'use client'

import { Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
// import { Bloom, EffectComposer, GodRays, LensFlare } from '@react-three/postprocessing'
import { Bloom, EffectComposer, GodRays, LensFlare } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { Experience } from './Experience'
// 1. IMPORT our utility function
import { latLonToVector3 } from './utils'

// 2. CALCULATE the starting position before the component renders
// We're picking a point over the South China Sea to frame Southeast Asia nicely.
const startingLat = 0 // Latitude
// const startingLat = 15 // Latitude
// const startingLat = -10 // Latitude
const startingLon = 100 // Longitude
// const startingLon = 105 // Longitude
const zoomLevel = 3.0 // Controls the initial zoom. Smaller is closer. Default was 7 / 2 = 3.5. Let's keep it.
const initialCameraPosition = latLonToVector3(startingLat, startingLon, 2 * zoomLevel)

// export default function Scene({
const Scene = React.forwardRef(function Scene(
  {
    eventSource, //
    setControls,
    resetTrigger,
    controls,
    // onMarkerClick,
    // selectedLocation,
    // isAnimating,
    // onLoaded,
    ...props
  },
  ref
) {
  // }) {
  const [sunMesh, setSunMesh] = useState(null)
  const lightTracker = useMemo(() => new THREE.Object3D(), [])

  const [isHighQuality, setIsHighQuality] = useState(true)
  const [isLensFlareVisible, setLensFlareVisible] = useState(true)
  // This ref will point to our cosmetic sun mesh in the Experience
  const sunRef = useRef()

  // useLayoutEffect(() => {
  //   if (onLoaded) onLoaded()
  // }, [onLoaded])

  // // This effect synchronizes the lens flare's visibility with the animation state.
  // useEffect(() => {
  //   let timer
  //   // If the main animation starts, hide the lens flare immediately.
  //   if (isAnimating) {
  //     setLensFlareVisible(false)
  //   }
  //   // If the main animation stops...
  //   else {
  //     // ...wait a very short moment (e.g., 50ms) before making it visible again.
  //     // This gives the scene one or two frames to stabilize all object positions.
  //     timer = setTimeout(() => {
  //       setLensFlareVisible(true)
  //     }, 5000)
  //   }
  //   // This is a cleanup function to prevent errors if the component unmounts.
  //   return () => {
  //     clearTimeout(timer)
  //   }
  // }, [isAnimating]) // This effect runs only when isAnimating changes.

  return (
    <>
      <Canvas
        eventSource={eventSource}
        eventPrefix="client" //
        camera={{ position: initialCameraPosition.toArray(), fov: 60 }}
        // camera={{ position: [-7, 2, 3], fov: 60 }}
        // camera={{ position: [0, 2, 6], fov: 60 }}
        // camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{ logarithmicDepthBuffer: true }}
      >
        <PerformanceMonitor
          onIncline={() => setIsHighQuality(true)} // FPS is good, enable effects
          onDecline={() => setIsHighQuality(false)} // FPS is bad, disable effects
        />
        {/* This is our visible sun object. It's just a mesh. */}
        <mesh ref={setSunMesh}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color={'#ffffff'} toneMapped={false} />
        </mesh>
        <Experience
          ref={ref}
          // {...props}
          // isAnimating={isAnimating}
          sunRef={sunMesh} // Pass the ref down
          lightTracker={lightTracker} // Pass the tracker down
          // onMarkerClick={onMarkerClick}
          // selectedLocation={selectedLocation}
          // initialCameraPosition={initialCameraPosition}
          setControls={setControls}
          resetTrigger={resetTrigger}
          controls={controls}
        />
        <EffectComposer>
          {sunMesh && (
            <>
              {/* GodRays emanate from the sunRef. The planet will naturally block them. */}
              <GodRays
                sun={sunMesh}
                blendFunction={BlendFunction.SCREEN} //
                samples={60}
                decay={0.95}
                // density={0.99}
                // weight={1.0}
                // exposure={0.8}
                density={0.96}
                weight={0.6}
                exposure={0.4}
                clampMax={1}
                kernelSize={KernelSize.SMALL}
              />
              {/* {!isLensFlareVisible && (
                <LensFlare
                  source={lightTracker} //
                  intensity={0.5}
                  scale={0.8}
                  blendFunction={BlendFunction.ADD}
                />
              )} */}
              {/* --- 2. THIS IS THE NEW CUSTOM FLARE --- */}
              {/* We replace the old <LensFlare> with this <Flare> component */}
              <LensFlare
                source={lightTracker}
                intensity={0.5} // Low intensity for a subtle effect
                scale={1.2} // Very large scale to create the main "glow"
                // color={new THREE.Color('#FFDDAA')}
                blendFunction={BlendFunction.ADD}
                // elements={[
                //   <StarBurst key="starburst" count={12} speed={0.1} intensity={0.6} />,
                //   <Halo
                //     key="halo1"
                //     scale={6.0} // The size of the main halo
                //     intensity={1.0} // Its brightness
                //   />,
                //   <Halo key="halo2" scale={2.5} intensity={0.5} />,
                //   <Halo key="halo3" scale={1.5} intensity={0.25} />,
                // ]}
              />
              {/* Layer 2: The sharp, bright core flare and its artifacts */}
              {/* <LensFlare
                source={lightTracker}
                intensity={0.6} // Higher intensity for the bright parts
                scale={1.2} // A smaller scale for the main streaks and halos
                blendFunction={BlendFunction.ADD}
                // Keeping this one white makes the core feel hotter
                color={new THREE.Color('white')}
              /> */}
            </>
          )}
          {/* <LensFlare
                source={lightTracker} //
                intensity={1.2}
                scale={1.5}
                // intensity={0.5}
                // scale={0.8}
                blendFunction={BlendFunction.ADD}
              /> */}
          {/* <Bloom
            intensity={1.5}
            luminanceThreshold={0.75} //
            // intensity={1.0}
            // luminanceThreshold={0.8} //
            luminanceSmoothing={0.025}
            mipmapBlur
          /> */}
          <Bloom
            intensity={2.0} // Increase intensity for a strong glow
            // Lower the threshold so the bloom "catches" the sun mesh more easily
            luminanceThreshold={0.7}
            luminanceSmoothing={0.01} // A little smoothing
            mipmapBlur // This makes the bloom softer and more diffuse
            kernelSize={KernelSize.HUGE} // Use a large kernel for a wide, atmospheric glow
          />
        </EffectComposer>
      </Canvas>
      <Loader />
    </>
  )
  // }
})

export default Scene
