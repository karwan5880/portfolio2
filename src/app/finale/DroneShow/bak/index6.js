'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import React, { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { FinalParticleSystem } from './FinalParticleSystem'

const SCENE_SCALE = 10.0
const FLY_UP_HEIGHT = 25.0
const FLIGHT_DURATION = 10.0
const FORMATION_DISTANCE = -1500 //

const PULSE_SPEED = 1.0 //
const PULSE_DURATION = 45.0 //
const PULSE_IS_PERPETUAL = 1.0 //

function ManualHDRISkybox() {
  const { scene } = useThree()
  useMemo(() => {
    new RGBELoader().load(
      //   '/textures/sunflowers_puresky_8k.hdr', // The path to your .hdr file in /public
      //   '/textures/belfast_sunset_puresky_2k.hdr', // The path to your .hdr file in /public
      //   '/textures/autumn_field_puresky_2k.hdr', // The path to your .hdr file in /public
      //   '/textures/moonless_golf_2k.hdr', // The path to your .hdr file in /public
      //   '/textures/rogland_clear_night_2k.hdr', // The path to your .hdr file in /public
      '/textures/birchwood_8k.hdr', // The path to your .hdr file in /public
      //   '/dusk_city.hdr',
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping
        scene.background = texture
        scene.environment = texture
      }
    )
  }, [scene])
  return null
}

function Scene() {
  const controlsRef = useRef()

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (controlsRef.current && time % 1 < 0.02) {
      const distance = controlsRef.current.getDistance()
      console.log('Camera Distance to Target:', distance.toFixed(2))
    }
  })

  return (
    <>
      {/* <color attach="background" args={['#6a6aff']} /> */}
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[500, 1000, 1000]} intensity={1.5} />
      {/* <ManualHDRISkybox /> */}
      <group position={[0, 0, FORMATION_DISTANCE]}>
        <FinalParticleSystem
          scale={SCENE_SCALE} //
          pulseFrequency={PULSE_SPEED}
          pulseDuration={PULSE_DURATION}
          pulseIsPerpetual={PULSE_IS_PERPETUAL}
        />
      </group>
      <axesHelper args={[200]} position={[0, 0, FORMATION_DISTANCE]} />

      <OrbitControls
        ref={controlsRef} //
        target={[0, 0, 0]}
        minDistance={100} //
        maxDistance={40000} //
      />
    </>
  )
}

export function NewBeginningDemo() {
  return (
    <Suspense fallback={<div style={{ color: 'white' }}>Preparing...</div>}>
      <Canvas
        camera={{
          position: [0, 500, 2000], //
          fov: 60,
          near: 0.1,
          far: 4160000,
        }}
      >
        <Scene />
        <EffectComposer>
          <Bloom
            intensity={0.5} //
            luminanceThreshold={0.5} //
            luminanceSmoothing={0.025}
            mipmapBlur={true} //
          />
        </EffectComposer>
      </Canvas>
    </Suspense>
  )
}
