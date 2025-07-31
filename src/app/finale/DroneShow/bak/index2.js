'use client'

import { Environment, Grid, OrbitControls, Sphere, useTexture } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, GodRays, LensFlare } from '@react-three/postprocessing'
import { KernelSize, Resolution } from 'postprocessing'
import React, { Suspense, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

import { FinalParticleSystem } from './FinalParticleSystem'

// This is the vertical height you decided on earlier. We need it to position our light source.

const SCENE_SCALE = 10.0 // Let's make everything 10x bigger
const FLY_UP_HEIGHT = 25.0 * SCENE_SCALE // The final height, also scaled
// const FORMATION_Z_OFFSET = -500.0 * SCENE_SCALE

// function ManualHDRISkybox() {
//   const { scene } = useThree()
//   useMemo(() => {
//     // 1. We use RGBELoader for HDR files.
//     // const loader = new THREE.RGBELoader()
//     const loader = new RGBELoader()
//     loader.load(
//       '/textures/sunflowers_puresky_8k.hdr', // The path to your .hdr file in /public
//       //   '/textures/moonless_golf_4k.hdr', // The path to your .hdr file in /public
//       //   '/textures/qwantani_dusk_2_puresky_2k.hdr', // The path to your .hdr file in /public
//       (texture) => {
//         // 2. This mapping is CRITICAL for 360° HDRIs.
//         texture.mapping = THREE.EquirectangularReflectionMapping
//         scene.background = texture
//         scene.environment = texture // Also set it as the environment for lighting
//       }
//     )
//   }, [scene])

//   return null
// }

export function NewBeginningDemo() {
  const lightRef = useRef()

  const initialCameraPosition = [130.9, 3.68, 104.16]
  const initialControlsTarget = [11.8, 111.5, 11.75]

  return (
    <React.Suspense fallback={null}>
      {/* <React.Suspense fallback={<div style={{ color: 'white', fontSize: '2rem' }}>Loading Scene...</div>}> */}
      <Canvas camera={{ position: [0, 20, 100], fov: 75 }}>
        {/* <Canvas camera={{ position: [0, 0, 170], fov: 75 }}> */}
        {/* <Canvas camera={{ position: [0, 0, 70], fov: 75 }}> */}
        {/* <Canvas camera={{ position: [40, 35, 180], fov: 75 }}> */}
        {/* <Canvas camera={{ position: [40, 140, 220], fov: 75 }}> */}
        {/* <Canvas camera={{ position: [40, 15, 140], fov: 75 }}> */}
        {/* <Canvas camera={{ position: [0, 150, 800], fov: 60, far: 15000 }}> */}
        {/* <Canvas camera={{ position: initialCameraPosition, fov: 75 }}> */}
        {/* <React.Suspense fallback={null}> */}
        {/* <fog attach="fog" args={['#1a202c', 1000, 4000]} /> */}
        {/* <ManualHDRISkybox /> */}

        {/* <Skybox /> */}
        {/* <ManualSkybox /> */}
        {/* <color attach="background" args={['#050505']} /> */}
        <ambientLight intensity={0.5} />
        {/* <mesh ref={lightRef} position={[0, FLY_UP_HEIGHT, 0]} visible={false}>
          <sphereGeometry args={[15, 32, 32]} />
          <meshBasicMaterial color="white" emissive="white" emissiveIntensity={10} toneMapped={false} />
        </mesh> */}

        {/* <Environment
          background
          files="/textures/qwantani_dusk_2_puresky_2k.hdr" // The path to your image in the /public folder
          blur={0.2} // A slight blur helps to fake depth-of-field and keep focus on the drones
        /> */}
        {/* <pointLight
          ref={lightRef}
          position={[200, 300, -400]}
          //   position={[200, 300, FORMATION_Z_OFFSET + 200]}
          intensity={50000.0} // Needs to be very intense from far away
          distance={3000.0}
          color="#ffaf40"
        /> */}
        <pointLight
          ref={lightRef}
          position={[0, FLY_UP_HEIGHT, 0]}
          intensity={150.0}
          distance={100.0}
          color="#87CEEB" // A sky blue color often works well for godrays
        />

        <FinalParticleSystem />
        {/* <FinalParticleSystem scale={SCENE_SCALE} /> */}
        <OrbitControls
          target={[0, FLY_UP_HEIGHT, 0]}
          //   target={[0, FLY_UP_HEIGHT, FORMATION_Z_OFFSET]}
          //   // target={initialControlsTarget}
          minDistance={200} // Prevent zooming in too close
          maxDistance={3000} // Allow zooming out far
          //   //   minDistance={100} // Prevent zooming in too close
          //   //   maxDistance={2000} // Allow zooming out far
        />

        {/* <Grid
          args={[200, 200]} //
          sectionColor={'#4A4A4A'}
          cellColor={'#6f6f6f'}
          fadeDistance={300}
          infiniteGrid
        /> */}

        {/* You can also add an axes helper for orientation */}
        {/* <axesHelper args={[20]} /> */}

        <EffectComposer>
          <Bloom
            intensity={0.009} // The bloom intensity.
            // intensity={0.009} // The bloom intensity.
            luminanceThreshold={0.6} // A value between 0 and 1. Only pixels brighter than this will bloom.
            luminanceSmoothing={0.025} // Smoothness of the luminance threshold.
            // intensity={1.5} // The bloom intensity.
            // luminanceThreshold={0.5} // A value between 0 and 1. Only pixels brighter than this will bloom.
            // luminanceSmoothing={0.025} // Smoothness of the luminance threshold.
            mipmapBlur={true} // Creates a higher quality, softer blur.
          />
          {lightRef.current && (
            <GodRays
              sun={lightRef} // Point the god rays at our invisible mesh
              // kernelSize={KernelSize.SMALL}
              // density={0.96}
              // decay={0.94}
              // weight={0.6}
              // exposure={0.54}
              // samples={60}
            />
          )}
        </EffectComposer>
        {/* <CameraLogger /> */}
        {/* </React.Suspense> */}
      </Canvas>
    </React.Suspense>
  )
}
