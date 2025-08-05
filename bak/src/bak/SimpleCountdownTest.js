// Ultra-simple countdown test to isolate the issue
'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { Suspense, useRef } from 'react'

import { FinalParticleSystem } from './FinalParticleSystem.js'

// Ultra-simple countdown test to isolate the issue

function Scene() {
  const controlsRef = useRef()

  useFrame((state) => {
    // Position camera to see the screen formation clearly
    state.camera.position.set(0, 400, 600)
    state.camera.lookAt(0, 400, 0)
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[500, 1000, 1000]} intensity={1.5} />

      <group position={[0, 0, 0]}>
        <FinalParticleSystem scale={1.0} pulseFrequency={1.0} />
      </group>

      <axesHelper args={[200]} position={[0, 0, 0]} />

      <OrbitControls ref={controlsRef} target={[0, 400, 0]} minDistance={100} maxDistance={2000} enabled={true} enablePan={true} />
    </>
  )
}

export function SimpleCountdownTest() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Suspense fallback={<div style={{ color: 'white' }}>Loading...</div>}>
        <Canvas
          camera={{
            position: [0, 400, 600],
            fov: 60,
            near: 0.1,
            far: 10000,
          }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>🧪 Simple Test</h3>
        <p style={{ margin: '5px 0' }}>• Using ORIGINAL FinalParticleSystem</p>
        <p style={{ margin: '5px 0' }}>• Wait for 40 seconds to see countdown</p>
        <p style={{ margin: '5px 0' }}>• Should see digits in the original shader</p>
        <p style={{ margin: '5px 0' }}>• Camera positioned at screen level</p>
        <div style={{ marginTop: '10px', padding: '5px', background: 'rgba(0,255,0,0.2)' }}>
          <strong>✅ This tests the ORIGINAL working system</strong>
        </div>
      </div>
    </div>
  )
}
