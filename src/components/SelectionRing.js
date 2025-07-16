'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const RING_COLOR = new THREE.Color('#a770ef')
const TARGET_POSITION = new THREE.Vector3(0, 0, 0) // The center of the planet

export function SelectionRing({ isHovered, isSelected }) {
  const ringRef = useRef()

  useFrame(() => {
    if (ringRef.current) {
      ringRef.current.lookAt(TARGET_POSITION)
    }
    // Animate the ring based on hover/selection state
    const targetScale = isSelected ? 1.5 : isHovered ? 1.2 : 0
    const targetOpacity = isSelected ? 0.3 : isHovered ? 0.2 : 0
    if (targetScale < 0.01 && ringRef.current.scale.x < 0.01) return

    // Animate using lerp for smoothness
    ringRef.current.scale.x = THREE.MathUtils.lerp(ringRef.current.scale.x, targetScale, 0.1)
    ringRef.current.scale.y = THREE.MathUtils.lerp(ringRef.current.scale.y, targetScale, 0.1)
    ringRef.current.material.opacity = THREE.MathUtils.lerp(ringRef.current.material.opacity, targetOpacity, 0.1)
  })

  return (
    <mesh ref={ringRef} scale={0}>
      <ringGeometry args={[0.08, 0.1, 32]} />
      <meshBasicMaterial color={RING_COLOR} transparent={true} opacity={0} toneMapped={false} />
    </mesh>
  )
}
