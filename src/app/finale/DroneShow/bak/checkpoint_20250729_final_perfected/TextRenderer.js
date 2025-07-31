// Enhanced TextRenderer.js - Professional text rendering for drone displays
import * as THREE from 'three'

// Text rendering configuration
const TEXT_CONFIG = {
  CANVAS_WIDTH: 128,
  CANVAS_HEIGHT: 32,

  // Character grid configuration for Chinese text
  CHAR_GRID_WIDTH: 32,
  CHAR_GRID_HEIGHT: 32,
  CHARS_PER_ROW: 4, // 128 / 32 = 4 characters per row

  // Typography settings - optimized for LED/drone displays with maximum internal space
  OPTIMAL_FONTS: [
    'Noto Sans CJK SC', // Google - excellent internal space design
    'Source Han Sans SC', // Adobe - great stroke separation and internal spaces
    'PingFang SC', // macOS - very clean with good internal spacing
    'STSong', // macOS - serif with excellent internal space definition
    'SimSun', // Windows - clear internal spaces in complex characters
    'Hiragino Sans GB', // macOS - good internal space preservation
    'Microsoft YaHei Light', // Light weight preserves more internal space
    'Kaiti SC', // macOS - script style with clear internal definition
    'Microsoft YaHei', // Standard fallback
    'Arial', // Final fallback
    'sans-serif', // System fallback
  ],

  // Spacing and positioning
  CHAR_SPACING_MULTIPLIER: 1.15,
  WORD_SPACING_MULTIPLIER: 0.02, // Extremely minimal spacing - less than 1 drone width
  VERTICAL_OFFSET: 4.5, // Lower by 4 drones (4 pixels) + original 0.5

  // Anti-aliasing levels
  BRIGHTNESS_LEVELS: {
    FULL: 1.0,
    HIGH: 0.8,
    MEDIUM: 0.5,
    LOW: 0.25,
    BACKGROUND: 0.02,
  },

  // Auto-sizing
  MAX_WIDTH_RATIO: 0.92, // Use 92% of canvas width
  MIN_FONT_SIZE: 12,
  MAX_FONT_SIZE: 28,
  OPTIMAL_FONT_SIZE: 24,
}

