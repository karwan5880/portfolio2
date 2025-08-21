'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const reusableVector3 = new THREE.Vector3()

export function Marker({ position, name, onClick, isAnimating, isSelected }) {
  const [isHovered, setIsHovered] = useState(false)
  const groupRef = useRef()
  const { camera } = useThree()
  const [isOccluded, setOccluded] = useState(false)
  const markerWorldPosition = new THREE.Vector3(...position)
  const innerGroupRef = useRef()
  const ringRef = useRef()

  useEffect(() => {
    if (isSelected) {
      gsap.fromTo(
        groupRef.current.scale,
        { x: 1, y: 1, z: 1 },
        {
          duration: 0.5,
          x: 1.5,
          y: 1.5,
          z: 1.5,
          ease: 'power2.out',
          yoyo: true,
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
      const cameraToPlanet = reusableVector3.copy(cameraPosition).negate()
      const cameraToMarker = reusableVector3.copy(markerWorldPosition).sub(cameraPosition)
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
    }

    const pulse = Math.sin(clock.getElapsedTime() * 3) * 0.1
    const scale = isSelected ? 1.2 : isHovered ? 1.2 : 1
    innerGroupRef.current.scale.set(scale + pulse, scale + pulse, scale + pulse)
  })

  const materialProps = {
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
        <mesh rotation={[Math.PI, 0, 0]} position={[0, 0.05, 0]}>
          <coneGeometry args={[0.03, 0.1, 8]} />
          <meshStandardMaterial
            {...materialProps}
            color={markerColor} //
            emissive={markerColor}
            emissiveIntensity={2}
            toneMapped={false}
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        <mesh ref={ringRef} position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.05, 0.005, 16]} />
          <meshBasicMaterial {...materialProps} color={isSelected || isHovered ? '#ffdd00' : '#a770ef'} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
