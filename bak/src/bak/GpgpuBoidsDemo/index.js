'use client'

import { OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useControls } from 'leva'
import React from 'react'

import { BoidsSimulation } from './BoidsSimulation'

useGLTF.preload('/monkey.glb')

export function GpgpuBoidsDemo() {
  // const { intensity, luminanceThreshold, luminanceSmoothing } = useControls('Bloom Effect', {
  //   intensity: { value: 1.2, min: 0, max: 2.0, step: 0.05 },
  //   luminanceThreshold: { value: 0.1, min: 0, max: 1.0, step: 0.05 },
  //   luminanceSmoothing: { value: 0.2, min: 0, max: 1.0, step: 0.05 },
  // })
  const { intensity, luminanceThreshold, luminanceSmoothing } = useControls('Bloom Effect', {
    intensity: { value: 0.6, min: 0, max: 2.0, step: 0.05 }, // Fine-tuned
    luminanceThreshold: { value: 0.05, min: 0, max: 1.0, step: 0.05 }, // Fine-tuned
    luminanceSmoothing: { value: 0.1, min: 0, max: 1.0, step: 0.05 }, // Fine-tuned
  })

  return (
    <React.Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <BoidsSimulation />

        {/* --- START OF CAMERA FIX --- */}
        <OrbitControls
          // --- Basic Controls ---
          //   enablePan={false} // Disable strafing left/right
          enablePan={true} // Disable strafing left/right
          enableZoom={true} // Allow zooming with the scroll wheel
          // --- "Human on the Ground" Constraints ---
          //   minDistance={0} // Don't let the camera get too close
          //   maxDistance={120} // Don't let the camera zoom too far out
          //   //   minDistance={8} // Don't let the camera get too close
          //   //   maxDistance={40} // Don't let the camera zoom too far out
          //   minPolarAngle={Math.PI / 4} // Prevent looking down at the "floor"
          //   maxPolarAngle={Math.PI / 1.8} // Prevent looking straight up or past vertical
          // //   minPolarAngle={Math.PI / 4} // Prevent looking down at the "floor"
          // //   maxPolarAngle={Math.PI / 1.8} // Prevent looking straight up or past vertical
        />
        {/* --- END OF CAMERA FIX --- */}

        <EffectComposer>
          <Bloom intensity={intensity} luminanceThreshold={luminanceThreshold} luminanceSmoothing={luminanceSmoothing} mipmapBlur={true} />
        </EffectComposer>
      </Canvas>
    </React.Suspense>
  )
}
