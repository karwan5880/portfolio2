'use client'

import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function FireworksBurst({ scale = 1.0, pulseFrequency = 5.0 }) {
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
        uSize: { value: 15.0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        attribute float a_id;
        varying vec3 vColor;
        varying float vSparkle;
        
        #define PI 3.14159265359
        #define DRONE_COUNT 1024.0
        
        vec3 hsl2rgb(vec3 c) { 
          vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0); 
          return c.z + c.y * (rgb-0.5)*(1.0-abs(2.0*c.z-1.0)); 
        }
        
        float random(float n) { return fract(sin(n) * 43758.5453123); }
        
        vec3 getFireworksPosition(float id, float time) {
          // Create multiple firework bursts
          float burstCount = 5.0;
          float burstIndex = mod(id, burstCount);
          float droneInBurst = floor(id / burstCount);
          
          // Burst centers at different positions
          vec3 center;
          if (burstIndex < 1.0) {
            center = vec3(0.0, 300.0, 0.0);      // Center
          } else if (burstIndex < 2.0) {
            center = vec3(150.0, 250.0, 100.0);  // Right
          } else if (burstIndex < 3.0) {
            center = vec3(-150.0, 250.0, 100.0); // Left
          } else if (burstIndex < 4.0) {
            center = vec3(0.0, 400.0, -150.0);   // Back high
          } else {
            center = vec3(0.0, 200.0, 150.0);    // Front low
          }
          
          // Each burst has its own timing
          float burstDelay = burstIndex * 2.0; // Stagger bursts
          float burstTime = time - burstDelay;
          
          if (burstTime < 0.0) {
            // Burst hasn't started yet, stay at center
            return center;
          }
          
          // Explosion parameters
          float explosionDuration = 4.0;
          float maxRadius = 120.0;
          
          // Random direction for each drone
          float phi = random(id + 100.0) * PI; // 0 to PI
          float theta = random(id + 200.0) * 2.0 * PI; // 0 to 2PI
          
          // Spherical explosion direction
          vec3 direction = vec3(
            sin(phi) * cos(theta),
            cos(phi),
            sin(phi) * sin(theta)
          );
          
          // Explosion progress (0 to 1)
          float progress = min(1.0, burstTime / explosionDuration);
          
          // Easing function for realistic explosion
          float easedProgress = progress * progress * (3.0 - 2.0 * progress); // Smoothstep
          
          // Distance from center
          float distance = easedProgress * maxRadius * (0.5 + random(id + 300.0) * 0.5);
          
          // Add gravity effect (drones fall down over time)
          float gravity = -50.0 * progress * progress;
          
          // Final position
          vec3 offset = direction * distance;
          offset.y += gravity;
          
          // Add some sparkle movement
          float sparkle = sin(time * 10.0 + id) * 2.0;
          offset += vec3(sparkle, sparkle * 0.5, sparkle);
          
          return center + offset;
        }
        
        void main() {
          vec3 fireworksPos = getFireworksPosition(a_id, uTime);
          
          // Fireworks colors - different color for each burst
          float burstIndex = mod(a_id, 5.0);
          float hue;
          
          if (burstIndex < 1.0) {
            hue = 0.0; // Red
          } else if (burstIndex < 2.0) {
            hue = 0.15; // Orange
          } else if (burstIndex < 3.0) {
            hue = 0.6; // Blue
          } else if (burstIndex < 4.0) {
            hue = 0.3; // Green
          } else {
            hue = 0.8; // Purple
          }
          
          // Add sparkle effect
          float sparkle = sin(uTime * 15.0 + a_id * 0.5) * 0.5 + 0.5;
          float brightness = 0.6 + sparkle * 0.4;
          
          vColor = hsl2rgb(vec3(hue, 0.9, brightness));
          vSparkle = sparkle;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(fireworksPos, 1.0);
          gl_PointSize = uSize + sparkle * 8.0; // Variable size for sparkle
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSparkle;
        
        void main() {
          // Circular point with glow
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          gl_FragColor = vec4(vColor * (2.0 + vSparkle), alpha);
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
