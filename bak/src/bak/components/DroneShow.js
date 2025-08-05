'use client'

import { BloomController } from '../animation/BloomController.js'
import { CameraController } from '../animation/CameraController.js'
import { CAMERA_CONFIG, VISUAL_CONFIG } from '../config/constants.js'
import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import React, { Suspense, useRef } from 'react'

import { RefactoredParticleSystem } from './RefactoredParticleSystem.js'

function Scene() {
  const controlsRef = useRef()
  const cameraController = useRef(new CameraController())

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    cameraController.current.updateCamera(state.camera, controlsRef.current, time)
  })

  return (
    <>
      <color attach="background" args={[VISUAL_CONFIG.COLORS.BACKGROUND]} />
      <ambientLight intensity={VISUAL_CONFIG.COLORS.AMBIENT_LIGHT} />
      <directionalLight position={[500, 1000, 1000]} intensity={VISUAL_CONFIG.COLORS.DIRECTIONAL_LIGHT} />

      <group position={[0, 0, 0]}>
        <RefactoredParticleSystem />
      </group>

      <axesHelper args={[200]} position={[0, 0, 0]} />

      <OrbitControls ref={controlsRef} target={[0, 0, 0]} minDistance={100} maxDistance={40000} enabled={true} enablePan={true} />
    </>
  )
}

function PostProcessing() {
  const bloomController = useRef(new BloomController())

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    bloomController.current.updateBloom(time)
  })

  return (
    <EffectComposer multisampling={4}>
      <Bloom intensity={bloomController.current.intensity} radius={bloomController.current.radius} luminanceThreshold={0.5} luminanceSmoothing={0.9} mipmapBlur={true} levels={7} />
    </EffectComposer>
  )
}

export function DroneShow() {
  return (
    <Suspense fallback={<div style={{ color: 'white' }}>Preparing...</div>}>
      <Canvas
        camera={{
          position: [CAMERA_CONFIG.POSITIONS.START.x, CAMERA_CONFIG.POSITIONS.START.y, CAMERA_CONFIG.POSITIONS.START.z],
          fov: CAMERA_CONFIG.FOV,
          near: CAMERA_CONFIG.NEAR,
          far: CAMERA_CONFIG.FAR,
        }}
      >
        <Scene />
        <PostProcessing />
      </Canvas>
    </Suspense>
  )
}
