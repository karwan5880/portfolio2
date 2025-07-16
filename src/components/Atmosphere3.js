'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

// GLSL code for the shaders
const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec3 vNormal;
  void main() {
    // The Fresnel effect calculation
    float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
  }
`

export function Atmosphere() {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {},
      blending: THREE.AdditiveBlending, // Makes the glow additive
      side: THREE.BackSide, // Render on the inside of the sphere
    })
  }, [])

  return (
    <mesh scale={[1.05, 1.05, 1.05]}>
      <sphereGeometry args={[2, 64, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  )
}
