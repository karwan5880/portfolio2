import { useFrame, useThree } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Screen-space light rays for atmospheric effect
export function LightRaySystem({ positionTexture, textureSize, droneCount }) {
  const { camera } = useThree()
  const rayRef = useRef()

  const [rayGeometry, rayMaterial] = useMemo(() => {
    const geometry = new THREE.BufferGeometry()

    // Create ray lines for each drone
    const raysPerDrone = 8 // 8 rays per drone
    const totalRays = droneCount * raysPerDrone

    const positions = new Float32Array(totalRays * 3)
    const ids = new Float32Array(totalRays)
    const rayAngles = new Float32Array(totalRays)

    for (let i = 0; i < droneCount; i++) {
      for (let r = 0; r < raysPerDrone; r++) {
        const index = i * raysPerDrone + r
        positions[index * 3] = 0
        positions[index * 3 + 1] = 0
        positions[index * 3 + 2] = 0
        ids[index] = i
        rayAngles[index] = (r / raysPerDrone) * Math.PI * 2 // Evenly distributed angles
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))
    geometry.setAttribute('a_rayAngle', new THREE.BufferAttribute(rayAngles, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPositionTexture: { value: positionTexture },
        uTime: { value: 0 },
        uTextureSize: { value: textureSize },
        uCameraPosition: { value: new THREE.Vector3() },
      },
      vertexShader: `
        uniform sampler2D uPositionTexture;
        uniform float uTime;
        uniform float uTextureSize;
        uniform vec3 uCameraPosition;
        attribute float a_id;
        attribute float a_rayAngle;
        varying vec3 vColor;
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
          
          // Calculate ray direction
          float rayLength = 50.0;
          vec3 rayOffset = vec3(
            cos(a_rayAngle) * rayLength,
            sin(a_rayAngle) * rayLength,
            0.0
          );
          
          vec3 rayPos = worldPos + rayOffset;
          
          // Distance-based intensity
          float distance = length(worldPos - uCameraPosition);
          vIntensity = 500.0 / (distance + 50.0);
          
          vec4 mvPosition = modelViewMatrix * vec4(rayPos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          gl_PointSize = 2.0 * (1000.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vIntensity;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          alpha = pow(alpha, 3.0); // Sharp falloff
          
          vec3 finalColor = vColor * 3.0 * vIntensity;
          
          gl_FragColor = vec4(finalColor, alpha * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    return [geometry, material]
  }, [positionTexture, textureSize, droneCount])

  useFrame((state) => {
    if (rayMaterial) {
      rayMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
      rayMaterial.uniforms.uCameraPosition.value.copy(camera.position)
    }
  })

  return <points ref={rayRef} geometry={rayGeometry} material={rayMaterial} frustumCulled={false} />
}
