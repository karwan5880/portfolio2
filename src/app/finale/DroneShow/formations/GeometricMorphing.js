'use client'

import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

export function GeometricMorphing({ scale = 1.0, pulseFrequency = 5.0 }) {
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
        
        float random(float n) { return fract(sin(n) * 43758.5453123); }
        
        // Cube formation
        vec3 getCubePosition(float id) {
          float cubeSize = pow(DRONE_COUNT, 1.0/3.0); // Cube root for 3D grid
          float layer = floor(id / (cubeSize * cubeSize));
          float remaining = mod(id, cubeSize * cubeSize);
          float row = floor(remaining / cubeSize);
          float col = mod(remaining, cubeSize);
          
          float spacing = 15.0;
          return vec3(
            (col - cubeSize/2.0) * spacing,
            (layer - cubeSize/2.0) * spacing + 200.0,
            (row - cubeSize/2.0) * spacing
          );
        }
        
        // Sphere formation
        vec3 getSpherePosition(float id) {
          float phi = acos(1.0 - 2.0 * (id / DRONE_COUNT));
          float theta = 2.0 * PI * id * 2.39996; // Golden angle
          
          float radius = 120.0;
          return vec3(
            radius * sin(phi) * cos(theta),
            radius * cos(phi) + 200.0,
            radius * sin(phi) * sin(theta)
          );
        }
        
        // Pyramid formation
        vec3 getPyramidPosition(float id) {
          // Create layers of decreasing size
          float currentId = id;
          float layer = 0.0;
          float layerSize = 20.0; // Base layer size
          
          // Find which layer this drone belongs to
          while (currentId >= layerSize * layerSize) {
            currentId -= layerSize * layerSize;
            layer += 1.0;
            layerSize = max(1.0, layerSize - 2.0); // Decrease layer size
          }
          
          // Position within layer
          float row = floor(currentId / layerSize);
          float col = mod(currentId, layerSize);
          
          float spacing = 12.0;
          return vec3(
            (col - layerSize/2.0) * spacing,
            layer * spacing + 100.0,
            (row - layerSize/2.0) * spacing
          );
        }
        
        // Torus formation
        vec3 getTorusPosition(float id) {
          float majorRadius = 100.0;
          float minorRadius = 40.0;
          
          float u = (id / DRONE_COUNT) * 2.0 * PI;
          float v = ((id * 7.0) / DRONE_COUNT) * 2.0 * PI; // Different frequency for minor circle
          
          return vec3(
            (majorRadius + minorRadius * cos(v)) * cos(u),
            minorRadius * sin(v) + 200.0,
            (majorRadius + minorRadius * cos(v)) * sin(u)
          );
        }
        
        vec3 getMorphingPosition(float id, float time) {
          // Cycle through shapes every 8 seconds
          float cycleDuration = 8.0;
          float cycleTime = mod(time, cycleDuration * 4.0); // 4 shapes total
          
          vec3 cubePos = getCubePosition(id);
          vec3 spherePos = getSpherePosition(id);
          vec3 pyramidPos = getPyramidPosition(id);
          vec3 torusPos = getTorusPosition(id);
          
          vec3 currentPos;
          float t; // Interpolation factor
          
          if (cycleTime < cycleDuration) {
            // Cube to Sphere
            t = smoothstep(0.0, 1.0, cycleTime / cycleDuration);
            currentPos = mix(cubePos, spherePos, t);
          } else if (cycleTime < cycleDuration * 2.0) {
            // Sphere to Pyramid
            t = smoothstep(0.0, 1.0, (cycleTime - cycleDuration) / cycleDuration);
            currentPos = mix(spherePos, pyramidPos, t);
          } else if (cycleTime < cycleDuration * 3.0) {
            // Pyramid to Torus
            t = smoothstep(0.0, 1.0, (cycleTime - cycleDuration * 2.0) / cycleDuration);
            currentPos = mix(pyramidPos, torusPos, t);
          } else {
            // Torus to Cube
            t = smoothstep(0.0, 1.0, (cycleTime - cycleDuration * 3.0) / cycleDuration);
            currentPos = mix(torusPos, cubePos, t);
          }
          
          return currentPos;
        }
        
        void main() {
          vec3 morphPos = getMorphingPosition(a_id, uTime);
          
          // Color changes with each shape
          float cycleDuration = 8.0;
          float cycleTime = mod(uTime, cycleDuration * 4.0);
          
          float hue;
          if (cycleTime < cycleDuration) {
            hue = 0.0; // Red for cube
          } else if (cycleTime < cycleDuration * 2.0) {
            hue = 0.3; // Green for sphere
          } else if (cycleTime < cycleDuration * 3.0) {
            hue = 0.6; // Blue for pyramid
          } else {
            hue = 0.8; // Purple for torus
          }
          
          // Add some variation
          hue += sin(uTime + a_id * 0.1) * 0.05;
          
          // Brightness animation
          float brightness = 0.7 + sin(uTime * 3.0 + a_id * 0.05) * 0.2;
          
          vColor = hsl2rgb(vec3(hue, 0.8, brightness));
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(morphPos, 1.0);
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
