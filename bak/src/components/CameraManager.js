'use client'

import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'

import { latLonToVector3 } from './utils'

export function CameraManager({ selectedLocation, initialCameraPosition }) {
  const { controls } = useThree()

  useEffect(() => {
    if (controls) {
      if (selectedLocation) {
        const targetPos = latLonToVector3(selectedLocation.coords[0], selectedLocation.coords[1], 2.1)
        const cameraPos = new THREE.Vector3().copy(targetPos).multiplyScalar(2.5)

        // Use the built-in, stable animation methods
        controls.setLookAt(
          cameraPos.x,
          cameraPos.y,
          cameraPos.z, // Camera position
          targetPos.x,
          targetPos.y,
          targetPos.z, // Target to look at
          true // Enable smooth transition
        )
      } else {
        // Go back to home view
        // controls.setLookAt(0, 2, 7, 0, 0, 0, true)
        controls.setLookAt(
          initialCameraPosition.x,
          initialCameraPosition.y,
          initialCameraPosition.z,
          0,
          0,
          0, // Look at the center
          true
        )
      }
    }
  }, [selectedLocation, controls, initialCameraPosition])

  return null
}
