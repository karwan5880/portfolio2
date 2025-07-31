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
  uniform vec3 uSunsetColor;
  uniform float uDensity;
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vec3 viewDirection = normalize(uCameraPosition - vPosition);
    
    // SIMPLE TEST: Just show basic fresnel with animated color
    float dotProduct = dot(viewDirection, vNormal);
    float fresnel = pow(1.0 - max(0.0, dotProduct), 3.0);
    
    // Animate color based on time to verify it's working
    float timeColor = sin(uTime * 0.5) * 0.5 + 0.5;
    vec3 testColor = vec3(timeColor, 0.3, 1.0 - timeColor);
    
    // Simple rim lighting
    float rim = fresnel * 0.8;
    
    gl_FragColor = vec4(testColor, 1.0) * rim;
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
  const timeRef = useRef({ value: 0 })
  const sunPositionRef = useRef({ value: new THREE.Vector3() })

  useFrame(({ camera, clock }) => {
    sunPositionRef.current.value.copy(sunPosition)
    timeRef.current.value = clock.getElapsedTime()
    if (atmosphereRef.current) {
      atmosphereRef.current.material.uniforms.uCameraPosition.value.copy(camera.position)
    }
  })

  return (
    <mesh ref={atmosphereRef} scale={2.015} raycast={() => null}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        vertexShader={`
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uSunPosition;
          uniform vec3 uCameraPosition;
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vec3 viewDirection = normalize(uCameraPosition - vPosition);
            vec3 sunDirection = normalize(uSunPosition);
            
            // Fresnel effect for rim lighting
            float dotProduct = dot(viewDirection, vNormal);
            float fresnel = pow(1.0 - max(0.0, dotProduct), 3.0);
            
            // Light angle - how much this surface faces the sun
            float lightAngle = dot(vNormal, sunDirection);
            float lightIntensity = max(0.0, lightAngle);
            
            // Enhanced color phases
            vec3 atmosphereBlue = vec3(0.3, 0.5, 0.8);     // Brighter blue
            vec3 sunsetOrange = vec3(1.0, 0.5, 0.1);       // Warmer orange
            vec3 twilightPurple = vec3(0.5, 0.3, 0.9);     // More vibrant purple
            
            // Enhanced sunset factor - wider sunset zone
            float sunsetFactor = smoothstep(0.0, 0.4, lightIntensity) * smoothstep(0.4, 0.0, lightIntensity);
            
            // Enhanced twilight factor - smoother transition
            float twilightFactor = smoothstep(-0.15, 0.15, lightAngle) * (1.0 - smoothstep(0.15, 0.4, lightAngle));
            
            // Mix colors
            vec3 finalColor = atmosphereBlue;
            finalColor = mix(finalColor, sunsetOrange, sunsetFactor);
            finalColor = mix(finalColor, twilightPurple, twilightFactor * 0.3);
            
            // Rim lighting with subtle animation
            float rim = smoothstep(0.4, 1.0, lightIntensity) * fresnel * 1.2;
            
            // Very subtle atmospheric shimmer
            float shimmer = sin(uTime * 0.3 + vPosition.x * 2.0 + vPosition.z * 1.5) * 0.02 + 1.0;
            
            gl_FragColor = vec4(finalColor, 1.0) * (lightIntensity * fresnel + rim) * 0.8 * shimmer;
          }
        `}
        uniforms={{
          uSunPosition: sunPositionRef.current,
          uCameraPosition: { value: new THREE.Vector3() },
          uTime: timeRef.current,
        }}
        transparent
        side={THREE.BackSide}
      />
    </mesh>
  )
}
