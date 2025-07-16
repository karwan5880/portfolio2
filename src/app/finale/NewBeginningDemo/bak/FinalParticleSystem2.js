'use client'

import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { ParticleShader } from './shader'

// Define our one and only material.
const ParticlesMaterial = shaderMaterial({ uPositions: null, uTime: 0 }, ParticleShader.vertexShader, ParticleShader.fragmentShader)
extend({ ParticlesMaterial })

export function FinalParticleSystem() {
  const matRef = useRef()

  // --- DATA GENERATION (Proven to be correct) ---
  const { positionTexture, particleGeometry } = useMemo(() => {
    const SIZE = 64
    const DRONE_COUNT = SIZE * SIZE
    const posData = new Float32Array(DRONE_COUNT * 4)
    const uvs = new Float32Array(DRONE_COUNT * 2)
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const i = row * SIZE + col
        posData.set([(col - (SIZE - 1) / 2) * 1.5, (row - (SIZE - 1) / 2) * 1.5, 0, 1.0], i * 4)
        uvs.set([col / (SIZE - 1), row / (SIZE - 1)], i * 2)
      }
    }
    const texture = new THREE.DataTexture(posData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    texture.needsUpdate = true
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))
    return { positionTexture: texture, particleGeometry: geometry }
  }, [])

  // --- The Frame Loop: Simple and Direct ---
  useFrame((state) => {
    if (matRef.current) {
      // We only need to update one thing: the time.
      matRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <points>
      <primitive object={particleGeometry} />
      <particlesMaterial ref={matRef} uPositions={positionTexture} />
    </points>
  )
}
