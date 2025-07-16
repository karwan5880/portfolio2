'use client'

import { shaderMaterial, useTexture } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { ParticleShader } from './shader'

// The material now includes a uniform for the grid size, promoting a single source of truth.
const ParticlesMaterial = shaderMaterial(
  { uTime: 0, uGridSize: 16.0 }, // uGridSize defaults to 16.0
  //   { uTime: 0, uGridSize: 16.0, uTexture: null },
  //   { uTime: 0, uGridSize: 16.0, uFlyUpHeight: 25.0 },
  ParticleShader.vertexShader,
  ParticleShader.fragmentShader
)
extend({ ParticlesMaterial })

export function FinalParticleSystem({ scale }) {
  const matRef = useRef()
  const flyUpHeight = 25
  //   //   const sparkleTexture = useTexture('/sparkle.png') // Path relative to the /public folder
  //   const sparkleTexture = useMemo(() => {
  //     return new THREE.TextureLoader().load('/sparkle.png')
  //   }, []) // The empty dependency array ensures this runs only once.

  // --- DATA GENERATION (Clarified variable names and logic) ---
  const { particleGeometry, gridSize } = useMemo(() => {
    // This is the side length of the final 16x16x16 cube formation.
    const GRID_SIZE = 16
    // The total number of drones is the cube of the grid size.
    const DRONE_COUNT = GRID_SIZE * GRID_SIZE * GRID_SIZE

    // Create an ID for each drone, from 0 to 4095.
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) {
      ids[i] = i
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))
    // We still need a placeholder position attribute for Three.js.
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))

    return { particleGeometry: geometry, gridSize: GRID_SIZE }
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
      {/* Pass the grid size to the material's uniforms. */}
      <particlesMaterial
        ref={matRef} //
        uGridSize={gridSize}
        // uTexture={sparkleTexture}
        // uFlyUpHeight={flyUpHeight}
        // uScale={scale}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending} // <-- The key for light effects
      />
    </points>
  )
}
