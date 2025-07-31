'use client'

import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { DroneInstancedShader } from './droneInstancedShader.js'

export function FinalParticleSystem({ scale = 1.0, pulseFrequency = 5.0 }) {
  const lightMeshRef = useRef()
  const bodyMeshRef = useRef()
  const lightMatRef = useRef()
  const bodyMatRef = useRef()
  // const DRONE_COUNT = 1
  // const DRONE_COUNT = 512
  // const DRONE_COUNT = 1024
  // const DRONE_COUNT = 2048
  const DRONE_COUNT = 4096

  const modelScene = useManualGLTF('/drone/drone_compound5.glb')
  const font = useManualFont('/noto_sans_jp_regular.json')

  // --- We create BOTH materials inside a useMemo to ensure they're created only once ---
  const [lightMaterial, bodyMaterial] = useMemo(() => {
    const lightMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPulseFrequency: { value: 5.0 },
        uScale: { value: 1.0 },
        uMasterProgress: { value: 0.0 },
        uTextPositions: { value: null },
      },
      vertexShader: DroneInstancedShader.vertexShader,
      fragmentShader: DroneInstancedShader.lightFragmentShader,
      transparent: true,
    })

    const bodyMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 1.0 },
        uMasterProgress: { value: 0.0 },
        uTextPositions: { value: null },
        uSunlightDirection: { value: new THREE.Vector3(0.0, 1.0, 1.0).normalize() },
        uAmbientLight: { value: 0.2 },
      },
      vertexShader: DroneInstancedShader.vertexShader,
      fragmentShader: DroneInstancedShader.bodyFragmentShader,
    })

    return [lightMat, bodyMat]
  }, [])

  const { lightGeometry, bodyGeometry, textPositionsTexture } = useMemo(() => {
    // ... This logic is correct and unchanged ...
    if (!modelScene || !font) return {}
    let lightGeo = null,
      bodyGeo = null
    modelScene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'Light_Geo') lightGeo = child.geometry.clone()
        else if (child.name === 'Body_Geo') bodyGeo = child.geometry.clone()
      }
    })
    const modelScale = 10.0
    if (lightGeo) lightGeo.scale(modelScale, modelScale, modelScale)
    if (bodyGeo) bodyGeo.scale(modelScale, modelScale, modelScale)
    const textGeo = new TextGeometry('T H A N K  Y O U', { font: font, size: 300.0, height: 50.0, curveSegments: 12, bevelEnabled: true, bevelThickness: 10.0, bevelSize: 4.0, bevelSegments: 5 })
    textGeo.center()
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
    const positions = new Float32Array(DRONE_COUNT * 4)
    const tempPosition = new THREE.Vector3()
    for (let i = 0; i < DRONE_COUNT; i++) {
      sampler.sample(tempPosition)
      positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
    }
    const textTex = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
    textTex.needsUpdate = true
    return { lightGeometry: lightGeo, bodyGeometry: bodyGeo, textPositionsTexture: textTex }
  }, [modelScene, font])

  useEffect(() => {
    // ... This logic is correct and unchanged ...
    if (!lightMeshRef.current || !bodyMeshRef.current) return
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) ids[i] = i
    const idAttribute = new THREE.InstancedBufferAttribute(ids, 1)
    lightMeshRef.current.geometry.setAttribute('a_id', idAttribute)
    bodyMeshRef.current.geometry.setAttribute('a_id', idAttribute)
  }, [lightGeometry, bodyGeometry])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    let masterProgress = 0.0
    if (time > 15.0) masterProgress = Math.min(1.0, (time - 15.0) / 5.0)
    if (time > 25.0) masterProgress = 1.0 + Math.min(1.0, (time - 25.0) / 5.0)

    // --- Clean and explicit uniform updates ---
    if (lightMatRef.current) {
      lightMatRef.current.uniforms.uTime.value = time
      lightMatRef.current.uniforms.uMasterProgress.value = masterProgress
      lightMatRef.current.uniforms.uTextPositions.value = textPositionsTexture
      lightMatRef.current.uniforms.uScale.value = scale
      lightMatRef.current.uniforms.uPulseFrequency.value = pulseFrequency
    }
    if (bodyMatRef.current) {
      bodyMatRef.current.uniforms.uTime.value = time
      bodyMatRef.current.uniforms.uMasterProgress.value = masterProgress
      bodyMatRef.current.uniforms.uTextPositions.value = textPositionsTexture
      bodyMatRef.current.uniforms.uScale.value = scale
    }
  })

  if (!lightGeometry || !bodyGeometry || !textPositionsTexture) {
    return (
      <Html center>
        <div style={{ color: 'white' }}>Loading Drone Components...</div>
      </Html>
    )
  }

  return (
    <group>
      <instancedMesh ref={bodyMeshRef} args={[bodyGeometry, null, DRONE_COUNT]} frustumCulled={false}>
        <primitive ref={bodyMatRef} object={bodyMaterial} attach="material" />
      </instancedMesh>
      <instancedMesh ref={lightMeshRef} args={[lightGeometry, null, DRONE_COUNT]} frustumCulled={false}>
        <primitive ref={lightMatRef} object={lightMaterial} attach="material" />
      </instancedMesh>
    </group>
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
