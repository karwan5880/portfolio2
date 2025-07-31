'use client'

import { DNAHelix } from '../DroneShow/formations/DNAHelix'
import { FireworksBurst } from '../DroneShow/formations/FireworksBurst'
import { GeometricMorphing } from '../DroneShow/formations/GeometricMorphing'
import { HeartFormation } from '../DroneShow/formations/HeartFormation'
import { SpiralGalaxy } from '../DroneShow/formations/SpiralGalaxy'
import { WavePatterns } from '../DroneShow/formations/WavePatterns'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'

const formations = [
  { name: 'Heart Formation ❤️', component: HeartFormation },
  { name: 'Spiral Galaxy 🌌', component: SpiralGalaxy },
  { name: 'DNA Helix 🧬', component: DNAHelix },
  { name: 'Fireworks Burst 🎆', component: FireworksBurst },
  { name: 'Wave Patterns 🌊', component: WavePatterns },
  { name: 'Geometric Morphing 🔷', component: GeometricMorphing },
]

export default function FormationsTestPage() {
  const [currentFormation, setCurrentFormation] = useState(0)
  const CurrentFormationComponent = formations[currentFormation].component

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#000' }}>
      {/* Formation Selector */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <h2 style={{ color: 'white', margin: 0, fontSize: '18px' }}>Drone Formation Tests</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {formations.map((formation, index) => (
            <button
              key={index}
              onClick={() => setCurrentFormation(index)}
              style={{
                padding: '8px 12px',
                backgroundColor: currentFormation === index ? '#4CAF50' : '#333',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background-color 0.2s',
              }}
            >
              {formation.name}
            </button>
          ))}
        </div>
        <div
          style={{
            color: 'white',
            fontSize: '14px',
            marginTop: '10px',
            padding: '10px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            borderRadius: '4px',
            maxWidth: '300px',
          }}
        >
          <strong>Currently viewing:</strong>
          <br />
          {formations[currentFormation].name}
          <br />
          <br />
          <strong>Controls:</strong>
          <br />
          • Mouse drag to rotate
          <br />
          • Scroll to zoom
          <br />• Each formation runs automatically
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 200, 500], fov: 60 }} style={{ background: '#000011' }}>
        <ambientLight intensity={0.1} />
        <pointLight position={[100, 100, 100]} intensity={0.5} />

        <CurrentFormationComponent />

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} target={[0, 200, 0]} />
      </Canvas>
    </div>
  )
}
