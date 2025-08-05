'use client'

import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { ParticleShader } from './shader'

// The material only needs one uniform: the time.
const ParticlesMaterial = shaderMaterial({ uTime: 0 }, ParticleShader.vertexShader, ParticleShader.fragmentShader)
extend({ ParticlesMaterial })

export function FinalParticleSystem() {
  const matRef = useRef()

  // --- DATA GENERATION (The "Missing Drone" bug is fixed here) ---
  const particleGeometry = useMemo(() => {
    const SIZE = 64
    const DRONE_COUNT = SIZE * SIZE

    // Create an ID for each drone, from 0 to 4095.
    const ids = new Float32Array(DRONE_COUNT)
    // The loop MUST go up to DRONE_COUNT to include the last drone.
    for (let i = 0; i < DRONE_COUNT; i++) {
      ids[i] = i
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))
    // We still need a placeholder position attribute for Three.js.
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))

    return geometry
  }, [])

  // --- The Frame Loop: Simple and Direct ---
  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <points>
      <primitive object={particleGeometry} />
      <particlesMaterial ref={matRef} />
    </points>
  )
}

// 'use client'

// import { shaderMaterial } from '@react-three/drei'
// import { extend, useFrame } from '@react-three/fiber'
// import React, { useMemo, useRef } from 'react'
// import * as THREE from 'three'

// import { ParticleShader } from './shader'

// // Define our one and only material.

// const ParticlesMaterial = shaderMaterial(
//   { uTime: 0 }, //
//   //   { uStartPositions: null, uEndPositions: null, uTime: 0 }, //
//   ParticleShader.vertexShader,
//   ParticleShader.fragmentShader
// )
// // const ParticlesMaterial = shaderMaterial({ uPositions: null, uTime: 0 }, ParticleShader.vertexShader, ParticleShader.fragmentShader)
// extend({ ParticlesMaterial })

// export function FinalParticleSystem() {
//   const matRef = useRef()

//   const particleGeometry = useMemo(() => {
//     const SIZE = 64
//     const DRONE_COUNT = SIZE * SIZE
//     const ids = new Float32Array(DRONE_COUNT)
//     for (let i = 0; i < DRONE_COUNT; i++) {
//       ids[i] = i
//     }
//     const geometry = new THREE.BufferGeometry()
//     geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))
//     geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))
//     return geometry
//   }, [])

//   //   // --- DATA GENERATION (Proven to be correct) ---
//   //   const { startPositionTexture, endPositionTexture, particleGeometry } = useMemo(() => {
//   //     const SIZE = 64
//   //     const DRONE_COUNT = SIZE * SIZE
//   //     const startPosData = new Float32Array(DRONE_COUNT * 4)
//   //     const endPosData = new Float32Array(DRONE_COUNT * 4)
//   //     const uvs = new Float32Array(DRONE_COUNT * 2)
//   //     // --- Generate Start & End Positions in ONE loop ---
//   //     for (let i = 0; i < DRONE_COUNT; i++) {
//   //       const k = i * 4
//   //       const k_uv = i * 2
//   //       const row = Math.floor(i / SIZE)
//   //       const col = i % SIZE
//   //       // --- Start Position: A random point on a huge "Birth Sphere" ---
//   //       const radius = 500 // Make this sphere very large
//   //       const phi = Math.random() * Math.PI
//   //       const theta = Math.random() * Math.PI * 2
//   //       const startX = radius * Math.sin(phi) * Math.cos(theta)
//   //       const startY = radius * Math.sin(phi) * Math.sin(theta)
//   //       const startZ = radius * Math.cos(phi)
//   //       startPosData.set([startX, startY, startZ, 1.0], k)
//   //       // --- End Position: The perfect, centered grid ---
//   //       const endX = (col - (SIZE - 1) / 2) * 1.5
//   //       const endY = (row - (SIZE - 1) / 2) * 1.5
//   //       endPosData.set([endX, endY, 0, 1.0], k)
//   //       // --- UV Data (This is correct) ---
//   //       uvs.set([col / (SIZE - 1), row / (SIZE - 1)], k_uv)
//   //     }
//   //     const startTex = new THREE.DataTexture(startPosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
//   //     startTex.needsUpdate = true
//   //     const endTex = new THREE.DataTexture(endPosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
//   //     endTex.needsUpdate = true
//   //     // for (let row = 0; row < SIZE; row++) {
//   //     //   for (let col = 0; col < SIZE; col++) {
//   //     //     const i = row * SIZE + col
//   //     //     posData.set([(col - (SIZE - 1) / 2) * 1.5, (row - (SIZE - 1) / 2) * 1.5, 0, 1.0], i * 4)
//   //     //     uvs.set([col / (SIZE - 1), row / (SIZE - 1)], i * 2)
//   //     //   }
//   //     // }
//   //     // const texture = new THREE.DataTexture(posData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
//   //     // texture.needsUpdate = true
//   //     const geometry = new THREE.BufferGeometry()
//   //     geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
//   //     geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))
//   //     return { startPositionTexture: startTex, endPositionTexture: endTex, particleGeometry: geometry }
//   //   }, [])

//   // --- The Frame Loop: Simple and Direct ---
//   useFrame((state) => {
//     if (matRef.current) {
//       // We only need to update one thing: the time.
//       matRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
//     }
//   })

//   return (
//     <points>
//       <primitive object={particleGeometry} />
//       <particlesMaterial
//         ref={matRef} //
//         // uStartPositions={startPositionTexture}
//         // uEndPositions={endPositionTexture}
//         // uPositions={positionTexture}
//       />
//     </points>
//   )
// }
