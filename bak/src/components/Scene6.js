'use client'

import { Loader } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, LensFlare } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { Experience } from './Experience'

export default function Scene({ onMarkerClick, cameraFocusSection, onAnimationComplete, isAnimating, setCameraFocusSection }) {
  const lightTracker = useMemo(() => new THREE.Object3D(), [])
  const lightSourceRef = useRef()

  return (
    <>
      <Canvas
        camera={{ position: [0, 2, 7], fov: 60 }}
        gl={{ logarithmicDepthBuffer: true }} //
      >
        <Experience
          onMarkerClick={onMarkerClick} //
          cameraFocusSection={cameraFocusSection}
          setCameraFocusSection={setCameraFocusSection}
          onAnimationComplete={onAnimationComplete}
          isAnimating={isAnimating} //
          lightTracker={lightTracker}
          lightSourceRef={lightSourceRef}
        />
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.9} //
            luminanceSmoothing={0.2}
            mipmapBlur
          />
          <LensFlare
            source={lightTracker}
            intensity={0.25} //
            scale={1.2}
            blendFunction={BlendFunction.ADD}
          />
        </EffectComposer>
      </Canvas>
      <Loader />
    </>
  )
}
