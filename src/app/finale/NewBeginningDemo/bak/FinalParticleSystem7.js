'use client'

import { shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { InstancedParticleShader } from './instancedShader'

// Import the new shader

const InstancedParticlesMaterial = shaderMaterial(
  {
    uTime: 0,
    uScale: 1.0,
    uMasterProgress: 0.0,
    uTextPositions: null,
  },
  InstancedParticleShader.vertexShader,
  InstancedParticleShader.fragmentShader
)
extend({ InstancedParticlesMaterial })

export function FinalParticleSystem({ scale = 1.0 }) {
  const matRef = useRef()
  const DRONE_COUNT = 4096

  // 1. USE YOUR NEW LOW-POLY MODEL
  const { scene } = useGLTF('/drone/drone_low_poly.glb')
  const font = useLoader(FontLoader, '/noto_sans_jp_regular.json') // this one good, not bad.

  const mergedGeometry = useMemo(() => {
    const geometriesToMerge = []
    scene.traverse((child) => {
      if (child.isMesh) {
        const cleanGeometry = new THREE.BufferGeometry()
        cleanGeometry.setAttribute('position', child.geometry.getAttribute('position').clone())
        cleanGeometry.applyMatrix4(child.matrixWorld)
        geometriesToMerge.push(cleanGeometry)
      }
    })

    if (geometriesToMerge.length === 0) return null
    const merged = mergeGeometries(geometriesToMerge, false)
    if (merged) {
      merged.center()
      merged.scale(0.2, 0.2, 0.2) // Slightly increased scale for visibility
    }
    return merged
  }, [scene])

  // const { mergedGeometry, textPositionsTexture } = useMemo(() => {
  //   // --- Merged Drone Geometry (same as before) ---
  //   const geometriesToMerge = []
  //   scene.traverse((child) => {
  //     if (child.isMesh) {
  //       const cleanGeometry = new THREE.BufferGeometry()
  //       cleanGeometry.setAttribute('position', child.geometry.getAttribute('position').clone())
  //       cleanGeometry.applyMatrix4(child.matrixWorld)
  //       geometriesToMerge.push(cleanGeometry)
  //     }
  //   })
  //   const merged = mergeGeometries(geometriesToMerge, false)
  //   if (merged) {
  //     merged.center()
  //     merged.scale(0.1, 0.1, 0.1)
  //   }
  //   const textGeo = new TextGeometry(' T H A N K  Y O U', {
  //     font: font,
  //     size: 15.0 * scale,
  //     height: 2.0 * scale,
  //     curveSegments: 12,
  //     bevelEnabled: true,
  //     bevelThickness: 0.5 * scale,
  //     bevelSize: 0.3 * scale,
  //     bevelOffset: 0,
  //     bevelSegments: 5,
  //   })
  //   textGeo.center()
  //   const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
  //   const positions = new Float32Array(DRONE_COUNT * 4)
  //   const tempPosition = new THREE.Vector3()
  //   for (let i = 0; i < DRONE_COUNT; i++) {
  //     sampler.sample(tempPosition)
  //     positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
  //   }
  //   const textTex = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
  //   textTex.needsUpdate = true
  //   return { mergedGeometry: merged, textPositionsTexture: textTex }
  // }, [scene, font, scale])

  // 2. We need to create the a_id attribute for the shader
  useEffect(() => {
    if (!mergedGeometry) return
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) {
      ids[i] = i
    }
    mergedGeometry.setAttribute('a_id', new THREE.InstancedBufferAttribute(ids, 1))
  }, [mergedGeometry])

  // 3. THE FRAME LOOP IS NOW SUPER SIMPLE AND FAST
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = time

    // We just update the master timeline. The GPU does the rest.
    let masterProgress = 0.0
    if (time > 15.0) {
      // Cube to Sphere
      masterProgress = Math.min(1.0, (time - 15.0) / 5.0)
    }
    // if (time > 25.0) {
    //   // Sphere to Text
    //   masterProgress = 1.0 + Math.min(1.0, (time - 25.0) / 5.0)
    // }
    matRef.current.uniforms.uMasterProgress.value = masterProgress
  })

  if (!mergedGeometry) return null

  return (
    <instancedMesh args={[mergedGeometry, null, DRONE_COUNT]}>
      {/* <instancedParticlesMaterial ref={matRef} uScale={scale} uTextPositions={textPositionsTexture} /> */}
      <instancedParticlesMaterial ref={matRef} uScale={scale} />
    </instancedMesh>
  )
}
