'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import React, { Suspense, useRef } from 'react'
import * as THREE from 'three'

import { FinalParticleSystem } from './FinalParticleSystem'

const SCENE_SCALE = 10.0
const FLY_UP_HEIGHT = 25.0
const FLIGHT_DURATION = 10.0
const FORMATION_DISTANCE = -1500 // Push it a bit further back

const PULSE_SPEED = 1.0 // A slower, more majestic pulse
const PULSE_DURATION = 45.0 // Make the launch pulse last for the entire flight
const PULSE_IS_PERPETUAL = 1.0 // Set to `true` to make it pulse forever

function Scene() {
  const controlsRef = useRef()

  // This hook runs on every frame
  useFrame((state) => {
    // We get the current time to prevent spamming the console
    const time = state.clock.getElapsedTime()

    // Only log the distance every second or so
    if (controlsRef.current && time % 1 < 0.02) {
      const distance = controlsRef.current.getDistance()
      console.log('Camera Distance to Target:', distance.toFixed(2))
    }
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1.0} />

      <group position={[0, 0, FORMATION_DISTANCE]}>
        <FinalParticleSystem
          scale={SCENE_SCALE} //
          pulseFrequency={PULSE_SPEED}
          pulseDuration={PULSE_DURATION}
          pulseIsPerpetual={PULSE_IS_PERPETUAL}
        />
      </group>
      <axesHelper args={[200]} position={[0, 0, FORMATION_DISTANCE]} />

      {/* We attach our ref here so we can access the controls */}
      <OrbitControls
        ref={controlsRef} //
        target={[0, 0, 0]}
        // target={[0, FLY_UP_HEIGHT * SCENE_SCALE, FORMATION_DISTANCE]}
        // target={[0, 250, FORMATION_DISTANCE]}
        minDistance={500} // Prevents zooming in too close
        maxDistance={40000} // Prevents zooming out too far
        // enablePan={true}
        // enableDamping={false}
      />
    </>
  )
}

export function NewBeginningDemo() {
  return (
    // A simple fallback for the component itself
    <Suspense fallback={<div style={{ color: 'white' }}>Preparing...</div>}>
      <Canvas
        // ========================================================================
        // --- THE FIX: A ROBUST CAMERA FOR A LARGE SCENE ---
        // ========================================================================
        camera={{
          position: [0, 500, 2000], // 1. Pull the camera WAY back to Z=2000
          fov: 60,
          near: 0.1, // 2. Set the near plane explicitly
          far: 4160000, // 3. Set the far plane to a huge value
        }}
      >
        {/* {' '}
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={1.0} />
        <group position={[0, 0, FORMATION_DISTANCE]}>
          <FinalParticleSystem scale={SCENE_SCALE} />
        </group>
        <OrbitControls target={[0, 250, FORMATION_DISTANCE]} /> */}
        <Scene />

        <EffectComposer>
          <Bloom
            intensity={0.5} // The strength of the glow. Tweak this value!
            luminanceThreshold={0.5} // Only pixels brighter than this threshold will bloom.
            luminanceSmoothing={0.025}
            mipmapBlur={true} // Creates a higher quality, softer blur
          />
        </EffectComposer>
      </Canvas>
    </Suspense>
  )
}
