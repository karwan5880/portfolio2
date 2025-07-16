'use client'

import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

export function Globe({ children, ...props }) {
  const globeRef = useRef()
  // Load the texture. This part is correct.
  const mapTexture = useTexture('/textures/world-dots.png')

  // The gentle autorotation. This part is also correct.
  useFrame((state, delta) => {
    if (globeRef.current) {
      globeRef.current.rotation.y += delta * 0.03
    }
  })

  return (
    <group ref={globeRef} {...props}>
      <mesh>
        <sphereGeometry args={[5, 64, 64]} />
        {/* We use meshBasicMaterial for a simple, glowing, unlit look */}
        <meshBasicMaterial
          // The color of the landmasses. This will be our glowing green.
          color="#00ff9d"
          // Use the texture to control transparency.
          alphaMap={mapTexture}
          // This MUST be true for alphaMap to work.
          transparent={true}
        />
      </mesh>

      {/* We keep the children to render the markers */}
      {children}
    </group>
  )
}
