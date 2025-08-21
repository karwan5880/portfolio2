const fs = require('fs')
const opentype = require('opentype.js')

// config
const TEXT = 'Leong Kar Wan'
const FONTFILE = 'public/font/Caveat-Regular.ttf' // change if using Bold/SemiBold
const FONT_SIZE = 160
const PADDING = 20
const DECIMALS = 2

opentype.load(FONTFILE, (err, font) => {
  if (err) {
    console.error('Font load error:', err)
    process.exit(1)
  }

  const letters = []
  let x = 0 // cursor position

  for (const char of TEXT) {
    if (char === ' ') {
      // add space manually
      x += FONT_SIZE * 0.4 // tweak spacing for Caveat
      continue
    }

    const glyph = font.charToGlyph(char)
    const path = glyph.getPath(x, FONT_SIZE, FONT_SIZE, { kerning: true })
    const d = path.toPathData(DECIMALS)

    letters.push({
      char,
      d,
    })

    // advance cursor
    x += glyph.advanceWidth * (FONT_SIZE / font.unitsPerEm)
  }

  fs.writeFileSync('letters.json', JSON.stringify(letters, null, 2), 'utf8')
  console.log('✔ Wrote letters.json with', letters.length, 'glyphs.')
})
