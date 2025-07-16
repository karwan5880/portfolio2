'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

export function CameraRig({
  cameraFocusSection, //
  isInteracting,
  isAnimating,
  onAnimationComplete,
  controlsRef,
}) {
  const { camera, controls } = useThree()

  const [targetPosition, setTargetPosition] = useState(null)
  const [lookAtPosition, setLookAtPosition] = useState(null)

  useEffect(() => {
    if (cameraFocusSection) {
      const location = locations.find((l) => l.name === cameraFocusSection)
      if (location) {
        const markerPos = latLonToVector3(location.coords[0], location.coords[1], 2.1)

        const newTargetPos = new THREE.Vector3().copy(markerPos).multiplyScalar(2.5)
        setTargetPosition(newTargetPos)

        const newLookAtPos = new THREE.Vector3().copy(markerPos).multiplyScalar(0.5)
        setLookAtPosition(newLookAtPos)
      }
    } else {
      // If we deselect, clear the targets
      setTargetPosition(null)
      setLookAtPosition(null)
    }
  }, [cameraFocusSection])

  // This useFrame hook is the new animation engine. It runs on every single frame.
  useFrame((state, delta) => {
    // We only animate if the `isAnimating` prop is true and our targets are set.
    if (!isAnimating || !targetPosition || !lookAtPosition || !controlsRef.current) {
      return
    }

    const camera = state.camera
    const controls = controlsRef.current

    // --- NATIVE ANIMATION USING LERP ---
    // Lerp (Linear Interpolation) moves the camera a small fraction of the way
    // towards the target on each frame. `delta` helps keep it smooth on all refresh rates.
    const lerpFactor = Math.min(delta * 1.5, 1) // Adjust speed with the multiplier

    camera.position.lerp(targetPosition, lerpFactor)
    controls.target.lerp(lookAtPosition, lerpFactor)

    // We need to tell the controls to update after we've manually changed its target
    controls.update()

    // --- CHECK FOR COMPLETION ---
    // When the camera is very close to the destination, we consider the animation complete.
    const distanceToTarget = camera.position.distanceTo(targetPosition)
    if (distanceToTarget < 0.01) {
      // Snap to the final position to ensure precision
      camera.position.copy(targetPosition)
      controls.target.copy(lookAtPosition)

      // IMPORTANT: Call the completion handler
      if (onAnimationComplete) {
        onAnimationComplete()
      }
    }
  })

  // useEffect(() => {
  //   if (isInteracting || !cameraFocusSection || !controlsRef.current) return

  //   const targetPosition = new THREE.Vector3()
  //   const lookAtPosition = new THREE.Vector3()
  //   const location = locations.find((l) => l.name === cameraFocusSection)

  //   if (location) {
  //     const markerPosition = latLonToVector3(location.coords[0], location.coords[1], 2.1)
  //     // Pull back slightly further to frame the atmosphere nicely
  //     targetPosition.copy(markerPosition).multiplyScalar(2.5)
  //     lookAtPosition.copy(markerPosition).multiplyScalar(0.5)
  //   }

  //   const animation = gsap.timeline({
  //     onComplete: () => {
  //       if (onAnimationComplete) {
  //         onAnimationComplete()
  //       }
  //     },
  //   })

  //   animation.to(
  //     camera.position,
  //     {
  //       duration: 2.5,
  //       x: targetPosition.x,
  //       y: targetPosition.y,
  //       z: targetPosition.z,
  //       ease: 'power3.inOut',
  //     },
  //     0
  //   ) // Start at the beginning of the timeline

  //   // Animate the OrbitControls' target using the direct, reliable ref
  //   animation.to(
  //     controlsRef.current.target,
  //     {
  //       duration: 2.5,
  //       x: lookAtPosition.x,
  //       y: lookAtPosition.y,
  //       z: lookAtPosition.z,
  //       ease: 'power3.inOut',
  //     },
  //     0
  //   )

  //   // if (controls) {
  //   //   animation.to(
  //   //     controls.target,
  //   //     {
  //   //       duration: 2.5,
  //   //       x: lookAtPosition.x,
  //   //       y: lookAtPosition.y,
  //   //       z: lookAtPosition.z,
  //   //       ease: 'power3.inOut',
  //   //     },
  //   //     0
  //   //   ) // Start at the same time as the camera position animation
  //   // }
  // }, [cameraFocusSection, isInteracting, camera, controlsRef, onAnimationComplete])

  return null
}
