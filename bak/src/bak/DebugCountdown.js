// Debug version to test countdown digits with easier timing
'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { Suspense, useRef } from 'react'

import { DebugParticleSystem } from './components/DebugParticleSystem.js'

// Debug version to test countdown digits with easier timing

// Debug version to test countdown digits with easier timing

// Debug version to test countdown digits with easier timing

function Scene() {
  const controlsRef = useRef()

  useFrame((state) => {
    // Simple camera setup - no complex animations
    state.camera.position.set(0, 250, 900)
    state.camera.lookAt(0, 400, 0)
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[500, 1000, 1000]} intensity={1.5} />

      <group position={[0, 0, 0]}>
        <DebugParticleSystem />
      </group>

      <axesHelper args={[200]} position={[0, 0, 0]} />

      <OrbitControls ref={controlsRef} target={[0, 400, 0]} minDistance={100} maxDistance={2000} enabled={true} enablePan={true} />
    </>
  )
}

export function DebugCountdown() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Suspense fallback={<div style={{ color: 'white' }}>Loading...</div>}>
        <Canvas
          camera={{
            position: [0, 250, 900],
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
        <h3 style={{ margin: '0 0 10px 0' }}>🔍 Debug Countdown</h3>
        <p style={{ margin: '5px 0' }}>
          • <strong>Countdown starts at 10 seconds</strong> (instead of 40s)
        </p>
        <p style={{ margin: '5px 0' }}>• Look for 32x32 screen formation in center</p>
        <p style={{ margin: '5px 0' }}>• Digits should be bright white on dark background</p>
        <p style={{ margin: '5px 0' }}>• Camera positioned to see screen clearly</p>
        <div style={{ marginTop: '10px', padding: '5px', background: 'rgba(255,255,0,0.2)' }}>
          <strong>⚠️ If no digits visible, there's a shader bug!</strong>
        </div>
      </div>
    </div>
  )
}
