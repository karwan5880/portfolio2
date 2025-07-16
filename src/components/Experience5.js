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
import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

const sunOcclusionRaycaster = new THREE.Raycaster()

export function Experience({
  onMarkerClick,
  cameraFocusSection, //
  onAnimationComplete,
  isAnimating,
  setCameraFocusSection,
  lightTracker,
  lightSourceRef,
}) {
  const controlsRef = useRef()
  const [isInteracting, setIsInteracting] = useState(false)
  const planetGroupRef = useRef()
  const lightRef = useRef()
  const { camera } = useThree()
  const sunRef = useRef()
  const [isFlareVisible, setFlareVisible] = useState(true)

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.1) * 10
      lightRef.current.position.z = Math.cos(time * 0.1) * 10
    }
    if (lightTracker && lightRef.current) {
      if (isFlareVisible) {
        lightTracker.position.copy(lightRef.current.position)
      }
    }
    if (sunRef.current && planetGroupRef.current) {
      const sunPosition = sunRef.current.position
      const cameraPosition = camera.position
      const direction = sunPosition.clone().sub(cameraPosition).normalize()

      sunOcclusionRaycaster.set(cameraPosition, direction)
      const intersects = sunOcclusionRaycaster.intersectObject(planetGroupRef.current, true)

      const sunDistance = cameraPosition.distanceTo(sunPosition)
      if (intersects.length > 0 && intersects[0].distance < sunDistance) {
        setFlareVisible(false)
      } else {
        setFlareVisible(true)
      }
    }
  })

  useEffect(() => {
    if (lightTracker) {
      // Check if the tracker exists
      if (isFlareVisible) {
        // If visible, we don't need to do anything extra here,
        // because the useFrame loop is already updating its position.
      } else {
        // If not visible, move the tracker very far away so the flare is off-screen.
        lightTracker.position.set(1000, 1000, 1000)
      }
    }
    // The useFrame handles the 'visible' case, this effect handles the 'hidden' case.
  }, [isFlareVisible, lightTracker])

  return (
    <>
      <CameraRig isInteracting={isInteracting} onAnimationComplete={onAnimationComplete} cameraFocusSection={cameraFocusSection} />
      <ambientLight intensity={0.1} />
      <pointLight ref={lightRef} position={[10, 2, 0]} intensity={120} decay={2} />
      {/* <mesh ref={lightSourceRef}>
        <sphereGeometry args={[0.01]} />
      </mesh> */}
      <mesh ref={sunRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={'#FFDDAA'} toneMapped={false} />
      </mesh>

      <Stars radius={300} depth={50} count={10000} factor={7} saturation={0} fade speed={1} />
      <AsteroidBelt />

      <group ref={planetGroupRef}>
        <PhotorealisticPlanet />
        <Atmosphere />
        {locations.map((loc) => (
          <Marker
            key={loc.name}
            name={loc.name} //
            position={latLonToVector3(loc.coords[0], loc.coords[1], 2.1)}
            onClick={onMarkerClick}
            isAnimating={isAnimating} //
            isSelected={cameraFocusSection === loc.name}
          />
        ))}
      </group>

      <OrbitControls
        ref={controlsRef}
        onStart={() => {
          setIsInteracting(true)
          setCameraFocusSection(null)
        }}
        onEnd={() => {
          setTimeout(() => setIsInteracting(false), 500)
        }}
        enablePan={false}
        autoRotate={false}
        autoRotateSpeed={0.2}
        minDistance={3.5}
        maxDistance={15}
      />
    </>
  )
}
