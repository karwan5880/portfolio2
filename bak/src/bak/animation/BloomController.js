// Bloom effect controller
import { TIMING_CONFIG, VISUAL_CONFIG } from '../config/constants.js'

export class BloomController {
  constructor() {
    this.intensity = VISUAL_CONFIG.BLOOM.INITIAL_INTENSITY
    this.radius = VISUAL_CONFIG.BLOOM.INITIAL_RADIUS
  }

  /**
   * Update bloom parameters based on time
   */
  updateBloom(time) {
    const { INITIAL_INTENSITY, INITIAL_RADIUS, DECREASE_RATE, MIN_VALUE } = VISUAL_CONFIG.BLOOM
    const bloomStartTime = TIMING_CONFIG.CAMERA.GROUND_PHASE

    if (time >= bloomStartTime) {
      const timeSinceBloomStart = time - bloomStartTime
      const newIntensity = Math.max(MIN_VALUE, INITIAL_INTENSITY - timeSinceBloomStart * DECREASE_RATE)
      const newRadius = Math.max(MIN_VALUE, INITIAL_RADIUS - timeSinceBloomStart * DECREASE_RATE)

      this.intensity = newIntensity
      this.radius = newRadius
    } else {
      this.intensity = INITIAL_INTENSITY
      this.radius = INITIAL_RADIUS
    }

    return {
      intensity: this.intensity,
      radius: this.radius,
    }
  }
}
