'use client'

import { OrbitControls, Points } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useControls } from 'leva'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const NUM_BOIDS = 500
const BOUNDS = 50

// The Boid logic component
function Boids() {
  const pointsRef = useRef()

  const { separation, alignment, cohesion, radius } = useControls({
    separation: { value: 0.15, min: 0, max: 0.5, step: 0.01 },
    alignment: { value: 0.05, min: 0, max: 0.5, step: 0.01 },
    cohesion: { value: 0.01, min: 0, max: 0.5, step: 0.01 },
    radius: { value: 10, min: 1, max: 50, step: 1 },
  })

  // Initialize boids with random positions and velocities
  const boids = useMemo(() => {
    return Array.from({ length: NUM_BOIDS }, () => ({
      position: new THREE.Vector3((Math.random() - 0.5) * BOUNDS, (Math.random() - 0.5) * BOUNDS, (Math.random() - 0.5) * BOUNDS),
      velocity: new THREE.Vector3().randomDirection().setLength(0.5),
    }))
  }, [])

  const tempVec3 = new THREE.Vector3()
  const sepVec = new THREE.Vector3()
  const aliVec = new THREE.Vector3()
  const cohVec = new THREE.Vector3()

  useFrame(() => {
    if (!pointsRef.current) return

    const positions = pointsRef.current.geometry.attributes.position.array

    // The core Boids algorithm
    for (let i = 0; i < NUM_BOIDS; i++) {
      const boid = boids[i]

      sepVec.set(0, 0, 0)
      aliVec.set(0, 0, 0)
      cohVec.set(0, 0, 0)
      let neighborCount = 0

      for (let j = 0; j < NUM_BOIDS; j++) {
        if (i === j) continue
        const other = boids[j]
        const dist = boid.position.distanceTo(other.position)

        if (dist < radius) {
          neighborCount++
          // 1. Separation: Steer to avoid crowding
          tempVec3.subVectors(boid.position, other.position).normalize().divideScalar(dist)
          sepVec.add(tempVec3)

          // 2. Alignment: Steer towards the average heading
          aliVec.add(other.velocity)

          // 3. Cohesion: Steer towards the average position
          cohVec.add(other.position)
        }
      }

      if (neighborCount > 0) {
        // Average the alignment and cohesion vectors
        aliVec.divideScalar(neighborCount).sub(boid.velocity).multiplyScalar(alignment)
        cohVec.divideScalar(neighborCount).sub(boid.position).multiplyScalar(cohesion)
      }

      sepVec.multiplyScalar(separation)

      // Apply forces to velocity
      boid.velocity.add(sepVec).add(aliVec).add(cohVec)
      boid.velocity.clampLength(0, 1) // Limit speed

      // Update position
      boid.position.add(boid.velocity)

      // Handle screen wrapping
      if (boid.position.x > BOUNDS) boid.position.x = -BOUNDS
      if (boid.position.x < -BOUNDS) boid.position.x = BOUNDS
      if (boid.position.y > BOUNDS) boid.position.y = -BOUNDS
      if (boid.position.y < -BOUNDS) boid.position.y = BOUNDS
      if (boid.position.z > BOUNDS) boid.position.z = -BOUNDS
      if (boid.position.z < -BOUNDS) boid.position.z = BOUNDS

      // Update buffer attribute
      positions[i * 3] = boid.position.x
      positions[i * 3 + 1] = boid.position.y
      positions[i * 3 + 2] = boid.position.z
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <Points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={NUM_BOIDS} array={new Float32Array(NUM_BOIDS * 3)} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="white" size={0.5} />
    </Points>
  )
}

// Main component to render the canvas
export default function FlockingDemo() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      <Canvas camera={{ position: [0, 0, 100] }}>
        <Boids />
        <OrbitControls />
      </Canvas>
    </div>
  )
}
