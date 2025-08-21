'use client'

import { OrbitControls, Sphere, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import { AsteroidBelt } from './AsteroidBelt'
import { CameraRig } from './CameraRig'
import { PhotorealisticPlanet } from './PhotorealisticPlanet'
import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

function Marker({ position, name, onClick }) {
  const [isHovered, setIsHovered] = useState(false)
  const markerRef = useRef()

  useEffect(() => {
    document.body.style.cursor = isHovered ? 'pointer' : 'auto'
  }, [isHovered])

  useFrame(() => {
    gsap.to(markerRef.current.scale, {
      duration: 0.3,
      x: isHovered ? 1.5 : 1,
      y: isHovered ? 1.5 : 1,
      z: isHovered ? 1.5 : 1,
      ease: 'power2.out',
    })
  })

  return (
    <Sphere
      ref={markerRef}
      position={position}
      args={[0.08, 16, 16]}
      onClick={(e) => {
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
      <meshBasicMaterial color="#a770ef" toneMapped={false} />
    </Sphere>
  )
}

export function Experience({ onMarkerClick, selectedSection }) {
  const controlsRef = useRef()
  const [isInteracting, setIsInteracting] = useState(false)

  return (
    <>
      <CameraRig selectedSection={selectedSection} isInteracting={isInteracting} />

      {/* A very subtle ambient light so the dark side isn't pitch black */}
      <ambientLight intensity={0.1} />

      {/* 
        THE KEY CHANGE: The DirectionalLight is GONE.
        All lighting will now be faked inside the planet's shader.
      */}
      {/* <directionalLight position={[5, 5, 5]} intensity={2.5} /> */}

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <AsteroidBelt />
      <group>
        <PhotorealisticPlanet />
        {locations.map((loc) => (
          <Marker key={loc.name} name={loc.name} position={latLonToVector3(loc.coords[0], loc.coords[1], 2.1)} onClick={onMarkerClick} />
        ))}
      </group>

      <OrbitControls ref={controlsRef} onStart={() => setIsInteracting(true)} onEnd={() => setIsInteracting(false)} enablePan={false} autoRotate={false} minDistance={2.5} maxDistance={10} />
    </>
  )
}
