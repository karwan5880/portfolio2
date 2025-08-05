'use client'

import { shaderMaterial, useFBO } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { button, useControls } from 'leva'
// --- NEW: Import useEffect ---
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { ParticlesMaterial as particleShader } from './shaders/particles'
import { SimulationMaterial as simShader } from './shaders/simulation'
import { useBoidData } from './useBoidData'

const SIZE = 256

const SimulationMaterial = shaderMaterial({ uPositionTexture: null, uTargetPositionTexture: null, uDroneDataTexture: null, uTime: 0, uSwitchTime: 0, uTexelSize: new THREE.Vector2(1 / SIZE, 1 / SIZE), uRepulsionRadius: 0.1, uRepulsionStrength: 0.04, uSearchRadius: 1.0 }, simShader.vertexShader, simShader.fragmentShader)
const ParticlesMaterial = shaderMaterial({ uPositionTexture: null, uTargetColorTexture: null }, particleShader.vertexShader, particleShader.fragmentShader)

extend({ SimulationMaterial, ParticlesMaterial })

export function BoidsSimulation() {
  const simulationMaterial = useRef()
  const particlesMaterial = useRef()
  const [currentFormation, setCurrentFormation] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const boidData = useBoidData()

  const { interval } = useControls('Show Controls', {
    'Play/Pause': {
      value: isPlaying,
      onChange: (v) => setIsPlaying(v),
    },
    interval: { value: 15, min: 5, max: 60, step: 1, label: 'Interval (s)' },
  })

  // --- Manual controls are still useful for debugging ---
  useControls('Choreography', {
    'Show Home': button(() => setCurrentFormation(0)),
    'Show Monkey': button(() => setCurrentFormation(1)),
    'Show Text': button(() => setCurrentFormation(2)),
  })

  const { repulsionRadius, repulsionStrength, searchRadius } = useControls('Drone Spacing', {
    repulsionRadius: { value: 0.1, min: 0, max: 1.0, step: 0.01 },
    repulsionStrength: { value: 0.04, min: 0, max: 0.5, step: 0.01 },
    searchRadius: { value: 1, min: 1, max: 5, step: 1 },
  })

  // const { formations, initialPositions, particleGeometry, droneDataTexture } = useBoidData()
  // 2. Add a guard clause. If the data isn't ready, render nothing.
  //    This prevents the destructuring error.
  // if (!boidData) return null
  // 3. Now that we know boidData is not null, we can safely destructure it.
  // const { formations, initialPositions, particleGeometry, droneDataTexture } = boidData

  const frame = useRef(0)
  const switchTimeRef = useRef(0)
  const lastFormationRef = useRef(-1)

  const fbos = useRef({
    read: useFBO(SIZE, SIZE, { type: THREE.FloatType }),
    write: useFBO(SIZE, SIZE, { type: THREE.FloatType }),
    swap: function () {
      const t = this.read
      this.read = this.write
      this.write = t
    },
  })
  const simScene = useMemo(() => {
    const s = new THREE.Scene()
    const c = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
    s.add(m)
    return { scene: s, camera: c, mesh: m }
  }, [])

  // --- NEW: Automated show sequencer logic ---
  useEffect(() => {
    // Do nothing if the data isn't loaded yet, or if the show is paused
    if (!isPlaying || !boidData) return

    // Set up an interval to advance the formation
    const timer = setInterval(() => {
      setCurrentFormation((prevFormation) => (prevFormation + 1) % boidData.formations.length)
    }, interval * 1000) // Convert seconds from leva to milliseconds

    // This is a crucial cleanup function.
    // It runs when the component unmounts or when the dependencies change.
    return () => {
      clearInterval(timer)
    }
  }, [isPlaying, interval, boidData]) // Dependencies: re-run this effect if any of these change

  useFrame(({ gl, clock }) => {
    if (!boidData) return
    const { formations, initialPositions, droneDataTexture } = boidData

    const fbo = fbos.current
    const time = clock.getElapsedTime()
    if (currentFormation !== lastFormationRef.current) {
      switchTimeRef.current = time
      lastFormationRef.current = currentFormation
    }
    const targetPosTexture = formations[currentFormation].posTexture
    const targetColTexture = formations[currentFormation].colTexture
    simScene.mesh.material = simulationMaterial.current
    const simUniforms = simulationMaterial.current.uniforms
    simUniforms.uTime.value = time
    simUniforms.uSwitchTime.value = switchTimeRef.current
    simUniforms.uPositionTexture.value = frame.current === 0 ? initialPositions : fbo.read.texture
    simUniforms.uTargetPositionTexture.value = targetPosTexture
    simUniforms.uDroneDataTexture.value = droneDataTexture
    simUniforms.uRepulsionRadius.value = repulsionRadius
    simUniforms.uRepulsionStrength.value = repulsionStrength
    simUniforms.uSearchRadius.value = searchRadius
    simUniforms.uTexelSize.value.set(1 / SIZE, 1 / SIZE)
    gl.setRenderTarget(fbo.write)
    gl.render(simScene.scene, simScene.camera)
    gl.setRenderTarget(null)
    particlesMaterial.current.uniforms.uPositionTexture.value = fbo.write.texture
    particlesMaterial.current.uniforms.uTargetColorTexture.value = targetColTexture
    fbo.swap()
    frame.current++
  })
  if (!boidData) {
    return null
  }
  // if (!particleGeometry) return null
  const { particleGeometry } = boidData

  return (
    <>
      <simulationMaterial ref={simulationMaterial} />
      <points>
        <primitive object={particleGeometry} />
        <particlesMaterial ref={particlesMaterial} transparent={true} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </>
  )
}
