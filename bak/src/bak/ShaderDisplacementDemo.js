'use client'

import { Canvas, extend, useFrame } from '@react-three-fiber'
import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { useControls } from 'leva'
import { useRef } from 'react'
import * as THREE from 'three'

// 1. The custom shader material
const DisplacementMaterial = shaderMaterial(
  // Uniforms: values passed from JS to the shader
  {
    uTime: 0.0,
    uAmplitude: 1.0,
    uFrequency: 0.1,
  },
  // Vertex Shader: runs for every vertex
  `
    uniform float uTime;
    uniform float uAmplitude;
    uniform float uFrequency;
    
    // A classic 3D simplex noise function, you can find these online
    // This is a self-contained function, no external libraries needed in GLSL
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      // 2. Calculate noise
      // We use the original position and time to get a continuously evolving noise value
      float noise = snoise(position * uFrequency + uTime);

      // 3. Displace the vertex
      // We push the vertex outwards along its normal vector
      // For a sphere centered at (0,0,0), the position is the normal
      vec3 displacedPosition = position + normalize(position) * noise * uAmplitude;

      // Standard R3F projection calculation
      vec4 modelViewPosition = modelViewMatrix * vec4(displacedPosition, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
      gl_PointSize = 5.0 * (100.0 / -modelViewPosition.z);
    }
  `,
  // Fragment Shader: runs for every pixel on the shape
  `
    void main() {
      // A simple glowing dot
      float dist = distance(gl_PointCoord, vec2(0.5));
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);
      gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
    }
  `
)
extend({ DisplacementMaterial })

function ShaderSphere() {
  const materialRef = useRef()

  const { amplitude, frequency } = useControls({
    amplitude: { value: 3, min: 0, max: 10, step: 0.1 },
    frequency: { value: 0.3, min: 0, max: 2, step: 0.05 },
  })

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.getElapsedTime()
      materialRef.current.uAmplitude = amplitude
      materialRef.current.uFrequency = frequency
    }
  })

  return (
    <points>
      <icosahedronGeometry args={[20, 64]} />
      <displacementMaterial ref={materialRef} transparent={true} depthWrite={false} />
    </points>
  )
}

export default function ShaderDisplacementDemo() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#101010' }}>
      <Canvas camera={{ position: [0, 0, 80] }}>
        <ShaderSphere />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
