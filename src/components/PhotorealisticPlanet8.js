'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Clouds() {
  const cloudsRef = useRef()
  const [cloudMap] = useLoader(THREE.TextureLoader, ['/textures/8k_earth_clouds.jpg'])

  useFrame(({ clock }) => {
    cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.02
  })

  return (
    <mesh ref={cloudsRef} scale={2.04}>
      {' '}
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial
        map={cloudMap}
        transparent={true}
        opacity={0.4} //
        blending={THREE.AdditiveBlending} //
        depthWrite={false}
      />
    </mesh>
  )
}

export function PhotorealisticPlanet() {
  const planetRef = useRef()
  const [colorMap, normalMap, glossMap, nightMap] = useLoader(THREE.TextureLoader, [
    '/textures/8k_earth_daymap.jpg',
    '/textures/8k_earth_normal_map.jpg',
    '/textures/8k_earth_specular_map.jpg',
    '/textures/8k_earth_nightmap.jpg', //
  ])

  useFrame(({ clock }) => {
    // Very slow rotation for the planet
    planetRef.current.rotation.y = clock.getElapsedTime() * 0.005
  })

  return (
    <group>
      <mesh ref={planetRef} scale={2}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          metalness={0.0}
          roughnessMap={glossMap} //
          roughness={1.0}
          emissiveMap={nightMap}
          emissive={'#ffff88'} //
          emissiveIntensity={1.5} //
        />
      </mesh>
      <Clouds />
    </group>
  )
}
