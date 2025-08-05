'use client'

import { Html, useFBO } from '@react-three/drei'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { bitonicSortShaderFS, bodyShaderFS, finalRenderShaderVS, hashComputeShaderFS, lightShaderFS, positionComputeShaderFS } from './droneInstancedShader.js'

// --- A Helper Class for the GPU Sort ---
// This encapsulates the complex, multi-pass logic of the sort.
class GPUSort {
  constructor(renderer, count) {
    this.renderer = renderer
    this.count = count
    this.stages = Math.log2(count)

    this.material = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: bitonicSortShaderFS,
      uniforms: {
        uTexture: { value: null },
        uStage: { value: 0 },
        uSubStage: { value: 0 },
      },
    })
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material)
    this.scene.add(this.quad)
  }

  compute(inputTexture, outputTextureA, outputTextureB) {
    // Ensure we don't have any bound render targets
    this.renderer.setRenderTarget(null)

    let readBuffer = inputTexture
    let writeBuffer = outputTextureA
    let nextBuffer = outputTextureB

    // Do the sorting passes with proper ping-pong
    for (let i = 0; i < this.stages; i++) {
      for (let j = 0; j < i + 1; j++) {
        // Set input texture (read from current buffer)
        this.material.uniforms.uTexture.value = readBuffer.texture
        this.material.uniforms.uStage.value = i
        this.material.uniforms.uSubStage.value = j

        // Render to write buffer
        this.renderer.setRenderTarget(writeBuffer)
        this.renderer.clear()
        this.renderer.render(this.scene, this.camera)
        this.renderer.setRenderTarget(null)

        // Swap buffers for next pass
        readBuffer = writeBuffer
        writeBuffer = nextBuffer
        nextBuffer = readBuffer === outputTextureA ? outputTextureB : outputTextureA
      }
    }

    return readBuffer // The final sorted texture
  }
}

// Helper for our other compute passes
function ComputePass({ material, target, scene, camera }) {
  const { gl } = useThree()
  useFrame(() => {
    gl.setRenderTarget(target)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
  })
  return createPortal(
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>,
    scene
  )
}

