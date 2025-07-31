'use client'

import { Html, useFBO } from '@react-three/drei'
import { createPortal, useFrame, useThree } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

import { bitonicSortShaderFS, bodyShaderFS, finalRenderShaderVS, hashComputeShaderFS, lightShaderFS, positionComputeShaderFS } from './droneInstancedShader.js'

export function FinalParticleSystem({
  scale = 1.0,
  pulseFrequency = 5.0, //
  safetyRadius = 1500.0,
  separationStrength = 10.0,
  gridCellSize = 100.0,
  // safetyRadius = 50.0,
  // separationStrength = 1.0,
  // gridCellSize = 100.0,
}) {
  const { gl } = useThree()
  const DRONE_COUNT = 4096
  const TEXTURE_SIZE = Math.sqrt(DRONE_COUNT)

  const lightMeshRef = useRef()
  const bodyMeshRef = useRef()
  const masterProgress = useRef(0)

  // --- FBOs (Render Targets) are correct ---
  const fboOptions = { format: THREE.RGBAFormat, type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter }
  const positionFBO = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, fboOptions)
  const hashFBO = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, fboOptions)
  const sortedFBO_A = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, fboOptions)
  const sortedFBO_B = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, fboOptions)

  // --- THE CORE FIX: One scene, one mesh for all compute passes ---
  const computeScene = useMemo(() => new THREE.Scene(), [])
  const computeCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])
  const computeQuad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), [])

  const positionMaterial = useMemo(() => new THREE.ShaderMaterial({ vertexShader: `void main(){gl_Position=vec4(position,1.0);}`, fragmentShader: positionComputeShaderFS, uniforms: { uTime: { value: 0 }, uScale: { value: scale }, uMasterProgress: { value: 0 }, uTextPositions: { value: null }, uTextureSize: { value: TEXTURE_SIZE } } }), [scale, TEXTURE_SIZE])
  const hashMaterial = useMemo(() => new THREE.ShaderMaterial({ vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`, fragmentShader: hashComputeShaderFS, uniforms: { uPositionTexture: { value: null }, uGridCellSize: { value: gridCellSize } } }), [gridCellSize])
  const sortMaterial = useMemo(() => new THREE.ShaderMaterial({ vertexShader: `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,1.0);}`, fragmentShader: bitonicSortShaderFS, uniforms: { uTexture: { value: null }, uStage: { value: 0 }, uSubStage: { value: 0 }, uTextureSize: { value: TEXTURE_SIZE } } }), [TEXTURE_SIZE])

  const [lightMaterial, bodyMaterial] = useMemo(() => {
    const commonUniforms = { uPositionTexture: { value: positionFBO.texture }, uSortedHashes: { value: null }, uTime: { value: 0 }, uSafetyRadius: { value: safetyRadius }, uSeparationStrength: { value: separationStrength } }
    const lightMat = new THREE.ShaderMaterial({ uniforms: { ...commonUniforms, uPulseFrequency: { value: pulseFrequency } }, vertexShader: finalRenderShaderVS, fragmentShader: lightShaderFS })
    const bodyMat = new THREE.ShaderMaterial({ uniforms: { ...commonUniforms, uSunlightDirection: { value: new THREE.Vector3(0, 1, 1).normalize() }, uAmbientLight: { value: 0.2 } }, vertexShader: finalRenderShaderVS, fragmentShader: bodyShaderFS })
    return [lightMat, bodyMat]
  }, [positionFBO, safetyRadius, separationStrength, pulseFrequency])

  const modelScene = useManualGLTF('/drone_compound.glb')
  const font = useManualFont('/noto_sans_jp_regular.json')
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
    const modelScale = 6.0
    if (lightGeo) lightGeo.scale(modelScale, modelScale, modelScale)
    if (bodyGeo) bodyGeo.scale(modelScale, modelScale, modelScale)
    const textGeo = new TextGeometry('藝恬 T H A N K Y O U', { font, size: 300, height: 50, curveSegments: 12, bevelEnabled: true, bevelThickness: 10, bevelSize: 4, bevelSegments: 5 })
    textGeo.center()
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
    const positions = new Float32Array(DRONE_COUNT * 4)
    const temp = new THREE.Vector3()
    for (let i = 0; i < DRONE_COUNT; i++) {
      sampler.sample(temp)
      positions.set([temp.x, temp.y, temp.z, 1.0], i * 4)
    }
    const textTex = new THREE.DataTexture(positions, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    textTex.needsUpdate = true
    return { lightGeometry: lightGeo, bodyGeometry: bodyGeo, textPositionsTexture: textTex }
  }, [modelScene, font])

  useEffect(() => {
    if (!lightGeometry || !bodyGeometry) return
    computeScene.add(computeQuad) // Add the single quad to the compute scene
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) ids[i] = i
    const idAttribute = new THREE.InstancedBufferAttribute(ids, 1)
    lightMeshRef.current.geometry.setAttribute('a_id', idAttribute)
    bodyMeshRef.current.geometry.setAttribute('a_id', idAttribute)
  }, [lightGeometry, bodyGeometry, computeScene, computeQuad])

  useFrame((state) => {
    const { gl, clock } = state
    const time = clock.getElapsedTime()
    masterProgress.current = time > 15 ? Math.min(1.0, (time - 15) / 5.0) + (time > 25 ? Math.min(1.0, (time - 25) / 5.0) : 0.0) : 0.0

    // --- The Definitive GPGPU Pipeline ---

    // PASS 1: Position Compute
    computeQuad.material = positionMaterial
    positionMaterial.uniforms.uTime.value = time
    positionMaterial.uniforms.uMasterProgress.value = masterProgress.current
    positionMaterial.uniforms.uTextPositions.value = textPositionsTexture
    gl.setRenderTarget(positionFBO)
    gl.render(computeScene, computeCamera)

    // PASS 2: Hash Compute
    computeQuad.material = hashMaterial
    hashMaterial.uniforms.uPositionTexture.value = positionFBO.texture
    gl.setRenderTarget(hashFBO)
    gl.render(computeScene, computeCamera)

    // PASS 3: Bitonic Sort
    computeQuad.material = sortMaterial
    let readFBO = hashFBO
    let writeFBO = sortedFBO_A
    const stages = Math.log2(DRONE_COUNT)
    for (let i = 0; i < stages; i++) {
      for (let j = 0; j <= i; j++) {
        sortMaterial.uniforms.uTexture.value = readFBO.texture
        sortMaterial.uniforms.uStage.value = i
        sortMaterial.uniforms.uSubStage.value = j
        gl.setRenderTarget(writeFBO)
        gl.render(computeScene, computeCamera)
        let temp = readFBO
        readFBO = writeFBO
        writeFBO = temp
      }
    }
    const finalSortedFBO = readFBO

    // PASS 4: Final Render to Screen
    gl.setRenderTarget(null)
    lightMaterial.uniforms.uSortedHashes.value = finalSortedFBO.texture
    bodyMaterial.uniforms.uSortedHashes.value = finalSortedFBO.texture
    lightMaterial.uniforms.uTime.value = time
    bodyMaterial.uniforms.uTime.value = time
  })

  if (!lightGeometry || !bodyGeometry || !textPositionsTexture) {
    return <Html center>Initializing Simulation...</Html>
  }

  return (
    <group>
      <instancedMesh ref={bodyMeshRef} args={[bodyGeometry, bodyMaterial, DRONE_COUNT]} frustumCulled={false} />
      <instancedMesh ref={lightMeshRef} args={[lightGeometry, lightMaterial, DRONE_COUNT]} frustumCulled={false} />
    </group>
  )
}

// Helper hooks
function useManualGLTF(path) {
  const [model, setModel] = useState(null)
  useEffect(() => {
    new GLTFLoader().load(path, (gltf) => setModel(gltf.scene))
  }, [path])
  return model
}
function useManualFont(path) {
  const [font, setFont] = useState(null)
  useEffect(() => {
    new FontLoader().load(path, (font) => setFont(font))
  }, [path])
  return font
}
