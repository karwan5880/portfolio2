'use client'

import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useEffect } from 'react'
import * as THREE from 'three'

import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

export function CameraRig({ cameraFocusSection, isInteracting, onAnimationComplete }) {
  const { camera, controls } = useThree()

  useEffect(() => {
    if (isInteracting) return

    // --- THE FIX ---
    // If there is no specific section to focus on, do nothing.
    // Let the user's manual control take precedence.
    if (!cameraFocusSection) {
      // The old code that sent the camera back to default was here.
      // By returning early, we prevent that from happening.
      return
    }
    // ---------------

    const targetPosition = new THREE.Vector3()
    const lookAtPosition = new THREE.Vector3()

    // if (cameraFocusSection) {
    const location = locations.find((l) => l.name === cameraFocusSection)
    if (location) {
      const markerPosition = latLonToVector3(location.coords[0], location.coords[1], 2.1)
      targetPosition.copy(markerPosition).multiplyScalar(2)
      lookAtPosition.copy(markerPosition).multiplyScalar(0.5)
    }
    // } else {
    //   // Default position
    //   targetPosition.set(0, 2, 7)
    //   lookAtPosition.set(0, 0, 0)
    // }

    gsap.to(camera.position, {
      duration: 2.5,
      x: targetPosition.x,
      y: targetPosition.y,
      z: targetPosition.z,
      ease: 'power3.inOut',
      onComplete: () => {
        if (onAnimationComplete) {
          onAnimationComplete()
        }
      },
    })

    if (controls) {
      gsap.to(controls.target, {
        duration: 2.5,
        x: lookAtPosition.x,
        y: lookAtPosition.y,
        z: lookAtPosition.z,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
      })
    }
  }, [cameraFocusSection, isInteracting, camera, controls, onAnimationComplete])

  return null
}
