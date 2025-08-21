'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const enhancedVertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    vWorldPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const enhancedFragmentShader = `
  uniform vec3 uSunPosition;
  uniform vec3 uCameraPosition;
  uniform vec3 uAtmosphereColor;
  uniform vec3 uSunsetColor;
  uniform vec3 uTwilightColor;
  uniform float uDensity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 viewDirection = normalize(uCameraPosition - vPosition);
    vec3 sunDirection = normalize(uSunPosition - vPosition);
    
    // Fresnel effect - exactly like original
    float dotProduct = dot(viewDirection, vNormal);
    float fresnel = pow(1.0 - max(0.0, dotProduct), 3.0);
    
    // Light angle calculation - exactly like original
    float lightAngle = dot(vNormal, sunDirection);
    float lightIntensity = max(0.0, lightAngle);
    
    // Rim lighting - exactly like original
    float rim = smoothstep(0.4, 1.0, lightAngle) * fresnel * uDensity;
    
    // Enhanced color mixing with multiple phases
    // Sunset factor - strongest at terminator (lightAngle near 0)
    float sunsetFactor = smoothstep(0.0, 0.3, lightIntensity) * smoothstep(0.3, 0.0, lightIntensity);
    
    // Twilight factor - for very low light angles
    float twilightFactor = smoothstep(-0.1, 0.1, lightAngle) * (1.0 - smoothstep(0.1, 0.3, lightAngle));
    
    // Color mixing - start with base atmosphere, add sunset and twilight
    vec3 baseColor = uAtmosphereColor;
    vec3 withSunset = mix(baseColor, uSunsetColor, sunsetFactor);
    vec3 finalColor = mix(withSunset, uTwilightColor, twilightFactor * 0.3);
    
    // Final output - exactly like original formula
    gl_FragColor = vec4(finalColor, 1.0) * (lightIntensity * fresnel + rim);
  }
`

export function EnhancedAtmosphere({ sunPosition }) {
  const atmosphereRef = useRef()

  useFrame(({ camera }) => {
    if (atmosphereRef.current) {
      atmosphereRef.current.material.uniforms.uCameraPosition.value.copy(camera.position)
      atmosphereRef.current.material.uniforms.uSunPosition.value.copy(sunPosition)
    }
  })

  return (
    <mesh ref={atmosphereRef} scale={2.015} raycast={() => null}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={enhancedVertexShader}
        fragmentShader={enhancedFragmentShader}
        uniforms={{
          uSunPosition: { value: new THREE.Vector3() },
          uCameraPosition: { value: new THREE.Vector3() },
          uAtmosphereColor: { value: new THREE.Color('#4682b4') }, // Steel blue like original
          uSunsetColor: { value: new THREE.Color('#ff6600') }, // Orange like original
          uTwilightColor: { value: new THREE.Color('#8B4B9C') }, // Purple for twilight
          uDensity: { value: 1.0 },
        }}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}
