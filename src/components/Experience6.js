'use client'

import { OrbitControls, Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import { AsteroidBelt } from './AsteroidBelt3'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Marker } from './Marker'
import { PhotorealisticPlanet } from './PhotorealisticPlanet'
import { Sun } from './Sun'
import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

const sunOcclusionRaycaster = new THREE.Raycaster()
const sunWorldPosition = new THREE.Vector3() // Reusable vector to avoid creating new ones in the loop

export function Experience({
  onMarkerClick,
  cameraFocusSection,
  onAnimationComplete,
  isAnimating,
  setCameraFocusSection,
  lightTracker, // We still need this to pass to the Sun
}) {
  const controlsRef = useRef()
  const [isInteracting, setIsInteracting] = useState(false)
  const planetGroupRef = useRef()
  const sunRef = useRef() // This will now point to our <Sun /> component's group
  const { camera } = useThree()
  const [isFlareVisible, setFlareVisible] = useState(true)

  useFrame(() => {
    // Occlusion logic is now the main responsibility of this useFrame
    if (sunRef.current && planetGroupRef.current && lightTracker) {
      // Get the real-time world position of the moving sun
      sunRef.current.getWorldPosition(sunWorldPosition)

      const cameraPosition = camera.position
      const direction = sunWorldPosition.clone().sub(cameraPosition).normalize()

      sunOcclusionRaycaster.set(cameraPosition, direction)
      const intersects = sunOcclusionRaycaster.intersectObject(planetGroupRef.current, true)

      const sunDistance = cameraPosition.distanceTo(sunWorldPosition)
      if (intersects.length > 0 && intersects[0].distance < sunDistance) {
        // setFlareVisible(true) // Sun is visible
        lightTracker.position.copy(sunWorldPosition)
      } else {
        // setFlareVisible(false) // Planet is blocking the sun
        lightTracker.position.set(1000, 1000, 1000)
      }
    }
  })

  useEffect(() => {
    // This logic is for hiding the LensFlare when occluded.
    // It works by moving the object the flare is tracking very far away.
    if (lightTracker && !isFlareVisible) {
      // The Sun component is always updating the tracker's position when visible.
      // We only need to intervene when it should be hidden.
      lightTracker.position.set(1000, 1000, 1000)
    }
  }, [isFlareVisible, lightTracker])

  return (
    <>
      <CameraRig isInteracting={isInteracting} onAnimationComplete={onAnimationComplete} cameraFocusSection={cameraFocusSection} />
      <ambientLight intensity={0.1} />

      {/* === REPLACEMENT === */}
      {/* Old sun/light removed, new unified Sun component added */}
      {/* <Sun ref={sunRef} lightTracker={lightTracker} /> */}
      <Sun ref={sunRef} />
      {/* =================== */}

      <Stars radius={300} depth={50} count={10000} factor={7} saturation={0} fade speed={1} />
      <AsteroidBelt />

      <group ref={planetGroupRef}>
        <PhotorealisticPlanet />
        <Atmosphere />
        {locations.map((loc) => (
          <Marker key={loc.name} name={loc.name} position={latLonToVector3(loc.coords[0], loc.coords[1], 2.1)} onClick={onMarkerClick} isAnimating={isAnimating} isSelected={cameraFocusSection === loc.name} />
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        onStart={() => {
          setIsInteracting(true)
          setCameraFocusSection(null)
        }}
        onEnd={() => setTimeout(() => setIsInteracting(false), 500)}
        enablePan={false}
        autoRotate={false}
        minDistance={3.5}
        maxDistance={15}
      />
    </>
  )
}
