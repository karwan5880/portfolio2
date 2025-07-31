'use client'

import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function HeartFormation({ scale = 1.0, pulseFrequency = 5.0 }) {
  const DRONE_COUNT = 1024
  const pointsRef = useRef()

  const { geometry, material } = useMemo(() => {
    // Create geometry
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(DRONE_COUNT * 3)

    // Initialize positions (will be updated in shader)
    for (let i = 0; i < DRONE_COUNT; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Add drone IDs
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) {
      ids[i] = i
    }
    geo.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))

    // Create material
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 12.0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        attribute float a_id;
        varying vec3 vColor;
        
        #define PI 3.14159265359
        #define DRONE_COUNT 1024.0
        
        vec3 hsl2rgb(vec3 c) { 
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
          return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); 
        }
        
        // Heart shape function
        vec3 getHeartPosition(float id, float time) {
          // Parametric heart equation
          float t = (id / DRONE_COUNT) * 2.0 * PI;
          
          // 2D heart shape (classic parametric heart)
          float x = 16.0 * pow(sin(t), 3.0);
          float y = 13.0 * cos(t) - 5.0 * cos(2.0 * t) - 2.0 * cos(3.0 * t) - cos(4.0 * t);
          
          // Add some depth variation
          float z = sin(t * 0.5) * 20.0;
          
          // Scale the heart to be visible
          vec3 heartPos = vec3(x * 5.0, y * 5.0 + 200.0, z);
          
          // Rotate the heart slowly around Y axis
          float rotationSpeed = 0.5;
          float angle = time * rotationSpeed;
          float cosA = cos(angle);
          float sinA = sin(angle);
          
          // Manual rotation matrix application
          vec3 rotated = vec3(
            heartPos.x * cosA - heartPos.z * sinA,
            heartPos.y,
            heartPos.x * sinA + heartPos.z * cosA
          );
          
          return rotated;
        }
        
        void main() {
          vec3 heartPos = getHeartPosition(a_id, uTime);
          
          // Pulsing effect
          float pulse = sin(uTime * 2.0) * 0.2 + 1.0;
          heartPos *= pulse;
          
          // Heart colors - bright romantic reds and pinks
          float heartHue = 0.0 + sin(uTime * 0.5 + a_id * 0.01) * 0.1; // Red to pink
          vColor = hsl2rgb(vec3(heartHue, 0.9, 0.8)); // Brighter colors
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(heartPos, 1.0);
          gl_PointSize = uSize;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create glowing point
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          float alpha = 1.0 - smoothstep(0.1, 0.5, dist);
          gl_FragColor = vec4(vColor * 3.0, alpha); // Brighter glow
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    return { geometry: geo, material: mat }
  }, [DRONE_COUNT])

  useFrame((state) => {
    if (material) {
      material.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return <points ref={pointsRef} geometry={geometry} material={material} />
}
