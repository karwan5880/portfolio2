import { useEffect, useState } from 'react'
import * as THREE from 'three'

import { choreography } from './choreography'

const TEXTURE_SIZE = 64
const DRONE_COUNT = 4096

function generateOffscreenData() {
  const pos = new Float32Array(DRONE_COUNT * 4)
  const startPos = new THREE.Vector3(200, 100, -200)
  for (let i = 0; i < DRONE_COUNT; i++) {
    const k = i * 4
    pos[k + 0] = startPos.x
    pos[k + 1] = startPos.y
    pos[k + 2] = startPos.z
  }
  return { pos }
}

function generateGridData() {
  const pos = new Float32Array(DRONE_COUNT * 4)
  const color = new Float32Array(DRONE_COUNT * 4)
  const info = new Float32Array(DRONE_COUNT * 4)
  const size = 16
  const spacing = 3.0
  let droneId = 0
  for (let layer = 0; layer < size; layer++) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const k = droneId * 4
        const x = (col - (size - 1) / 2) * spacing
        const y = (row - (size - 1) / 2) * spacing + 25
        const z = (layer - (size - 1) / 2) * spacing
        pos[k + 0] = x
        pos[k + 1] = y
        pos[k + 2] = z
        color[k + 0] = 0.8
        color[k + 1] = 0.9
        color[k + 2] = 1.0
        color[k + 3] = 1.0
        info[k + 0] = col
        info[k + 1] = row
        info[k + 2] = layer
        info[k + 3] = droneId
        droneId++
      }
    }
  }
  return { pos, color, info }
}

// --- Generator Functions (These are correct) ---
function generateInitialGridData2() {
  const pos = new Float32Array(DRONE_COUNT * 4)
  const color = new Float32Array(DRONE_COUNT * 4)
  const dronesPerRow = 100
  const spacing = 2.0
  for (let i = 0; i < DRONE_COUNT; i++) {
    const k = i * 4
    pos[k + 0] = ((i % dronesPerRow) - dronesPerRow / 2) * spacing
    pos[k + 1] = 20
    pos[k + 2] = Math.floor(i / dronesPerRow) * spacing - 40
    color[k + 0] = 0.8
    color[k + 1] = 0.9
    color[k + 2] = 1.0
    color[k + 3] = 1.0
  }
  return { pos, color }
}
function generateTextData() {
  const pos = new Float32Array(DRONE_COUNT * 4)
  const color = new Float32Array(DRONE_COUNT * 4)
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
  ]
  const textDroneCount = points.length
  for (let i = 0; i < DRONE_COUNT; i++) {
    const k = i * 4
    if (i < textDroneCount) {
      const p = points[i]
      pos[k + 0] = (p.x - 1) * 15
      pos[k + 1] = (p.y - 2) * 15
      pos[k + 2] = 0
      color[k + 0] = 0.0
      color[k + 1] = 0.5
      color[k + 2] = 1.0
      color[k + 3] = 1.0
    } else {
      pos[k + 0] = 0
      pos[k + 1] = 1000
      pos[k + 2] = 0
      color[k + 0] = 0
      color[k + 1] = 0
      color[k + 2] = 0
      color[k + 3] = 0
    }
  }
  return { pos, color }
}
function generateSphereData() {
  const pos = new Float32Array(DRONE_COUNT * 4)
  const color = new Float32Array(DRONE_COUNT * 4)
  const info = new Float32Array(DRONE_COUNT * 4)
  const colorA = new THREE.Color('#ff4b1f')
  const colorB = new THREE.Color('#ffc107')
  const groupACount = DRONE_COUNT / 2
  const radius = 40

  for (let i = 0; i < DRONE_COUNT; i++) {
    const k = i * 4
    const y = 1 - (i / (DRONE_COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = Math.PI * (3 - Math.sqrt(5)) * i
    pos[k + 0] = Math.cos(theta) * r * radius
    pos[k + 1] = y * radius + radius
    pos[k + 2] = Math.sin(theta) * r * radius
    const c = new THREE.Color().lerpColors(colorA, colorB, (y + 1) / 2)
    color[k + 0] = c.r
    color[k + 1] = c.g
    color[k + 2] = c.b
    color[k + 3] = 1.0

    // Assign the drone to a group based on its ID
    info[k + 0] = i < groupACount ? choreography.GROUP_A : choreography.GROUP_B
  }
  return { pos, color, info }
}

export function useDroneShowData() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const offscreenData = generateOffscreenData()
    const gridData = generateGridData()
    const textData = generateTextData()
    const sphereData = generateSphereData()

    const initialPositionTexture = new THREE.DataTexture(offscreenData.pos, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    initialPositionTexture.needsUpdate = true

    const gridPosTexture = new THREE.DataTexture(gridData.pos, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    gridPosTexture.needsUpdate = true
    const gridColorTexture = new THREE.DataTexture(gridData.color, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    gridColorTexture.needsUpdate = true

    // // --- Generate Raw Data ---
    // const initialData = generateInitialGridData()
    // // --- Create Data Textures with the .needsUpdate = true flag ---
    // const gridPosTexture = new THREE.DataTexture(initialData.pos, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    // gridPosTexture.needsUpdate = true
    // const gridColorTexture = new THREE.DataTexture(initialData.color, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    // gridColorTexture.needsUpdate = true

    const textPosTexture = new THREE.DataTexture(textData.pos, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    textPosTexture.needsUpdate = true
    const textColorTexture = new THREE.DataTexture(textData.color, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    textColorTexture.needsUpdate = true

    const spherePosTexture = new THREE.DataTexture(sphereData.pos, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    spherePosTexture.needsUpdate = true
    const sphereColorTexture = new THREE.DataTexture(sphereData.color, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    sphereColorTexture.needsUpdate = true

    const droneInfoTexture = new THREE.DataTexture(gridData.info, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    droneInfoTexture.needsUpdate = true

    const particleGeometry = new THREE.BufferGeometry()
    const uvs = new Float32Array(DRONE_COUNT * 2)
    for (let i = 0; i < TEXTURE_SIZE; i++) {
      for (let j = 0; j < TEXTURE_SIZE; j++) {
        const k = (i * TEXTURE_SIZE + j) * 2
        uvs[k] = i / (TEXTURE_SIZE - 1)
        uvs[k + 1] = j / (TEXTURE_SIZE - 1)
      }
    }
    particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))

    setData({
      particleGeometry,
      initialPositionTexture: gridPosTexture,
      droneInfoTexture,
      formations: [
        { name: choreography.formations.GRID.name, positionTexture: gridPosTexture, colorTexture: gridColorTexture },
        { name: choreography.formations.TEXT.name, positionTexture: textPosTexture, colorTexture: textColorTexture },
        { name: choreography.formations.SPHERE.name, positionTexture: spherePosTexture, colorTexture: sphereColorTexture },
      ],
    })
  }, [])
  return data
}
