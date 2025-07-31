// High-resolution digit patterns for countdown display
import { FORMATION_CONFIG, TIMING_CONFIG } from '../config/constants.js'

export class DigitPatterns {
  /**
   * Get the current countdown digit based on time
   */
  static getCurrentDigit(time) {
    const { COUNTDOWN_START, COUNTDOWN_END } = TIMING_CONFIG.PHASES

    if (time < COUNTDOWN_START || time >= COUNTDOWN_END) {
      return null // No countdown active
    }

    // Count down from 10 to 1 over 10 seconds (40s-50s)
    const countdownProgress = time - COUNTDOWN_START
    const digit = Math.max(1, Math.ceil(10 - countdownProgress))

    return digit === 11 ? 10 : digit // Handle edge case
  }

  /**
   * Check if a screen position should be lit for the given digit
   * Uses 32x32 grid coordinates (0-31 for both row and col)
   */
  static getDigitPixel(digit, row, col) {
    // Ensure we're working with integers
    row = Math.floor(row)
    col = Math.floor(col)

    // Check bounds
    if (row < 0 || row >= 32 || col < 0 || col >= 32) {
      return false
    }

    switch (digit) {
      case 1:
        return this.getDigit1(row, col)
      case 2:
        return this.getDigit2(row, col)
      case 3:
        return this.getDigit3(row, col)
      case 4:
        return this.getDigit4(row, col)
      case 5:
        return this.getDigit5(row, col)
      case 6:
        return this.getDigit6(row, col)
      case 7:
        return this.getDigit7(row, col)
      case 8:
        return this.getDigit8(row, col)
      case 9:
        return this.getDigit9(row, col)
      case 10:
        return this.getDigit10(row, col)
      default:
        return false
    }
  }

  /**
   * Digit 1: Vertical line on the right with top angle
   */
  static getDigit1(row, col) {
    // Main vertical line (right side)
    if (col >= 18 && col <= 21 && row >= 4 && row <= 28) {
      return true
    }
    // Top angle
    if (row >= 4 && row <= 8 && col >= 15 && col <= 18) {
      return true
    }
    return false
  }

  /**
   * Digit 2: Z-shape pattern
   */
  static getDigit2(row, col) {
    // Top horizontal bar
    if (row >= 4 && row <= 7 && col >= 8 && col <= 24) {
      return true
    }
    // Middle horizontal bar
    if (row >= 14 && row <= 17 && col >= 8 && col <= 24) {
      return true
    }
    // Bottom horizontal bar
    if (row >= 25 && row <= 28 && col >= 8 && col <= 24) {
      return true
    }
    // Top right vertical
    if (row >= 7 && row <= 14 && col >= 21 && col <= 24) {
      return true
    }
    // Bottom left vertical
    if (row >= 17 && row <= 25 && col >= 8 && col <= 11) {
      return true
    }
    return false
  }

  /**
   * Digit 3: Right side with all horizontal bars
   */
  static getDigit3(row, col) {
    // Top horizontal bar
    if (row >= 4 && row <= 7 && col >= 8 && col <= 24) {
      return true
    }
    // Middle horizontal bar
    if (row >= 14 && row <= 17 && col >= 8 && col <= 24) {
      return true
    }
    // Bottom horizontal bar
    if (row >= 25 && row <= 28 && col >= 8 && col <= 24) {
      return true
    }
    // Right vertical line
    if (row >= 7 && row <= 25 && col >= 21 && col <= 24) {
      return true
    }
    return false
  }

  /**
   * Digit 4: Left top, middle bar, right side
   */
  static getDigit4(row, col) {
    // Middle horizontal bar
    if (row >= 14 && row <= 17 && col >= 8 && col <= 24) {
      return true
    }
    // Top left vertical
    if (row >= 4 && row <= 14 && col >= 8 && col <= 11) {
      return true
    }
    // Right vertical line (full height)
    if (row >= 4 && row <= 28 && col >= 21 && col <= 24) {
      return true
    }
    return false
  }

  /**
   * Digit 5: S-shape (reverse of 2)
   */
  static getDigit5(row, col) {
    // Top horizontal bar
    if (row >= 4 && row <= 7 && col >= 8 && col <= 24) {
      return true
    }
    // Middle horizontal bar
    if (row >= 14 && row <= 17 && col >= 8 && col <= 24) {
      return true
    }
    // Bottom horizontal bar
    if (row >= 25 && row <= 28 && col >= 8 && col <= 24) {
      return true
    }
    // Top left vertical
    if (row >= 7 && row <= 14 && col >= 8 && col <= 11) {
      return true
    }
    // Bottom right vertical
    if (row >= 17 && row <= 25 && col >= 21 && col <= 24) {
      return true
    }
    return false
  }

