'use client'

import { OrbitControls, Stars } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import { AsteroidBelt } from './AsteroidBelt3'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
// import { Nebula } from './Nebula'
import { PhotorealisticPlanet } from './PhotorealisticPlanet'
import { SelectionRing } from './SelectionRing'
import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

function Marker({ position, name, onClick, isAnimating, isSelected }) {
  const markerRef = useRef()
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef()
  const { camera } = useThree()
  const [isOccluded, setOccluded] = useState(false)
  const markerWorldPosition = new THREE.Vector3(...position)
  const innerGroupRef = useRef()
  const markerPosition = new THREE.Vector3(...position)
  const raycaster = new THREE.Raycaster()
  const ringRef = useRef()

  // --- ACTIVATION ANIMATION ---
  useEffect(() => {
    if (isSelected) {
      // Animate the whole group
      gsap.fromTo(
        groupRef.current.scale,
        { x: 1, y: 1, z: 1 },
        {
          duration: 0.5,
          x: 1.5,
          y: 1.5,
          z: 1.5,
          ease: 'power2.out',
          yoyo: true, // Animate back to original size
          repeat: 1,
        }
      )
    }
  }, [isSelected])

  useEffect(() => {
    document.body.style.cursor = isHovered && !isAnimating ? 'pointer' : 'auto'
  }, [isHovered, isAnimating])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.lookAt(0, 0, 0)

      const cameraPosition = camera.position
      const cameraToPlanet = new THREE.Vector3().sub(cameraPosition)
      const cameraToMarker = new THREE.Vector3().copy(markerWorldPosition).sub(cameraPosition)
      if (cameraToPlanet.dot(cameraToMarker) < 0) {
        const planetNormal = markerWorldPosition.clone().normalize()
        const cameraToMarkerNormal = cameraToMarker.clone().normalize()
        if (planetNormal.dot(cameraToMarkerNormal) < -0.3) {
          setOccluded(false)
        } else {
          setOccluded(true)
        }
      } else {
        setOccluded(true)
      }

      // const direction = markerPosition.clone().sub(cameraPosition).normalize()
      // raycaster.set(cameraPosition, direction)
      // const sphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 2)
      // const intersects = raycaster.ray.intersectsSphere(sphere)
      // const distanceToMarker = cameraPosition.distanceTo(markerPosition)
      // if (intersects && cameraPosition.distanceTo(raycaster.ray.intersectSphere(sphere, new THREE.Vector3())) < distanceToMarker) {
      //   setOccluded(true)
      // } else {
      //   setOccluded(false)
      // }
    }

    const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1
    const scale = isSelected ? 1.2 : isHovered ? 1.2 : 1 // Hover/selection only affects this group
    innerGroupRef.current.scale.set(scale + pulse, scale + pulse, scale + pulse)
  })

  // Conditionally set material properties based on occlusion
  const materialProps = {
    // If occluded, make it transparent and disable depth testing
    depthTest: !isOccluded,
    opacity: isOccluded ? 0.25 : 1,
    transparent: isOccluded,
  }

  const markerColor = isSelected || isHovered ? '#ffdd00' : '#a770ef'

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={(e) => {
        if (isAnimating) return
        e.stopPropagation()
        onClick(name)
      }}
      onPointerEnter={(e) => {
        e.stopPropagation()
        setIsHovered(true)
      }}
      onPointerLeave={(e) => {
        e.stopPropagation()
        setIsHovered(false)
      }}
    >
      <mesh>
        <sphereGeometry args={[0.15, 16, 8]} />
        <meshBasicMaterial transparent opacity={0} visible={false} />
      </mesh>
      <group ref={innerGroupRef}>
        {/* The downward-pointing cone */}
        <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.05, 0]}>
          <coneGeometry args={[0.03, 0.1, 8]} />
          <meshStandardMaterial color={markerColor} emissive={markerColor} emissiveIntensity={2} toneMapped={false} metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.005, 16]} />
          <meshBasicMaterial {...materialProps} color={isSelected || isHovered ? '#ffdd00' : '#a770ef'} toneMapped={false} />
        </mesh>
        {/* The floating, pulsing ring */}
        {/* <PulsingRing isSelected={isSelected} isHovered={isHovered} materialProps={materialProps} /> */}

        {/* <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial
          color={isHovered ? '#ffdd00' : '#a770ef'} //
          emissive={isHovered ? '#ffdd00' : '#a770ef'}
          emissiveIntensity={isHovered ? 2 : 1}
          toneMapped={false}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <SelectionRing isHovered={isHovered} isSelected={isSelected} /> */}
      </group>
    </group>
  )
}

