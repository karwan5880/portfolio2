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

// --- THIS IS THE UPGRADED SHADER ---
const fragmentShader = `
  uniform vec3 uSunPosition;
  uniform vec3 uCameraPosition;
  uniform vec3 uAtmosphereColor;
  uniform vec3 uSunsetColor; // Our new color for the sunset effect
  uniform float uDensity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDirection = normalize(uCameraPosition - vPosition);
    vec3 sunDirection = normalize(uSunPosition - vPosition);
    float dotProduct = dot(viewDirection, vNormal);
    float fresnel = pow(1.0 - max(0.0, dotProduct), 3.0); // Increased power for a tighter glow
    float lightAngle = dot(vNormal, sunDirection);
    float lightIntensity = max(0.0, lightAngle);
    float rim = smoothstep(0.4, 1.0, lightAngle) * fresnel * uDensity;
    // --- SUNSET LOGIC ---
    // 1. Create a "sunset factor". It's strongest when lightAngle is near 0 (at the terminator).
    float sunsetFactor = smoothstep(0.0, 0.3, lightIntensity) * smoothstep(0.3, 0.0, lightIntensity);
    // 2. Mix the two colors. When sunsetFactor is 1, it's pure sunset color. When 0, it's atmosphere color.
    vec3 finalColor = mix(uAtmosphereColor, uSunsetColor, sunsetFactor);
    // -------------------
    gl_FragColor = vec4(finalColor, 1.0) * (lightIntensity * fresnel + rim);
  }
`
// const fragmentShader = `
//   uniform vec3 uSunPosition;
//   uniform vec3 uCameraPosition;
//   uniform vec3 uAtmosphereColor;
//   uniform float uDensity;
//   varying vec3 vNormal;
//   varying vec3 vPosition;
//   void main() {
//     vec3 viewDirection = normalize(uCameraPosition - vPosition);
//     vec3 sunDirection = normalize(uSunPosition - vPosition);
//     float dotProduct = dot(viewDirection, vNormal);
//     float fresnel = pow(1.0 - max(0.0, dotProduct), 2.0);
//     float lightAngle = dot(vNormal, sunDirection);
//     float lightIntensity = max(0.0, lightAngle) * fresnel;
//     // Rim light effect for the atmosphere
//     //vec3 rim = smoothstep(0.4, 1.0, lightAngle) * fresnel * uDensity;
//     float rim = smoothstep(0.4, 1.0, lightAngle) * fresnel * uDensity;
//     gl_FragColor = vec4(uAtmosphereColor, 1.0) * (lightIntensity + rim);
//   }
// `

export function Atmosphere({ sunPosition }) {
  const atmosphereRef = useRef()

  useFrame(({ camera }) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.material.uniforms.uCameraPosition.value.copy(camera.position)
      atmosphereRef.current.material.uniforms.uSunPosition.value.copy(sunPosition)
    }
  })

  return (
    <mesh ref={atmosphereRef} scale={2.05} raycast={() => null}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uSunPosition: { value: new THREE.Vector3() },
          uCameraPosition: { value: new THREE.Vector3() },
          uAtmosphereColor: { value: new THREE.Color('#4682b4') },
          uSunsetColor: { value: new THREE.Color('#ff6600') },
          uDensity: { value: 1.5 },
        }}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  )
}
