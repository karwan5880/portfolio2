'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 uSunPosition;
  uniform vec3 uCameraPosition;
  uniform vec3 uAtmosphereColor;
  uniform float uDensity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 viewDirection = normalize(uCameraPosition - vPosition);
    vec3 sunDirection = normalize(uSunPosition - vPosition);
    
    float dotProduct = dot(viewDirection, vNormal);
    float fresnel = pow(1.0 - max(0.0, dotProduct), 2.0);
    
    float lightAngle = dot(vNormal, sunDirection);
    float lightIntensity = max(0.0, lightAngle) * fresnel;
    
    // Rim light effect for the atmosphere
    //vec3 rim = smoothstep(0.4, 1.0, lightAngle) * fresnel * uDensity;
    float rim = smoothstep(0.4, 1.0, lightAngle) * fresnel * uDensity;

    gl_FragColor = vec4(uAtmosphereColor, 1.0) * (lightIntensity + rim);
  }
`

export function Atmosphere({ sunPosition }) {
  const atmosphereRef = useRef()
  // const { camera } = useFrame(({ camera }) => camera)

  useFrame(({ camera }) => {
    if (atmosphereRef.current) {
      // Update the shader's `uCameraPosition` uniform with the camera's world position.
      atmosphereRef.current.material.uniforms.uCameraPosition.value.copy(camera.position)

      // We also still need to update the sun position uniform.
      atmosphereRef.current.material.uniforms.uSunPosition.value.copy(sunPosition)
    }
  })

  // useFrame(() => {
  //   if (atmosphereRef.current) {
  //     atmosphereRef.current.material.uniforms.uSunPosition.value.copy(sunPosition)
  //     atmosphereRef.current.material.uniforms.uCameraPosition.value.copy(camera.position)
  //   }
  // })

  return (
    <mesh ref={atmosphereRef} scale={2.05} raycast={() => null}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uSunPosition: { value: new THREE.Vector3() },
          uCameraPosition: { value: new THREE.Vector3() },
          uAtmosphereColor: { value: new THREE.Color('#4682b4') }, // Steel Blue
          uDensity: { value: 1.5 },
        }}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  )
}
