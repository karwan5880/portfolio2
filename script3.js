// build-svg.js
const fs = require('fs')
const letters = require('./letters.json')

// adjust scaling/translation if needed
const svgOpen = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 200">`
const svgClose = `</svg>`

let paths = letters.map((l) => `<path d="${l.d}" fill="none" stroke="black" stroke-width="2"/>`).join('\n')

const svg = `${svgOpen}\n${paths}\n${svgClose}`

fs.writeFileSync('public/leongkarwan.svg', svg)
console.log('✅ SVG generated at public/leongkarwan.svg')
