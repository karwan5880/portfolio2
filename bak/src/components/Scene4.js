'use client'

import { Canvas } from '@react-three/fiber'
// No more post-processing for now, let's get the base right.
// import { Bloom, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

// We need THREE for the encoding

import { Experience } from './Experience'

export default function Scene({ onMarkerClick, selectedSection }) {
  return (
    // Add the `gl` prop for explicit color management
    <Canvas gl={{ outputColorSpace: THREE.SRGBColorSpace, toneMapping: THREE.ACESFilmicToneMapping }} camera={{ position: [0, 0, 5], fov: 75 }}>
      <Experience onMarkerClick={onMarkerClick} selectedSection={selectedSection} />
    </Canvas>
  )
}
