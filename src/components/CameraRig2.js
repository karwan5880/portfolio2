'use client'

import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'

// Import the same data
import { latLonToVector3 } from './utils'
import { locations } from '@/data/locations'

// Import our amazing helper function

export function CameraRig({ selectedSection }) {
  useFrame((state, delta) => {
    // If no section is selected, the rig does absolutely nothing.
    // The user has full control via OrbitControls.
    if (!selectedSection) {
      return
    }

    // Find the data for the selected location
    const locationData = locations.find((loc) => loc.name === selectedSection)
    if (!locationData) return // Should not happen, but good practice

    // Calculate the target position using our existing helper function!
    // We'll place the camera a bit further out than the marker.
    const targetPosition = latLonToVector3(
      locationData.coords[0],
      locationData.coords[1],
      3.5 // Camera distance from the center
    )

    // // --- THE FIX ---
    // // If the user is interacting OR a section is selected, don't run the idle animation.
    // // The camera logic for a selected section is already handled below.
    // if (isInteracting) {
    //   // When user is interacting, we need to stop any ongoing easing from the rig.
    //   // A simple way is to just set the target to the current position.
    //   easing.damp3(state.camera.position, state.camera.position, 0.25, delta)
    //   return // Exit the frame logic early
    // }

    // let targetPosition = new THREE.Vector3(0, 0, 5) // Default position

    // if (selectedSection) {
    //   // ... (your switch case logic for markers is perfect, no changes here)
    // } else {
    //   // When idle, the camera should be at a default position.
    //   // But we don't want it to snap back. Instead, let OrbitControls handle it.
    //   // So, let's change the logic. The rig's ONLY job now is to move
    //   // the camera when a section is selected.
    // }

    // Let's refactor this logic to be clearer.

    // switch (selectedSection) {
    //   case 'About':
    //     targetPosition.setFromSphericalCoords(3.5, Math.PI / 4, Math.PI / 4)
    //     break
    //   case 'Projects':
    //     targetPosition.setFromSphericalCoords(3.5, Math.PI / 2, -Math.PI / 2)
    //     break
    //   case 'Contact':
    //     targetPosition.setFromSphericalCoords(3.5, (Math.PI * 3) / 4, Math.PI)
    //     break
    //   default:
    //     break
    //   // ... Add ALL your locations here ...
    //   // You can pre-calculate these Vector3s to avoid doing it every frame.
    // }

    // Animate camera to the target position
    easing.damp3(state.camera.position, targetPosition, 0.5, delta)

    // Create a dummy object to look at the center of the planet for smooth damping
    const dummy = new THREE.Object3D()
    dummy.position.set(0, 0, 0)
    state.camera.lookAt(dummy.position)
    // There is no dampLookAt in maath, so a direct lookAt is fine
    // Or we could animate the controls.target, but let's keep it simple.

    // // Always look at the center of the planet
    // // We can use dampLookAt for a smoother look
    // const targetLookAt = new THREE.Vector3(0, 0, 0)
    // easing.dampLookAt(state.camera, targetLookAt, 0.25, delta)

    // state.camera.lookAt(0, 0, 0)
  })

  return null
}
