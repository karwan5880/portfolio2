'use client'

import { OrbitControls, Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import * as THREE from 'three'

import { AsteroidBelt } from './AsteroidBelt'
import { Atmosphere } from './Atmosphere'
import { PhotorealisticPlanet } from './PhotorealisticPlanet'
import { Pin } from './Pin'
import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

const TILT_ANGLE = -23.5 * (Math.PI / 180)
const ROTATION_AXIS = new THREE.Vector3(Math.sin(TILT_ANGLE), Math.cos(TILT_ANGLE), 0).normalize()

const Experience = React.forwardRef(function Experience(
  {
    lightTracker,
    sunRef, //
  },
  ref
) {
  const initialRotationSpeed = 0.25
  const initialStarsSpeed = 0.004
  const solidPlanetRef = useRef()
  const controlsRef = useRef()
  const directionalLightRef = useRef()
  const planetGroupRef = useRef()
  const starsRef = useRef()
  const inactivityTimerRef = useRef()
  const resetDelayTimerRef = useRef()
  const sunPosition = new THREE.Vector3()
  const deltaRotation = new THREE.Quaternion()
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isInitialDelayOver, setIsInitialDelayOver] = useState(false)
  const [planetRotationSpeed, setPlanetRotationSpeed] = useState(0)
  const [starsRotationSpeed, setStarsRotationSpeed] = useState(0)

  useEffect(() => {
    resetDelayTimerRef.current = setTimeout(() => {
      setIsInitialDelayOver(true)
      setPlanetRotationSpeed(initialRotationSpeed)
      setStarsRotationSpeed(initialStarsSpeed)
    }, 15000)
    return () => clearTimeout(resetDelayTimerRef.current)
  }, [])

  useEffect(() => {
    if (isInitialDelayOver) {
      const accelerationInterval = setInterval(() => {
        setPlanetRotationSpeed((prev) => Math.min(prev + 0.005, 0.8))
        setStarsRotationSpeed((prev) => prev + 0.001)
      }, 1000)
      return () => clearInterval(accelerationInterval)
    }
  }, [isInitialDelayOver, planetRotationSpeed])

  useImperativeHandle(ref, () => ({
    reset: () => {
      console.log('Reset command received inside Experience!')
      if (controlsRef.current) {
        controlsRef.current.reset(true)
      }
      if (planetGroupRef.current) {
        planetGroupRef.current.quaternion.set(0, 0, 0, 1)
      }
      setIsInitialDelayOver(false)
      setPlanetRotationSpeed(0)
      setStarsRotationSpeed(0)
      setHasInteracted(false)
      clearTimeout(inactivityTimerRef.current)
      clearTimeout(resetDelayTimerRef.current)
      resetDelayTimerRef.current = setTimeout(() => {
        console.log('Reset delay finished. Starting animations.')
        setIsInitialDelayOver(true)
        setPlanetRotationSpeed(0.25)
        setStarsRotationSpeed(0.002)
      }, 3000)
    },
  }))

  useFrame((state, delta) => {
    if (controlsRef.current) controlsRef.current.update()
    const time = state.clock.getElapsedTime()
    // const sunInitialAngle = Math.PI
    // const sunInitialAngle = 0
    // const sunInitialAngle = Math.PI / -2
    const sunInitialAngle = Math.PI / 2
    const angle = time * 0.2 + sunInitialAngle
    const orbitRadius = 60
    sunPosition.set(Math.sin(angle) * orbitRadius, 0, Math.cos(angle) * orbitRadius)
    if (sunRef) sunRef.position.copy(sunPosition)
    if (lightTracker) lightTracker.position.copy(sunPosition)
    if (directionalLightRef.current) {
      directionalLightRef.current.position.copy(sunPosition)
      directionalLightRef.current.target.position.set(0, 0, 0)
    }
    if (starsRef.current) {
      if (isInitialDelayOver) {
        starsRef.current.rotation.y += starsRotationSpeed * delta
        starsRef.current.rotation.x += (starsRotationSpeed / 2) * delta
      }
    }
    if (planetGroupRef.current) {
      if (isInitialDelayOver && !hasInteracted) {
        const rotationAmount = planetRotationSpeed * delta
        deltaRotation.setFromAxisAngle(ROTATION_AXIS, rotationAmount)
        planetGroupRef.current.quaternion.premultiply(deltaRotation)
      }
    }
  })

  return (
    <>
      <ambientLight intensity={0.05} />
      <directionalLight ref={directionalLightRef} intensity={1.0} />
      <Stars ref={starsRef} radius={500} depth={80} count={15000} factor={10} saturation={0} fade speed={1.5} />
      <AsteroidBelt />
      <group
        ref={planetGroupRef} //
        // rotation={[0.01, 0, 0]}
        rotation={[-0.02, 0, 0]}
      >
        <PhotorealisticPlanet ref={solidPlanetRef} />
        {locations.map((loc) => (
          <Pin
            key={loc.name} //
            status={loc.status}
            occluderRef={solidPlanetRef}
            position={latLonToVector3(loc.coords[0], loc.coords[1], 2.02)}
            tooltip={`${loc.name} - ${loc.subtitle}`}
          />
        ))}
      </group>
      {/* Test: Move atmosphere outside the rotating group */}
      <Atmosphere sunPosition={sunPosition} />
      <OrbitControls
        ref={controlsRef}
        onStart={() => {
          setHasInteracted(true)
          clearTimeout(inactivityTimerRef.current)
        }}
        onEnd={() => {
          inactivityTimerRef.current = setTimeout(() => {
            setHasInteracted(false)
          }, 2000)
        }}
        enableDamping={true} //
        dampingFactor={0.05} //
        autoRotate={false}
        // autoRotate={!hasInteracted && isInitialDelayOver}
        autoRotateSpeed={0.1} //
        enablePan={false}
        minDistance={2.5}
        maxDistance={19} //
      />
    </>
  )
})

export { Experience }
