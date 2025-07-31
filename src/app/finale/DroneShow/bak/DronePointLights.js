import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Custom Point Sprites for pure light effect
export function DronePointLights({ positionTexture, textureSize, droneCount }) {
  const pointsRef = useRef()

  const [pointsGeometry, pointsMaterial] = useMemo(() => {
    const geometry = new THREE.BufferGeometry()

    // Create positions and IDs for all drones
    const positions = new Float32Array(droneCount * 3)
    const ids = new Float32Array(droneCount)

    for (let i = 0; i < droneCount; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
      ids[i] = i
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPositionTexture: { value: positionTexture },
        uTime: { value: 0 },
        uTextureSize: { value: textureSize },
        uPulseFrequency: { value: 5.0 },
      },
      vertexShader: `
        uniform sampler2D uPositionTexture;
        uniform float uTime;
        uniform float uTextureSize;
        attribute float a_id;
        varying vec3 vColor;
        varying float vIntensity;
        
        vec3 hsl2rgb(vec3 c) { 
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
          return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); 
        }
        
        vec3 getFormationColor(float formationGroup, float time) {
          float timeOffset = time * 0.5;
          
          if (formationGroup < 0.5) {
            return hsl2rgb(vec3(0.15 + sin(timeOffset) * 0.05, 0.9, 0.95));
          } else if (formationGroup < 1.5) {
            return hsl2rgb(vec3(0.6 + sin(timeOffset + 1.0) * 0.1, 0.8, 0.8));
          } else if (formationGroup < 2.5) {
            return hsl2rgb(vec3(0.8 + sin(timeOffset + 2.0) * 0.1, 0.85, 0.75));
          } else {
            return hsl2rgb(vec3(0.05 + sin(timeOffset + 3.0) * 0.08, 0.9, 0.7));
          }
        }
        
        void main() {
          vec2 ownUv = vec2(mod(a_id, uTextureSize) + 0.5, floor(a_id / uTextureSize) + 0.5) / uTextureSize;
          vec4 positionData = texture2D(uPositionTexture, ownUv);
          vec3 worldPos = positionData.xyz;
          float formationGroup = positionData.w;
          
          vColor = getFormationColor(formationGroup, uTime);
          
          // Pulsing intensity
          float pulse = (sin(uTime * 5.0) + 1.0) / 2.0;
          vIntensity = pow(pulse, 3.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(worldPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Large point size for maximum impact
          gl_PointSize = 25.0 * (1000.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vColor;
        varying float vIntensity;
        
        void main() {
          // Create perfect circular points
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard; // Perfect circle
          
          // Soft falloff from center
          float falloff = 1.0 - smoothstep(0.0, 0.5, dist);
          falloff = pow(falloff, 0.5); // Softer falloff
          
          // High brightness for pure light effect
          float brightness = 8.0 + vIntensity * 12.0;
          
          vec3 finalColor = vColor * brightness * falloff;
          
          gl_FragColor = vec4(finalColor, falloff);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    return [geometry, material]
  }, [positionTexture, textureSize, droneCount])

  useFrame((state) => {
    if (pointsMaterial) {
      pointsMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return <points ref={pointsRef} geometry={pointsGeometry} material={pointsMaterial} frustumCulled={false} />
}
