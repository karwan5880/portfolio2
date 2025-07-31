'use client'

import { Html, shaderMaterial, useGLTF } from '@react-three/drei'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { FinalInstancedShader } from './finalInstancedShader.js'

// Define our material class using the new shader
const FinalInstancedMaterial = shaderMaterial(
  {
    uTime: 0,
    uScale: 1.0,
    uMasterProgress: 0.0,
    uTextPositions: null, // A placeholder for our position texture

    uPulseFrequency: 5.0, // Default value
    uPulseDuration: 4.0, // Default value
    uPulseIsPerpetual: 0.0, // Default value
  },
  FinalInstancedShader.vertexShader,
  FinalInstancedShader.fragmentShader
)

export function FinalParticleSystem({
  scale = 1.0, //
  pulseFrequency = 5.0,
  pulseDuration = 4.0,
  pulseIsPerpetual = false,
}) {
  const meshRef = useRef()
  const matRef = useRef()
  const DRONE_COUNT = 4096

  // The manual GLTF loader is unchanged
  const modelScene = useManualGLTF('/drone/drone_low_poly.glb')
  const font = useManualFont('/noto_sans_jp_regular.json')

  // const textPositionsTexture = useMemo(() => {
  //   if (!font) return null // Safety check
  //   // const geometry = new TextGeometry('FINALE', {
  //   // const geometry = new TextGeometry('T H A N K  Y O U', {
  //   const geometry = new TextGeometry(' T H A N K  Y O U', {
  //     font: font,
  //     size: 300.0, // Make the text nice and large
  //     height: 50.0,
  //     curveSegments: 12,
  //     bevelEnabled: true,
  //     bevelThickness: 10.0,
  //     bevelSize: 4.0,
  //     bevelSegments: 5,
  //   })
  //   geometry.center()
  //   const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build()
  //   const positions = new Float32Array(DRONE_COUNT * 4)
  //   const tempPosition = new THREE.Vector3()
  //   for (let i = 0; i < DRONE_COUNT; i++) {
  //     sampler.sample(tempPosition)
  //     positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
  //   }
  //   const texture = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
  //   texture.needsUpdate = true
  //   return texture
  //   // textGeo.center()
  //   // const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
  //   // const positions = new Float32Array(DRONE_COUNT * 4)
  //   // const tempPosition = new THREE.Vector3()
  //   // for (let i = 0; i < DRONE_COUNT; i++) {
  //   //   sampler.sample(tempPosition)
  //   //   positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
  //   // }
  //   // const textTex = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
  //   // textTex.needsUpdate = true
  //   // return { droneGeometry: merged, textPositionsTexture: textTex }
  // }, [font, scale])

  const { droneGeometry, textPositionsTexture } = useMemo(() => {
    // We wait until BOTH the drone model and the font have loaded
    if (!modelScene || !font) return { droneGeometry: null, textPositionsTexture: null }
    // Process the drone geometry (this is unchanged)
    const geometriesToMerge = []
    modelScene.traverse((child) => {
      if (child.isMesh) {
        const cleanGeometry = new THREE.BufferGeometry()
        cleanGeometry.setAttribute('position', child.geometry.getAttribute('position').clone())
        cleanGeometry.applyMatrix4(child.matrixWorld)
        geometriesToMerge.push(cleanGeometry)
      }
    })
    const merged = mergeGeometries(geometriesToMerge, false)
    if (merged) {
      merged.center()
      merged.scale(0.5, 0.5, 0.5)
    }
    // 4. Generate the "FINALE" text positions
    const textGeo = new TextGeometry('T H A N K  Y O U', {
      font: font,
      size: 300.0, // Make the text nice and large
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
    const textTex = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
    textTex.needsUpdate = true
    return { droneGeometry: merged, textPositionsTexture: textTex }
  }, [modelScene, font, scale])

  // // The geometry merger is unchanged
  // const droneGeometry = useMemo(() => {
  //   if (!modelScene) return null
  //   const geometriesToMerge = []
  //   modelScene.traverse((child) => {
  //     if (child.isMesh) {
  //       const cleanGeometry = new THREE.BufferGeometry()
  //       cleanGeometry.setAttribute('position', child.geometry.getAttribute('position').clone())
  //       cleanGeometry.applyMatrix4(child.matrixWorld)
  //       geometriesToMerge.push(cleanGeometry)
  //     }
  //   })
  //   if (geometriesToMerge.length === 0) return null
  //   const merged = mergeGeometries(geometriesToMerge, false)
  //   if (merged) {
  //     merged.center()
  //     merged.scale(0.5, 0.5, 0.5)
  //   }
  //   return merged
  // }, [modelScene])

  // We attach the unique ID to each instance so the shader can use it
  useEffect(() => {
    if (!meshRef.current || !droneGeometry) return
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) {
      ids[i] = i
    }
    meshRef.current.geometry.setAttribute('a_id', new THREE.InstancedBufferAttribute(ids, 1))
  }, [droneGeometry])

  // The frame loop is now incredibly simple and fast
  useFrame((state) => {
    if (!matRef.current) return
    const time = state.clock.getElapsedTime()
    matRef.current.uniforms.uTime.value = time
    let masterProgress = 0.0
    if (time > 15.0) {
      masterProgress = Math.min(1.0, (time - 15.0) / 5.0)
    }
    if (time > 25.0) {
      masterProgress = 1.0 + Math.min(1.0, (time - 25.0) / 5.0)
    }
    matRef.current.uniforms.uMasterProgress.value = masterProgress
  })

  // Display a loading message until both assets are processed
  if (!droneGeometry || !textPositionsTexture) {
    return (
      <Html center>
        <div style={{ color: 'white' }}>Loading Choreography...</div>
      </Html>
    )
  }

  return (
    // We attach our new shader material using the robust <primitive> method
    <instancedMesh
      ref={meshRef} //
      args={[droneGeometry, null, DRONE_COUNT]}
      frustumCulled={false}
    >
      <primitive
        ref={matRef} //
        object={new FinalInstancedMaterial()}
        attach="material"
        uniforms-uScale-value={scale}
        uniforms-uPulseFrequency-value={pulseFrequency}
        uniforms-uPulseDuration-value={pulseDuration}
        uniforms-uPulseIsPerpetual-value={pulseIsPerpetual ? 1.0 : 0.0}
        uniforms-uTextPositions-value={textPositionsTexture}
      />
    </instancedMesh>
  )
}

// The manual loader hook is unchanged
function useManualGLTF(path) {
  const [modelScene, setModelScene] = useState(null)
  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      path,
      (gltf) => {
        setModelScene(gltf.scene)
      },
      undefined,
      (error) => {
        console.error(error)
      }
    )
  }, [path])
  return modelScene
}

function useManualFont(path) {
  const [font, setFont] = useState(null)
  useEffect(() => {
    const loader = new FontLoader()
    loader.load(
      path,
      (loadedFont) => setFont(loadedFont),
      undefined,
      (e) => console.error(e)
    )
  }, [path])
  return font
}
