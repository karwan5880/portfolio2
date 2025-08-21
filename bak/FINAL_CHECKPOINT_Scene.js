'use client'

import { Loader, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Bloom, EffectComposer, GodRays, LensFlare } from '@react-three/postprocessing'
import { BlendFunction, KernelSize } from 'postprocessing'
import React, { useMemo, useState } from 'react'
import * as THREE from 'three'

import { Experience } from './Experience'
import { latLonToVector3 } from './utils'

const startingLat = 4
const startingLon = 101
const zoomLevel = 2.8
const initialCameraPosition = latLonToVector3(startingLat, startingLon, 2 * zoomLevel)

const Scene = React.forwardRef(function Scene({ eventSource, setControls, resetTrigger, controls }, ref) {
  const [sunMesh, setSunMesh] = useState(null)
  const lightTracker = useMemo(() => new THREE.Object3D(), [])
  const [isHighQuality, setIsHighQuality] = useState(true)

  return (
    <>
      <Canvas eventSource={eventSource} eventPrefix="client" camera={{ position: initialCameraPosition.toArray(), fov: 60 }} gl={{ logarithmicDepthBuffer: true }}>
        <PerformanceMonitor onIncline={() => setIsHighQuality(true)} onDecline={() => setIsHighQuality(false)} />
        <mesh ref={setSunMesh}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color={'#ffffff'} toneMapped={false} />
        </mesh>
        <Experience ref={ref} sunRef={sunMesh} lightTracker={lightTracker} setControls={setControls} resetTrigger={resetTrigger} controls={controls} />
        <EffectComposer>
          {sunMesh && (
            <>
              {isHighQuality && <GodRays sun={sunMesh} blendFunction={BlendFunction.SCREEN} samples={60} decay={0.85} density={0.96} weight={0.6} exposure={0.4} clampMax={1} kernelSize={KernelSize.SMALL} />}
              {isHighQuality && <LensFlare source={lightTracker} intensity={0.5} scale={1.2} blendFunction={BlendFunction.ADD} />}
            </>
          )}
          <Bloom intensity={2.0} luminanceThreshold={0.7} luminanceSmoothing={0.01} mipmapBlur kernelSize={KernelSize.HUGE} />
        </EffectComposer>
      </Canvas>
      <Loader />
    </>
  )
})

export default Scene
