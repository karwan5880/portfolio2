'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

// --- Vertex Shader (No changes needed) ---
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(cameraPosition - modelPosition.xyz);
  }
`

// --- NEW, ROBUST FRAGMENT SHADER ---
const fragmentShader = `
  // Textures
  uniform sampler2D uDayTexture;
  uniform sampler2D uNightTexture;
  uniform sampler2D uSpecularMap;
  uniform sampler2D uCloudTexture;

  // Controls
  uniform float uCloudOpacity;
  uniform vec3 uSunDirection;

  // Varyings from Vertex Shader
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  // --- Main ---
  void main() {
    // 1. NORMALIZE VECTORS
    // We need these vectors to be of unit length for accurate dot products.
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunDirection);
    vec3 viewDir = normalize(vViewDirection);

    // 2. CALCULATE SUNLIGHT INTENSITY
    // This is the core of our lighting. A value of 1.0 is full daylight, 0.0 is full darkness.
    // We use max(..., 0.0) to prevent negative light.
    // The 'smoothstep' creates a soft, realistic transition zone (the terminator).
    float lightIntensity = smoothstep(-0.1, 0.1, dot(normal, sunDir));

    // 3. SAMPLE TEXTURES
    vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
    vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
    float specularMask = texture2D(uSpecularMap, vUv).r; // Only need one channel
    vec4 cloudData = texture2D(uCloudTexture, vUv);

    // 4. CALCULATE SURFACE COLOR (WITHOUT CLOUDS)
    // Here we blend the day and night textures based on the light intensity.
    // We boost the night color to make city lights pop.
    vec3 surfaceColor = mix(nightColor * 1.5, dayColor, lightIntensity);

    // 5. CALCULATE CLOUDS
    // We light the clouds using the same intensity, but make them slightly brighter.
    // The cloud's own alpha channel determines its density.
    vec3 cloudColor = cloudData.rgb * (lightIntensity + 0.1); // Add a little ambient light to clouds
    float cloudAlpha = cloudData.a * uCloudOpacity;

    // 6. CALCULATE SPECULAR (SUN GLINT ON WATER)
    // This creates the shiny reflection on oceans.
    vec3 halfVector = normalize(sunDir + viewDir);
    float specAngle = max(dot(normal, halfVector), 0.0);
    // The 'pow' function narrows the highlight, making it sharper.
    // We multiply by lightIntensity to ensure it only appears on the day side.
    float specular = pow(specAngle, 32.0) * specularMask * 2.0 * lightIntensity;

    // 7. CALCULATE ATMOSPHERIC GLOW (FRESNEL)
    // This creates the blue halo around the planet's edge.
    float fresnel = dot(viewDir, normal);
    // 'smoothstep' creates a clean, soft edge for the glow.
    float atmosphereIntensity = smoothstep(0.5, -0.1, fresnel);
    vec3 atmosphereColor = vec3(0.3, 0.6, 1.0) * atmosphereIntensity * 0.8;

    // 8. COMPOSE THE FINAL COLOR
    // Start with the base surface color.
    vec3 finalColor = surfaceColor;

    // Add the specular highlight on top.
    finalColor += specular;
    
    // Mix in the clouds based on their calculated color and alpha.
    finalColor = mix(finalColor, cloudColor, cloudAlpha);

    // Finally, add the atmospheric glow. This is an additive effect.
    finalColor += atmosphereColor;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function PhotorealisticPlanet() {
  // IMPORTANT: Make sure you have the correct, new cloud texture!
  const [dayTexture, cloudTexture, nightTexture, specularMap] = useLoader(THREE.TextureLoader, [
    '/textures/earthmap.jpg',
    '/textures/earth_clouds_8k.png', // <--- UPDATE THIS TO YOUR NEW CLOUD MAP
    '/textures/earth_night.jpg',
    '/textures/earth_specular.jpg',
  ])

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

  // This hook is still great. It fades clouds out when you zoom in.
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
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        // This helps prevent "z-fighting" if you have multiple layers close together
        depthWrite={true}
      />
    </mesh>
  )
}
