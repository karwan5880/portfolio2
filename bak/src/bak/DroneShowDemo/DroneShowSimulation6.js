'use client'

import { shaderMaterial, useFBO } from '@react-three/drei'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { button, useControls } from 'leva'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { choreography } from './choreography'
import { ParticlesMaterial as particleShader } from './shaders/particles'
import { SimulationMaterial as simShader } from './shaders/simulation'
import { useDroneShowData } from './useDroneShowData'

const TEXTURE_SIZE = 64

const SimulationMaterial = shaderMaterial({ uPositionTexture: null, uTargetPositionTexture: null, uDroneInfoTexture: null, uTime: 0, uRepulsionRadius: 0.5, uRepulsionStrength: 0.2 }, simShader.vertexShader, simShader.fragmentShader)
// const SimulationMaterial = shaderMaterial({ uPositionTexture: null, uTargetPositionTexture: null, uDroneInfoTexture: null, uTime: 0, uRepulsionRadius: 0.5, uRepulsionStrength: 0.2 }, simShader.vertexShader, simShader.fragmentShader)
// const SimulationMaterial = shaderMaterial({ uPositionTexture: null, uTargetPositionTexture: null, uRepulsionRadius: 0.5, uRepulsionStrength: 0.2 }, simShader.vertexShader, simShader.fragmentShader)
const ParticlesMaterial = shaderMaterial({ uPositionTexture: null, uTargetColorTexture: null }, particleShader.vertexShader, particleShader.fragmentShader)
extend({ SimulationMaterial, ParticlesMaterial })

export function DroneShowSimulation() {
  const { gl } = useThree()
  const data = useDroneShowData()
  const particlesMatRef = useRef()
  const [currentFormation, setCurrentFormation] = useState(choreography.formations.GRID.index)

  const { repulsionRadius, repulsionStrength } = useControls('Drone Physics', {
    repulsionRadius: { value: 0.5, min: 0, max: 5.0 },
    repulsionStrength: { value: 0.2, min: 0, max: 2.0 },
  })
  useControls(
    'Phase 2: Choreography',
    () => {
      const buttons = {}
      Object.values(choreography.formations).forEach((f) => {
        buttons[f.name] = button(() => setCurrentFormation(f.index))
      })
      return buttons
    },
    []
  )

  const simMaterial = useMemo(() => new SimulationMaterial(), [])
  const fboA = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, { type: THREE.FloatType })
  const fboB = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, { type: THREE.FloatType })
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

  // const { camera } = useThree()
  // useEffect(() => {
  //   // --- DIAGNOSTIC: Force the camera to a guaranteed viewpoint ---
  //   camera.position.set(100, 100, 100)
  //   camera.lookAt(0, 0, 0)
  // }, [camera])

  useFrame((state) => {
    if (!data) return
    const fbo = fbos.current
    gl.setRenderTarget(fbo.write)

    simMaterial.uniforms.uTime.value = state.clock.getElapsedTime()
    simMaterial.uniforms.uDroneInfoTexture.value = data.droneInfoTexture

    simMaterial.uniforms.uPositionTexture.value = fbo.read.texture
    simMaterial.uniforms.uTargetPositionTexture.value = data.formations[currentFormation].positionTexture
    simMaterial.uniforms.uRepulsionRadius.value = repulsionRadius
    simMaterial.uniforms.uRepulsionStrength.value = repulsionStrength
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