// --- Helper component for the off-screen compute pass ---
function PositionCompute({ textPositionsTexture, scale, masterProgress }) {
  // This material runs our compute shader
  const computeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          // We declare a 'varying' to pass the UV coordinates to the fragment shader
          varying vec2 vUv;
          void main() {
            // We assign the built-in 'uv' attribute to our varying
            vUv = uv;
            gl_Position = vec4(position, 1.0);
          }
        `,
        fragmentShader: positionComputeShaderFS,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: scale },
          uMasterProgress: { value: 0 },
          uTextPositions: { value: textPositionsTexture },
        },
      }),
    [textPositionsTexture, scale]
  )

  useFrame((state) => {
    // Keep its uniforms in sync
    computeMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
    computeMaterial.uniforms.uMasterProgress.value = masterProgress.current
  })

  // Render a full-screen plane with this material
  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <primitive object={computeMaterial} attach="material" />
    </mesh>
  )
}

export function FinalParticleSystem({
  scale = 1.0, //
  pulseFrequency = 5.0,

  // safetyRadius = 0.0,
  // separationStrength = 0.0,
  safetyRadius = 50.0,
  separationStrength = 100.0,
}) {
  const lightMeshRef = useRef()
  const bodyMeshRef = useRef()
  const DRONE_COUNT = 4096
  const TEXTURE_SIZE = Math.sqrt(DRONE_COUNT)
  const { gl } = useThree() // Access the WebGL renderer
  const masterProgress = useRef(0)

  // Create a render target (a texture) to store the drone positions
  const positionTexture = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
  })

  // This is a separate, minimal scene for the compute pass
  const computeScene = useMemo(() => new THREE.Scene(), [])
  const computeCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])

  // Create a single quad mesh that we'll swap materials on
  const computeQuad = useMemo(() => {
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
    computeScene.add(quad)
    return quad
  }, [computeScene])

  // --- Setup all FBOs (Frame Buffer Objects / Render Targets) ---
  const positionFBO_A = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, { type: THREE.FloatType })
  const positionFBO_B = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, { type: THREE.FloatType })
  const hashFBO = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, { type: THREE.FloatType })
  const sortedFBO_A = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, { type: THREE.FloatType })
  const sortedFBO_B = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, { type: THREE.FloatType })

  // Ping-pong state
  const pingPongRef = useRef({ current: positionFBO_A, previous: positionFBO_B })

  const gpuSort = useMemo(() => new GPUSort(gl, DRONE_COUNT), [gl])

  // --- Setup all Materials for Compute Passes ---
  const positionMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
        fragmentShader: positionComputeShaderFS,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: scale },
          uMasterProgress: { value: 0 },
          uTextPositions: { value: null },
        },
      }),
    [scale]
  )
  const hashMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
        fragmentShader: hashComputeShaderFS,
        uniforms: {
          uPositionTexture: { value: null }, // Will be set dynamically
          uGridCellSize: { value: 100.0 },
        },
      }),
    []
  )

  const modelScene = useManualGLTF('/drone.glb')
  const font = useManualFont('/noto_sans_jp_regular.json')

  // --- Final Render Materials ---
  const [lightMaterial, bodyMaterial] = useMemo(() => {
    const commonUniforms = {
      uPositionTexture: { value: null }, // Will be set dynamically
      uSortedHashes: { value: null },
      uTime: { value: 0 },
      uSafetyRadius: { value: safetyRadius },
      uSeparationStrength: { value: separationStrength },
      uPulseFrequency: { value: pulseFrequency },
      uSunlightDirection: { value: new THREE.Vector3(0.5, 1.0, 0.5).normalize() },
      uAmbientLight: { value: 0.3 },
    }
    const lightMat = new THREE.ShaderMaterial({
      vertexShader: finalRenderShaderVS,
      fragmentShader: lightShaderFS,
      uniforms: { ...commonUniforms },
    })
    const bodyMat = new THREE.ShaderMaterial({
      vertexShader: finalRenderShaderVS,
      fragmentShader: bodyShaderFS,
      uniforms: { ...commonUniforms },
    })
    return [lightMat, bodyMat]
  }, [safetyRadius, separationStrength, pulseFrequency])

  const { lightGeometry, bodyGeometry, textPositionsTexture } = useMemo(() => {
    if (!font) return {}

    let lightGeo = null,
      bodyGeo = null

    if (modelScene) {
      // Debug: log all mesh names in the model
      console.log('Model loaded, traversing meshes:')
      modelScene.traverse((child) => {
        if (child.isMesh) {
          console.log('Found mesh:', child.name)
          if (child.name === 'Light_Geo') lightGeo = child.geometry.clone()
          else if (child.name === 'Body_Geo') bodyGeo = child.geometry.clone()
          // Try alternative names or use first available geometry
          else if (!lightGeo && child.name.toLowerCase().includes('light')) lightGeo = child.geometry.clone()
          else if (!bodyGeo && child.name.toLowerCase().includes('body')) bodyGeo = child.geometry.clone()
          // Fallback: use any geometry we find
          else if (!lightGeo) lightGeo = child.geometry.clone()
          else if (!bodyGeo) bodyGeo = child.geometry.clone()
        }
      })
    }

    // Fallback geometries if model doesn't load or doesn't have the right meshes
    if (!lightGeo) {
      console.log('Using fallback light geometry (sphere)')
      lightGeo = new THREE.SphereGeometry(2, 8, 6)
    }
    if (!bodyGeo) {
      console.log('Using fallback body geometry (box)')
      bodyGeo = new THREE.BoxGeometry(4, 1, 4)
    }

    const modelScale = 10.0
    if (lightGeo) lightGeo.scale(modelScale, modelScale, modelScale)
    if (bodyGeo) bodyGeo.scale(modelScale, modelScale, modelScale)

    const textGeo = new TextGeometry('T H A N K  Y O U', {
      font: font,
      size: 300.0,
      height: 50.0,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10.0,
      bevelSize: 4.0,
      bevelSegments: 5,
    })
    textGeo.center()

    const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
    const positions = new Float32Array(DRONE_COUNT * 4)
    const tempPosition = new THREE.Vector3()
    for (let i = 0; i < DRONE_COUNT; i++) {
      sampler.sample(tempPosition)
      positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
    }
    const textTex = new THREE.DataTexture(positions, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    textTex.needsUpdate = true

    return { lightGeometry: lightGeo, bodyGeometry: bodyGeo, textPositionsTexture: textTex }
  }, [modelScene, font])

  useEffect(() => {
    if (!lightMeshRef.current || !bodyMeshRef.current) return

    // Set up instance matrices for positioning (since we're using basic materials)
    const matrix = new THREE.Matrix4()
    const GRID_SIZE = 16

    for (let i = 0; i < DRONE_COUNT; i++) {
      const layer = Math.floor(i / (GRID_SIZE * GRID_SIZE))
      const row = Math.floor((i % (GRID_SIZE * GRID_SIZE)) / GRID_SIZE)
      const col = i % GRID_SIZE

      const x = (col - 7.5) * 50
      const y = (row - 7.5) * 50 + 200 // Lift them up so they're visible
      const z = (layer - 7.5) * 50

      matrix.setPosition(x, y, z)
      lightMeshRef.current.setMatrixAt(i, matrix)
      bodyMeshRef.current.setMatrixAt(i, matrix)
    }

    lightMeshRef.current.instanceMatrix.needsUpdate = true
    bodyMeshRef.current.instanceMatrix.needsUpdate = true

    console.log(`Positioned ${DRONE_COUNT} drones in a grid`)
  }, [lightGeometry, bodyGeometry])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    masterProgress.current = 0.0
    if (time > 15.0) masterProgress.current = Math.min(1.0, (time - 15.0) / 5.0)
    if (time > 25.0) masterProgress.current = 1.0 + Math.min(1.0, (time - 25.0) / 5.0)

    // Swap ping-pong buffers
    const temp = pingPongRef.current.current
    pingPongRef.current.current = pingPongRef.current.previous
    pingPongRef.current.previous = temp

    // 1. Update uniforms for the position compute pass
    positionMaterial.uniforms.uTime.value = time
    positionMaterial.uniforms.uMasterProgress.value = masterProgress.current
    positionMaterial.uniforms.uTextPositions.value = textPositionsTexture

    // 2. Run the position compute pass (write to current, no reading from it)
    computeQuad.material = positionMaterial
    gl.setRenderTarget(pingPongRef.current.current)
    gl.clear()
    gl.render(computeScene, computeCamera)
    gl.setRenderTarget(null) // Important: unbind render target

    // 3. Run the hash compute pass (read from current position, write to hash)
    hashMaterial.uniforms.uPositionTexture.value = pingPongRef.current.current.texture
    computeQuad.material = hashMaterial
    gl.setRenderTarget(hashFBO)
    gl.clear()
    gl.render(computeScene, computeCamera)
    gl.setRenderTarget(null) // Important: unbind render target

    // 4. Temporarily disable GPU Sort to isolate feedback loop issue
    // gl.setRenderTarget(null)
    // const finalSortedFBO = gpuSort.compute(hashFBO, sortedFBO_A, sortedFBO_B)

    // 5. Update the final render materials with shader uniforms
    lightMaterial.uniforms.uSortedHashes.value = null // GPU sort disabled for now
    bodyMaterial.uniforms.uSortedHashes.value = null

    // 6. Update other animation uniforms for the final render
    lightMaterial.uniforms.uTime.value = time
    bodyMaterial.uniforms.uTime.value = time

    // Use the buffer we just wrote to for reading in final render
    lightMaterial.uniforms.uPositionTexture.value = pingPongRef.current.current.texture
    bodyMaterial.uniforms.uPositionTexture.value = pingPongRef.current.current.texture

    // Reset render target and clear any bound textures
    gl.setRenderTarget(null)
  })

  if (!lightGeometry || !bodyGeometry || !textPositionsTexture) {
    return (
      <Html center>
        <div style={{ color: 'white' }}>Loading Drone Components...</div>
      </Html>
    )
  }

  return (
    <>
      {/* Note: ComputePass components removed since we're handling compute manually in useFrame */}

      {/* Final Render Meshes */}
      <group>
        <instancedMesh ref={bodyMeshRef} args={[bodyGeometry, bodyMaterial, DRONE_COUNT]} />
        <instancedMesh ref={lightMeshRef} args={[lightGeometry, lightMaterial, DRONE_COUNT]} />
      </group>
    </>
  )
}

// Helper hooks (no changes needed)
function useManualGLTF(path) {
  const [modelScene, setModelScene] = useState(null)
  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(path, (gltf) => {
      setModelScene(gltf.scene)
    })
  }, [path])
  return modelScene
}
function useManualFont(path) {
  const [font, setFont] = useState(null)
  useEffect(() => {
    const loader = new FontLoader()
    loader.load(path, (font) => setFont(font))
  }, [path])
  return font
}
