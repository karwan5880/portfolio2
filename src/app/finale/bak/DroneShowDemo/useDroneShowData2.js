import { useEffect, useState } from 'react'
import * as THREE from 'three'

const SIZE = 64

export function useDroneShowData() {
  const [data, setData] = useState(null)

  useEffect(() => {
    // --- START OF FIX: Ensure ALL drones are initialized ---
    const totalDrones = SIZE * SIZE
    const gridPosData = new Float32Array(totalDrones * 4)
    const gridColorData = new Float32Array(totalDrones * 4)

    // We will place all drones in a massive grid, ignoring the specific counts for now.
    // This guarantees every drone has a unique starting spot.
    const dronesPerRow = 500 // Let's create a huge grid off to the side
    const DRONE_SPACING = 2.0

    for (let i = 0; i < totalDrones; i++) {
      const k = i * 4
      const x = ((i % dronesPerRow) - dronesPerRow / 2) * DRONE_SPACING
      const z = Math.floor(i / dronesPerRow) * DRONE_SPACING
      const y = 20 // All start at a consistent height

      gridPosData[k + 0] = x
      gridPosData[k + 1] = y
      gridPosData[k + 2] = z - 80 // Move the whole grid back

      const color = new THREE.Color(0.8, 0.9, 1.0)
      gridColorData[k + 0] = color.r
      gridColorData[k + 1] = color.g
      gridColorData[k + 2] = color.b
      gridColorData[k + 3] = 1.0
    }
    // --- END OF FIX ---

    // --- The Sphere Formation logic remains the same ---
    const spherePosData = new Float32Array(totalDrones * 4)
    const sphereColorData = new Float32Array(totalDrones * 4)
    const radius = 40
    const colorA = new THREE.Color('#ff4b1f')
    const colorB = new THREE.Color('#ffc107')
    for (let i = 0; i < totalDrones; i++) {
      const k = i * 4
      //   const phi = Math.acos(-1 + (2 * i) / totalDrones)
      //   const theta = Math.sqrt(totalDrones * Math.PI) * phi
      //   spherePosData[k + 0] = radius * Math.cos(theta) * Math.sin(phi)
      //   spherePosData[k + 1] = radius * Math.sin(theta) * Math.sin(phi) + radius
      //   spherePosData[k + 2] = radius * Math.cos(phi)
      const y = 1 - (i / (totalDrones - 1)) * 2 // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y) // radius at y
      const goldenAngle = Math.PI * (3 - Math.sqrt(5)) // Golden angle in radians
      const theta = goldenAngle * i // Golden angle increment
      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY
      spherePosData[k + 0] = x * radius
      spherePosData[k + 1] = y * radius + radius // Center the sphere
      spherePosData[k + 2] = z * radius
      //   const finalColor = new THREE.Color().lerpColors(colorA, colorB, Math.sin(phi))
      const finalColor = new THREE.Color().lerpColors(colorA, colorB, (y + 1) / 2) // Gradient from bottom to top
      sphereColorData[k + 0] = finalColor.r
      sphereColorData[k + 1] = finalColor.g
      sphereColorData[k + 2] = finalColor.b
      sphereColorData[k + 3] = 1.0
    }

    // --- Create Data Textures (remains the same) ---
    const initialPositionTexture = new THREE.DataTexture(gridPosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    initialPositionTexture.needsUpdate = true
    const gridPositionTexture = new THREE.DataTexture(gridPosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    gridPositionTexture.needsUpdate = true
    const gridColorTexture = new THREE.DataTexture(gridColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    gridColorTexture.needsUpdate = true
    const spherePositionTexture = new THREE.DataTexture(spherePosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    spherePositionTexture.needsUpdate = true
    const sphereColorTexture = new THREE.DataTexture(sphereColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    sphereColorTexture.needsUpdate = true

    // --- Particle Geometry (remains the same) ---
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
      formations: [
        { name: 'Grid', positionTexture: gridPositionTexture, colorTexture: gridColorTexture },
        { name: 'Sphere', positionTexture: spherePositionTexture, colorTexture: sphereColorTexture },
      ],
    })
  }, [])

  return data
}
