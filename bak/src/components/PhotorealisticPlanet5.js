'use client'

import { useFrame, useLoader } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

// Vertex Shader is fine, no changes needed
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

// --- THE FINAL, BLOWOUT-PROOF FRAGMENT SHADER ---
const fragmentShader = `
  uniform sampler2D uDayTexture;
  uniform sampler2D uNightTexture;
  uniform sampler2D uSpecularMap;
  uniform sampler2D uCloudTexture;
  uniform vec3 uSunDirection;
  uniform float uCloudOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    // === 1. LIGHTING CALCULATION ===
    // This is now the ONLY source of "sunlight" in the scene.
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunDirection);

    // Calculate the intensity of the sun's light on the surface (0.0 to 1.0)
    // smoothstep creates the soft terminator line between day and night.
    float lightIntensity = smoothstep(0.0, 0.1, dot(normal, sunDir));
    
    // === 2. TEXTURE SAMPLING ===
    vec3 dayColor = texture2D(uDayTexture, vUv).rgb;
    vec3 nightColor = texture2D(uNightTexture, vUv).rgb;
    vec4 cloudData = texture2D(uCloudTexture, vUv);
    float specularMask = texture2D(uSpecularMap, vUv).r;

    // === 3. LAYER COMPOSITION (The key to preventing blowouts) ===

    // --- LAYER 1: The Emissive Night Lights ---
    // We want the city lights to be visible, but fade out on the day side.
    float nightGlow = 1.0 - lightIntensity;
    vec3 emissiveLayer = nightColor * nightGlow;

    // --- LAYER 2: The Lit Daytime Surface ---
    // This is the color of the surface (land/sea) when lit by the sun.
    vec3 surfaceLayer = dayColor * lightIntensity;
    
    // --- LAYER 3: The Lit Clouds ---
    // We light the clouds and apply opacity. We also make them a bit brighter than the surface.
    vec3 cloudLayer = cloudData.rgb * (lightIntensity * 1.2); // Make clouds a bit brighter
    float cloudAlpha = cloudData.a * uCloudOpacity;
    
    // --- LAYER 4: The Specular Highlight (Sun glint on water) ---
    vec3 viewDir = normalize(vViewDirection);
    vec3 halfVector = normalize(sunDir + viewDir);
    float specAngle = max(dot(normal, halfVector), 0.0);
    // We use a high power to make the glint small and sharp.
    float specular = pow(specAngle, 64.0) * specularMask * 3.0 * lightIntensity;

    // === 4. FINAL ASSEMBLY ===
    // We start with the lit surface and add the glowing cities.
    // Because one is bright when the other is dark, they won't blow each other out.
    vec3 finalColor = surfaceLayer + emissiveLayer;
    
    // Now, we blend the clouds on top of the surface+cities layer.
    // mix is safe; it interpolates, it doesn't add brightness.
    finalColor = mix(finalColor, cloudLayer, cloudAlpha);

    // Finally, we add the specular highlight on top.
    finalColor += specular;

    // --- Atmosphere (Optional but recommended) ---
    float fresnel = dot(viewDir, normal);
    float atmosphereIntensity = smoothstep(0.4, -0.1, fresnel);
    finalColor += vec3(0.3, 0.6, 1.0) * atmosphereIntensity * 0.8;

    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function PhotorealisticPlanet() {
  const [dayTexture, cloudTexture, nightTexture, specularMap] = useLoader(THREE.TextureLoader, [
    '/textures/earthmap.jpg',
    '/textures/earth_clouds_8k.png', // The shader is now robust enough to handle this texture
    '/textures/earth_night.jpg',
    '/textures/earth_specular.jpg',
  ])

  const uniforms = useMemo(
    () => ({
      uDayTexture: { value: dayTexture },
      uNightTexture: { value: nightTexture },
      uCloudTexture: { value: cloudTexture },
      uSpecularMap: { value: specularMap },
      // This vector now acts as our "virtual sun" direction
      uSunDirection: { value: new THREE.Vector3(1.0, 0.0, 1.0).normalize() },
      uCloudOpacity: { value: 0.8 },
    }),
    [dayTexture, nightTexture, cloudTexture, specularMap]
  )

  // This cloud fade logic is still excellent. Keep it.
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
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  )
}
