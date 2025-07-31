// Pattern generation for the animated display
import { TIMING_CONFIG } from '../config/constants.js'

import { DigitPatterns } from './DigitPatterns.js'

export class PatternGenerator {
  /**
   * Get the current pattern based on time
   */
  static getCurrentPattern(time) {
    const { CYCLE_DURATION, PATTERN_DURATION } = TIMING_CONFIG.PATTERNS
    const patternTime = time % CYCLE_DURATION
    return Math.floor(patternTime / PATTERN_DURATION)
  }

  /**
   * Generate pattern effect with countdown digit priority
   * This is the main method that should be called from shaders
   */
  static getPatternEffect(screenIndex, normalizedX, normalizedY, time) {
    // Check if countdown is active - digits take priority over patterns
    const countdownEffect = DigitPatterns.getCountdownEffect(screenIndex, time)
    if (countdownEffect !== null) {
      return countdownEffect
    }

    // No countdown active, show animated patterns
    return this.getAnimatedPatternEffect(normalizedX, normalizedY, time)
  }

  /**
   * Generate animated pattern color and brightness (when no countdown)
   */
  static getAnimatedPatternEffect(normalizedX, normalizedY, time) {
    const patternIndex = this.getCurrentPattern(time)

    switch (patternIndex) {
      case 0:
        return this.generateRippleWaves(normalizedX, normalizedY, time)
      case 1:
        return this.generateRotatingSpiral(normalizedX, normalizedY, time)
      case 2:
        return this.generatePlasmaEffect(normalizedX, normalizedY, time)
      case 3:
        return this.generatePulsingCircles(normalizedX, normalizedY, time)
      case 4:
        return this.generateDynamicCheckerboard(normalizedX, normalizedY, time)
      case 5:
        return this.generateDiagonalWaves(normalizedX, normalizedY, time)
      default:
        return { color: [1, 1, 1], brightness: 20 }
    }
  }

  /**
   * Pattern 1: Ripple waves from center
   */
  static generateRippleWaves(x, y, time) {
    const distance = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2)
    const wave = Math.sin(distance * 15.0 - time * 6.0) * 0.5 + 0.5

    return {
      color: [0.2 + wave * 0.8, 0.8, 1.0], // Blue to cyan waves
      brightness: 25 + wave * 25,
    }
  }

  /**
   * Pattern 2: Rotating spiral
   */
  static generateRotatingSpiral(x, y, time) {
    const angle = Math.atan2(y - 0.5, x - 0.5)
    const radius = Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2)
    const spiral = Math.sin(angle * 4.0 + radius * 20.0 - time * 5.0) * 0.5 + 0.5

    return {
      color: [1.0, 0.3 + spiral * 0.7, 1.0], // Purple to magenta spiral
      brightness: 20 + spiral * 30,
    }
  }

  /**
   * Pattern 3: Plasma effect
   */
  static generatePlasmaEffect(x, y, time) {
    const plasma = Math.sin(x * 8.0 + time * 3.0) + Math.sin(y * 10.0 + time * 2.5) + Math.sin((x + y) * 6.0 + time * 4.0)
    const normalizedPlasma = (plasma + 3.0) / 6.0

    return {
      color: [1.0, 0.5 + normalizedPlasma * 0.5, 0.2 + normalizedPlasma * 0.8], // Orange to yellow
      brightness: 15 + normalizedPlasma * 35,
    }
  }

  /**
   * Pattern 4: Pulsing circles with moving center
   */
  static generatePulsingCircles(x, y, time) {
    const centerX = 0.5 + Math.sin(time * 1.2) * 0.3
    const centerY = 0.5 + Math.cos(time * 1.5) * 0.3
    const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2)
    const pulse = Math.sin(distance * 25.0 - time * 8.0) * 0.5 + 0.5

    return {
      color: [0.2 + pulse * 0.8, 1.0, 0.3 + pulse * 0.7], // Green to yellow pulses
      brightness: 20 + pulse * 30,
    }
  }

  /**
   * Pattern 5: Dynamic checkerboard
   */
  static generateDynamicCheckerboard(x, y, time) {
    const checkerX = Math.sin(x * 12.0 + time * 2.0) > 0 ? 1 : 0
    const checkerY = Math.sin(y * 12.0 + time * 1.5) > 0 ? 1 : 0
    const checker = checkerX * checkerY

    return {
      color: [1.0, checker * 0.5, checker], // Red to pink checkerboard
      brightness: 25 + checker * 20,
    }
  }

  /**
   * Pattern 6: Diagonal waves
   */
  static generateDiagonalWaves(x, y, time) {
    const diagonal = (x + y) * 0.5
    const wave = Math.sin(diagonal * 20.0 - time * 6.0) * 0.5 + 0.5

    return {
      color: [0.8 + wave * 0.2, 0.4 + wave * 0.6, 1.0], // Light blue to white waves
      brightness: 20 + wave * 30,
    }
  }
}
