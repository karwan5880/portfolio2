// BoidsDemo.js
'use client'

import { OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// BoidsDemo.js

// BoidsDemo.js

// BoidsDemo.js

// BoidsDemo.js

// --- Configuration ---
const config = {
  boidCount: 200,
  maxSpeed: 0.5,
  maxForce: 0.03,
  perceptionRadius: 5,
  separationWeight: 1.5,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  bounds: 20, // The size of the box the boids are constrained to
}

// A temporary object to avoid creating new THREE objects in the loop
const dummy = new THREE.Object3D()

function Boids() {
  const meshRef = useRef()

  // 1. Initialize the boids' data
  // We use useMemo to ensure this array is created only once.
  const boids = useMemo(() => {
    const boidData = []
    for (let i = 0; i < config.boidCount; i++) {
      boidData.push({
        position: new THREE.Vector3((Math.random() - 0.5) * config.bounds, (Math.random() - 0.5) * config.bounds, (Math.random() - 0.5) * config.bounds),
        velocity: new THREE.Vector3().randomDirection().setLength(Math.random() * config.maxSpeed),
        acceleration: new THREE.Vector3(),
      })
    }
    return boidData
  }, [])

  useFrame((state, delta) => {
    if (!meshRef.current) return

    // These vectors are reused in the loop to avoid allocations
    const separation = new THREE.Vector3()
    const alignment = new THREE.Vector3()
    const cohesion = new THREE.Vector3()

    // 2. The main Boids algorithm loop
    for (const boid of boids) {
      // Reset forces for this boid
      separation.set(0, 0, 0)
      alignment.set(0, 0, 0)
      cohesion.set(0, 0, 0)
      let perceptionCount = 0

      // A. Find all neighbors within the perception radius
      for (const other of boids) {
        const distance = boid.position.distanceTo(other.position)
        if (other !== boid && distance < config.perceptionRadius) {
          // Rule 1: Separation - Steer to avoid crowding local flockmates.
          const diff = new THREE.Vector3().subVectors(boid.position, other.position)
          diff.divideScalar(distance * distance) // Weight by distance (closer = stronger)
          separation.add(diff)

          // Rule 2: Alignment - Steer towards the average heading of local flockmates.
          alignment.add(other.velocity)

          // Rule 3: Cohesion - Steer to move toward the average position of local flockmates.
          cohesion.add(other.position)

          perceptionCount++
        }
      }

      // B. Calculate the steering force from each rule if neighbors were found
      if (perceptionCount > 0) {
        // Finalize alignment vector
        alignment.divideScalar(perceptionCount)
        alignment.setLength(config.maxSpeed)
        alignment.sub(boid.velocity)
        alignment.clampLength(0, config.maxForce)

        // Finalize cohesion vector
        cohesion.divideScalar(perceptionCount)
        cohesion.sub(boid.position)
        cohesion.setLength(config.maxSpeed)
        cohesion.sub(boid.velocity)
        cohesion.clampLength(0, config.maxForce)

        // Finalize separation vector
        separation.divideScalar(perceptionCount)
        separation.setLength(config.maxSpeed)
        separation.sub(boid.velocity)
        separation.clampLength(0, config.maxForce)
      }

      // C. Apply the weighted forces to the boid's acceleration
      boid.acceleration.add(alignment.multiplyScalar(config.alignmentWeight))
      boid.acceleration.add(cohesion.multiplyScalar(config.cohesionWeight))
      boid.acceleration.add(separation.multiplyScalar(config.separationWeight))
    }

    // 3. Update physics and matrix for each boid
    for (let i = 0; i < boids.length; i++) {
      const boid = boids[i]

      // D. Keep boids within the bounds
      if (boid.position.length() > config.bounds) {
        const boundaryForce = boid.position.clone().negate().normalize().multiplyScalar(0.1)
        boid.acceleration.add(boundaryForce)
      }

      // E. Update physics
      boid.velocity.add(boid.acceleration)
      boid.velocity.clampLength(0, config.maxSpeed)
      boid.position.add(boid.velocity.clone().multiplyScalar(delta * 60)) // Delta compensated
      boid.acceleration.set(0, 0, 0) // Reset acceleration for next frame

      // F. Update the InstancedMesh matrix
      dummy.position.copy(boid.position)
      // Point the cone in the direction of its velocity
      dummy.lookAt(boid.position.clone().add(boid.velocity))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }

    // 4. Tell Three.js to update the instance matrix
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  // We use InstancedMesh for performance, rendering all boids in a single draw call.
  return (
    <instancedMesh ref={meshRef} args={[null, null, config.boidCount]}>
      <coneGeometry args={[0.1, 0.5, 8]} />
      <meshStandardMaterial color="#2d7f9d" />
    </instancedMesh>
  )
}

// The main component that sets up the scene
export default function BoidsDemo() {
  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#fff' }}>
      <Canvas camera={{ position: [0, 0, 35] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Boids />
        {/* Optional: A wireframe box to visualize the bounds */}
        <mesh>
          <boxGeometry args={[config.bounds * 2, config.bounds * 2, config.bounds * 2]} />
          <meshBasicMaterial color="red" wireframe={true} />
        </mesh>
        <OrbitControls />
      </Canvas>
    </div>
  )
}
