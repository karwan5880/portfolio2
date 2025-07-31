'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'

function Clouds() {
  const cloudsRef = useRef()
  const [cloudMap] = useLoader(THREE.TextureLoader, ['/textures/8k_earth_clouds.jpg'])

  useFrame(({ clock }) => {
    // Slower, more realistic cloud movement
    cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.008
  })

  return (
    <mesh ref={cloudsRef} scale={2.04} raycast={() => null}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={cloudMap} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

export const PhotorealisticPlanet = React.forwardRef(function PhotorealisticPlanet(props, ref) {
  const planetRef = useRef()

  const [colorMap, normalMap, glossMap, nightMap] = useLoader(THREE.TextureLoader, ['/textures/8k_earth_daymap.jpg', '/textures/8k_earth_normal_map.jpg', '/textures/8k_earth_specular_map.jpg', '/textures/8k_earth_nightmap.jpg'])

  return (
    <group>
      <mesh ref={ref} scale={2}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          // Reduce specular map influence for less water reflection
          roughnessMap={glossMap}
          roughnessMapIntensity={0.3}
          // Lower metalness, higher roughness for a more realistic Earth
          metalness={0.0}
          roughness={0.95}
          // Night lights should glow
          emissiveMap={nightMap}
          emissive={'#ffff88'}
          emissiveIntensity={2.0}
        />
      </mesh>
      <Clouds />
    </group>
  )
})
