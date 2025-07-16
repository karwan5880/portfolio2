// import helvetiker from '/public/helvetiker_regular.typeface.json'
import * as THREE from 'three'
import { SVGLoader } from 'three-stdlib'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
// import { TextGeometry } from 'three-stdlib/geometries/TextGeometry.js'
// import { FontLoader } from 'three-stdlib/loaders/FontLoader.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

export const NUM_DRONES = 400
export const BOUNDS = 80

export function generateImplosionPattern() {
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  // A hot, intense white color for the implosion point
  const color = new THREE.Color('#ffffff')
  // The target for EVERY drone is the exact center of the scene
  for (let i = 0; i < NUM_DRONES; i++) {
    positions.set([0, 0, 0], i * 3)
    colors.set([color.r, color.g, color.b], i * 3)
  }
  return { positions, colors }
}

export async function generateSvgPattern(url) {
  const loader = new SVGLoader()
  const svgData = await loader.loadAsync(url)
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  const color = new THREE.Color('#00ffff') // A cool cyan color for the signature
  const allPoints = []
  // // Loop through all paths in the SVG
  for (const path of svgData.paths) {
    const shapes = SVGLoader.createShapes(path)
    for (const shape of shapes) {
      // Get a set of points from the shape's path
      const points = shape.getPoints(100) // 100 points per shape
      allPoints.push(...points)
    }
  }
  // Find the bounding box to center and scale the SVG
  const box = new THREE.Box2().setFromPoints(allPoints)
  const size = box.getSize(new THREE.Vector2())
  const scale = BOUNDS / 2 / Math.max(size.x, size.y)
  // Distribute our drones randomly among the points from the SVG
  for (let i = 0; i < NUM_DRONES; i++) {
    const point = allPoints[Math.floor(Math.random() * allPoints.length)]
    const x = (point.x - box.min.x - size.x / 2) * scale
    const y = -(point.y - box.min.y - size.y / 2) * scale // Invert Y-axis
    positions.set([x, y, 0], i * 3)
    colors.set([color.r, color.g, color.b], i * 3)
  }
  return { positions, colors }
}

export function generateFinalePattern() {
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  const color = new THREE.Color('#ffffff') // Brilliant white for the finale flash
  const radius = BOUNDS * 5 // A huge radius, well outside the camera view

  for (let i = 0; i < NUM_DRONES; i++) {
    // Distribute points evenly on a sphere using the same technique as our sphere pattern
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const theta = (2 * Math.PI * i) / goldenRatio
    const phi = Math.acos(1 - (2 * (i + 0.5)) / NUM_DRONES)

    positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi)
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    // All drones turn brilliant white
    colors.set([color.r, color.g, color.b], i * 3)
  }
  return { positions, colors }
}

/**
 * Generates drone positions AND colors from an image file.
 * @param {string} imageUrl The public URL of the image to load.
 */
export async function generateImagePattern(imageUrl) {
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)

  // Load the image and draw it to an off-screen canvas to read its pixel data
  const image = new Image()
  image.src = imageUrl
  await new Promise((resolve) => {
    image.onload = resolve
  })

  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0)

  const imageData = ctx.getImageData(0, 0, image.width, image.height).data

  // Find all valid pixels (e.g., not fully transparent) and store their coordinates and colors
  const validPoints = []
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const i = (y * image.width + x) * 4 // 4 values per pixel (R, G, B, A)
      const alpha = imageData[i + 3]

      // We'll consider any pixel with some visibility
      if (alpha > 50) {
        validPoints.push({
          x: x - image.width / 2, // Center the image on the x-axis
          y: -y + image.height / 2, // Center and invert the y-axis
          r: imageData[i] / 255, // Normalize color to 0-1 range
          g: imageData[i + 1] / 255,
          b: imageData[i + 2] / 255,
        })
      }
    }
  }

  if (validPoints.length === 0) {
    console.error('No valid points found in image. Is it transparent or all black?')
    // Fallback to a single point to avoid crashing
    validPoints.push({ x: 0, y: 0, r: 1, g: 1, b: 1 })
  }

  // Assign a drone to a random valid point from the image
  const scale = BOUNDS / Math.max(image.width, image.height)
  for (let i = 0; i < NUM_DRONES; i++) {
    const point = validPoints[Math.floor(Math.random() * validPoints.length)]
    positions.set([point.x * scale, point.y * scale, 0], i * 3) // z is 0 for a flat image
    colors.set([point.r, point.g, point.b], i * 3)
  }

  return { positions, colors }
}

/**
 * Generates drone positions AND colors from 3D text.
 * Note: This is an async function because font loading is async.
 */
