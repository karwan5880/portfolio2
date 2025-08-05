// Formation calculation utilities
import { DRONE_CONFIG, FORMATION_CONFIG } from '../config/constants.js'
import { random } from '../utils/mathUtils.js'

export class FormationCalculator {
  /**
   * Calculate ground position for a drone in the initial grid
   */
  static getGroundPosition(droneId) {
    const row = Math.floor(droneId / DRONE_CONFIG.GRID_SIZE)
    const col = droneId % DRONE_CONFIG.GRID_SIZE

    return {
      x: (col - DRONE_CONFIG.GRID_SIZE / 2 + 0.5) * DRONE_CONFIG.SPACING,
      y: 0,
      z: (row - DRONE_CONFIG.GRID_SIZE / 2 + 0.5) * DRONE_CONFIG.SPACING,
    }
  }

  /**
   * Calculate random formation position for gathering phase
   */
  static getFormationPosition(droneId) {
    const groundPos = this.getGroundPosition(droneId)
    const randomSeed = droneId * 0.001
    const randomY = 200 + random(randomSeed + 1000) * 200 // Height between 200-400

    return {
      x: groundPos.x,
      y: randomY,
      z: groundPos.z,
    }
  }

  /**
   * Calculate dome position based on ground position
   */
  static getDomePosition(basePosition) {
    const centerOffset = Math.sqrt(basePosition.x * basePosition.x + basePosition.z * basePosition.z)
    const { RADIUS, HEIGHT, BASE_ALTITUDE } = FORMATION_CONFIG.DOME

    let domeY = BASE_ALTITUDE
    if (centerOffset < RADIUS) {
      const normalizedDistance = centerOffset / RADIUS
      const heightFactor = Math.sqrt(1 - normalizedDistance * normalizedDistance)
      domeY = BASE_ALTITUDE + heightFactor * HEIGHT
    }

    return {
      x: basePosition.x,
      y: domeY,
      z: basePosition.z,
    }
  }

  /**
   * Check if drone is selected for screen formation (middle 32x32 square)
   */
  static isSelectedForScreenFormation(droneId) {
    const row = Math.floor(droneId / DRONE_CONFIG.GRID_SIZE)
    const col = droneId % DRONE_CONFIG.GRID_SIZE

    const isMiddleRow = row >= 16 && row <= 47
    const isMiddleCol = col >= 16 && col <= 47

    return isMiddleRow && isMiddleCol
  }

  /**
   * Get screen index for selected drone (0-1023 for 32x32)
   */
  static getScreenIndex(droneId) {
    const row = Math.floor(droneId / DRONE_CONFIG.GRID_SIZE)
    const col = droneId % DRONE_CONFIG.GRID_SIZE

    const localRow = row - 16
    const localCol = col - 16
    const invertedRow = 31 - localRow

    return invertedRow * 32 + localCol
  }

  /**
   * Calculate final screen position for pattern display
   */
  static getFinalScreenPosition(screenIndex) {
    const { WIDTH, SPACING, BASE_HEIGHT } = FORMATION_CONFIG.SCREEN
    const totalRow = Math.floor(screenIndex / WIDTH)
    const totalCol = screenIndex % WIDTH
    const centerOffset = (WIDTH - 1) / 2

    return {
      x: (totalCol - centerOffset) * SPACING,
      y: BASE_HEIGHT - totalRow * SPACING,
      z: 0,
    }
  }

  /**
   * Calculate vertical spread position (intermediate step)
   */
  static getVerticalSpreadPosition(screenIndex, domePosition) {
    const { WIDTH, SPACING, BASE_HEIGHT } = FORMATION_CONFIG.SCREEN
    const finalRow = Math.floor(screenIndex / WIDTH)
    const targetHeight = BASE_HEIGHT - finalRow * SPACING

    return {
      x: domePosition.x,
      y: targetHeight,
      z: domePosition.z,
    }
  }

  /**
   * Calculate row-based delay for staggered movement
   */
  static getRowBasedDelay(screenIndex) {
    const { WIDTH } = FORMATION_CONFIG.SCREEN
    const finalRow = Math.floor(screenIndex / WIDTH)
    const delayPerRow = 0.5
    return (31 - finalRow) * delayPerRow
  }

  /**
   * Check if drone is in pattern display area
   */
  static isPatternDrone(position) {
    const inXRange = position.x >= -200 && position.x <= 200
    const inYRange = position.y >= 200 && position.y <= 600
    const inZRange = Math.abs(position.z) < 50

    return inXRange && inYRange && inZRange
  }

  /**
   * Get normalized coordinates for pattern display (0-1 range)
   */
  static getNormalizedPatternCoords(position) {
    const normalizedX = (position.x + 200) / 400
    const normalizedY = (position.y - 200) / 400

    return {
      x: Math.max(0, Math.min(1, normalizedX)),
      y: Math.max(0, Math.min(1, normalizedY)),
    }
  }
}
