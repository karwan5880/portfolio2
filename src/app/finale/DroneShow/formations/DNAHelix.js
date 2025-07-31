'use client'

import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function DNAHelix({ scale = 1.0, pulseFrequency = 5.0 }) {
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
        uSize: { value: 10.0 },
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
        
        vec3 getDNAHelixPosition(float id, float time) {
          // DNA parameters
          float helixHeight = 400.0;
          float helixRadius = 80.0;
          float helixTurns = 4.0;
          
          // Determine which strand (0 or 1)
          float strand = mod(id, 2.0);
          float droneInStrand = floor(id / 2.0);
          
          // Position along helix height
          float t = (droneInStrand / (DRONE_COUNT / 2.0));
          float y = (t - 0.5) * helixHeight + 200.0; // Center at y=200
          
          // Helix angle with rotation
          float angle = t * helixTurns * 2.0 * PI + time * 0.5;
          
          // Offset second strand by 180 degrees
          if (strand > 0.5) {
            angle += PI;
          }
          
          // Helix position
          float x = helixRadius * cos(angle);
          float z = helixRadius * sin(angle);
          
          // Add connecting base pairs every few drones
          float basePairSpacing = 20.0;
          if (mod(droneInStrand, basePairSpacing) < 2.0) {
            // This is a base pair connector
            float connector_t = mod(droneInStrand, basePairSpacing) / 2.0;
            if (strand > 0.5) connector_t = 1.0 - connector_t;
            
            // Interpolate between the two strands
            float angle1 = t * helixTurns * 2.0 * PI + time * 0.5;
            float angle2 = angle1 + PI;
            
            float x1 = helixRadius * cos(angle1);
            float z1 = helixRadius * sin(angle1);
            float x2 = helixRadius * cos(angle2);
            float z2 = helixRadius * sin(angle2);
            
            x = mix(x1, x2, connector_t);
            z = mix(z1, z2, connector_t);
          }
          
          return vec3(x, y, z);
        }
        
        void main() {
          vec3 dnaPos = getDNAHelixPosition(a_id, uTime);
          
          // Gentle pulsing
          float pulse = sin(uTime * 1.5) * 0.1 + 1.0;
          dnaPos.xz *= pulse;
          
          // DNA colors - alternating strands in different colors
          float strand = mod(a_id, 2.0);
          float droneInStrand = floor(a_id / 2.0);
          
          // Base pair connectors get special color
          float basePairSpacing = 20.0;
          bool isBasePair = mod(droneInStrand, basePairSpacing) < 2.0;
          
          vec3 color;
          if (isBasePair) {
            // Base pairs in white/yellow
            color = hsl2rgb(vec3(0.15, 0.8, 0.9)); // Yellow
          } else if (strand < 0.5) {
            // First strand in blue
            color = hsl2rgb(vec3(0.6, 0.8, 0.7)); // Blue
          } else {
            // Second strand in green
            color = hsl2rgb(vec3(0.3, 0.8, 0.7)); // Green
          }
          
          // Add some animation
          float brightness = 0.8 + sin(uTime * 2.0 + a_id * 0.1) * 0.2;
          vColor = color * brightness;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(dnaPos, 1.0);
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
