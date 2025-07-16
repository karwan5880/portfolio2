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

    if (!cameraFocusSection) {
      return
    }

    const targetPosition = new THREE.Vector3()
    const lookAtPosition = new THREE.Vector3()

    const location = locations.find((l) => l.name === cameraFocusSection)
    if (location) {
      const markerPosition = latLonToVector3(location.coords[0], location.coords[1], 2.1)
      targetPosition.copy(markerPosition).multiplyScalar(2)
      lookAtPosition.copy(markerPosition).multiplyScalar(0.5)
    }

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
