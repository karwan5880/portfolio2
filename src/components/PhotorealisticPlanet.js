'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'

function Clouds() {
  const cloudsRef = useRef()
  const [cloudMap] = useLoader(THREE.TextureLoader, ['/textures/8k_earth_clouds.jpg'])

  useFrame(({ clock }) => {
    cloudsRef.current.rotation.y = clock.getElapsedTime() * 0.02
  })

  return (
    <mesh ref={cloudsRef} scale={2.04} raycast={() => null}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial map={cloudMap} transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  )
}

// export function PhotorealisticPlanet() {
export const PhotorealisticPlanet = React.forwardRef(function PhotorealisticPlanet(props, ref) {
  const planetRef = useRef()

  const [colorMap, normalMap, glossMap, nightMap] = useLoader(THREE.TextureLoader, [
    '/textures/8k_earth_daymap.jpg', //
    '/textures/8k_earth_normal_map.jpg',
    '/textures/8k_earth_specular_map.jpg',
    '/textures/8k_earth_nightmap.jpg', //
  ])

  // useFrame(({ clock }) => {
  //   planetRef.current.rotation.y = clock.getElapsedTime() * 0.01
  // })

  return (
    <group>
      {/* <mesh ref={planetRef} scale={2} raycast={() => null}> */}
      <mesh ref={ref} scale={2}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          // The glossMap makes water reflective (white areas) and land rough (black areas)
          roughnessMap={glossMap}
          // Lower metalness, higher roughness for a more realistic Earth
          metalness={0.001}
          // metalness={0.2}
          // metalness={0.1}
          roughness={0.9}
          // roughness={0.8}
          // roughness={0.3}
          // Night lights should glow
          emissiveMap={nightMap}
          emissive={'#ffff88'}
          emissiveIntensity={1.5}
        />
      </mesh>
      <Clouds />
    </group>
  )
})