  /**
   * Digit 6: Like 5 but with bottom left
   */
  static getDigit6(row, col) {
    // Top horizontal bar
    if (row >= 4 && row <= 7 && col >= 8 && col <= 24) {
      return true
    }
    // Middle horizontal bar
    if (row >= 14 && row <= 17 && col >= 8 && col <= 24) {
      return true
    }
    // Bottom horizontal bar
    if (row >= 25 && row <= 28 && col >= 8 && col <= 24) {
      return true
    }
    // Left vertical line (full height)
    if (row >= 7 && row <= 25 && col >= 8 && col <= 11) {
      return true
    }
    // Bottom right vertical
    if (row >= 17 && row <= 25 && col >= 21 && col <= 24) {
      return true
    }
    return false
  }

  /**
   * Digit 7: Top bar and right side
   */
  static getDigit7(row, col) {
    // Top horizontal bar
    if (row >= 4 && row <= 7 && col >= 8 && col <= 24) {
      return true
    }
    // Right vertical line
    if (row >= 7 && row <= 28 && col >= 21 && col <= 24) {
      return true
    }
    return false
  }

  /**
   * Digit 8: Full 7-segment display
   */
  static getDigit8(row, col) {
    // Top horizontal bar
    if (row >= 4 && row <= 7 && col >= 8 && col <= 24) {
      return true
    }
    // Middle horizontal bar
    if (row >= 14 && row <= 17 && col >= 8 && col <= 24) {
      return true
    }
    // Bottom horizontal bar
    if (row >= 25 && row <= 28 && col >= 8 && col <= 24) {
      return true
    }
    // Left vertical line (full height)
    if (row >= 7 && row <= 25 && col >= 8 && col <= 11) {
      return true
    }
    // Right vertical line (full height)
    if (row >= 7 && row <= 25 && col >= 21 && col <= 24) {
      return true
    }
    return false
  }

  /**
   * Digit 9: Like 8 but no bottom left
   */
  static getDigit9(row, col) {
    // Top horizontal bar
    if (row >= 4 && row <= 7 && col >= 8 && col <= 24) {
      return true
    }
    // Middle horizontal bar
    if (row >= 14 && row <= 17 && col >= 8 && col <= 24) {
      return true
    }
    // Bottom horizontal bar
    if (row >= 25 && row <= 28 && col >= 8 && col <= 24) {
      return true
    }
    // Top left vertical
    if (row >= 7 && row <= 14 && col >= 8 && col <= 11) {
      return true
    }
    // Right vertical line (full height)
    if (row >= 7 && row <= 25 && col >= 21 && col <= 24) {
      return true
    }
    return false
  }

  /**
   * Digit 10: "1" and "0" side by side
   */
  static getDigit10(row, col) {
    // Left side: "1" (cols 6-13)
    if (col >= 10 && col <= 13) {
      // Main vertical line
      if (row >= 4 && row <= 28) {
        return true
      }
    }
    // Top angle for "1"
    if (row >= 4 && row <= 8 && col >= 7 && col <= 10) {
      return true
    }

    // Right side: "0" (cols 19-26)
    if (col >= 19 && col <= 26) {
      // Top horizontal bar
      if (row >= 4 && row <= 7) {
        return true
      }
      // Bottom horizontal bar
      if (row >= 25 && row <= 28) {
        return true
      }
    }
    // Left side of "0"
    if (row >= 7 && row <= 25 && col >= 19 && col <= 22) {
      return true
    }
    // Right side of "0"
    if (row >= 7 && row <= 25 && col >= 23 && col <= 26) {
      return true
    }

    return false
  }

  /**
   * Get countdown effect for a drone at screen position
   */
  static getCountdownEffect(screenIndex, time) {
    const digit = this.getCurrentDigit(time)

    if (digit === null) {
      return null // No countdown active
    }

    // Convert screen index to 32x32 grid position
    const { WIDTH } = FORMATION_CONFIG.SCREEN
    const row = Math.floor(screenIndex / WIDTH)
    const col = screenIndex % WIDTH

    const isLit = this.getDigitPixel(digit, row, col)

    if (isLit) {
      return {
        color: [1.0, 1.0, 1.0], // Bright white for countdown
        brightness: 100.0, // Very bright
      }
    } else {
      return {
        color: [0.02, 0.02, 0.02], // Very dark
        brightness: 1.0, // Minimal brightness
      }
    }
  }
}
