'use client'

import { shaderMaterial, useFBO } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { button, useControls } from 'leva'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { ParticlesMaterial as particleShader } from './shaders/particles'
import { SimulationMaterial as simShader } from './shaders/simulation'
import { useDroneShowData } from './useDroneShowData'

const SIZE = 64

const SimulationMaterial = shaderMaterial({ uPositionTexture: null, uTargetPositionTexture: null, uRepulsionRadius: 0.5, uRepulsionStrength: 0.2 }, simShader.vertexShader, simShader.fragmentShader)
const ParticlesMaterial = shaderMaterial({ uPositionTexture: null, uTargetColorTexture: null }, particleShader.vertexShader, particleShader.fragmentShader)
extend({ SimulationMaterial, ParticlesMaterial })

export function DroneShowSimulation() {
  // --- 1. SETUP: All hooks are called at the top level, unconditionally. ---
  const { gl } = useThree()
  const data = useDroneShowData()
  const particlesMatRef = useRef()
  const [currentFormation, setCurrentFormation] = useState(0)

  // Leva controls for real-time tweaking
  const { repulsionRadius, repulsionStrength } = useControls('Drone Physics', {
    repulsionRadius: { value: 0.5, min: 0, max: 5.0 },
    repulsionStrength: { value: 0.2, min: 0, max: 2.0 },
  })
  useControls('Phase 2: Choreography', {
    Grid: button(() => setCurrentFormation(0)),
    Sphere: button(() => setCurrentFormation(1)),
  })

  // --- 2. GPGPU ENGINE SETUP: The Correct and Legal Way ---
  // Create the simulation material ONCE.
  const simMaterial = useMemo(() => new SimulationMaterial(), [])

  // Call useFBO at the top level to create our buffers. THIS IS LEGAL.
  const fboA = useFBO(SIZE, SIZE, { type: THREE.FloatType })
  const fboB = useFBO(SIZE, SIZE, { type: THREE.FloatType })

  // Use a ref to hold our simulation state object. The ref is stable. THIS IS LEGAL.
  const fbos = useRef({
    read: fboA,
    write: fboB,
    swap: function () {
      const t = this.read
      this.read = this.write
      this.write = t
    },
  })

  // The helper scene to run the simulation is also created once.
  const simScene = useMemo(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial)
    scene.add(mesh)
    return { scene, camera }
  }, [simMaterial])

  // --- 3. SEEDING THE SIMULATION: The "On Mount" Logic ---
  // This useEffect runs ONCE when the `data` is ready. It correctly seeds the FBOs.
  useEffect(() => {
    if (data) {
      const { scene, camera } = simScene
      // Use a temporary material to render the initial positions into both buffers
      const initialMaterial = new THREE.MeshBasicMaterial({ map: data.initialPositionTexture })
      scene.children[0].material = initialMaterial

      gl.setRenderTarget(fbos.current.read)
      gl.render(scene, camera)
      gl.setRenderTarget(fbos.current.write)
      gl.render(scene, camera)
      gl.setRenderTarget(null)

      // Restore the actual simulation material for the main loop
      scene.children[0].material = simMaterial
      initialMaterial.dispose()
    }
  }, [data, gl, simScene, fbos, simMaterial])

  // --- 4. THE FRAME LOOP: The Pure Simulation ---
  useFrame(() => {
    // Don't run until our data is loaded and the FBOs have been seeded.
    if (!data) return

    const fbo = fbos.current

    // Update uniforms
    simMaterial.uniforms.uPositionTexture.value = fbo.read.texture
    simMaterial.uniforms.uTargetPositionTexture.value = data.formations[currentFormation].positionTexture
    simMaterial.uniforms.uRepulsionRadius.value = repulsionRadius
    simMaterial.uniforms.uRepulsionStrength.value = repulsionStrength

    // Run simulation, writing new positions to the 'write' buffer
    gl.setRenderTarget(fbo.write)
    gl.render(simScene.scene, simScene.camera)

    // Update visible particles with the new state from the 'write' buffer
    particlesMatRef.current.uniforms.uPositionTexture.value = fbo.write.texture
    particlesMatRef.current.uniforms.uTargetColorTexture.value = data.formations[currentFormation].colorTexture

    // Swap for the next frame
    fbo.swap()

    gl.setRenderTarget(null)
  })

  if (!data) return null

  // The JSX is clean and correct.
  return (
    <points>
      <primitive object={data.particleGeometry} />
      <particlesMaterial ref={particlesMatRef} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}
