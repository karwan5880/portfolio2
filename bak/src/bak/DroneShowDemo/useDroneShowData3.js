import { useEffect, useState } from 'react'
import * as THREE from 'three'

import { choreography } from './choreography'

// Import our master list

const SIZE = 64 // Calibrated size

// --- Modular Generators ---
function generateGridData(totalDrones) {
  const pos = new Float32Array(totalDrones * 4)
  const color = new Float32Array(totalDrones * 4)
  const dronesPerRow = 100 // Adjusted for a more compact grid
  const spacing = 1.5
  for (let i = 0; i < totalDrones; i++) {
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

function generateSphereData(totalDrones) {
  const pos = new Float32Array(totalDrones * 4)
  const color = new Float32Array(totalDrones * 4)
  const radius = 40
  const colorA = new THREE.Color('#ff4b1f')
  const colorB = new THREE.Color('#ffc107')
  for (let i = 0; i < totalDrones; i++) {
    const k = i * 4
    const y = 1 - (i / (totalDrones - 1)) * 2
    const radiusAtY = Math.sqrt(1 - y * y)
    const theta = Math.PI * (3 - Math.sqrt(5)) * i
    pos[k + 0] = Math.cos(theta) * radiusAtY * radius
    pos[k + 1] = y * radius + radius
    pos[k + 2] = Math.sin(theta) * radiusAtY * radius
    const finalColor = new THREE.Color().lerpColors(colorA, colorB, (y + 1) / 2)
    color[k + 0] = finalColor.r
    color[k + 1] = finalColor.g
    color[k + 2] = finalColor.b
    color[k + 3] = 1.0
  }
  return { pos, color }
}

export function useDroneShowData() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const totalDrones = SIZE * SIZE

    // Generate data using our modular functions
    const gridData = generateGridData(totalDrones)
    const sphereData = generateSphereData(totalDrones)

    // Assemble the final data textures
    const initialPositionTexture = new THREE.DataTexture(gridData.pos, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    initialPositionTexture.needsUpdate = true
    const gridPositionTexture = new THREE.DataTexture(gridData.pos, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    gridPositionTexture.needsUpdate = true
    const gridColorTexture = new THREE.DataTexture(gridData.color, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    gridColorTexture.needsUpdate = true
    const spherePositionTexture = new THREE.DataTexture(sphereData.pos, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    spherePositionTexture.needsUpdate = true
    const sphereColorTexture = new THREE.DataTexture(sphereData.color, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    sphereColorTexture.needsUpdate = true

    const particleGeometry = new THREE.BufferGeometry()
    const uvs = new Float32Array(totalDrones * 2)
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = (i * SIZE + j) * 2
        uvs[k] = i / (SIZE - 1)
        uvs[k + 1] = j / (SIZE - 1)
      }
    }
    particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(totalDrones * 3), 3))

    setData({
      initialPositionTexture,
      particleGeometry,
      // The list of formations is now built programmatically
      formations: [
        { name: choreography.GRID.name, positionTexture: gridPositionTexture, colorTexture: gridColorTexture },
        { name: choreography.SPHERE.name, positionTexture: spherePositionTexture, colorTexture: sphereColorTexture },
      ],
    })
  }, [])

  return data
}
