// Coordinate Mapping Diagnostic Tool
// Tests the texture coordinate mapping for symmetry and correctness

function testCoordinateMapping() {
  console.log('🔍 Testing Drone Coordinate Mapping...\n')

  // Simulate the GLSL coordinate mapping function
  function calculateTextureCoordinates(row, col) {
    let textureX, textureY

    // FIXED mapping logic
    if (row >= 64.0 && col <= 15.0) {
      // Top-left quadrant
      textureX = 127.0 - row
      textureY = 15.0 - col
    } else if (row >= 64.0 && col >= 16.0) {
      // Top-right quadrant
      textureX = 64.0 + (127.0 - row)
      textureY = 31.0 - col // FIXED: was (16.0 - (col - 16.0))
    } else if (row <= 63.0 && col <= 15.0) {
      // Bottom-left quadrant
      textureX = 63.0 - row
      textureY = 16.0 + (15.0 - col)
    } else {
      // Bottom-right quadrant
      textureX = 64.0 + (63.0 - row)
      textureY = 16.0 + (31.0 - col) // FIXED: was (31.0 - (col - 16.0))
    }

    return {
      x: textureX / 127.0,
      y: textureY / 31.0,
      rawX: textureX,
      rawY: textureY,
    }
  }

  // Test corner cases
  const testCases = [
    // Top-left quadrant corners
    { row: 127, col: 0, expected: 'Top-left corner' },
    { row: 127, col: 15, expected: 'Top-left right edge' },
    { row: 64, col: 0, expected: 'Top-left bottom edge' },
    { row: 64, col: 15, expected: 'Top-left bottom-right' },

    // Top-right quadrant corners
    { row: 127, col: 16, expected: 'Top-right corner' },
    { row: 127, col: 31, expected: 'Top-right right edge' },
    { row: 64, col: 16, expected: 'Top-right bottom edge' },
    { row: 64, col: 31, expected: 'Top-right bottom-right' },

    // Bottom-left quadrant corners
    { row: 63, col: 0, expected: 'Bottom-left corner' },
    { row: 63, col: 15, expected: 'Bottom-left right edge' },
    { row: 0, col: 0, expected: 'Bottom-left bottom edge' },
    { row: 0, col: 15, expected: 'Bottom-left bottom-right' },

    // Bottom-right quadrant corners
    { row: 63, col: 16, expected: 'Bottom-right corner' },
    { row: 63, col: 31, expected: 'Bottom-right right edge' },
    { row: 0, col: 16, expected: 'Bottom-right bottom edge' },
    { row: 0, col: 31, expected: 'Bottom-right bottom-right' },
  ]

  console.log('📊 Coordinate Mapping Test Results:')
  console.log('Row | Col | TextureX | TextureY | NormX | NormY | Description')
  console.log('-'.repeat(70))

  testCases.forEach((test) => {
    const result = calculateTextureCoordinates(test.row, test.col)
    console.log(`${test.row.toString().padStart(3)} | ` + `${test.col.toString().padStart(3)} | ` + `${result.rawX.toString().padStart(8)} | ` + `${result.rawY.toString().padStart(8)} | ` + `${result.x.toFixed(3)} | ` + `${result.y.toFixed(3)} | ` + `${test.expected}`)
  })

  // Test symmetry
  console.log('\n🔍 Symmetry Analysis:')

  // Check if left and right quadrants have equal height ranges
  const topLeft = calculateTextureCoordinates(127, 0)
  const topRight = calculateTextureCoordinates(127, 31)
  const bottomLeft = calculateTextureCoordinates(0, 0)
  const bottomRight = calculateTextureCoordinates(0, 31)

  console.log('Top-left Y range:', topLeft.rawY, 'to', bottomLeft.rawY)
  console.log('Top-right Y range:', topRight.rawY, 'to', bottomRight.rawY)

  const leftHeight = Math.abs(topLeft.rawY - bottomLeft.rawY)
  const rightHeight = Math.abs(topRight.rawY - bottomRight.rawY)

  console.log('Left quadrant height:', leftHeight)
  console.log('Right quadrant height:', rightHeight)
  console.log('Heights equal:', leftHeight === rightHeight ? '✅ YES' : '❌ NO')

  // Check texture coverage
  console.log('\n📐 Texture Coverage Analysis:')
  const allCoords = []

  // Sample all quadrants
  for (let row = 0; row <= 127; row += 32) {
    for (let col = 0; col <= 31; col += 8) {
      const coord = calculateTextureCoordinates(row, col)
      allCoords.push(coord)
    }
  }

  const minX = Math.min(...allCoords.map((c) => c.rawX))
  const maxX = Math.max(...allCoords.map((c) => c.rawX))
  const minY = Math.min(...allCoords.map((c) => c.rawY))
  const maxY = Math.max(...allCoords.map((c) => c.rawY))

  console.log(`X range: ${minX} to ${maxX} (expected: 0 to 127)`)
  console.log(`Y range: ${minY} to ${maxY} (expected: 0 to 31)`)
  console.log('Full coverage:', minX === 0 && maxX === 127 && minY === 0 && maxY === 31 ? '✅ YES' : '❌ NO')

  return {
    symmetrical: leftHeight === rightHeight,
    fullCoverage: minX === 0 && maxX === 127 && minY === 0 && maxY === 31,
    leftHeight,
    rightHeight,
  }
}

// Test the old (buggy) mapping for comparison
function testOldMapping() {
  console.log('\n🐛 Testing OLD (Buggy) Mapping for Comparison:')

  function calculateTextureCoordinatesOld(row, col) {
    let textureX, textureY

    if (row >= 64.0 && col <= 15.0) {
      textureX = 127.0 - row
      textureY = 15.0 - col
    } else if (row >= 64.0 && col >= 16.0) {
      textureX = 64.0 + (127.0 - row)
      textureY = 16.0 - (col - 16.0) // BUG: This creates asymmetry
    } else if (row <= 63.0 && col <= 15.0) {
      textureX = 63.0 - row
      textureY = 16.0 + (15.0 - col)
    } else {
      textureX = 64.0 + (63.0 - row)
      textureY = 31.0 - (col - 16.0) // BUG: This creates asymmetry
    }

    return { rawX: textureX, rawY: textureY }
  }

  const topLeftOld = calculateTextureCoordinatesOld(127, 0)
  const topRightOld = calculateTextureCoordinatesOld(127, 31)
  const bottomLeftOld = calculateTextureCoordinatesOld(0, 0)
  const bottomRightOld = calculateTextureCoordinatesOld(0, 31)

  const leftHeightOld = Math.abs(topLeftOld.rawY - bottomLeftOld.rawY)
  const rightHeightOld = Math.abs(topRightOld.rawY - bottomRightOld.rawY)

  console.log('OLD - Left quadrant height:', leftHeightOld)
  console.log('OLD - Right quadrant height:', rightHeightOld)
  console.log('OLD - Heights equal:', leftHeightOld === rightHeightOld ? '✅ YES' : '❌ NO')
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testCoordinateMapping, testOldMapping }
} else if (typeof window !== 'undefined') {
  window.testCoordinateMapping = testCoordinateMapping
  window.testOldMapping = testOldMapping
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('Drone Coordinate Mapping Diagnostic Tool')
  console.log('Run testCoordinateMapping() to test the fixes')
  console.log('Run testOldMapping() to see the old bugs')
}
