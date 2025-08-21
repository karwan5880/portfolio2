'use client'

import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

import { Experience } from './Experience'

export default function Scene({ onMarkerClick, selectedSection }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <Experience onMarkerClick={onMarkerClick} selectedSection={selectedSection} />

      <EffectComposer>
        <Bloom
          intensity={1.0} //
          luminanceThreshold={0.75}
          luminanceSmoothing={0.025}
        />
      </EffectComposer>
    </Canvas>
  )
}
