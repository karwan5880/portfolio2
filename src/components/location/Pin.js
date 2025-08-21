'use client'

import { Html } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import './Pin.css'

// Simple, performant, and does one job.
export function Pin({ position, tooltip, occluderRef, status }) {
  const [isHovered, setIsHovered] = useState(false)
  //   const techBlue = '#00BFFF' // A nice, bright "Deep Sky Blue"
  //   const highlightYellow = '#ffdd00'
  // A ref for the group so we can get its world position
  const groupRef = useRef()
  // A ref for the visual part of the pin so we can control its opacity
  const visualRef = useRef()
  // Get the camera from the scene
  const { camera } = useThree()
  const greenColor = '#2de0a8' // For 'available'
  //   const orangeYellowColor = '#FFC355' // For 'sponsorship'
  const orangeYellowColor = '#ff77aa' // For 'sponsorship'
  const highlightYellow = '#ffdd00' // For hover
  const techBlue = '#2de0a8' // A nice, bright "Deep Sky Blue"
  const baseColor = status === 'available' ? greenColor : orangeYellowColor

  // 2. THIS IS THE NEW LOGIC
  // This useEffect hook is a side effect that runs whenever `isHovered` changes.
  useEffect(() => {
    // When hovered, change the document's cursor to a pointer.
    // Otherwise, set it back to the default.
    document.body.style.cursor = isHovered ? 'pointer' : 'auto'
    // This is a "cleanup" function. It runs when the component unmounts
    // or before the effect runs again. It ensures the cursor is always
    // reset to default if the pin disappears for any reason.
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [isHovered]) // The dependency array: this effect only runs when isHovered changes.

  // --- THIS IS THE NEW LOGIC ---
  useFrame(() => {
    if (!groupRef.current || !visualRef.current) return
    const worldPosition = groupRef.current.getWorldPosition(new THREE.Vector3())
    const planetNormal = worldPosition.clone().normalize()
    // 1. FIX: Calculate the vector from the pin TOWARDS the camera.
    const viewDirection = camera.position.clone().sub(worldPosition).normalize()
    // 2. Calculate the dot product.
    // Now, a POSITIVE dot product means the pin is facing the camera.
    // A NEGATIVE dot product means it's on the back.
    const dotProduct = planetNormal.dot(viewDirection)
    // 3. FIX: Calculate opacity using the correct range.
    // We want full opacity when the dot product is high (e.g., > 0.2)
    // and zero opacity when it's low (e.g., < 0.0).
    const opacity = THREE.MathUtils.smoothstep(dotProduct, 0.0, 0.2)
    // Apply the opacity.
    visualRef.current.material.opacity = opacity
  })

  return (
    <group ref={groupRef} position={position} renderOrder={1}>
      {/* <group position={position}> */}
      {/* --- MESH 1: The Visible Dot --- */}
      {/* This mesh is purely visual and does not interact with the mouse. */}
      <mesh ref={visualRef} raycast={() => null}>
        {/* <mesh raycast={() => null}> */}
        <sphereGeometry args={[0.015, 32, 32]} />
        {/* <sphereGeometry args={[0.015, 16, 16]} /> */}
        {/* <sphereGeometry args={[0.04, 32, 32]} /> */}
        <meshStandardMaterial
          color={isHovered ? highlightYellow : baseColor}
          metalness={0.8} // Makes it look like polished metal
          roughness={0.2} // Makes the reflections sharp and clear
          emissive={isHovered ? highlightYellow : baseColor} // Makes it emit light
          emissiveIntensity={isHovered ? 2.0 : 0.5} // Controls the glow strength
          toneMapped={false}
          //   depthTest={false} // Renders on top of other objects
          //   transparent={true}
          //   opacity={0} // Start invisible, useFrame will fade it in
        />
      </mesh>

      {/* --- MESH 2: The new semi-transparent "Glass Shell" --- */}
      {/* This adds a nice highlight and sense of volume. */}
      <mesh raycast={() => null}>
        {/* <sphereGeometry args={[0.05, 32, 32]} /> */}
        {/* <sphereGeometry args={[0.05, 32, 32]} /> */}
        <sphereGeometry args={[0.035, 32, 32]} />
        <meshStandardMaterial
          color={isHovered ? highlightYellow : baseColor}
          transparent={true}
          opacity={0.2} // A subtle, glassy look
          roughness={0}
          metalness={0.5}
        />
      </mesh>

      {/* This mesh is larger and invisible. Its only job is to catch mouse events. */}
      <mesh
        onPointerEnter={() => setIsHovered(true)} //
        onPointerLeave={() => setIsHovered(false)}
      >
        {/* <sphereGeometry args={[0.04, 16, 16]} /> */}
        {/* <sphereGeometry args={[0.15, 16, 16]} /> */}
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* The HTML tooltip is now a direct child of the group. */}
      {/* {isHovered && (
        <Html center distanceFactor={10}>
          <div className="pin-tooltip">{tooltip}</div>
        </Html>
      )} */}
      {isHovered && visualRef.current?.material.opacity > 0.5 && (
        // <Html center distanceFactor={10}>
        <Html
          center //
          occlude={[occluderRef]}
        >
          <div className="pin-tooltip">{tooltip}</div>
        </Html>
      )}
    </group>
  )
}
