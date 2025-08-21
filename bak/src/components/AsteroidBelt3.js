'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

useGLTF.preload('/asteroid.glb')

export function AsteroidBelt() {
  const instancedMeshRef = useRef()
  const beltRef = useRef()

  const { nodes } = useGLTF('/asteroid.glb')
  // IMPORTANT: The name 'rock' must match the name of the mesh in your .glb file!
  // Open the .glb in a viewer like https://gltf-viewer.donmccurdy.com/ to check the name.
  let asteroidGeometry = nodes.Object_2?.geometry
  let asteroidMaterial = nodes.Object_2?.material
  // if (asteroidMaterial) {
  //   asteroidMaterial.roughness = 1.0
  //   asteroidMaterial.metalness = 0.0
  // }
  if (!asteroidGeometry) {
    console.log('Fallback geometry is being used. Check your model path and node name.')
    asteroidGeometry = new THREE.SphereGeometry(1, 4, 4) // A simple, low-poly sphere
    asteroidMaterial = new THREE.MeshStandardMaterial({ color: 'gray', roughness: 1.0 })
  } else {
    // // If the model DID load, make sure its material is set
    // asteroidMaterial.roughness = 1.0
    // asteroidMaterial.metalness = 0.0
  }
  // console.log(`node: `, nodes)
  // console.log(`node.object_2: `, nodes.Object_2)

  const dummy = useMemo(() => new THREE.Object3D(), [])

  const asteroids = useMemo(() => {
    const temp = []
    for (let i = 0; i < 500; i++) {
      const radius = Math.random() * 1.5 + 3.5
      const angle = Math.random() * Math.PI * 2
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      const y = (Math.random() - 0.5) * 0.3
      temp.push({ x, y, z })
    }
    return temp
  }, [])

  useEffect(() => {
    if (!instancedMeshRef.current) return

    asteroids.forEach((asteroid, i) => {
      dummy.position.set(asteroid.x, asteroid.y, asteroid.z)
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      const masterscale = 0.01
      dummy.scale.setScalar((Math.random() * 0.2 + 0.1) * masterscale)
      dummy.updateMatrix()
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
    })
    instancedMeshRef.current.instanceMatrix.needsUpdate = true
  }, [asteroids, dummy])

  useFrame((state, delta) => {
    if (beltRef.current) {
      beltRef.current.rotation.y += delta * 0.02
    }
  })

  // Don't render anything if the model hasn't loaded its geometry yet
  if (!asteroidGeometry) return null

  return (
    <group ref={beltRef}>
      <instancedMesh ref={instancedMeshRef} args={[asteroidGeometry, asteroidMaterial, asteroids.length]} />
    </group>
  )
}
