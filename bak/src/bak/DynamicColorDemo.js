'use client'

import { shaderMaterial, useTexture } from '@react-three/drei'
import { Canvas, extend } from '@react-three/fiber'
import * as THREE from 'three'

// 1. Define the simple shader material.
// It only needs one uniform: the texture we want to display.
const ImageColorMaterial = shaderMaterial(
  { uColorTexture: null },
  // Vertex Shader: Pass the geometry's UV coordinates to the fragment shader.
  /*glsl*/ `
    varying vec2 vUv;
    void main() {
      vUv = uv; // The 'uv' attribute is provided by default in THREE.PlaneGeometry
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader: Look up the color from the texture.
  /*glsl*/ `
    varying vec2 vUv;
    uniform sampler2D uColorTexture; // This is our image
    void main() {
      // For each pixel, use its UV coordinate (vUv) to find the
      // corresponding color in the uColorTexture and display it.
      vec4 textureColor = texture2D(uColorTexture, vUv);
      gl_FragColor = textureColor;
    }
  `
)

// Add the material to the R3F system
extend({ ImageColorMaterial })

// 2. The main component for the demonstration.
function ColorDemoScene() {
  // Use Drei's `useTexture` hook to load our image.
  // Make sure 'color-map.jpg' is in your /public folder.
  const colorMap = useTexture('/color-map.jpg')

  return (
    <mesh>
      {/* Use a simple plane geometry. It's 5x5 units in size. */}
      <planeGeometry args={[5, 5]} />
      {/* 
        Apply our custom shader material.
        We pass the loaded texture into the 'uColorTexture' uniform.
      */}
      <imageColorMaterial uColorTexture={colorMap} />
    </mesh>
  )
}

// 3. Export a wrapper component that sets up the canvas.
export function DynamicColorDemo() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ColorDemoScene />
    </Canvas>
  )
}
