'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

// --- Vertex Shader ---
// Calculates where things are and passes view direction to the fragment shader.
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Calculate normals and view direction in world space
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(cameraPosition - modelPosition.xyz);
  }
`

// --- FINAL, CORRECTED FRAGMENT SHADER ---
const fragmentShader = `
  uniform sampler2D uDayTexture;
  uniform sampler2D uNightTexture;
  uniform sampler2D uSpecularMap;
  uniform sampler2D uCloudTexture;
  uniform float uCloudOpacity;
  uniform vec3 uSunDirection;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  const vec3 ATMOSPHERE_COLOR = vec3(0.3, 0.6, 1.0);
  const float SPECULAR_SHININESS = 32.0; // Higher number = smaller, sharper highlight

  void main() {
    // 1. Get Base Vectors and Textures
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDirection);
    vec3 sunDir = normalize(uSunDirection);
    
    vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
    vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
    float specularMask = texture2D(uSpecularMap, vUv).r;
    vec4 cloudData = texture2D(uCloudTexture, vUv);

    // 2. Calculate Light Dot Products
    float sunDotNormal = dot(normal, sunDir);
    float lightIntensity = max(sunDotNormal, 0.0);
    
    // 3. Ambient Light (base illumination, stronger on the dark side)
    float ambientIntensity = 0.1;
    vec3 ambient = ambientIntensity * dayColor;

    // 4. Diffuse Light (the main, soft light on the surface)
    vec3 diffuse = dayColor * lightIntensity;
    
    // 5. Specular Light (the sharp, shiny reflection)
    vec3 halfVector = normalize(sunDir + viewDir);
    float specAngle = max(dot(normal, halfVector), 0.0);
    float specularIntensity = pow(specAngle, SPECULAR_SHININESS) * specularMask;
    vec3 specular = vec3(1.0) * specularIntensity;

    // 6. Combine Lights and Textures
    // This is the correct way: Start with ambient, add diffuse, and add specular.
    // We also mix in the night lights on the dark side.
    vec3 litSurface = ambient + diffuse + specular;
    vec3 surfaceColor = mix(litSurface, nightColor, 1.0 - smoothstep(-0.1, 0.1, sunDotNormal));

    // 7. Atmospheric Scattering / Haze
    float atmosphereDensity = 1.0 - dot(viewDir, normal);
    float atmosphereEffect = pow(atmosphereDensity, 4.0);
    
    // Mix the final surface color with the atmosphere color based on the haze effect
    // Only apply haze where the sun is shining.
    vec3 finalColor = mix(surfaceColor, ATMOSPHERE_COLOR, atmosphereEffect * lightIntensity * 0.5);
    
    // 8. Add Clouds on top
    finalColor = mix(finalColor, cloudData.rgb, cloudData.a * uCloudOpacity);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function PhotorealisticPlanet() {
  // Load Textures
  const [dayTexture, cloudTexture, nightTexture, specularMap] = useLoader(THREE.TextureLoader, [
    '/textures/earthmap.jpg', //
    '/textures/earth_clouds.png', //
    '/textures/earth_night.jpg', //
    '/textures/earth_specular.jpg', // <-- Load the new map
  ])

  // Define Shader Uniforms
  const uniforms = useMemo(
    () => ({
      uDayTexture: { value: dayTexture },
      uNightTexture: { value: nightTexture },
      uCloudTexture: { value: cloudTexture },
      uSpecularMap: { value: specularMap }, // <-- Add new uniform
      // This needs to match the position of your directionalLight in Experience.js
      uSunDirection: { value: new THREE.Vector3(5, 5, 5).normalize() },
      uCloudOpacity: { value: 0.8 },
    }),
    [dayTexture, nightTexture, cloudTexture, specularMap]
  )

  // --- THE FIX: Add a useFrame hook to this component ---
  useFrame(({ camera }) => {
    // Get the camera's distance from the center of the scene
    const distance = camera.position.length()

    // Define zoom range for fading clouds
    const minZoom = 2.5 // Corresponds to OrbitControls minDistance
    const maxZoom = 4.5 // The distance at which clouds are fully visible

    // Calculate opacity based on distance (inverse linear interpolation)
    // `smoothstep` creates a nice ease-in/ease-out effect
    const opacity = THREE.MathUtils.smoothstep(distance, maxZoom, minZoom)

    // Update the shader uniform
    uniforms.uCloudOpacity.value = opacity * 0.8 // Multiply by max desired opacity
  })

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader} //
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
