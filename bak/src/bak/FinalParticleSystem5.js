'use client'

import { shaderMaterial, useTexture } from '@react-three/drei'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
// import { MeshSurfaceSampler } from 'three/examples/jsm/utils/MeshSurfaceSampler.js'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { ParticleShader } from './shader'

const ParticlesMaterial = shaderMaterial(
  //   { uTime: 0, uGridSize: 16.0 }, //
  //   { uTime: 0, uGridSize: 16.0, uFlyUpHeight: 25.0, uScale: 1.0 }, // Default scale is 1.0
  //   { uTime: 0, uGridSize: 16.0, uFlyUpHeight: 25.0, uScale: 1.0, uSceneSize: 0.0 },
  {
    uTime: 0, //
    uGridSize: 16.0,
    uFlyUpHeight: 25.0,
    uScale: 1.0,
    uMorphProgress: 0.0,
    uSplitLevel: 0.0,
    uHeartbeatDuration: 4.0,
    uTextPositions: null, // The texture will be passed here
    uMasterProgress: 0.0, // Our new master timeline control
    uFlightDuration: 5.0, // Default duration of 5 seconds
  },
  ParticleShader.vertexShader,
  ParticleShader.fragmentShader
)
extend({ ParticlesMaterial })

export function FinalParticleSystem({ scale = 1.0, sceneSize = 0.0, heartbeatDuration = 4.0, flightDuration = 5.0 }) {
  const matRef = useRef()
  const flyUpHeight = 25

  const DRONE_COUNT = 4096

  //   const textPositionsTexture = <TextBlueprint scale={scale} droneCount={DRONE_COUNT} />
  //   const font = useLoader(FontLoader, '/helvetiker_regular.typeface.json')
  //   const font = useLoader(FontLoader, '/ma_shan_zheng_regular.json')
  //   const font = useLoader(FontLoader, '/yuji_mai_regular.json')
  //   const font = useLoader(FontLoader, '/yuji_boku_regular.json') // this one good, not bad.
  const font = useLoader(FontLoader, '/noto_sans_jp_regular.json') // this one good, not bad.

  const textPositionsTexture = useMemo(() => {
    if (!font) return null // Safety check

    // const geometry = new TextGeometry('FINALE', {
    // const geometry = new TextGeometry('T H A N K  Y O U', {
    const geometry = new TextGeometry(' T H A N K  Y O U', {
      font: font,
      size: 15.0 * scale,
      height: 2.0 * scale,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.5 * scale,
      bevelSize: 0.3 * scale,
      bevelOffset: 0,
      bevelSegments: 5,
    })
    geometry.center()

    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geometry)).build()
    const positions = new Float32Array(DRONE_COUNT * 4)
    const tempPosition = new THREE.Vector3()

    for (let i = 0; i < DRONE_COUNT; i++) {
      sampler.sample(tempPosition)
      positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
    }

    const texture = new THREE.DataTexture(positions, Math.sqrt(DRONE_COUNT), Math.sqrt(DRONE_COUNT), THREE.RGBAFormat, THREE.FloatType)
    texture.needsUpdate = true
    return texture
  }, [font, scale])

  //   const { particleGeometry, gridSize } = useMemo(() => {
  //     const GRID_SIZE = 16
  //     const DRONE_COUNT = GRID_SIZE * GRID_SIZE * GRID_SIZE
  //     const ids = new Float32Array(DRONE_COUNT)
  //     for (let i = 0; i < DRONE_COUNT; i++) {
  //       ids[i] = i
  //     }
  //     const geometry = new THREE.BufferGeometry()
  //     geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))
  //     geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))
  //     return { particleGeometry: geometry, gridSize: GRID_SIZE }
  //   }, [])

  const particleGeometry = useMemo(() => {
    // ... this part for creating the `a_id` buffer is unchanged ...
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) {
      ids[i] = i
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('a_id', new THREE.BufferAttribute(ids, 1))
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))
    return { particleGeometry: geometry }
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = time

    // We now have a timeline from 0.0 to 3.0
    let masterProgress = 0.0
    // let t1 = 45.0
    let t1 = 10.0
    if (time > t1) {
      // Cube to Sphere
      masterProgress = Math.min(1.0, (time - t1) / 5.0)
    }
    // let t2 = 55.0
    let t2 = 15.0
    if (time > t2) {
      // Sphere to FINALE Text
      masterProgress = 1.0 + Math.min(1.0, (time - t2) / 5.0)
    }
    matRef.current.uniforms.uMasterProgress.value = masterProgress

    // // --- Animation Timeline ---
    // // Stage 1: Fly up and form cube (0s - 10s)
    // const morphProgress = THREE.MathUtils.smoothstep(time, 10.0, 15.0)
    // matRef.current.uniforms.uMorphProgress.value = morphProgress
    // // Stage 2: Recursive Splitting (starts at 15s)
    // let splitLevel = 0.0
    // if (time > 15.0) {
    //   // Every 5 seconds, increase the split level by 1.
    //   // The `min` caps it at 4 (16 spheres) to avoid splitting too much.
    //   splitLevel = Math.min(4.0, (time - 15.0) / 10.0)
    //   //   splitLevel = Math.min(4.0, (time - 15.0) / 5.0)
    // }
    // matRef.current.uniforms.uSplitLevel.value = splitLevel
  })

  return (
    <points>
      <primitive object={particleGeometry.particleGeometry} />
      <particlesMaterial
        ref={matRef} //
        uScale={scale}
        uTextPositions={textPositionsTexture}
        uFlightDuration={flightDuration}
        // uGridSize={particleGeometry.gridSize}
        // uSceneSize={sceneSize}
        // uHeartbeatDuration={heartbeatDuration}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending} //
      />
    </points>
  )
}
