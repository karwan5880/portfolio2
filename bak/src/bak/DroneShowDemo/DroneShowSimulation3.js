'use client'

import { shaderMaterial, useFBO } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
// Import folder instead of 'leva' directly to get button
import { button, folder, useControls } from 'leva'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { choreography } from './choreography'
// Import our master list

import { ParticlesMaterial as particleShader } from './shaders/particles'
import { SimulationMaterial as simShader } from './shaders/simulation'
import { useDroneShowData } from './useDroneShowData'

// DroneShowDemo/DroneShowSimulation.js --- REFACTORED

const SIZE = 64

const SimulationMaterial = shaderMaterial({ uPositionTexture: null, uTargetPositionTexture: null, uRepulsionRadius: 0.5, uRepulsionStrength: 0.2 }, simShader.vertexShader, simShader.fragmentShader)
const ParticlesMaterial = shaderMaterial({ uPositionTexture: null, uTargetColorTexture: null }, particleShader.vertexShader, particleShader.fragmentShader)
extend({ SimulationMaterial, ParticlesMaterial })

export function DroneShowSimulation() {
  const { gl } = useThree()
  const data = useDroneShowData()
  const particlesMatRef = useRef()
  const [currentFormation, setCurrentFormation] = useState(choreography.GRID.index)

  const { repulsionRadius, repulsionStrength } = useControls('Drone Physics', {
    repulsionRadius: { value: 0.5, min: 0, max: 5.0 },
    repulsionStrength: { value: 0.2, min: 0, max: 2.0 },
  })

  // --- DYNAMIC UI CONTROLS ---
  // This hook now generates the buttons automatically from our choreography object.
  // To add a new button, we just update choreography.js.
  useControls(
    'Phase 2: Choreography',
    () => {
      const buttons = {}
      Object.values(choreography).forEach((formation) => {
        buttons[formation.name] = button(() => setCurrentFormation(formation.index))
      })
      return buttons
    },
    [choreography]
  )

  const simMaterial = useMemo(() => new SimulationMaterial(), [])
  const fboA = useFBO(SIZE, SIZE, { type: THREE.FloatType })
  const fboB = useFBO(SIZE, SIZE, { type: THREE.FloatType })
  const fbos = useRef({
    read: fboA,
    write: fboB,
    swap: function () {
      const t = this.read
      this.read = this.write
      this.write = t
    },
  })
  const simScene = useMemo(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), simMaterial)
    scene.add(mesh)
    return { scene, camera }
  }, [simMaterial])

  useEffect(() => {
    if (data) {
      const { scene, camera } = simScene
      const initialMaterial = new THREE.MeshBasicMaterial({ map: data.initialPositionTexture })
      scene.children[0].material = initialMaterial
      gl.setRenderTarget(fbos.current.read)
      gl.render(scene, camera)
      gl.setRenderTarget(fbos.current.write)
      gl.render(scene, camera)
      gl.setRenderTarget(null)
      scene.children[0].material = simMaterial
      initialMaterial.dispose()
    }
  }, [data, gl, simScene, fbos, simMaterial])

  useFrame(() => {
    if (!data) return
    const fbo = fbos.current
    simMaterial.uniforms.uPositionTexture.value = fbo.read.texture
    simMaterial.uniforms.uTargetPositionTexture.value = data.formations[currentFormation].positionTexture
    simMaterial.uniforms.uRepulsionRadius.value = repulsionRadius
    simMaterial.uniforms.uRepulsionStrength.value = repulsionStrength
    gl.setRenderTarget(fbo.write)
    gl.render(simScene.scene, simScene.camera)
    particlesMatRef.current.uniforms.uPositionTexture.value = fbo.write.texture
    particlesMatRef.current.uniforms.uTargetColorTexture.value = data.formations[currentFormation].colorTexture
    fbo.swap()
    gl.setRenderTarget(null)
  })

  if (!data) return null

  return (
    <points>
      <primitive object={data.particleGeometry} />
      <particlesMaterial ref={particlesMatRef} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}