export async function generateTextPattern() {
  //   const font = new FontLoader().parse(helvetiker)
  const fontLoader = new FontLoader()

  const font = await new Promise((resolve, reject) => {
    fontLoader.load(
      '/fonts/Roboto_Regular.json', // The public URL to the font file
      //   '/fonts/Inter_Bold2.json', // The public URL to the font file
      //   '/helvetiker_regular.typeface.json', // The public URL to the font file
      resolve, // OnLoad callback
      undefined, // OnProgress callback (optional)
      reject // OnError callback
    )
  })

  const textOptions = {
    font: font,
    size: 15, // The size of the text
    height: 3, // The thickness of the text
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.5,
    bevelSize: 0.3,
    bevelSegments: 5,
  }

  // Create the 3D geometry for the text
  const textGeo = new TextGeometry('FINALE', textOptions)

  // Center the geometry so it rotates around its middle
  textGeo.center()

  // --- SAMPLING POINTS FROM THE GEOMETRY ---
  // We need to pick 12,000 random points from the surface of the text model.
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  const color = new THREE.Color('#ffffff') // Bright white for the text

  // This is a simple sampling method. It picks random vertices from the geometry.
  // For a more uniform distribution, a more advanced surface sampling algorithm would be used.
  for (let i = 0; i < NUM_DRONES; i++) {
    const vertexIndex = Math.floor(Math.random() * textGeo.attributes.position.count)
    const pos = new THREE.Vector3().fromBufferAttribute(textGeo.attributes.position, vertexIndex)
    positions.set([pos.x, pos.y, pos.z], i * 3)
    colors.set([color.r, color.g, color.b], i * 3)
  }

  return { positions, colors }
}

/**
 * Generates drone positions AND colors for a hollow sphere pattern.
 * Colors will be a cool blue.
 */
export function generateSpherePattern() {
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  const color = new THREE.Color('#00bfff') // Deep Sky Blue
  const radius = BOUNDS / 2.5

  for (let i = 0; i < NUM_DRONES; i++) {
    const goldenRatio = (1 + Math.sqrt(5)) / 2
    const theta = (2 * Math.PI * i) / goldenRatio
    const phi = Math.acos(1 - (2 * (i + 0.5)) / NUM_DRONES)

    positions[i * 3] = radius * Math.cos(theta) * Math.sin(phi)
    positions[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    colors.set([color.r, color.g, color.b], i * 3)
  }
  return { positions, colors }
}

/**
 * Generates drone positions AND colors for a hollow cube pattern.
 * Colors will be a fiery orange.
 */
export function generateCubePattern() {
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  const color = new THREE.Color('#ff4500') // OrangeRed
  const half = BOUNDS / 2

  for (let i = 0; i < NUM_DRONES; i++) {
    const face = Math.floor(Math.random() * 6)
    const x = THREE.MathUtils.randFloatSpread(BOUNDS)
    const y = THREE.MathUtils.randFloatSpread(BOUNDS)
    const z = THREE.MathUtils.randFloatSpread(BOUNDS)

    switch (face) {
      case 0:
        positions.set([x, y, half], i * 3)
        break
      case 1:
        positions.set([x, y, -half], i * 3)
        break
      case 2:
        positions.set([half, y, z], i * 3)
        break
      case 3:
        positions.set([-half, y, z], i * 3)
        break
      case 4:
        positions.set([x, half, z], i * 3)
        break
      case 5:
        positions.set([x, -half, z], i * 3)
        break
    }

    colors.set([color.r, color.g, color.b], i * 3)
  }
  return { positions, colors }
}

/**
 * Generates drone positions AND colors for a Torus (donut) pattern.
 * Colors will be a vibrant magenta.
 */
export function generateTorusPattern() {
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  const color = new THREE.Color('#ff00ff') // Magenta
  const radius = BOUNDS / 3 // Major radius of the torus
  const tube = radius / 4 // Minor radius (thickness)

  for (let i = 0; i < NUM_DRONES; i++) {
    // Randomly pick a point on the circle (for the tube)
    const u = Math.random() * 2 * Math.PI
    // Randomly pick a point on the larger circle (for the main ring)
    const v = Math.random() * 2 * Math.PI

    positions[i * 3] = (radius + tube * Math.cos(v)) * Math.cos(u)
    positions[i * 3 + 1] = (radius + tube * Math.cos(v)) * Math.sin(u)
    positions[i * 3 + 2] = tube * Math.sin(v)

    colors.set([color.r, color.g, color.b], i * 3)
  }
  return { positions, colors }
}
