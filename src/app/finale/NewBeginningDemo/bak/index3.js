'use client'

import { Environment, Grid, OrbitControls, Sphere, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, GodRays } from '@react-three/postprocessing'
import { KernelSize, Resolution } from 'postprocessing'
import React, { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { FinalParticleSystem } from './FinalParticleSystem'

const SCENE_SCALE = 10.0
const FORMATION_DISTANCE = -1000 // Push the formation 5000 units away
const FLY_UP_HEIGHT = 25.0 // The base height, before scaling
const HEARTBEAT_DURATION = 10.0 // Let's make it last for 10 seconds!
const FLIGHT_DURATION = 1.0 // Let's double the duration to 10 seconds!
// const FLIGHT_DURATION = 15.0 // Let's double the duration to 10 seconds!

// The working HDR loader
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

  // The dynamic camera logic
  useFrame((state) => {
    if (!controlsRef.current) return
    const t = state.clock.getElapsedTime()
    const flightProgress = Math.min(1.0, t / 12.0)
    const startTarget = new THREE.Vector3(0, 50, 0)
    const endTarget = new THREE.Vector3(0, 25.0 * SCENE_SCALE, FORMATION_DISTANCE)
    controlsRef.current.target.lerpVectors(startTarget, endTarget, flightProgress)
    controlsRef.current.update()
  })

  return (
    <>
      {/* 2. THE ENVIRONMENT COMPONENT - THE PROFESSIONAL WAY */}
      {/* This will correctly load our .hdr and integrate with Suspense. */}
      {/* It provides both the background and the realistic lighting. */}
      {/* <Environment files="/textures/birchwood_8k.hdr" background blur={0.2} /> */}

      {/* The fog for atmospheric depth */}
      <fog attach="fog" args={['#0d1a24', 500, 3000]} />

      <group position={[0, 0, FORMATION_DISTANCE]}>
        <FinalParticleSystem scale={SCENE_SCALE} />
      </group>

      <OrbitControls ref={controlsRef} />
    </>
  )
}

export function NewBeginningDemo() {
  // const lightRef = useRef()
  // const controlsRef = useRef()
  // // 3. THE DYNAMIC CAMERA TARGET LOGIC
  // useFrame((state) => {
  //   if (!controlsRef.current) return
  //   // We calculate a 'progress' value for the first 10 seconds of the show
  //   const t = state.clock.getElapsedTime()
  //   const flightProgress = Math.min(1.0, t / 10.0)
  //   // The camera's target starts at the launchpad (Y=0, Z=0)
  //   const startTarget = new THREE.Vector3(0, 0, 0)
  //   // The final target is the center of our distant drone formation
  //   const endTarget = new THREE.Vector3(0, 25.0 * SCENE_SCALE, FORMATION_DISTANCE)
  //   // We smoothly interpolate the target from the start to the end
  //   controlsRef.current.target.lerpVectors(startTarget, endTarget, flightProgress)
  //   // We must manually tell the controls to update
  //   controlsRef.current.update()
  // })

  return (
    <Suspense fallback={<div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#111', color: 'white' }}>Loading Show...</div>}>
      <Canvas camera={{ position: [0, 200, 800], fov: 60, near: 1, far: 5000 }}>
        <Scene />
      </Canvas>
    </Suspense>

    // <Suspense fallback={<div>Loading Final Show...</div>}>
    //   <Canvas camera={{ position: [0, 200, 800], fov: 60, near: 1, far: 5000 }}>
    //     <Scene />
    //   </Canvas>
    // </Suspense>
  )

  // return (
  //   <React.Suspense fallback={<div style={{ color: 'white' }}>Building Universe...</div>}>
  //     <Suspense fallback={<div></div>}>
  //       {/* <Canvas camera={{ position: [0, 20, 100], fov: 75 }}> */}
  //       <Canvas camera={{ position: [0, 200, 800], fov: 60, near: 1, far: 5000 }}>
  //         {/* <color attach="background" args={['#000000']} /> */}
  //         {/* <ambientLight intensity={0.5} /> */}
  //         {/* <pointLight ref={lightRef} position={[0, 0, 0]} intensity={150.0} distance={100.0} color="#87CEEB" /> */}
  //         <fog attach="fog" args={['#0d1a24', 500, 3000]} />
  //         {/* <ManualHDRISkybox /> */}
  //         <group position={[0, 0, FORMATION_DISTANCE]}>
  //           <FinalParticleSystem
  //             scale={SCENE_SCALE} //
  //             sceneSize={FORMATION_DISTANCE}
  //             heartbeatDuration={HEARTBEAT_DURATION}
  //             flightDuration={FLIGHT_DURATION}
  //           />
  //           {/* <FinalParticleSystem scale={SCENE_SCALE} /> */}
  //         </group>
  //         {/* <Grid
  //         args={[200, 200]} //
  //         sectionColor={'#4A4A4A'}
  //         cellColor={'#6f6f6f'}
  //         fadeDistance={300}
  //         infiniteGrid
  //       /> */}
  //         {/* You can also add an axes helper for orientation */}
  //         {/* <axesHelper args={[200]} position={[0, 0, FORMATION_DISTANCE]} /> */}
  //         <OrbitControls
  //           ref={controlsRef}
  //           // target={[0, 25 * SCENE_SCALE, FORMATION_DISTANCE]} //
  //           // minDistance={500} //
  //           // maxDistance={10000} //
  //         />
  //         {/* target={[0, 0, 0]}
  //       /> */}
  //         <EffectComposer>
  //           <Bloom
  //             intensity={0.009} // T
  //             luminanceThreshold={0.6} //
  //             luminanceSmoothing={0.025} //
  //             mipmapBlur={true} //
  //             kernelSize={KernelSize.HUGE}
  //           />
  //           {lightRef.current && <GodRays sun={lightRef} />}
  //         </EffectComposer>
  //       </Canvas>
  //     </Suspense>
  //   </React.Suspense>
  // )
}