export class TextRenderer {
  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = TEXT_CONFIG.CANVAS_WIDTH
    this.canvas.height = TEXT_CONFIG.CANVAS_HEIGHT
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true })

    // Enhanced canvas configuration for better text rendering
    this.ctx.imageSmoothingEnabled = true // Enable for better anti-aliasing
    this.ctx.imageSmoothingQuality = 'high'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    // Load and test fonts
    this.availableFonts = this.detectAvailableFonts()
  }

  // Detect which fonts are available in the system
  detectAvailableFonts() {
    const available = []
    const testString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    try {
      // Test each font by measuring text width
      for (const font of TEXT_CONFIG.OPTIMAL_FONTS) {
        try {
          this.ctx.font = `24px ${font}`
          const width1 = this.ctx.measureText(testString).width

          this.ctx.font = `24px serif` // Fallback comparison
          const width2 = this.ctx.measureText(testString).width

          // If widths differ significantly, font is likely available
          if (Math.abs(width1 - width2) > 5) {
            available.push(font)
          }
        } catch (fontError) {
          // Skip this font if there's an error
          console.warn(`Font detection failed for ${font}:`, fontError)
        }
      }
    } catch (error) {
      console.warn('Font detection failed, using fallback:', error)
    }

    // Ensure we always have at least one font
    return available.length > 0 ? available : ['Arial', 'sans-serif']
  }

  // Calculate optimal font size for given text
  calculateOptimalFontSize(text, fontFamily = this.availableFonts[0] || 'Arial', maxWidth = TEXT_CONFIG.CANVAS_WIDTH * TEXT_CONFIG.MAX_WIDTH_RATIO) {
    let fontSize = TEXT_CONFIG.OPTIMAL_FONT_SIZE

    try {
      // Binary search for optimal font size
      let minSize = TEXT_CONFIG.MIN_FONT_SIZE
      let maxSize = TEXT_CONFIG.MAX_FONT_SIZE

      while (maxSize - minSize > 1) {
        fontSize = Math.floor((minSize + maxSize) / 2)
        this.ctx.font = `bold ${fontSize}px ${fontFamily}`
        const width = this.ctx.measureText(text).width

        if (width <= maxWidth) {
          minSize = fontSize
        } else {
          maxSize = fontSize
        }
      }

      return minSize
    } catch (error) {
      console.warn('Font size calculation failed, using default:', error)
      return TEXT_CONFIG.OPTIMAL_FONT_SIZE
    }
  }

  // Render Chinese text in 32x32 character grids
  renderTextInGrids(text, options = {}) {
    const { fontFamily = this.availableFonts[0] || 'Arial', fontWeight = 'normal', color = 'white', backgroundColor = 'black' } = options

    // Clear canvas with background
    this.ctx.fillStyle = backgroundColor
    this.ctx.fillRect(0, 0, TEXT_CONFIG.CANVAS_WIDTH, TEXT_CONFIG.CANVAS_HEIGHT)

    const characters = Array.from(text) // Handle Unicode characters properly

    // Calculate optimal font size for 32x32 grid
    const gridFontSize = this.calculateGridFontSize(fontFamily)

    // Configure font
    try {
      this.ctx.font = `${fontWeight} ${gridFontSize}px ${fontFamily}`
    } catch (fontError) {
      console.warn(`Font setting failed, using fallback:`, fontError)
      this.ctx.font = `${fontWeight} ${gridFontSize}px Arial`
    }

    this.ctx.fillStyle = color
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'middle'

    // Render each character in its own 32x32 grid
    for (let i = 0; i < characters.length && i < TEXT_CONFIG.CHARS_PER_ROW; i++) {
      const char = characters[i]

      // Calculate grid position
      const gridX = i * TEXT_CONFIG.CHAR_GRID_WIDTH
      const centerX = gridX + TEXT_CONFIG.CHAR_GRID_WIDTH / 2
      const centerY = TEXT_CONFIG.CHAR_GRID_HEIGHT / 2 + 3 // Move down 5 pixels for better centering

      // Render character centered in its grid
      this.ctx.fillText(char, centerX, centerY)
    }

    // Get image data and convert to texture format
    const imageData = this.ctx.getImageData(0, 0, TEXT_CONFIG.CANVAS_WIDTH, TEXT_CONFIG.CANVAS_HEIGHT)
    return this.processImageDataEnhanced(imageData)
  }

  // Calculate optimal font size for 32x32 character grid
  calculateGridFontSize(fontFamily = 'Arial') {
    let fontSize = 28 // Start with a reasonable size for 32x32 grid

    try {
      // Test with a complex Chinese character
      const testChar = '喜'
      let maxSize = 32
      let minSize = 16

      while (maxSize - minSize > 1) {
        fontSize = Math.floor((minSize + maxSize) / 2)
        this.ctx.font = `normal ${fontSize}px ${fontFamily}`

        const metrics = this.ctx.measureText(testChar)
        const charWidth = metrics.width
        const charHeight = fontSize * 1.2 // Approximate height

        // Check if character fits comfortably in 32x32 grid with some padding
        if (charWidth <= 28 && charHeight <= 28) {
          minSize = fontSize
        } else {
          maxSize = fontSize
        }
      }

      return minSize
    } catch (error) {
      console.warn('Grid font size calculation failed, using default:', error)
      return 24
    }
  }

  // Enhanced text rendering with improved typography
  renderText(text, options = {}) {
    try {
      const {
        fontSize = null, // Auto-calculate if not provided
        fontFamily = this.availableFonts[0] || 'Arial',
        fontWeight = 'bold',
        color = 'white',
        backgroundColor = 'black',
        letterSpacing = 0,
      } = options

      // Clear canvas with background
      this.ctx.fillStyle = backgroundColor
      this.ctx.fillRect(0, 0, TEXT_CONFIG.CANVAS_WIDTH, TEXT_CONFIG.CANVAS_HEIGHT)

      // Calculate optimal font size if not provided
      const optimalFontSize = fontSize || this.calculateOptimalFontSize(text, fontFamily)

      // Configure enhanced font rendering with error handling
      try {
        this.ctx.font = `${fontWeight} ${optimalFontSize}px ${fontFamily}`
      } catch (fontError) {
        console.warn(`Font setting failed, using fallback:`, fontError)
        this.ctx.font = `${fontWeight} ${optimalFontSize}px Arial`
      }

      this.ctx.fillStyle = color

      // Apply letter spacing if supported
      if (letterSpacing > 0 && 'letterSpacing' in this.ctx) {
        this.ctx.letterSpacing = `${letterSpacing}px`
      }

      // Apply vertical scaling if specified (for better internal space in Chinese characters)
      if (options.scaleY && options.scaleY !== 1.0) {
        this.ctx.save()
        this.ctx.scale(1.0, options.scaleY)
      }

      // Enhanced positioning with vertical offset
      const centerX = TEXT_CONFIG.CANVAS_WIDTH / 2
      const centerY = (TEXT_CONFIG.CANVAS_HEIGHT / 2 + TEXT_CONFIG.VERTICAL_OFFSET) / (options.scaleY || 1.0)

      // Render text with improved spacing
      if (text.includes(' ')) {
        // Handle multi-word text with custom word spacing
        this.renderTextWithCustomSpacing(text, centerX, centerY, optimalFontSize)
      } else if (letterSpacing > 0) {
        // Render with custom character spacing
        this.renderTextWithCharacterSpacing(text, centerX, centerY, letterSpacing)
      } else {
        // Single word - render normally
        this.ctx.fillText(text, centerX, centerY)
      }

      // Restore context if scaling was applied
      if (options.scaleY && options.scaleY !== 1.0) {
        this.ctx.restore()
      }

      // Get image data and convert to texture format
      const imageData = this.ctx.getImageData(0, 0, TEXT_CONFIG.CANVAS_WIDTH, TEXT_CONFIG.CANVAS_HEIGHT)
      return this.processImageDataEnhanced(imageData)
    } catch (error) {
      console.error('Text rendering failed:', error)
      // Return empty texture data as fallback
      return new Float32Array(TEXT_CONFIG.CANVAS_WIDTH * TEXT_CONFIG.CANVAS_HEIGHT * 4)
    }
  }

  // Render text with precise character spacing control
  renderTextWithCharacterSpacing(text, centerX, centerY, letterSpacing) {
    const characters = Array.from(text) // Handle Unicode characters properly

    // Measure total width with custom character spacing
    let totalWidth = 0
    for (let i = 0; i < characters.length; i++) {
      totalWidth += this.ctx.measureText(characters[i]).width
      if (i < characters.length - 1) {
        totalWidth += letterSpacing
      }
    }

    // Start position for left-aligned rendering
    let currentX = centerX - totalWidth / 2

    // Render each character with custom spacing
    for (let i = 0; i < characters.length; i++) {
      const char = characters[i]
      const charWidth = this.ctx.measureText(char).width

      // Render character
      this.ctx.fillText(char, currentX + charWidth / 2, centerY)

      // Move to next character position
      currentX += charWidth + letterSpacing
    }
  }

  // Render text with custom word and character spacing
  renderTextWithCustomSpacing(text, centerX, centerY, fontSize) {
    const words = text.split(' ')

    // Measure total width with custom spacing
    let totalWidth = 0
    for (let i = 0; i < words.length; i++) {
      totalWidth += this.ctx.measureText(words[i]).width
      if (i < words.length - 1) {
        totalWidth += fontSize * TEXT_CONFIG.WORD_SPACING_MULTIPLIER
      }
    }

    // Start position for left-aligned rendering
    let currentX = centerX - totalWidth / 2

    // Render each word with custom spacing
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      const wordWidth = this.ctx.measureText(word).width

      // Render word
      this.ctx.fillText(word, currentX + wordWidth / 2, centerY)

      // Move to next word position
      currentX += wordWidth
      if (i < words.length - 1) {
        currentX += fontSize * TEXT_CONFIG.WORD_SPACING_MULTIPLIER
      }
    }
  }

  // Enhanced image processing with anti-aliasing and gradient brightness
  processImageDataEnhanced(imageData) {
    const textureData = new Float32Array(TEXT_CONFIG.CANVAS_WIDTH * TEXT_CONFIG.CANVAS_HEIGHT * 4)

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i]
      const g = imageData.data[i + 1]
      const b = imageData.data[i + 2]
      // Alpha channel not needed for brightness calculation

      // Convert to grayscale brightness (0-255)
      const brightness = (r + g + b) / 3

      // Enhanced brightness mapping with anti-aliasing
      let textIntensity
      if (brightness >= 240) {
        textIntensity = TEXT_CONFIG.BRIGHTNESS_LEVELS.FULL
      } else if (brightness >= 180) {
        textIntensity = TEXT_CONFIG.BRIGHTNESS_LEVELS.HIGH
      } else if (brightness >= 120) {
        textIntensity = TEXT_CONFIG.BRIGHTNESS_LEVELS.MEDIUM
      } else if (brightness >= 60) {
        textIntensity = TEXT_CONFIG.BRIGHTNESS_LEVELS.LOW
      } else {
        textIntensity = TEXT_CONFIG.BRIGHTNESS_LEVELS.BACKGROUND
      }

      const pixelIndex = i / 4
      const textureIndex = pixelIndex * 4

      // Store enhanced RGBA data with gradient brightness
      textureData[textureIndex] = textIntensity // R: text intensity
      textureData[textureIndex + 1] = textIntensity // G: text intensity
      textureData[textureIndex + 2] = textIntensity // B: text intensity
      textureData[textureIndex + 3] = 1.0 // A: always opaque
    }

    return textureData
  }

  // Legacy method for backward compatibility
  processImageData(imageData) {
    return this.processImageDataEnhanced(imageData)
  }

  // Create enhanced THREE.js texture from text
  createTextTexture(text, options = {}) {
    // Use grid rendering for Chinese characters, regular rendering for English
    const isChinese = /[\u4e00-\u9fff]/.test(text)
    const textureData = isChinese ? this.renderTextInGrids(text, options) : this.renderText(text, options)

    // Create THREE.js DataTexture with enhanced settings
    const texture = new THREE.DataTexture(textureData, TEXT_CONFIG.CANVAS_WIDTH, TEXT_CONFIG.CANVAS_HEIGHT, THREE.RGBAFormat, THREE.FloatType)

    // Enhanced texture parameters for better quality
    texture.minFilter = THREE.LinearFilter // Smooth scaling
    texture.magFilter = THREE.LinearFilter // Smooth magnification
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.needsUpdate = true

    return texture
  }

  // Get available fonts for debugging
  getAvailableFonts() {
    return this.availableFonts
  }

  // Create texture with specific font for testing
  createTextTextureWithFont(text, fontFamily, options = {}) {
    const enhancedOptions = {
      ...options,
      fontFamily: fontFamily,
    }
    return this.createTextTexture(text, enhancedOptions)
  }

  // Test method to visualize rendered text
  getCanvasDataURL() {
    return this.canvas.toDataURL()
  }
}

