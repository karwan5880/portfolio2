'use client'

import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function WavePatterns({ scale = 1.0, pulseFrequency = 5.0 }) {
  const DRONE_COUNT = 1024
  const pointsRef = useRef()

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const positions = new Float32Array(DRONE_COUNT * 3)

    for (let i = 0; i < DRONE_COUNT; i++) {
      positions[i * 3] = 0
      positions[i * 3 + 1] = 0
      positions[i * 3 + 2] = 0
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) {
      ids[i] = i
    }
    geo.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 8.0 },
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
        
        vec3 getWavePosition(float id, float time) {
          // Create a grid formation first
          float gridSize = sqrt(DRONE_COUNT);
          float row = floor(id / gridSize);
          float col = mod(id, gridSize);
          
          // Base grid position
          float spacing = 20.0;
          float x = (col - gridSize/2.0) * spacing;
          float z = (row - gridSize/2.0) * spacing;
          
          // Multiple wave patterns
          float waveSpeed = 2.0;
          float waveFreq = 0.02;
          float waveAmplitude = 80.0;
          
          // Primary sine wave (X direction)
          float wave1 = sin(x * waveFreq + time * waveSpeed) * waveAmplitude;
          
          // Secondary sine wave (Z direction)
          float wave2 = sin(z * waveFreq + time * waveSpeed * 1.3) * waveAmplitude * 0.7;
          
          // Circular wave from center
          float distFromCenter = sqrt(x*x + z*z);
          float circularWave = sin(distFromCenter * waveFreq * 0.5 - time * waveSpeed * 2.0) * waveAmplitude * 0.5;
          
          // Interference pattern
          float interference = sin(x * waveFreq * 2.0 + time * waveSpeed) * 
                             sin(z * waveFreq * 2.0 + time * waveSpeed * 0.8) * 
                             waveAmplitude * 0.3;
          
          // Combine all waves
          float y = 200.0 + wave1 + wave2 + circularWave + interference;
          
          // Add some phase variation based on position
          float phase = (x + z) * 0.01;
          y += sin(time * 3.0 + phase) * 20.0;
          
          return vec3(x, y, z);
        }
        
        void main() {
          vec3 wavePos = getWavePosition(a_id, uTime);
          
          // Color based on height (wave amplitude)
          float heightNormalized = (wavePos.y - 100.0) / 200.0; // Normalize height
          float hue = 0.5 + heightNormalized * 0.3; // Blue to cyan based on height
          
          // Add time-based color shifting
          hue += sin(uTime * 0.5 + a_id * 0.01) * 0.1;
          
          // Brightness based on wave motion
          float brightness = 0.6 + sin(uTime * 2.0 + wavePos.x * 0.02 + wavePos.z * 0.02) * 0.3;
          
          vColor = hsl2rgb(vec3(hue, 0.8, brightness));
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(wavePos, 1.0);
          gl_PointSize = uSize;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(vColor * 1.5, alpha);
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
