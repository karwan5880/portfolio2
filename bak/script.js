// make-svg-path.js
// Usage examples:
//   node make-svg-path.js --text "Leong Kar Wan"
//   node make-svg-path.js --text "Leong Kar Wan" --font Caveat-Bold.ttf --size 180 --pad 24 --decimals 2 --fill "#000"

const fs = require('fs')
const path = require('path')
const opentype = require('opentype.js')

// --- CLI args (tiny parser) ---
const args = process.argv.slice(2).reduce((acc, cur, i, arr) => {
  if (cur.startsWith('--')) {
    const key = cur.replace(/^--/, '')
    const val = arr[i + 1] && !arr[i + 1].startsWith('--') ? arr[i + 1] : true
    acc[key] = val
  }
  return acc
}, {})

// Inputs (with defaults)
const TEXT = String(args.text ?? 'Leong Kar Wan')
const FONTFILE = String(args.font ?? 'Caveat-Regular.ttf')
const FONT_SIZE = Number(args.size ?? 160) // pixel-ish units for SVG
const PADDING = Number(args.pad ?? 20) // extra space around glyphs
const DECIMALS = Math.max(0, Number(args.decimals ?? 2)) // path precision
const FILL = args.fill === true ? 'currentColor' : (args.fill ?? 'currentColor')
const STROKE = args.stroke || null // e.g. "#000"
const STROKE_W = args['stroke-width'] ? Number(args['stroke-width']) : null
const OUTFILE = String(args.out ?? `${TEXT.replace(/\s+/g, '-')}-caveat.svg`)

if (!fs.existsSync(FONTFILE)) {
  console.error(`Font not found: ${FONTFILE}\nPlace ${FONTFILE} in this folder (e.g. Caveat-Regular.ttf).`)
  process.exit(1)
}

opentype.load(FONTFILE, (err, font) => {
  if (err) {
    console.error('Failed to load font:', err)
    process.exit(1)
  }

  // Build one path for the whole string (with kerning)
  const textPath = font.getPath(TEXT, 0, FONT_SIZE, FONT_SIZE, { kerning: true })

  // Convert to SVG path data with chosen precision
  const d = textPath.toPathData(DECIMALS)

  // Compute bounding box to size/position the SVG snugly with padding
  const bb = textPath.getBoundingBox()
  const width = bb.x2 - bb.x1 + PADDING * 2
  const height = bb.y2 - bb.y1 + PADDING * 2

  // Shift so the path sits inside the padded viewBox at (0,0)
  const shiftX = PADDING - bb.x1
  const shiftY = PADDING - bb.y1

  const attribFill = FILL ? ` fill="${FILL}"` : ''
  const attribStroke = STROKE ? ` stroke="${STROKE}"` : ''
  const attribStrokeW = STROKE_W != null ? ` stroke-width="${STROKE_W}"` : ''

  const svg =
    `
<svg xmlns="http://www.w3.org/2000/svg"
     width="${Math.ceil(width)}" height="${Math.ceil(height)}"
     viewBox="0 0 ${width} ${height}">
  <g transform="translate(${shiftX}, ${shiftY})">
    <path d="${d}"${attribFill}${attribStroke}${attribStrokeW}/>
  </g>
</svg>`.trim() + '\n'

  fs.writeFileSync(OUTFILE, svg, 'utf8')
  console.log(`✔ Wrote ${OUTFILE}`)
  console.log('Tip: Open it in a viewer/editor or inline it directly in HTML.')
})

// node script.js --text "Leong Kar Wan" --font Caveat-Regular.ttf
