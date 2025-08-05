import { useEffect, useState } from 'react'
import * as THREE from 'three'

import { choreography } from './choreography'

const TEXTURE_SIZE = 64
const DRONE_COUNT = 3328

// --- Formation Generators (These are now correct) ---
function generate2024TextData() {
  const pos = []
  const color = []
  const info = []
  const depth = 2
  const scale = 8
  const points = [
    { x: 0, y: 4 },
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 2, y: 3 },
    { x: 2, y: 2 },
    { x: 1, y: 2 },
    { x: 0, y: 2 },
    { x: 0, y: 1 },
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 4, y: 4 },
    { x: 5, y: 4 },
    { x: 6, y: 4 },
    { x: 4, y: 3 },
    { x: 6, y: 3 },
    { x: 4, y: 2 },
    { x: 6, y: 2 },
    { x: 4, y: 1 },
    { x: 6, y: 1 },
    { x: 4, y: 0 },
    { x: 5, y: 0 },
    { x: 6, y: 0 },
    { x: 8, y: 4 },
    { x: 9, y: 4 },
    { x: 10, y: 4 },
    { x: 10, y: 3 },
    { x: 10, y: 2 },
    { x: 9, y: 2 },
    { x: 8, y: 2 },
    { x: 8, y: 1 },
    { x: 8, y: 0 },
    { x: 9, y: 0 },
    { x: 10, y: 0 },
    { x: 12, y: 4 },
    { x: 14, y: 4 },
    { x: 12, y: 3 },
    { x: 14, y: 3 },
    { x: 12, y: 2 },
    { x: 13, y: 2 },
    { x: 14, y: 2 },
    { x: 14, y: 1 },
    { x: 14, y: 0 },
  ]
  let droneId = 0
  for (const p of points) {
    for (let d = 0; d < depth; d++) {
      pos.push((p.x - 7.5) * scale, (p.y - 2) * scale, d * scale)
      const c = new THREE.Color().lerpColors(new THREE.Color(0x0055ff), new THREE.Color(0xffffff), d / (depth - 1))
      color.push(c.r, c.g, c.b, 1.0)
      info.push(0, 0, 0, 0)
      droneId++
    }
  }
  return { pos, color, info, count: droneId }
}

function generateSphereData(startId, count) {
  const pos = []
  const color = []
  const info = []
  const headCount = Math.floor(count / 2)
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = Math.PI * (3 - Math.sqrt(5)) * i
    pos.push(Math.cos(theta) * r * 40, y * 40 + 40, Math.sin(theta) * r * 40)
    const c = new THREE.Color(i < headCount ? '#ff4b1f' : '#ffc107')
    color.push(c.r, c.g, c.b, 1.0)
    info.push(i < headCount ? choreography.DRAGON_HEAD : choreography.DRAGON_TAIL, 0, 0, 0)
  }
  return { pos, color, info, count }
}

export function useDroneShowData() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const totalDrones = TEXTURE_SIZE * TEXTURE_SIZE

    const textData = generate2024TextData()
    const sphereData = generateSphereData(0, DRONE_COUNT)

    const posTextures = {}
    const colorTextures = {}
    const darkDroneColor = [0, 0, 0, 0]

    // --- "2024" Formation Data ---
    const textPosData = new Float32Array(totalDrones * 4)
    const textColorData = new Float32Array(totalDrones * 4)
    for (let i = 0; i < DRONE_COUNT; i++) {
      if (i < textData.count) {
        textPosData.set(textData.pos.slice(i * 3, i * 3 + 3), i * 4)
        textColorData.set(textData.color.slice(i * 4, i * 4 + 4), i * 4)
      } else {
        textPosData.set([0, 1000, 0], i * 4) // Send unused drones far away
        textColorData.set(darkDroneColor, i * 4)
      }
    }
    posTextures['2024'] = new THREE.DataTexture(textPosData, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    colorTextures['2024'] = new THREE.DataTexture(textColorData, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)

    // --- "Sphere" Formation Data ---
    const spherePosData = new Float32Array(totalDrones * 4)
    const sphereColorData = new Float32Array(totalDrones * 4)
    for (let i = 0; i < DRONE_COUNT; i++) {
      spherePosData.set(sphereData.pos.slice(i * 3, i * 3 + 3), i * 4)
      sphereColorData.set(sphereData.color.slice(i * 4, i * 4 + 4), i * 4)
    }
    posTextures['Sphere'] = new THREE.DataTexture(spherePosData, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    colorTextures['Sphere'] = new THREE.DataTexture(sphereColorData, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)

    // --- START OF THE DEFINITIVE FIX ---
    // --- "Grid" Formation Data ---
    const gridColorData = new Float32Array(totalDrones * 4)
    for (let i = 0; i < DRONE_COUNT; i++) {
      // For the grid, turn ALL active drones ON.
      gridColorData.set([0.8, 0.9, 1.0, 1.0], i * 4)
    }
    const gridColorTexture = new THREE.DataTexture(gridColorData, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    // --- END OF THE DEFINITIVE FIX ---

    const initialPositionTexture = posTextures['2024']

    // --- Final Assembly ---
    const droneInfoTexture = new THREE.DataTexture(new Float32Array(totalDrones * 4), TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    const particleGeometry = new THREE.BufferGeometry()
    const uvs = new Float32Array(totalDrones * 2)
    for (let i = 0; i < TEXTURE_SIZE; i++) {
      for (let j = 0; j < TEXTURE_SIZE; j++) {
        const k = (i * TEXTURE_SIZE + j) * 2
        uvs[k] = i / (TEXTURE_SIZE - 1)
        uvs[k + 1] = j / (TEXTURE_SIZE - 1)
      }
    }
    particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(totalDrones * 3), 3))

    setData({
      initialPositionTexture,
      particleGeometry,
      droneInfoTexture,
      formations: [
        { name: choreography.formations.GRID.name, positionTexture: initialPositionTexture, colorTexture: gridColorTexture },
        { name: choreography.formations.TEXT_2024.name, positionTexture: posTextures['2024'], colorTexture: colorTextures['2024'] },
        { name: choreography.formations.SPHERE.name, positionTexture: posTextures['Sphere'], colorTexture: colorTextures['Sphere'] },
      ],
    })
  }, [])

  return data
}
