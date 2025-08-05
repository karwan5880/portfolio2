'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import React from 'react'

import { DroneShowSimulation } from './DroneShowSimulation'

export function DroneShowDemo() {
  return (
    <React.Suspense fallback={null}>
      <Canvas camera={{ position: [0, 20, 150], fov: 60 }}>
        <DroneShowSimulation />
        <OrbitControls />
        {/* <EffectComposer>
          <Bloom intensity={1.0} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer> */}
      </Canvas>
    </React.Suspense>
  )
}
