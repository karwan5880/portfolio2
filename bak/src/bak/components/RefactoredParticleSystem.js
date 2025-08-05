'use client'

import { cinematicPositionShader } from '../cinematicShader.js'
import { DRONE_CONFIG, VISUAL_CONFIG } from '../config/constants.js'
import { bodyShaderFS, lightShaderFS } from '../shaders/fragmentShaders.js'
import { finalRenderShaderVS } from '../shaders/vertexShader.js'
import { Html, useFBO } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

export function RefactoredParticleSystem({ scale = 1.0, pulseFrequency = 5.0, safetyRadius = 150.0, separationStrength = 20.0 }) {
  const lightMeshRef = useRef()
  const bodyMeshRef = useRef()
  const masterProgress = useRef(0)

  // FBO for position computation
  const fboOptions = {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  }
  const positionFBO = useFBO(DRONE_CONFIG.TEXTURE_SIZE, DRONE_CONFIG.TEXTURE_SIZE, fboOptions)

  // Compute scene setup
  const computeScene = useMemo(() => new THREE.Scene(), [])
  const computeCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])
  const computeQuad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), [])

  // Position computation material
  const positionMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ` 
          void main(){
            gl_Position=vec4(position,1.0);
          }
        `,
        fragmentShader: cinematicPositionShader,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: scale },
          uMasterProgress: { value: 0 },
          uTextPositions: { value: null },
          uTextureSize: { value: DRONE_CONFIG.TEXTURE_SIZE },
        },
      }),
    [scale]
  )

  // Rendering materials
  const [lightMaterial, bodyMaterial] = useMemo(() => {
    const commonUniforms = {
      uPositionTexture: { value: positionFBO.texture },
      uTime: { value: 0 },
      uSafetyRadius: { value: safetyRadius },
      uSeparationStrength: { value: separationStrength },
    }

    const lightMat = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        uPulseFrequency: { value: pulseFrequency },
        uInstanceScale: { value: DRONE_CONFIG.LIGHT_SCALE.INITIAL },
      },
      vertexShader: finalRenderShaderVS,
      fragmentShader: lightShaderFS,
      transparent: false,
      blending: THREE.NormalBlending,
      depthWrite: true,
    })

    const bodyMat = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        uSunlightDirection: { value: new THREE.Vector3(0, 1, 1).normalize() },
        uAmbientLight: { value: 0.2 },
        uInstanceScale: { value: DRONE_CONFIG.SCALE },
      },
      vertexShader: finalRenderShaderVS,
      fragmentShader: bodyShaderFS,
    })

    return [lightMat, bodyMat]
  }, [positionFBO, safetyRadius, separationStrength, pulseFrequency])

  // Asset loading
  const { model: modelScene, error: modelError } = useManualGLTF('/drone_compound.glb')
  const { font, error: fontError } = useManualFont('/noto_sans_jp_regular.json')

  // Geometry and texture preparation
  const { lightGeometry, bodyGeometry, textPositionsTexture } = useMemo(() => {
    if (!modelScene || !font) return {}

    let lightGeo = null,
      bodyGeo = null

    modelScene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'Light_Geo') lightGeo = child.geometry.clone()
        else if (child.name === 'Body_Geo') bodyGeo = child.geometry.clone()
      }
    })

    if (!lightGeo || !bodyGeo) {
      console.warn('Could not find Light_Geo or Body_Geo in the model')
      return {}
    }

    // Scale geometries
    const lightScale = 2.0
    lightGeo.scale(lightScale, lightScale, lightScale)
    bodyGeo.scale(DRONE_CONFIG.SCALE, DRONE_CONFIG.SCALE, DRONE_CONFIG.SCALE)

    // Create text geometry and sample positions
    const textGeo = new TextGeometry('藝恬 T H A N K Y O U', {
      font,
      size: 300,
      height: 50,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 4,
      bevelSegments: 5,
    })
    textGeo.center()

    const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
    const positions = new Float32Array(DRONE_CONFIG.COUNT * 4)
    const temp = new THREE.Vector3()

    for (let i = 0; i < DRONE_CONFIG.COUNT; i++) {
      sampler.sample(temp)
      positions.set([temp.x, temp.y, temp.z, 1.0], i * 4)
    }

    const textTex = new THREE.DataTexture(positions, DRONE_CONFIG.TEXTURE_SIZE, DRONE_CONFIG.TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    textTex.needsUpdate = true

    return {
      lightGeometry: lightGeo,
      bodyGeometry: bodyGeo,
      textPositionsTexture: textTex,
    }
  }, [modelScene, font])

  // Setup instanced attributes
  useEffect(() => {
    if (!lightGeometry || !bodyGeometry) return

    computeScene.add(computeQuad)

    const ids = new Float32Array(DRONE_CONFIG.COUNT)
    for (let i = 0; i < DRONE_CONFIG.COUNT; i++) ids[i] = i
    const idAttribute = new THREE.InstancedBufferAttribute(ids, 1)

    if (lightMeshRef.current) {
      lightMeshRef.current.geometry.setAttribute('a_id', idAttribute)
    }
    if (bodyMeshRef.current) {
      bodyMeshRef.current.geometry.setAttribute('a_id', idAttribute)
    }
  }, [lightGeometry, bodyGeometry, computeScene, computeQuad])

  // Animation loop
  useFrame((state) => {
    const { gl, clock } = state
    const time = clock.getElapsedTime()

    // Update light scale animation
    const { INITIAL, FINAL, START_TIME, DURATION } = DRONE_CONFIG.LIGHT_SCALE
    let currentScale = INITIAL

    if (time > START_TIME) {
      const progress = Math.min(1.0, (time - START_TIME) / DURATION)
      currentScale = INITIAL + progress * (FINAL - INITIAL)
    }

    if (lightMaterial) {
      lightMaterial.uniforms.uInstanceScale.value = currentScale
    }

    // Update master progress for text formation
    if (time > 15.0) {
      masterProgress.current = Math.min(1.0, (time - 15.0) / 10.0)
    } else {
      masterProgress.current = 0.0
    }

    // Position compute pass
    computeQuad.material = positionMaterial
    positionMaterial.uniforms.uTime.value = time
    positionMaterial.uniforms.uMasterProgress.value = masterProgress.current
    positionMaterial.uniforms.uTextPositions.value = textPositionsTexture

    gl.setRenderTarget(positionFBO)
    gl.render(computeScene, computeCamera)

    // Final render to screen
    gl.setRenderTarget(null)
    lightMaterial.uniforms.uTime.value = time
    bodyMaterial.uniforms.uTime.value = time
  })

  // Error handling
  if (modelError || fontError) {
    return (
      <Html center style={{ color: 'red' }}>
        Error loading assets: {modelError?.message || fontError?.message}
      </Html>
    )
  }

  if (!lightGeometry || !bodyGeometry || !textPositionsTexture) {
    return <Html center></Html>
  }

  return (
    <group>
      <instancedMesh ref={bodyMeshRef} args={[bodyGeometry, bodyMaterial, DRONE_CONFIG.COUNT]} frustumCulled={false} />
      <instancedMesh ref={lightMeshRef} args={[lightGeometry, lightMaterial, DRONE_CONFIG.COUNT]} frustumCulled={false} />
    </group>
  )
}

// Helper hooks for asset loading
function useManualGLTF(path) {
  const [model, setModel] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    new GLTFLoader().load(
      path,
      (gltf) => setModel(gltf.scene),
      undefined,
      (error) => {
        console.error('Error loading GLTF:', error)
        setError(error)
      }
    )
  }, [path])

  return { model, error }
}

function useManualFont(path) {
  const [font, setFont] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    new FontLoader().load(
      path,
      (font) => setFont(font),
      undefined,
      (error) => {
        console.error('Error loading font:', error)
        setError(error)
      }
    )
  }, [path])

  return { font, error }
}
