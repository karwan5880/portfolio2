import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Screen-space lens flare effects for bright lights
export function LensFlareSystem({ positionTexture, textureSize, droneCount }) {
  const { camera, size } = useThree()
  const flareRef = useRef()

  const [flareGeometry, flareMaterial] = useMemo(() => {
    const geometry = new THREE.BufferGeometry()

    // Create multiple flare elements per drone
    const flaresPerDrone = 3 // Core, inner ring, outer ring
    const totalFlares = droneCount * flaresPerDrone

    const positions = new Float32Array(totalFlares * 3)
    const ids = new Float32Array(totalFlares)
    const flareTypes = new Float32Array(totalFlares)

    for (let i = 0; i < droneCount; i++) {
      for (let f = 0; f < flaresPerDrone; f++) {
        const index = i * flaresPerDrone + f
        positions[index * 3] = 0
        positions[index * 3 + 1] = 0
        positions[index * 3 + 2] = 0
        ids[index] = i
        flareTypes[index] = f // 0=core, 1=inner, 2=outer
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))
    geometry.setAttribute('a_flareType', new THREE.BufferAttribute(flareTypes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPositionTexture: { value: positionTexture },
        uTime: { value: 0 },
        uTextureSize: { value: textureSize },
        uCameraPosition: { value: new THREE.Vector3() },
        uScreenSize: { value: new THREE.Vector2(size.width, size.height) },
      },
      vertexShader: `
        uniform sampler2D uPositionTexture;
        uniform float uTime;
        uniform float uTextureSize;
        uniform vec3 uCameraPosition;
        attribute float a_id;
        attribute float a_flareType;
        varying vec3 vColor;
        varying float vFlareType;
        varying float vIntensity;
        
        vec3 hsl2rgb(vec3 c) { 
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
          return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); 
        }
        
        vec3 getFormationColor(float formationGroup) {
          if (formationGroup < 0.5) {
            return hsl2rgb(vec3(0.15, 0.9, 0.95));
          } else if (formationGroup < 1.5) {
            return hsl2rgb(vec3(0.6, 0.8, 0.8));
          } else if (formationGroup < 2.5) {
            return hsl2rgb(vec3(0.8, 0.85, 0.75));
          } else {
            return hsl2rgb(vec3(0.05, 0.9, 0.7));
          }
        }
        
        void main() {
          vec2 ownUv = vec2(mod(a_id, uTextureSize) + 0.5, floor(a_id / uTextureSize) + 0.5) / uTextureSize;
          vec4 positionData = texture2D(uPositionTexture, ownUv);
          vec3 worldPos = positionData.xyz;
          float formationGroup = positionData.w;
          
          vColor = getFormationColor(formationGroup);
          vFlareType = a_flareType;
          
          // Calculate distance-based intensity
          float distance = length(worldPos - uCameraPosition);
          vIntensity = 1000.0 / (distance + 100.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Different sizes for different flare types
          float baseSize = 15.0;
          if (a_flareType < 0.5) {
            gl_PointSize = baseSize * 0.5; // Core
          } else if (a_flareType < 1.5) {
            gl_PointSize = baseSize * 1.5; // Inner ring
          } else {
            gl_PointSize = baseSize * 3.0; // Outer ring
          }
          
          gl_PointSize *= (1000.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vColor;
        varying float vFlareType;
        varying float vIntensity;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = 1.0;
          float brightness = 1.0;
          
          if (vFlareType < 0.5) {
            // Core flare - bright and sharp
            alpha = 1.0 - smoothstep(0.0, 0.3, dist);
            brightness = 15.0;
          } else if (vFlareType < 1.5) {
            // Inner ring - medium brightness, larger
            alpha = 1.0 - smoothstep(0.2, 0.5, dist);
            brightness = 8.0;
          } else {
            // Outer ring - soft and large
            alpha = 1.0 - smoothstep(0.0, 0.5, dist);
            alpha = pow(alpha, 2.0);
            brightness = 4.0;
          }
          
          vec3 finalColor = vColor * brightness * vIntensity;
          
          gl_FragColor = vec4(finalColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    return [geometry, material]
  }, [positionTexture, textureSize, droneCount, size])

  useFrame((state) => {
    if (flareMaterial) {
      flareMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
      flareMaterial.uniforms.uCameraPosition.value.copy(camera.position)
    }
  })

  return <points ref={flareRef} geometry={flareGeometry} material={flareMaterial} frustumCulled={false} />
}
