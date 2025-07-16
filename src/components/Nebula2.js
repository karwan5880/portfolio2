'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

import noise from './glsl/noise'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;

  ${noise} // Inject the noise function code here

  float fbm(vec4 x) {
    float v = 0.0;
    float a = 0.5;
    vec4 shift = vec4(100.0);
    for (int i = 0; i < 5; ++i) {
      v += a * snoise(x);
      x = x * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float t = uTime * 0.05;
    vec4 p = vec4(vUv * 3.0, t, 0.0); // Start with a larger initial scale

    
    // Use our fbm function to get detailed, layered noise
    float noiseValue = fbm(p);

    // Make the nebula appear in wisps and patches instead of everywhere
    float clampValue = clamp(noiseValue, 0.0, 1.0);
    float shapedValue = pow(clampValue, 3.0); // Use pow to create sharp falloffs, making it more "wispy"
    
    // Define the colors
    vec3 color1 = vec3(0.05, 0.02, 0.1); // A darker, more subtle purple/blue
    vec3 color2 = vec3(0.3, 0.1, 0.2); // A brighter magenta for the highlights
    vec3 starColor = vec3(0.9, 0.9, 1.0); // White for stars

    // Mix the nebula colors
    vec3 nebulaColor = mix(color1, color2, shapedValue);
    
    // Add stars by checking for very high noise peaks
    //float starValue = fbm(p * 5.0); // Use a different, higher frequency noise for stars
    float starValue = fbm(vec4(vUv * 80.0, t * 0.5, 0.0));
    starValue = pow(starValue, 20.0);
    nebulaColor = mix(nebulaColor, starColor, starValue);

    //if (starValue > 0.99) {
      //nebulaColor = mix(nebulaColor, starColor, smoothstep(0.99, 1.0, starValue));
    //}
    
    // Final color, but make it very dark overall
    // We multiply by a low value to make the nebula very faint, like it is in deep space
    //gl_FragColor = vec4(nebulaColor * 0.4, 1.0);
    gl_FragColor = vec4(nebulaColor * 0.5, 1.0);

    
    // Use the noise function to create swirling patterns
    // We sample it multiple times at different scales ("octaves") for more detail
    //float noiseValue = 0.0;
    //noiseValue += snoise(vec4(vUv * 5.0, t, 0.0)) * 0.5;
    //noiseValue += snoise(vec4(vUv * 10.0, t, 0.0)) * 0.25;
    //noiseValue += snoise(vec4(vUv * 20.0, t, 0.0)) * 0.125;

    // Use the noise value to mix between two colors
    //vec3 color1 = vec3(0.0, 0.0, 0.1); // Dark blue
    //vec3 color2 = vec3(0.3, 0.1, 0.4); // Magenta/Purple
    
    //vec3 finalColor = mix(color1, color2, smoothstep(0.3, 0.7, noiseValue));
    
    //gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function Nebula() {
  // `uniforms` are variables we pass from our JS code to the shader
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0.0 },
    }),
    []
  )

  // Animate the uTime uniform on every frame
  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <mesh>
      {/* A massive sphere that acts as the background */}
      <sphereGeometry args={[200, 64, 64]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        side={THREE.BackSide} // Render the inside of the sphere
      />
    </mesh>
  )
}
