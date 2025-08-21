'use client'

import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'

export function Nebula() {
  const texture = useLoader(THREE.TextureLoader, '/textures/nebula.jpg')
  return (
    <mesh position={[0, 0, -20]}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} transparent opacity={0.3} />
    </mesh>
  )
}
