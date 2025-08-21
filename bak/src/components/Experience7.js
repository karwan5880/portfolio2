'use client'

import { Environment, OrbitControls, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import { AsteroidBelt } from './AsteroidBelt'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Marker } from './Marker'
import { PhotorealisticPlanet } from './PhotorealisticPlanet'
import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

export function Experience({
  lightTracker,
  sunRef,
  onMarkerClick, //
  cameraFocusSection,
  setCameraFocusSection,
  onAnimationComplete,
  isAnimating,
  ...props
}) {
  // export function Experience({ lightTracker, sunRef, ...props }) {
  const controlsRef = useRef()
  const directionalLightRef = useRef()
  const [isInteracting, setIsInteracting] = useState(false) // Needed for CameraRig
  const [hasInteracted, setHasInteracted] = useState(false)

  const [targetPosition, setTargetPosition] = useState(null)
  const [lookAtPosition, setLookAtPosition] = useState(null)

  // This is the single source of truth for the sun's position.
  const sunPosition = new THREE.Vector3()

  useEffect(() => {
    if (cameraFocusSection) {
      const location = locations.find((l) => l.name === cameraFocusSection)
      if (location) {
        const markerPos = latLonToVector3(location.coords[0], location.coords[1], 2.1)
        setTargetPosition(new THREE.Vector3().copy(markerPos).multiplyScalar(2.5))
        setLookAtPosition(new THREE.Vector3().copy(markerPos).multiplyScalar(0.5))
      }
    } else {
      // setTargetPosition(null)
      // setLookAtPosition(null)
      setTargetPosition(new THREE.Vector3(0, 2, 7)) // Our default camera position
      setLookAtPosition(new THREE.Vector3(0, 0, 0)) // Look at the center of the planet
    }
  }, [cameraFocusSection])

  // useFrame(({ clock }) => {
  //   if (controlsRef.current) {
  //     controlsRef.current.update()
  //   }
  //   const time = clock.getElapsedTime()
  //   // Calculate the sun's position in an orbit
  //   sunPosition.set(Math.sin(time * 0.1) * 12, 2, Math.cos(time * 0.1) * 12)
  //   // Update the cosmetic sun mesh's position
  //   if (sunRef) {
  //     sunRef.position.copy(sunPosition)
  //   }
  //   // Update the lightTracker for the LensFlare
  //   if (lightTracker) {
  //     lightTracker.position.copy(sunPosition)
  //   }
  //   // The directional light should point FROM the sun's position TOWARDS the origin
  //   if (directionalLightRef.current) {
  //     directionalLightRef.current.position.copy(sunPosition)
  //     directionalLightRef.current.target.position.set(0, 0, 0)
  //   }
  // })

  // --- THE SINGLE, UNIFIED USEFRAME HOOK ---
  useFrame((state, delta) => {
    // 1. Always update the controls for damping, if they exist.
    if (controlsRef.current) {
      controlsRef.current.update()
    }

    // 2. Always update the sun's position and effects.
    const time = state.clock.getElapsedTime()
    sunPosition.set(Math.sin(time * 0.1) * 12, 2, Math.cos(time * 0.1) * 12)
    if (sunRef) sunRef.position.copy(sunPosition)
    if (lightTracker) lightTracker.position.copy(sunPosition)
    if (directionalLightRef.current) {
      directionalLightRef.current.position.copy(sunPosition)
      directionalLightRef.current.target.position.set(0, 0, 0)
    }

    // 3. Perform the camera animation IF needed.
    if (isAnimating && targetPosition && lookAtPosition && controlsRef.current) {
      const camera = state.camera
      const controls = controlsRef.current
      const lerpFactor = Math.min(delta * 1.5, 1)

      camera.position.lerp(targetPosition, lerpFactor)
      controls.target.lerp(lookAtPosition, lerpFactor)

      const distanceToTarget = camera.position.distanceTo(targetPosition)
      if (distanceToTarget < 0.05) {
        camera.position.copy(targetPosition)
        controls.target.copy(lookAtPosition)
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      }
    }
  })

  return (
    <>
      {/* <CameraRig
        isAnimating={isAnimating}
        isInteracting={isInteracting} //
        cameraFocusSection={props.cameraFocusSection}
        onAnimationComplete={props.onAnimationComplete}
        controlsRef={controlsRef}
      /> */}
      {/* <Environment
        // files="/textures/your-space-background-8k.hdr"
        // files="/textures/NightSkyHDRI002_4K-HDR.exr" //
        // files="/textures/NightSkyHDRI002_8K-HDR.exr" //
        // files="/textures/starmap_random_2020_4k_gal.exr" //
        files="/textures/milkyway_2020_4k_gal.exr" //
        background // This tells it to be the visible background
        ground={false} // We don't need a ground projection
      /> */}
      {/* <ambientLight intensity={0.05} /> */}
      {/* The main, physically accurate light source */}
      <ambientLight intensity={0.05} />
      <directionalLight ref={directionalLightRef} intensity={4} />
      <Stars radius={400} depth={50} count={15000} factor={10} saturation={0} fade speed={1.5} />
      {/* The new Atmosphere component needs the sun's position to calculate scattering */}
      <AsteroidBelt />
      {/* <Atmosphere sunPosition={sunPosition} /> */}
      <group>
        <PhotorealisticPlanet />
        {locations.map((loc) => (
          <Marker
            key={loc.name}
            name={loc.name}
            position={latLonToVector3(loc.coords[0], loc.coords[1], 2.1)}
            // Pass the props from the parent down to the marker
            onClick={onMarkerClick}
            isAnimating={isAnimating}
            // The isSelected prop is calculated based on the global state
            isSelected={cameraFocusSection === loc.name}
          />
        ))}
      </group>
      <OrbitControls
        ref={controlsRef}
        // These onStart/onEnd handlers control the CameraRig
        onStart={() => {
          setIsInteracting(true)
          if (setCameraFocusSection) setCameraFocusSection(null)
          // if (props.setCameraFocusSection) props.setCameraFocusSection(null)
          setHasInteracted(true)
          if (onAnimationComplete) onAnimationComplete()
        }}
        onEnd={() => {
          // A brief timeout helps prevent accidental clicks after dragging.
          setTimeout(() => setIsInteracting(false), 500)
        }}
        // onEnd={() => setTimeout(() => setIsInteracting(false), 500)}
        // --- UX ENHANCEMENTS ---
        enableDamping={true} // Makes camera movement feel smooth and weighty
        dampingFactor={0.05} // Adjust for more or less "glide"
        autoRotate={!hasInteracted} // Adds a gentle, cinematic idle rotation
        autoRotateSpeed={0.1} // Speed of the idle rotation
        // --- Other settings ---
        enablePan={false}
        minDistance={2.5}
        maxDistance={19} // Increased max distance to allow for wider shots
        // minDistance={9.5}
        // maxDistance={25} // Increased max distance to allow for wider shots
      />
      {/* <OrbitControls
        ref={controlsRef} //
        {...props}
        enablePan={false}
        autoRotate={false}
        minDistance={3.5}
        maxDistance={20}
      /> */}
    </>
  )
}