// A new component for the animated ring, for clarity
function PulsingRing({ isSelected, isHovered, materialProps }) {
  const ringRef = useRef()

  useFrame(({ clock }) => {
    const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.05
    const scale = isSelected ? 1.5 : isHovered ? 1.2 : 1
    ringRef.current.scale.set(scale + pulse, scale + pulse, scale + pulse)
  })

  return (
    <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[0.05, 0.005, 16]} />
      <meshBasicMaterial {...materialProps} color={isSelected || isHovered ? '#ffdd00' : '#a770ef'} toneMapped={false} />
    </mesh>
  )
}

export function Experience({ onMarkerClick, cameraFocusSection, onAnimationComplete, isAnimating, setCameraFocusSection, lightSourceRef }) {
  const controlsRef = useRef()
  const [isInteracting, setIsInteracting] = useState(false)
  const planetGroupRef = useRef()
  const lightRef = useRef()
  const [isAutoRotateEnabled, setAutoRotateEnabled] = useState(false)
  const { camera } = useThree() // <-- Get access to the camera

  const sunRef = useRef() // <-- Add a new ref for the physical sun mesh

  // This is a new state to control the flare's visibility
  const [isFlareVisible, setFlareVisible] = useState(true)
  const raycaster = new THREE.Raycaster() // Create the raycaster once

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime()
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.1) * 10
      lightRef.current.position.z = Math.cos(time * 0.1) * 10
    }
    // --- ADDED LOGIC ---
    // Make our tracker object follow the real light
    if (lightSourceRef.current && lightRef.current) {
      lightSourceRef.current.position.copy(lightRef.current.position)
    }

    // --- NEW OCCLUSION LOGIC ---
    if (sunRef.current && planetGroupRef.current) {
      const sunPosition = sunRef.current.position
      const cameraPosition = camera.position
      const direction = sunPosition.clone().sub(cameraPosition).normalize()

      raycaster.set(cameraPosition, direction)
      // Check for intersections with the planet group
      const intersects = raycaster.intersectObject(planetGroupRef.current, true)

      // The sun is visible if there are no intersections, OR if the first
      // intersection is further away than the sun itself.
      const sunDistance = cameraPosition.distanceTo(sunPosition)
      if (intersects.length > 0 && intersects[0].distance < sunDistance) {
        setFlareVisible(false) // Sun is hidden
      } else {
        setFlareVisible(true) // Sun is visible
      }
    }
  })

  // Conditionally move the flare's source based on visibility
  useEffect(() => {
    if (lightSourceRef.current && lightRef.current) {
      if (isFlareVisible) {
        lightSourceRef.current.position.copy(lightRef.current.position)
      } else {
        // Move the flare source far away so it's off-screen
        lightSourceRef.current.position.set(1000, 1000, 1000)
      }
    }
  }, [isFlareVisible, lightRef, lightSourceRef])

  return (
    <>
      <CameraRig
        isInteracting={isInteracting}
        onAnimationComplete={onAnimationComplete}
        cameraFocusSection={cameraFocusSection} // Pass down the new prop
      />
      {/* <Nebula /> */}
      <ambientLight intensity={0.1} />
      <pointLight ref={lightRef} position={[10, 2, 0]} intensity={120} decay={2} />

      <mesh ref={lightSourceRef}>
        <sphereGeometry args={[0.01]} />
      </mesh>

      <mesh ref={sunRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial
          color={'#FFDDAA'}
          toneMapped={false} // This makes it ignore scene lighting and GLOW
        />
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
            isAnimating={isAnimating} // Pass down the state
            isSelected={cameraFocusSection === loc.nname}
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
