// Camera animation controller
import { CAMERA_CONFIG, TIMING_CONFIG } from '../config/constants.js'
import { lerp, smoothstep } from '../utils/mathUtils.js'
import * as THREE from 'three'

export class CameraController {
  constructor() {
    this.startPos = new THREE.Vector3(CAMERA_CONFIG.POSITIONS.START.x, CAMERA_CONFIG.POSITIONS.START.y, CAMERA_CONFIG.POSITIONS.START.z)

    this.endPos = new THREE.Vector3(CAMERA_CONFIG.POSITIONS.END.x, CAMERA_CONFIG.POSITIONS.END.y, CAMERA_CONFIG.POSITIONS.END.z)

    this.startLookAt = new THREE.Vector3(CAMERA_CONFIG.LOOK_AT.START.x, CAMERA_CONFIG.LOOK_AT.START.y, CAMERA_CONFIG.LOOK_AT.START.z)

    this.endLookAt = new THREE.Vector3(CAMERA_CONFIG.LOOK_AT.END.x, CAMERA_CONFIG.LOOK_AT.END.y, CAMERA_CONFIG.LOOK_AT.END.z)
  }

  /**
   * Update camera position based on current time
   */
  updateCamera(camera, controls, time) {
    const { GROUND_PHASE, ANIMATION_END, USER_CONTROL } = TIMING_CONFIG.CAMERA

    if (time < ANIMATION_END) {
      // Disable controls during scripted sequence
      if (controls) {
        controls.enabled = false
      }

      if (time < GROUND_PHASE) {
        // Phase 1: Ground level distant view
        camera.position.copy(this.startPos)
        camera.lookAt(this.startLookAt)
      } else {
        // Phase 2: Smooth camera movement
        const animationStartTime = GROUND_PHASE
        const totalDuration = ANIMATION_END - animationStartTime
        const progress = (time - animationStartTime) / totalDuration
        const smoothProgress = smoothstep(0, 1, progress)

        // Interpolate position and look-at
        const currentPos = new THREE.Vector3().copy(this.startPos)
        const currentLookAt = new THREE.Vector3().copy(this.startLookAt)

        currentPos.lerp(this.endPos, smoothProgress)
        currentLookAt.lerp(this.endLookAt, smoothProgress)

        camera.position.copy(currentPos)
        camera.lookAt(currentLookAt)
      }
    } else {
      // After scripted sequence: transition to user control
      if (controls) {
        controls.enabled = true

        if (time < USER_CONTROL) {
          // Smooth transition to user control position
          const transitionProgress = (time - ANIMATION_END) / (USER_CONTROL - ANIMATION_END)
          const smoothTransition = smoothstep(0, 1, transitionProgress)

          const targetPos = CAMERA_CONFIG.POSITIONS.USER_CONTROL
          const targetLookAt = CAMERA_CONFIG.LOOK_AT.USER_CONTROL

          const currentX = lerp(this.endPos.x, targetPos.x, smoothTransition)
          const currentY = lerp(this.endPos.y, targetPos.y, smoothTransition)
          const currentZ = lerp(this.endPos.z, targetPos.z, smoothTransition)
          const currentLookAtY = lerp(this.endLookAt.y, targetLookAt.y, smoothTransition)

          camera.position.set(currentX, currentY, currentZ)
          camera.lookAt(0, currentLookAtY, 0)
        }

        // Set OrbitControls target after transition
        if (time >= USER_CONTROL && time < USER_CONTROL + 0.1) {
          const target = CAMERA_CONFIG.LOOK_AT.USER_CONTROL
          const position = CAMERA_CONFIG.POSITIONS.USER_CONTROL

          controls.target.set(target.x, target.y, target.z)
          controls.object.position.set(position.x, position.y, position.z)
        }
      }
    }
  }
}
