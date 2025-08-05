// Quick test with early countdown timing to avoid formation conflicts
'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import React, { Suspense, useRef } from 'react'
import * as THREE from 'three'

import { FinalParticleSystem } from './FinalParticleSystem.js'

// Quick test with early countdown timing to avoid formation conflicts

// Override the shader timing for quick testing
const quickTestShader = `
    uniform float uTime;
    uniform float uPulseFrequency;
    varying vec3 vColor;
    varying vec3 vPosition;
    
    // Quick test - countdown starts at 5 seconds
    bool isCountdownActive(float time) {
        return (time >= 5.0 && time < 15.0); // Quick test: 5-15 seconds
    }
    
    bool isPatternDrone(vec3 pos) {
        bool inXRange = (pos.x >= -200.0 && pos.x <= 200.0);
        bool inYRange = (pos.y >= 200.0 && pos.y <= 600.0);
        bool inZRange = (abs(pos.z) < 50.0);
        return (inXRange && inYRange && inZRange);
    }
    
    // Simple digit "8" for testing
    bool getDigitPixel(int digit, int row, int col) {
        // Just make a simple "8" pattern
        if ((row >= 4 && row <= 7 && col >= 8 && col <= 24) ||      // Top bar
            (row >= 14 && row <= 17 && col >= 8 && col <= 24) ||    // Middle bar
            (row >= 25 && row <= 28 && col >= 8 && col <= 24) ||    // Bottom bar
            (row >= 7 && row <= 25 && col >= 8 && col <= 11) ||     // Left side
            (row >= 7 && row <= 25 && col >= 21 && col <= 24)) {    // Right side
            return true;
        }
        return false;
    }
    
    void main() { 
        float h = (sin(uTime * uPulseFrequency) + 1.0) / 2.0; 
        h = pow(h, 3.0);
        
        bool showPatterns = isPatternDrone(vPosition);
        
        float brightness = 10.0 + h * 5.0;
        vec3 finalColor = vColor;
        
        if (showPatterns) {
            float normalizedX = (vPosition.x + 200.0) / 400.0;
            float normalizedY = (vPosition.y - 200.0) / 400.0;
            
            normalizedX = clamp(normalizedX, 0.0, 1.0);
            normalizedY = clamp(normalizedY, 0.0, 1.0);
            
            if (isCountdownActive(uTime)) {
                // COUNTDOWN MODE: Show digit "8" for testing
                int gridRow = int(floor(normalizedY * 32.0));
                int gridCol = int(floor(normalizedX * 32.0));
                
                gridRow = clamp(gridRow, 0, 31);
                gridCol = clamp(gridCol, 0, 31);
                
                bool isLit = getDigitPixel(8, gridRow, gridCol);
                
                if (isLit) {
                    // SUPER BRIGHT WHITE
                    finalColor = vec3(1.0, 1.0, 1.0);
                    brightness = 200.0;
                } else {
                    // VERY DARK
                    finalColor = vec3(0.0, 0.0, 0.0);
                    brightness = 0.1;
                }
            } else {
                // Before/after countdown: solid color
                if (uTime < 5.0) {
                    finalColor = vec3(0.0, 0.5, 1.0); // Blue before
                    brightness = 30.0;
                } else {
                    finalColor = vec3(0.0, 1.0, 0.5); // Green after
                    brightness = 30.0;
                }
            }
        }
        
        float globalBrightness = showPatterns ? 1.0 : 0.1;
        gl_FragColor = vec4(finalColor * brightness * globalBrightness, 1.0); 
    }
`

function Scene() {
  const controlsRef = useRef()

  useFrame((state) => {
    // Position camera to see screen clearly
    state.camera.position.set(0, 400, 600)
    state.camera.lookAt(0, 400, 0)
  })

  return (
    <>
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={1.0} />
      <directionalLight position={[500, 1000, 1000]} intensity={1.5} />

      <group position={[0, 0, 0]}>
        <FinalParticleSystem scale={1.0} pulseFrequency={1.0} />
      </group>

      <axesHelper args={[200]} position={[0, 0, 0]} />

      <OrbitControls ref={controlsRef} target={[0, 400, 0]} minDistance={100} maxDistance={2000} enabled={true} enablePan={true} />
    </>
  )
}

export function QuickCountdownTest() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Suspense fallback={<div style={{ color: 'white' }}>Loading...</div>}>
        <Canvas
          camera={{
            position: [0, 400, 600],
            fov: 60,
            near: 0.1,
            far: 10000,
          }}
        >
          <Scene />
        </Canvas>
      </Suspense>

      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', color: '#ff6600' }}>⚡ Quick Test</h3>
        <p style={{ margin: '5px 0' }}>
          • <strong>0-5s:</strong> Blue patterns
        </p>
        <p style={{ margin: '5px 0' }}>
          • <strong>5-15s:</strong> <span style={{ color: '#ffff00' }}>DIGIT "8" TEST</span>
        </p>
        <p style={{ margin: '5px 0' }}>
          • <strong>15s+:</strong> Green patterns
        </p>

        <div
          style={{
            marginTop: '15px',
            padding: '8px',
            background: 'rgba(255,0,0,0.2)',
            borderRadius: '4px',
          }}
        >
          <strong>🚨 This bypasses formation timing!</strong>
          <br />
          If you see a bright white "8" digit at 5-15s,
          <br />
          then the countdown system works!
        </div>
      </div>
    </div>
  )
}
