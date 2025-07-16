'use client'

import { Center, Stars, Text3D } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Vector3 } from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
// Assuming these imports are correct for your project structure
import { useGatekeeper } from '@/hooks/useGatekeeper'

// ========================================================================
// Component 1: The Drone
// This component represents a single drone. It knows how to move to a
// target position and how to glow.
// ========================================================================
function Drone({ targetPosition, color }) {
  const meshRef = useRef()

  // Store the drone's random starting position using useMemo so it doesn't
  // change on every re-render. We'll start it somewhere in a big sphere.
  const startPosition = useMemo(() => {
    return new Vector3().setFromSphericalCoords(
      30, // A large radius to start far away
      Math.random() * Math.PI,
      Math.random() * 2 * Math.PI
    )
  }, [])

  // This is the animation loop that runs on every frame.
  useFrame((_, delta) => {
    if (!meshRef.current) return

    // Animate the drone's movement from its current position towards the target.
    // 'lerp' stands for "linear interpolation" - it creates a smooth move.
    meshRef.current.position.lerp(targetPosition, delta * 0.5)
  })

  return (
    <mesh ref={meshRef} position={startPosition}>
      {/* A simple sphere shape for our drone */}
      <sphereGeometry args={[0.08, 8, 8]} />

      {/* This material makes the drone glow. */}
      {/* 'emissive' is the color of the light the object gives off. */}
      {/* 'toneMapped={false}' makes the glow really stand out. */}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={5} toneMapped={false} />
    </mesh>
  )
}

function DroneShow() {
  const groupRef = useRef()
  const [targetPositions, setTargetPositions] = useState([])

  // This effect runs once. We have REMOVED the font loader completely.
  useEffect(() => {
    const positions = []
    const numberOfDrones = 200 // Let's use 200 drones for this test
    const radius = 8 // The radius of our circle

    // This loop creates the coordinates for a circle.
    for (let i = 0; i < numberOfDrones; i++) {
      // Calculate the angle for each drone around the circle.
      const angle = (i / numberOfDrones) * Math.PI * 2

      // Use sin and cos to get the (x, y) coordinates on the circle's edge.
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      const z = 0 // We'll keep it flat on the z-axis for this test.

      positions.push(new Vector3(x, y, z))
    }

    // Set the state with our new, hardcoded circle positions.
    // This is GUARANTEED to run.
    setTargetPositions(positions)
  }, []) // The empty array [] means this effect runs only once.

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Keep the rotation. A rotating circle will look very clear.
      groupRef.current.rotation.y -= delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {targetPositions.map((pos, index) => (
        <Drone key={index} targetPosition={pos} color="#00e0ff" />
      ))}
    </group>
  )
}

// ========================================================================
// Component 3: The Main Page
// This is your main page component, updated to use the new DroneShow.
// ========================================================================
export default function FinalePage() {
  useGatekeeper('/finale') // Keeping your access control logic

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 25], fov: 75 }}>
          <ambientLight intensity={0.2} />
          <Stars count={5000} factor={4} saturation={0} fade speed={1} />

          {/* We've replaced everything with our new DroneShow! */}
          <DroneShow />
        </Canvas>
      </div>
      <div className={styles.overlayContent}>{/* We can add back text later if we want */}</div>
      <CornerLink href="/location" position="bottom-left" label="Location" aria-label="Return to location" />
      <CornerLink href="/" position="bottom-right" label="Home" aria-label="Go to Home Page" />
    </div>
  )
}
