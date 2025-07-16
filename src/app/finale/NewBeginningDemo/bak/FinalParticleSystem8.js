'use client'

import { shaderMaterial, useGLTF } from '@react-three/drei'
import { Html } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { FinalInstancedShader } from './finalInstancedShader.js'

// const FinalInstancedMaterial = extend({
//   ...FinalInstancedShader,
// })

const FinalInstancedMaterial = shaderMaterial(
  {
    // Uniforms
    uTime: 0,
    uScale: 1.0,
    uMasterProgress: 0.0,
  },
  FinalInstancedShader.vertexShader,
  FinalInstancedShader.fragmentShader
)
// // This line registers our custom material with R3F, making it usable as a JSX tag
// extend({ FinalInstancedMaterial })

function useManualGLTF(path) {
  const [modelScene, setModelScene] = useState(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      path,
      // This is the success callback
      (gltf) => {
        console.log('Manual GLTF load successful!')
        setModelScene(gltf.scene)
      },
      // This is the progress callback (optional)
      undefined,
      // This is the error callback
      (error) => {
        console.error('An error happened during manual GLTF load:', error)
      }
    )
  }, [path]) // This effect runs only once when the path changes

  return modelScene
}

export function FinalParticleSystem({ scale = 1.0 }) {
  const meshRef = useRef()
  const matRef = useRef()

  const DRONE_COUNT = 4096
  const scene = useManualGLTF('/drone/drone_low_poly.glb')

  const droneGeometry = useMemo(() => {
    if (!scene) return null

    console.log('Processing low-poly drone model...')
    const geometriesToMerge = []

    scene.traverse((child) => {
      if (child.isMesh) {
        const cleanGeometry = new THREE.BufferGeometry()
        cleanGeometry.setAttribute('position', child.geometry.getAttribute('position').clone())
        cleanGeometry.applyMatrix4(child.matrixWorld)
        geometriesToMerge.push(cleanGeometry)
      }
    })

    if (geometriesToMerge.length === 0) {
      console.error('No geometries found in the low-poly model!')
      return null
    }

    const merged = mergeGeometries(geometriesToMerge, false)

    if (merged) {
      merged.center()
      // Adjust the scale if needed. Let's make them a bit bigger than the boxes.
      merged.scale(8.4, 8.4, 8.4)
    }

    console.log('Low-poly drone model processed successfully.')
    return merged
  }, [scene])

  // // 4. We now create the `a_id` attribute ONCE and attach it to the geometry.
  // useEffect(() => {
  //   if (!droneGeometry || !meshRef.current) return
  //   const ids = new Float32Array(DRONE_COUNT)
  //   for (let i = 0; i < DRONE_COUNT; i++) {
  //     ids[i] = i
  //   }
  //   // Attach the IDs as an instanced attribute
  //   meshRef.current.geometry.setAttribute('a_id', new THREE.InstancedBufferAttribute(ids, 1))
  // }, [droneGeometry])

  // // // This hook runs once after the component mounts.
  // // // It calculates the position for each box and sets its matrix.
  // useEffect(() => {
  //   if (!meshRef.current || !droneGeometry) return
  //   console.log('Setting up static cube of boxes...')
  //   const tempObject = new THREE.Object3D()
  //   for (let i = 0; i < DRONE_COUNT; i++) {
  //     const gridSize = 16.0
  //     const layer = Math.floor(i / (gridSize * gridSize))
  //     const row = Math.floor((i % (gridSize * gridSize)) / gridSize)
  //     const col = i % gridSize
  //     // Simple cube position logic
  //     const position = new THREE.Vector3((col - (gridSize - 1.0) / 2.0) * 50.0, (row - (gridSize - 1.0) / 2.0) * 50.0, (layer - (gridSize - 1.0) / 2.0) * 50.0)
  //     tempObject.position.copy(position)
  //     tempObject.updateMatrix()
  //     meshRef.current.setMatrixAt(i, tempObject.matrix)
  //   }
  //   // Crucial: tell the instancedMesh to update
  //   meshRef.current.instanceMatrix.needsUpdate = true
  //   console.log('Static cube setup complete.')
  // }, [droneGeometry]) // The empty array ensures this runs only once.

  useEffect(() => {
    if (!meshRef.current || !droneGeometry) return
    const tempObject = new THREE.Object3D()
    for (let i = 0; i < DRONE_COUNT; i++) {
      const gridSize = 16.0
      const layer = Math.floor(i / (gridSize * gridSize))
      const row = Math.floor((i % (gridSize * gridSize)) / gridSize)
      const col = i % gridSize
      const position = new THREE.Vector3((col - 7.5) * 50.0, (row - 7.5) * 50.0, (layer - 7.5) * 50.0)

      // We apply the overall scene scale here
      position.multiplyScalar(scale)

      tempObject.position.copy(position)
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [droneGeometry, scale])

  // // 5. The frame loop is now simple again! It only updates timers.
  // useFrame((state) => {
  //   const time = state.clock.getElapsedTime()
  //   if (!matRef.current) return
  //   matRef.current.uniforms.uTime.value = time
  //   let masterProgress = 0.0
  //   if (time > 45.0) {
  //     // After 15s, start Cube to Sphere morph
  //     masterProgress = Math.min(1.0, (time - 45.0) / 5.0)
  //   }
  //   // We can add more stages here later if we want!
  //   matRef.current.uniforms.uMasterProgress.value = masterProgress
  // })

  // Don't render anything until the geometry has been processed.
  if (!droneGeometry) {
    return (
      <Html center>
        <div style={{ color: 'white', fontSize: '1.5rem' }}>Processing Drone Model...</div>
      </Html>
    )
  }

  return (
    // We render an instancedMesh using a built-in box geometry.
    // This has NO external dependencies.
    <instancedMesh ref={meshRef} args={[droneGeometry, null, DRONE_COUNT]}>
      {/* <boxGeometry args={[10, 10, 10]} /> */}
      <meshStandardMaterial color="lawngreen" />
      {/* <FinalInstancedMaterial ref={matRef} uScale={scale} /> */}
      {/* <primitive
        ref={matRef}
        object={new FinalInstancedMaterial()}
        attach="material"
        uniforms-uScale-value={scale} // We pass uniforms this way now
      /> */}
    </instancedMesh>
  )
}
