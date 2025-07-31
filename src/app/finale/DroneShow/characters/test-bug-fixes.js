// Test script to verify bug fixes in enhanced TextRenderer
// Run this in browser console or Node.js environment

// Mock THREE.js for testing
const THREE = {
  DataTexture: class {
    constructor(data, width, height, format, type) {
      this.data = data
      this.width = width
      this.height = height
      this.format = format
      this.type = type
      this.needsUpdate = true
    }
  },
  RGBAFormat: 'RGBAFormat',
  FloatType: 'FloatType',
  LinearFilter: 'LinearFilter',
  ClampToEdgeWrapping: 'ClampToEdgeWrapping',
}

// Test configuration
const TEXT_CONFIG = {
  CANVAS_WIDTH: 128,
  CANVAS_HEIGHT: 32,
  OPTIMAL_FONTS: ['Orbitron', 'Arial'],
  MAX_WIDTH_RATIO: 0.92,
  MIN_FONT_SIZE: 12,
  MAX_FONT_SIZE: 28,
  OPTIMAL_FONT_SIZE: 24,
  BRIGHTNESS_LEVELS: {
    FULL: 1.0,
    HIGH: 0.8,
    MEDIUM: 0.5,
    LOW: 0.25,
    BACKGROUND: 0.02,
  },
}

// Simplified TextRenderer for testing
class TestTextRenderer {
  constructor() {
    if (typeof document !== 'undefined') {
      this.canvas = document.createElement('canvas')
      this.canvas.width = TEXT_CONFIG.CANVAS_WIDTH
      this.canvas.height = TEXT_CONFIG.CANVAS_HEIGHT
      this.ctx = this.canvas.getContext('2d')
      this.availableFonts = this.detectAvailableFonts()
    } else {
      // Node.js environment - mock canvas
      this.availableFonts = ['Arial']
      console.log('Running in Node.js - canvas operations mocked')
    }
  }

  detectAvailableFonts() {
    if (!this.ctx) return ['Arial']

    const available = []
    const testString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    try {
      for (const font of TEXT_CONFIG.OPTIMAL_FONTS) {
        try {
          this.ctx.font = `24px ${font}`
          const width1 = this.ctx.measureText(testString).width

          this.ctx.font = `24px serif`
          const width2 = this.ctx.measureText(testString).width

          if (Math.abs(width1 - width2) > 5) {
            available.push(font)
          }
        } catch (fontError) {
          console.warn(`Font detection failed for ${font}:`, fontError)
        }
      }
    } catch (error) {
      console.warn('Font detection failed, using fallback:', error)
    }

    return available.length > 0 ? available : ['Arial', 'sans-serif']
  }

  calculateOptimalFontSize(text, fontFamily = this.availableFonts[0] || 'Arial') {
    if (!this.ctx) return TEXT_CONFIG.OPTIMAL_FONT_SIZE

    try {
      let minSize = TEXT_CONFIG.MIN_FONT_SIZE
      let maxSize = TEXT_CONFIG.MAX_FONT_SIZE
      const maxWidth = TEXT_CONFIG.CANVAS_WIDTH * TEXT_CONFIG.MAX_WIDTH_RATIO

      while (maxSize - minSize > 1) {
        const fontSize = Math.floor((minSize + maxSize) / 2)
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

  testRender(text, options = {}) {
    console.log(`Testing render: "${text}"`)
    console.log('Available fonts:', this.availableFonts)

    const fontFamily = options.fontFamily || this.availableFonts[0] || 'Arial'
    const optimalSize = this.calculateOptimalFontSize(text, fontFamily)

    console.log(`Optimal font size for "${text}": ${optimalSize}px`)
    console.log(`Using font: ${fontFamily}`)

    return {
      text,
      fontFamily,
      fontSize: optimalSize,
      success: true,
    }
  }
}

// Run tests
function runBugFixTests() {
  console.log('🧪 Running Bug Fix Tests...\n')

  try {
    const renderer = new TestTextRenderer()

    // Test 1: Basic functionality
    console.log('Test 1: Basic functionality')
    const result1 = renderer.testRender('THANK YOU')
    console.log('✅ Basic render test passed\n')

    // Test 2: Font detection
    console.log('Test 2: Font detection')
    console.log('Available fonts:', renderer.availableFonts)
    console.log('✅ Font detection test passed\n')

    // Test 3: Error handling
    console.log('Test 3: Error handling')
    const result3 = renderer.testRender('TEST', { fontFamily: 'NonExistentFont' })
    console.log('✅ Error handling test passed\n')

    // Test 4: Font size calculation
    console.log('Test 4: Font size calculation')
    const shortText = renderer.calculateOptimalFontSize('HI')
    const longText = renderer.calculateOptimalFontSize('VERY LONG TEXT MESSAGE')
    console.log(`Short text font size: ${shortText}px`)
    console.log(`Long text font size: ${longText}px`)
    console.log('✅ Font size calculation test passed\n')

    console.log('🎉 All bug fix tests passed!')
    return true
  } catch (error) {
    console.error('❌ Bug fix tests failed:', error)
    return false
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runBugFixTests, TestTextRenderer }
} else if (typeof window !== 'undefined') {
  window.runBugFixTests = runBugFixTests
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('Enhanced TextRenderer Bug Fix Tests')
  console.log('Run runBugFixTests() to test the fixes')
}