// Timeline controller for managing text messages
export class TextTimeline {
  constructor() {
    this.messages = []
    this.currentMessage = null
  }

  // Add a message to the timeline
  addMessage(startTime, duration, text, color = [1, 1, 1], options = {}) {
    this.messages.push({
      startTime,
      endTime: startTime + duration,
      text,
      color,
      options,
    })

    // Sort messages by start time
    this.messages.sort((a, b) => a.startTime - b.startTime)
  }

  // Get current active message based on time
  getCurrentMessage(currentTime) {
    for (const message of this.messages) {
      if (currentTime >= message.startTime && currentTime < message.endTime) {
        return message
      }
    }
    return null
  }

  // Check if text display should be active
  isTextActive(currentTime) {
    return this.getCurrentMessage(currentTime) !== null
  }

  // Clear all messages
  clear() {
    this.messages = []
    this.currentMessage = null
  }
}

// Enhanced timeline with improved typography and spacing
export function createDefaultTimeline() {
  const timeline = new TextTimeline()

  // Enhanced drone show text timeline with optimized display fonts
  const fontOptions = {
    fontFamily: 'Trebuchet MS', // Clean, modern, good spacing, thinner strokes
    fontWeight: 'bold', // Bold for visibility but not as thick as Impact
    letterSpacing: 0.5, // Reduced from 1 to save space
  }

  // Soft, melancholic blue-white for emotional, dramatic feel
  const emotionalBlueWhite = [0.7, 0.8, 1.0] // Soft blue-white, like moonlight or tears

  // Chinese New Year message sequence with grid-based rendering
  const chineseOptions = {
    fontFamily: 'Noto Sans CJK SC', // Excellent internal space design for complex characters
    fontWeight: 'normal', // Normal weight to preserve character holes/spaces
    // No letterSpacing needed - each character gets its own 32x32 grid
    // No fontSize needed - automatically calculated for optimal 32x32 fit
    // No scaleY needed - grid system handles proportions
  }

  // Emotional message sequence with gentle fade-in and fade-out transitions
  timeline.addMessage(90.0, 10.0, '新年快乐', emotionalBlueWhite, chineseOptions) // 90-100s: Happy New Year (10s with fade-out)
  timeline.addMessage(101.0, 10.0, '家承运昌', emotionalBlueWhite, chineseOptions) // 101-111s: Family inherits prosperity (10s with fade-out)
  timeline.addMessage(112.0, 10.0, '身安心安', emotionalBlueWhite, chineseOptions) // 112-122s: Health & peace of mind (10s with fade-out)
  timeline.addMessage(123.0, 999.0, '艺臻恬然', emotionalBlueWhite, chineseOptions) // 123s+: Art reaches tranquil perfection (stays visible during finale)

  return timeline
}

// Create timeline with custom font for testing
export function createTimelineWithFont(fontFamily = 'Impact') {
  const timeline = new TextTimeline()

  const fontOptions = {
    fontFamily: fontFamily,
    fontWeight: 'bold',
    letterSpacing: 1,
  }

  timeline.addMessage(55.0, 8.0, 'HELLO', [1, 1, 1], fontOptions)
  timeline.addMessage(65.0, 8.0, 'WELCOME', [0.3, 0.8, 1], fontOptions)
  timeline.addMessage(75.0, 8.0, 'TO MY', [1, 0.6, 0.1], fontOptions)
  timeline.addMessage(85.0, 8.0, 'PORTFOLIO', [1, 0.3, 0.8], fontOptions)
  timeline.addMessage(95.0, 8.0, 'ENJOY', [0.4, 1, 0.3], fontOptions)
  timeline.addMessage(105.0, 8.0, 'THE SHOW', [1, 1, 0.3], fontOptions)
  timeline.addMessage(115.0, 999.0, 'THANK YOU', [1, 1, 1], { ...fontOptions, letterSpacing: 2, fontSize: 26 })

  return timeline
}
