'use client'

import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function SpiralGalaxy({ scale = 1.0, pulseFrequency = 5.0 }) {
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
        
        float random(float n) { return fract(sin(n) * 43758.5453123); }
        
        vec3 getSpiralGalaxyPosition(float id, float time) {
          // Create multiple spiral arms
          float armCount = 3.0;
          float armIndex = mod(id, armCount);
          float droneInArm = floor(id / armCount);
          
          // Spiral parameters
          float maxRadius = 300.0;
          float radius = (droneInArm / (DRONE_COUNT / armCount)) * maxRadius;
          
          // Spiral angle with time rotation
          float baseAngle = (armIndex / armCount) * 2.0 * PI; // Arm offset
          float spiralTightness = 3.0;
          float angle = baseAngle + (radius / maxRadius) * spiralTightness * 2.0 * PI;
          
          // Galaxy rotation
          float rotationSpeed = 0.2;
          angle += time * rotationSpeed;
          
          // Position in spiral
          float x = radius * cos(angle);
          float z = radius * sin(angle);
          
          // Vertical variation for 3D effect
          float y = sin(radius * 0.02 + time) * 20.0 + 200.0;
          
          // Add some randomness for realistic galaxy look
          float randomOffset = random(id) * 10.0;
          x += sin(time + id * 0.1) * randomOffset;
          z += cos(time + id * 0.1) * randomOffset;
          
          return vec3(x, y, z);
        }
        
        void main() {
          vec3 galaxyPos = getSpiralGalaxyPosition(a_id, uTime);
          
          // Pulsing expansion/contraction
          float pulse = sin(uTime * 0.5) * 0.2 + 1.0;
          galaxyPos.xz *= pulse;
          
          // Galaxy colors - blues, purples, whites
          float armIndex = mod(a_id, 3.0);
          float hue = 0.6 + armIndex * 0.1 + sin(uTime + a_id * 0.05) * 0.1; // Blue to purple spectrum
          float brightness = 0.5 + sin(uTime * 2.0 + a_id * 0.1) * 0.3; // Twinkling effect
          vColor = hsl2rgb(vec3(hue, 0.7, brightness));
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(galaxyPos, 1.0);
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
