'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import React from 'react'

import { ParticleChainSimulation } from './ParticleChainSimulation'

export function ParticleChainDemo() {
  return (
    <React.Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 35], fov: 75 }}>
        <ParticleChainSimulation />
        <OrbitControls />
        <EffectComposer>
          <Bloom intensity={0.7} luminanceThreshold={0.1} luminanceSmoothing={0.2} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </React.Suspense>
  )
}
