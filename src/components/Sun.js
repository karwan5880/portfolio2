'use client'

import { useFrame } from '@react-three/fiber'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'

// We use forwardRef to pass a ref from the parent (Experience) to the group inside this component.
export const Sun = forwardRef(function Sun(props, ref) {
  const groupRef = useRef()
  const pointLightRef = useRef()

  // This allows the parent component to get a reference to the group
  useImperativeHandle(ref, () => groupRef.current)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime()
      // Orbit the entire group (sun mesh + point light)
      groupRef.current.position.x = Math.sin(time * 0.1) * 10
      groupRef.current.position.z = Math.cos(time * 0.1) * 10
      // // // Always update the lightTracker's position to match the light's world position.
      // // // The parent component will handle making it "disappear" when occluded.
      // // if (lightTracker && pointLightRef.current) {
      // //   pointLightRef.current.getWorldPosition(lightTracker.position)
      // // }
      // if (lightTracker) {
      //   lightTracker.position.copy(groupRef.current.position)
      // }
    }
  })

  return (
    <group ref={groupRef} position={[10, 2, 0]}>
      {/* The visible sun mesh */}
      {/* <mesh visible={false}> */}
      <mesh visible={true}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color={'#FFDDAA'} toneMapped={false} />
      </mesh>
      {/* The light source, parented to the group so it moves with the mesh */}
      {/* <pointLight ref={pointLightRef} intensity={120} decay={2} /> */}
      <pointLight intensity={120} decay={2} />
    </group>
  )
})
