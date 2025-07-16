// DroneShowDemo/useDroneShowData.js --- FINAL VERSION
import { useEffect, useState } from 'react'
import * as THREE from 'three'

import { choreography } from './choreography'

const TEXTURE_SIZE = 64
const DRONE_COUNT = 4096

function generateStartData() {
  const pos = new Float32Array(DRONE_COUNT * 4)
  const startPos = new THREE.Vector3(200, 100, -200)
  for (let i = 0; i < DRONE_COUNT; i++) {
    pos.set([startPos.x, startPos.y, startPos.z, 1.0], i * 4)
  }
  return { pos }
}
function generateGridData() {
  const pos = new Float32Array(DRONE_COUNT * 4),
    color = new Float32Array(DRONE_COUNT * 4),
    info = new Float32Array(DRONE_COUNT * 4)
  const size = 16,
    spacing = 3.0
  let id = 0
  for (let l = 0; l < size; l++) {
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const k = id * 4
        pos.set([(c - (size - 1) / 2) * spacing, (r - (size - 1) / 2) * spacing + 25, (l - (size - 1) / 2) * spacing], k)
        color.set([0.8, 0.9, 1.0, 1.0], k)
        info.set([c, r, l, id], k)
        id++
      }
    }
  }
  return { pos, color, info }
}

function generateTextData() {
  const posData = new Float32Array(DRONE_COUNT * 4)
  const colorData = new Float32Array(DRONE_COUNT * 4)
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
      posData.set([(p.x - 1) * 15, (p.y - 2) * 15, 0], k)
      colorData.set([0.0, 0.5, 1.0, 1.0], k)
    } else {
      posData.set([0, 1000, 0], k) // Hide unused drones
      colorData.set([0, 0, 0, 0], k)
    }
  }
  return { pos: posData, color: colorData }
}
function generateSphereData() {
  const posData = new Float32Array(DRONE_COUNT * 4)
  const colorData = new Float32Array(DRONE_COUNT * 4)
  const radius = 40
  for (let i = 0; i < DRONE_COUNT; i++) {
    const k = i * 4
    const y = 1 - (i / (DRONE_COUNT - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = Math.PI * (3 - Math.sqrt(5)) * i
    posData.set([Math.cos(theta) * r * radius, y * radius + radius, Math.sin(theta) * r * radius], k)
    const c = new THREE.Color().lerpColors(new THREE.Color('#ff4b1f'), new THREE.Color('#ffc107'), (y + 1) / 2)
    colorData.set([c.r, c.g, c.b, 1.0], k)
  }
  return { pos: posData, color: colorData }
}

export function useDroneShowData() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const startData = generateStartData()
    const gridData = generateGridData()
    const textData = generateTextData()
    const sphereData = generateSphereData()

    const startPosTexture = new THREE.DataTexture(startData.pos, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    startPosTexture.needsUpdate = true
    const gridPosTexture = new THREE.DataTexture(gridData.pos, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    gridPosTexture.needsUpdate = true
    const gridColorTexture = new THREE.DataTexture(gridData.color, TEXTURE_SIZE, TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    gridColorTexture.needsUpdate = true
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
      initialPositionTexture: startPosTexture,
      startPosTexture,
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
