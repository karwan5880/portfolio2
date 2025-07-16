'use client'

import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Preload the model so it's ready when the component mounts
useGLTF.preload('/asteroid.glb')

export function AsteroidBelt() {
  const beltRef = useRef()

  // Load the GLB model
  const { nodes } = useGLTF('/asteroid.glb')
  // Find the geometry and material from the loaded model
  const asteroidGeometry = nodes.rock.geometry // Adjust 'rock' to the name of the mesh in your model
  const asteroidMaterial = nodes.rock.material

  // We use useMemo to create the instance data only once
  const asteroids = useMemo(() => {
    const temp = []
    for (let i = 0; i < 500; i++) {
      // Define the radius of the belt
      const radius = Math.random() * 1.5 + 3.5 // Random radius between 3.5 and 5.0
      const angle = Math.random() * Math.PI * 2

      // Position in a flat ring (on the XY plane)
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      // Add some random vertical spread
      const y = (Math.random() - 0.5) * 0.3

      // Random rotation and scale for each asteroid
      const rotation = new THREE.Euler(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      const scale = Math.random() * 0.2 + 0.1

      temp.push({ position: [x, y, z], rotation, scale })
    }
    return temp
  }, [])

  // Animate the entire belt's rotation
  useFrame((state, delta) => {
    if (beltRef.current) {
      beltRef.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group ref={beltRef}>
      {/* The InstancedMesh component */}
      <instancedMesh args={[asteroidGeometry, asteroidMaterial, asteroids.length]}>
        {asteroids.map((props, i) => (
          // In a real InstancedMesh setup, you'd use dummy objects and matrices,
          // but for simplicity and to show a more declarative approach, we can
          // create a helper component to set the instance properties.
          <AsteroidInstance key={i} {...props} />
        ))}
      </instancedMesh>
    </group>
  )
}

// A simple helper component to set the transform of each instance
function AsteroidInstance({ position, rotation, scale }) {
  const ref = useRef()

  // This is a placeholder to illustrate the concept.
  // The correct, performant way uses a dummy object and matrix updates.
  // For R3F, we'd typically manage this in the main component's useFrame.
  // Let's correct this to the performant approach.
  return null // The logic will be moved up.
}

// --- LET'S REWRITE THIS THE PERFORMANT R3F WAY ---
export function AsteroidBelt_Correct() {
  const instancedMeshRef = useRef()
  const beltRef = useRef()

  const { nodes } = useGLTF('/asteroid.glb')
  const asteroidGeometry = nodes.rock.geometry
  const asteroidMaterial = nodes.rock.material
  asteroidMaterial.roughness = 1.0 // Make them look like rough stone
  asteroidMaterial.metalness = 0.0

  // Create the transformation data only once
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

  // On the very first frame, set the transforms for each instance
  useEffect(() => {
    asteroids.forEach((asteroid, i) => {
      dummy.position.set(asteroid.x, asteroid.y, asteroid.z)
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI)
      dummy.scale.setScalar(Math.random() * 0.2 + 0.1)
      dummy.updateMatrix()
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
    })
    instancedMeshRef.current.instanceMatrix.needsUpdate = true
  }, [])

  // Animate the whole group
  useFrame((state, delta) => {
    if (beltRef.current) {
      beltRef.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group ref={beltRef}>
      <instancedMesh ref={instancedMeshRef} args={[asteroidGeometry, asteroidMaterial, asteroids.length]} />
    </group>
  )
}
