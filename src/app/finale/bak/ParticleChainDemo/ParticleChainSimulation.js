'use client'

import { shaderMaterial, useFBO } from '@react-three/drei'
// Import useThree to get access to the WebGL renderer
import { extend, useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
// Import useEffect
import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

import { ParticlesMaterial as particleShader } from './shaders/particles'
import { SimulationMaterial as simShader } from './shaders/simulation'

const SIZE = 256

// --- Shaders and extend() remain the same ---
const SimulationMaterial = shaderMaterial({ uPositionTexture: null, uTime: 0, uSpawnRate: 1.0, uFollowDistance: 0.2, uFollowStrength: 0.05, uNoiseSpeed: 0.4, uNoiseStrength: 3.0 }, simShader.vertexShader, simShader.fragmentShader)
const ParticlesMaterial = shaderMaterial({ uPositionTexture: null, uTime: 0, uSpawnRate: 1.0, uFadeInTime: 2.0 }, particleShader.vertexShader, particleShader.fragmentShader)
extend({ SimulationMaterial, ParticlesMaterial })

export function ParticleChainSimulation() {
  // All hooks must be called at the top, unconditionally
  const { gl } = useThree() // Get the renderer
  const simulationMaterial = useRef()
  const particlesMaterial = useRef()

  const { spawnRate, followDistance, followStrength, noiseSpeed, noiseStrength } = useControls('Chain Behavior', {
    spawnRate: { value: 0.01, min: 0.005, max: 1.0, step: 0.005, label: 'Spawn Interval' },
    followDistance: { value: 0.2, min: 0.01, max: 2.0, step: 0.01, label: 'Follow Distance' },
    followStrength: { value: 0.05, min: 0.01, max: 0.5, step: 0.01, label: 'Follow Strength' },
    noiseSpeed: { value: 0.4, min: 0.1, max: 2.0, step: 0.05, label: 'Head Speed' },
    noiseStrength: { value: 3.0, min: 0.5, max: 10.0, step: 0.1, label: 'Head Wander' },
  })

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
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
    scene.add(mesh)
    return { scene, camera, mesh }
  }, [])

  // --- START OF THE FIX: The Reset Logic ---

  // We need a simple scene with a material that just renders black (0,0,0,0)
  const clearScene = useMemo(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({
        fragmentShader: 'void main() { gl_FragColor = vec4(0.0); }',
      })
    )
    scene.add(mesh)
    return { scene, camera }
  }, [])

  // This useEffect will run once on mount (and after remount in Strict Mode)
  useEffect(() => {
    // Manually render our 'clear' scene into BOTH FBOs to reset them.
    gl.setRenderTarget(fbos.current.read)
    gl.render(clearScene.scene, clearScene.camera)
    gl.setRenderTarget(fbos.current.write)
    gl.render(clearScene.scene, clearScene.camera)
    gl.setRenderTarget(null)
  }, [gl, clearScene]) // Dependencies

  // --- END OF THE FIX ---

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const uvs = new Float32Array(SIZE * SIZE * 2)
    const ids = new Float32Array(SIZE * SIZE)
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = i * SIZE + j
        uvs[k * 2 + 0] = i / (SIZE - 1)
        uvs[k * 2 + 1] = j / (SIZE - 1)
        ids[k] = k
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SIZE * SIZE * 3), 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))
    return geometry
  }, [])

  useFrame((state, delta) => {
    // The useFrame logic can now remain the same
    if (!simulationMaterial.current || !particlesMaterial.current) {
      return
    }

    const fbo = fbos.current
    const time = state.clock.getElapsedTime()

    simScene.mesh.material = simulationMaterial.current
    const simUniforms = simulationMaterial.current.uniforms
    simUniforms.uTime.value = time
    simUniforms.uPositionTexture.value = fbo.read.texture
    simUniforms.uSpawnRate.value = spawnRate
    simUniforms.uFollowDistance.value = followDistance
    simUniforms.uFollowStrength.value = followStrength
    simUniforms.uNoiseSpeed.value = noiseSpeed
    simUniforms.uNoiseStrength.value = noiseStrength

    gl.setRenderTarget(fbo.write)
    gl.render(simScene.scene, simScene.camera)
    gl.setRenderTarget(null)
    fbo.swap()

    particlesMaterial.current.uniforms.uTime.value = time
    particlesMaterial.current.uniforms.uPositionTexture.value = fbo.read.texture
    particlesMaterial.current.uniforms.uSpawnRate.value = spawnRate
  })

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
