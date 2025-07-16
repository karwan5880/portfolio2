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

// --- Fragment Shader ---
// This is where the magic happens: lighting, texturing, and atmosphere.
const fragmentShader = `
  uniform sampler2D uDayTexture;
  uniform sampler2D uNightTexture;
  uniform sampler2D uCloudTexture;
  uniform sampler2D uSpecularMap;
  uniform float uCloudOpacity;
  uniform vec3 uSunDirection;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  // Configuration
  const vec3 ATMOSPHERE_COLOR = vec3(0.3, 0.6, 1.0); // Sky blue

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewDirection);
    vec3 sunDir = normalize(uSunDirection);

    // 1. Calculate Lighting (Lambertian Diffuse)
    //float lightIntensity = max(dot(normal, sunDir), 0.0);

    // 1. Sample Textures
    vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
    vec3 nightColor = texture2D(uNightTexture, vUv).rgb * 1.5; // Boost night lights
    vec4 cloudData = texture2D(uCloudTexture, vUv);
    float specularMask = texture2D(uSpecularMap, vUv).r; // 'r' channel of our B&W map

    // 2. Calculate Diffuse Lighting (how much a point is generally lit)
    float diffuseIntensity = max(dot(normal, sunDir), 0.0);
    vec3 diffuse = dayColor * diffuseIntensity;

    // 3. Calculate Specular Lighting (the tight, bright reflection)
    vec3 halfVector = normalize(sunDir + viewDir);
    float specAngle = max(dot(normal, halfVector), 0.0);
    // 'pow(..., 16.0)' makes the highlight small and sharp
    float specularIntensity = pow(specAngle, 16.0) * specularMask * 2.0; 
    vec3 specular = vec3(1.0) * specularIntensity; // White highlight

    // 4. Combine lighting and textures
    vec3 surfaceColor = diffuse + nightColor * (1.0 - diffuseIntensity) + specular;

    // 5. Calculate Atmospheric Scattering (same as before)
    float atmosphereDensity = 1.0 - dot(viewDir, normal);
    float haloIntensity = pow(atmosphereDensity, 3.0);
    float atmosphereLight = smoothstep(0.0, 0.5, diffuseIntensity) * 0.8;

    // 6. Apply Surface Haze and Halo
    surfaceColor = mix(surfaceColor, ATMOSPHERE_COLOR, atmosphereDensity * atmosphereLight * 0.4);
    surfaceColor += ATMOSPHERE_COLOR * haloIntensity * atmosphereLight;
    
    // 7. Mix in Clouds
    vec3 finalColor = mix(surfaceColor, cloudData.rgb, cloudData.a * uCloudOpacity);
    
    gl_FragColor = vec4(finalColor, 1.0);


    // 3. Blend Day and Night
    // Day color is multiplied by light intensity, night color is shown where it's dark
    //vec3 surfaceColor = dayColor * lightIntensity + nightColor * (1.0 - lightIntensity);

    // 4. Calculate Atmospheric Scattering (Fresnel Effect)
    // How much atmosphere are we looking through? (More at edges, less in center)
    //float atmosphereDensity = 1.0 - dot(viewDir, normal);
    
    // Sharpen the effect for the outer halo
    //float haloIntensity = pow(atmosphereDensity, 4.0);

    // Calculate how much the atmosphere is lit by the sun
    //float atmosphereLight = smoothstep(0.0, 0.5, lightIntensity) * 0.8;

    // 5. Apply Surface Haze (Subtle scattering on the surface)
    // This adds the blueish tint across the day side
    //surfaceColor = mix(surfaceColor, ATMOSPHERE_COLOR, atmosphereDensity * atmosphereLight * 0.5);

    // 6. Mix in Clouds (Clouds should be on top of the haze)
    //vec3 finalColor = mix(surfaceColor, cloudData.rgb, cloudData.a * 0.8);
    //vec3 finalColor = mix(surfaceColor, cloudData.rgb, cloudData.a * uCloudOpacity);

    // 7. Add the Outer Halo Glow
    //finalColor += ATMOSPHERE_COLOR * haloIntensity * atmosphereLight;

    //gl_FragColor = vec4(finalColor, 1.0);
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

// too bright at the back side of the earth.
