'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

const vertexShader = `
`

const fragmentShader = `
`

export function PhotorealisticPlanet() {
  const [dayTexture, cloudTexture, nightTexture, specularMap] = useLoader(THREE.TextureLoader, ['/textures/earthmap.jpg', '/textures/earth_clouds_8k.png', '/textures/earth_night.jpg', '/textures/earth_specular.jpg'])

  // Define Shader Uniforms
  const uniforms = useMemo(
    () => ({
      uDayTexture: { value: dayTexture },
      uNightTexture: { value: nightTexture },
      uCloudTexture: { value: cloudTexture },
      uSpecularMap: { value: specularMap },
      uSunDirection: { value: new THREE.Vector3(5, 5, 5).normalize() },
      uCloudOpacity: { value: 0.8 },
    }),
    [dayTexture, nightTexture, cloudTexture, specularMap]
  )

  useFrame(({ camera }) => {
    const distance = camera.position.length()
    const minZoom = 2.5
    const maxZoom = 4.5
    const opacity = THREE.MathUtils.smoothstep(distance, maxZoom, minZoom)
    uniforms.uCloudOpacity.value = opacity * 0.8
  })

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} depthWrite={true} />
    </mesh>
  )
}
