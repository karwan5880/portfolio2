'use client'

import { shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
// import { MeshSurfaceSampler } from 'three/examples/jsm/utils/MeshSurfaceSampler.js'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { ParticleShader } from './shader'
import { InstancedParticleShader } from './shader'

const InstancedParticlesMaterial = shaderMaterial({ uTime: 0 }, InstancedParticleShader.vertexShader, InstancedParticleShader.fragmentShader)
extend({ InstancedParticlesMaterial })

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
  const meshRef = useRef()

  const flyUpHeight = 25

  const DRONE_COUNT = 4096

  // const { scene } = useGLTF('/drone/scene.gltf')
  const { scene } = useGLTF('/drone/drone_low.glb')
  const droneGeometry = useMemo(() => {
    console.log('Starting advanced model processing...')
    const geometriesToMerge = []
    scene.traverse((child) => {
      if (child.isMesh) {
        // --- THE ATTRIBUTE NORMALIZER ---
        // 1. Get the original geometry
        const originalGeometry = child.geometry
        // 2. Create a NEW, clean geometry
        const cleanGeometry = new THREE.BufferGeometry()
        // 3. ONLY copy the 'position' attribute. We ignore normals, uvs, etc.
        // This ensures every piece we merge is identical in structure.
        cleanGeometry.setAttribute('position', originalGeometry.getAttribute('position').clone())
        // 4. Apply the world matrix to this new, clean geometry
        cleanGeometry.applyMatrix4(child.matrixWorld)
        geometriesToMerge.push(cleanGeometry)
      }
    })
    if (geometriesToMerge.length === 0) {
      console.error('No geometries found to merge!')
      return null // Return null if nothing was found
    }
    // 5. Merge our new array of perfectly uniform geometries
    const mergedGeometry = mergeGeometries(geometriesToMerge, false)
    // Safety check before centering
    if (mergedGeometry === null) {
      console.error('Merge failed, resulting in null geometry.')
      return new THREE.BoxGeometry(1, 1, 1) // Return a fallback
    }
    mergedGeometry.center()
    mergedGeometry.scale(0.1, 0.1, 0.1)
    console.log('Model processing complete.')
    return mergedGeometry
  }, [scene])

  const particleIds = useMemo(() => {
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) {
      ids[i] = i
    }
    return ids
  }, [DRONE_COUNT])

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

  // ========================================================================
  // --- 4. THE NEW ANIMATION LOGIC (ON THE CPU) ---
  // ========================================================================
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (!meshRef.current) return
    // We'll create temporary objects to work with
    const tempMatrix = new THREE.Matrix4()
    const tempObject = new THREE.Object3D()
    for (let i = 0; i < DRONE_COUNT; i++) {
      // --- Calculate target positions (this logic is moved from the shader) ---
      // We'll simplify for now and just do the cube formation.
      const id = particleIds[i]
      const gridSize = 16.0
      const layer = Math.floor(id / (gridSize * gridSize))
      const row = Math.floor((id % (gridSize * gridSize)) / gridSize)
      const col = id % gridSize
      const endPos = new THREE.Vector3((col - (gridSize - 1.0) / 2.0) * 30.0, (row - (gridSize - 1.0) / 2.0) * 30.0, (layer - (gridSize - 1.0) / 2.0) * 30.0)
      endPos.y += 250.0 // Fly-up height
      // --- Set the object's position ---
      tempObject.position.copy(endPos)
      tempObject.updateMatrix()
      // --- Apply the matrix to the instance ---
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }
    // CRITICAL: Update the instance mesh
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  //   useFrame((state) => {
  //     const time = state.clock.getElapsedTime()
  //     if (!matRef.current) return
  //     matRef.current.uniforms.uTime.value = time
  //     let masterProgress = 0.0
  //     // let t1 = 45.0
  //     let t1 = 10.0
  //     if (time > t1) {
  //       // Cube to Sphere
  //       masterProgress = Math.min(1.0, (time - t1) / 5.0)
  //     }
  //     // let t2 = 55.0
  //     let t2 = 15.0
  //     if (time > t2) {
  //       // Sphere to FINALE Text
  //       masterProgress = 1.0 + Math.min(1.0, (time - t2) / 5.0)
  //     }
  //     matRef.current.uniforms.uMasterProgress.value = masterProgress
  //   })

  return (
    // <instancedMesh ref={meshRef} args={[droneGeometry, null, DRONE_COUNT]}>
    <instancedMesh ref={meshRef} key={droneGeometry.uuid} args={[droneGeometry, null, DRONE_COUNT]}>
      <instancedParticlesMaterial ref={matRef} />
    </instancedMesh>
    // <points>
    //   <primitive object={particleGeometry.particleGeometry} />
    //   <particlesMaterial
    //     ref={matRef} //
    //     uScale={scale}
    //     uTextPositions={textPositionsTexture}
    //     uFlightDuration={flightDuration}
    //     // uGridSize={particleGeometry.gridSize}
    //     // uSceneSize={sceneSize}
    //     // uHeartbeatDuration={heartbeatDuration}
    //     transparent={true}
    //     depthWrite={false}
    //     blending={THREE.AdditiveBlending} //
    //   />
    // </points>
  )
}
