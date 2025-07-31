import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { volumetricFogFS, volumetricFogVS } from './atmosphericShader.js'

export function AtmosphericEffects() {
  const { camera } = useThree()
  const fogMeshRef = useRef()

  // Create a large sphere around the scene for volumetric fog
  const fogMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCameraPosition: { value: new THREE.Vector3() },
        uPositionTexture: { value: null }, // Will be set by parent
        uTextureSize: { value: 64 },
        uDroneCount: { value: 4096 },
      },
      vertexShader: volumetricFogVS,
      fragmentShader: volumetricFogFS,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide, // Render from inside
      depthWrite: false,
    })
  }, [])

  useFrame((state) => {
    if (fogMeshRef.current) {
      fogMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
      fogMaterial.uniforms.uCameraPosition.value.copy(camera.position)
    }
  })

  return (
    <mesh ref={fogMeshRef} material={fogMaterial}>
      <sphereGeometry args={[1500, 32, 32]} />
    </mesh>
  )
}
