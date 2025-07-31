'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import React, { Suspense, useRef, useState } from 'react'
import * as THREE from 'three'

import { DroneSystem } from './DroneSystem'

const DRONE_SCALE = 1.0
const PULSE_SPEED = 1.0

function Scene({ speedMultiplier = 1.0 }) {
  const controlsRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speedMultiplier // Apply speed multiplier

    // SIMPLE CAMERA TRANSITION - from ground level to overview

    // Initial camera view (CLOSER ground level at row 32)
    const staticDuration = 18.0 // Stay still for first 18 seconds
    const actualTransitionDuration = 30.0 // Then 30 seconds to transition
    const totalDuration = staticDuration + actualTransitionDuration

    const initialPos = { x: 0, y: 2, z: 50 } // Elevated: Y=10, Z=+10
    const initialLookAt = { x: 0, y: 330, z: -1000 } // Look at elevated level

    // Final camera view (CLOSER, looking up at circle from below)
    const finalPos = { x: 0, y: 100, z: 590 } // 10 units closer (600 → 590)
    const finalLookAt = { x: 0, y: 200, z: 0 } // Look up at circle formation

    if (time < staticDuration) {
      // PHASE 1: Stay still for first 5 seconds - watch revealing up close
      if (controlsRef.current) {
        controlsRef.current.enabled = false
      }

      state.camera.position.set(initialPos.x, initialPos.y, initialPos.z)
      state.camera.lookAt(initialLookAt.x, initialLookAt.y, initialLookAt.z)
    } else if (time < totalDuration) {
      // PHASE 2: Smooth transition from 5s to 60s
      if (controlsRef.current) {
        controlsRef.current.enabled = false
      }

      // Transition progress (0 to 1 over 55 seconds)
      const progress = (time - staticDuration) / actualTransitionDuration
      const smoothProgress = progress * progress * (3.0 - 2.0 * progress) // Smooth curve

      // Interpolate camera position
      const currentPos = {
        x: initialPos.x + smoothProgress * (finalPos.x - initialPos.x),
        y: initialPos.y + smoothProgress * (finalPos.y - initialPos.y),
        z: initialPos.z + smoothProgress * (finalPos.z - initialPos.z),
      }

      // Interpolate look-at target
      const currentLookAt = {
        x: initialLookAt.x + smoothProgress * (finalLookAt.x - initialLookAt.x),
        y: initialLookAt.y + smoothProgress * (finalLookAt.y - initialLookAt.y),
        z: initialLookAt.z + smoothProgress * (finalLookAt.z - initialLookAt.z),
      }

      state.camera.position.set(currentPos.x, currentPos.y, currentPos.z)
      state.camera.lookAt(currentLookAt.x, currentLookAt.y, currentLookAt.z)
    } else {
      // PHASE 3: After transition - enable full user control
      if (controlsRef.current && !controlsRef.current.enabled) {
        // Only enable controls once and set initial target
        controlsRef.current.enabled = true
        controlsRef.current.target.set(finalLookAt.x, finalLookAt.y, finalLookAt.z)

        // Set camera position only once when transitioning to user control
        state.camera.position.set(finalPos.x, finalPos.y, finalPos.z)
      }
      // Don't override camera position/lookAt after this - let OrbitControls handle it
    }
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[500, 1000, 1000]} intensity={1.5} />
      <DroneSystem scale={DRONE_SCALE} pulseFrequency={PULSE_SPEED} speedMultiplier={speedMultiplier} />
      <OrbitControls
        ref={controlsRef}
        target={[0, 0, 0]}
        minDistance={100}
        maxDistance={40000}
        enabled={true}
        enablePan={true}
        mouseButtons={{
          LEFT: THREE.MOUSE.ROTATE,
          MIDDLE: THREE.MOUSE.DOLLY,
          RIGHT: THREE.MOUSE.PAN,
        }}
      />
    </>
  )
}

function PostProcessing({ speedMultiplier = 1.0 }) {
  const [bloomIntensity, setBloomIntensity] = useState(0.9)
  const [bloomRadius, setBloomRadius] = useState(0.9)
  const [bloomThreshold, setBloomThreshold] = useState(0.6)

  useFrame((state) => {
    const time = state.clock.getElapsedTime() * speedMultiplier // Apply speed multiplier

    // BOSS'S BLOOM SYSTEM - Simple and effective
    const hiddenPhaseEnd = 5.0 // 0-5s: completely invisible
    const columnRevealEnd = 12.0 // 5-12s: column reveal with dim light (NO BLOOM) - FASTER
    const flightStartTime = 12.0 // 12s+: drones start flying row by row - FASTER

    let newIntensity, newRadius, newThreshold

    if (time < hiddenPhaseEnd) {
      // Phase 0: Hidden phase (0-5s) - No bloom
      newIntensity = 0.0
      newRadius = 0.0
      newThreshold = 2.0
    } else if (time < columnRevealEnd) {
      // Phase 1: Column reveal (5-10s) - NO BLOOM EFFECT as per boss requirements
      newIntensity = 0.0 // No bloom during reveal phase
      newRadius = 0.0 // No bloom radius
      newThreshold = 10.0 // Very high threshold to prevent any bloom
    } else {
      // Phase 2: Flight phase (10s+) - Moderate bloom for flying drones
      const flightTime = time - columnRevealEnd
      const flightProgress = Math.min(1.0, flightTime / 5.0) // Gradual bloom buildup over 5s

      // Moderate bloom that builds up as drones fly
      newIntensity = flightProgress * 0.6 // 0 → 0.6 moderate bloom
      newRadius = flightProgress * 0.8 // 0 → 0.8 moderate radius
      newThreshold = 1.0 - flightProgress * 0.3 // 1.0 → 0.7 (selective bloom)
    }

    // Smooth state updates to prevent jarring transitions
    setBloomIntensity(newIntensity)
    setBloomRadius(newRadius)
    setBloomThreshold(newThreshold)
  })

  return (
    <EffectComposer multisampling={4}>
      {/* Premium bloom settings for cinematic quality */}
      <Bloom intensity={bloomIntensity} radius={bloomRadius} luminanceThreshold={bloomThreshold} luminanceSmoothing={0.98} mipmapBlur={true} levels={8} kernelSize={5} />
    </EffectComposer>
  )
}

export function DroneScene({ speedMultiplier = 1.0 }) {
  return (
    <Suspense fallback={<div style={{ color: 'white' }}>Preparing...</div>}>
      <Canvas
        camera={{
          position: [0, 4, 90], // Ground level distant view
          fov: 60,
          near: 0.1,
          far: 4160000,
        }}
      >
        <Scene speedMultiplier={speedMultiplier} />
        <PostProcessing speedMultiplier={speedMultiplier} />
      </Canvas>
    </Suspense>
  )
}
