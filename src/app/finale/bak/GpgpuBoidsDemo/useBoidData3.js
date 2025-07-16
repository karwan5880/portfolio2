'use client'

import { useGLTF } from '@react-three/drei'
import { useEffect, useState } from 'react'
import * as THREE from 'three'

const SIZE = 256

export function useBoidData() {
  const gltf = useGLTF('/monkey.glb')
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!gltf.nodes.mesh_0) return

    // --- REFINED CANVAS METHOD ---
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const canvasWidth = 200 // Higher resolution for more detail
    const canvasHeight = 50
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    ctx.fillStyle = 'white'
    ctx.font = 'bold 40px Arial' // Larger, bolder font
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('FINALE', canvasWidth / 2, canvasHeight / 2)

    const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data
    const textCoordinates = []
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        if (imageData[(y * canvasWidth + x) * 4 + 3] > 0) {
          textCoordinates.push({
            x: x - canvasWidth / 2,
            y: canvasHeight / 2 - y,
          })
        }
      }
    }

    const textPosData = new Float32Array(SIZE * SIZE * 4)
    const textColorData = new Float32Array(SIZE * SIZE * 4)
    const textColor = new THREE.Color('#fafad2')

    for (let i = 0; i < SIZE * SIZE; i++) {
      const coord = textCoordinates[i % textCoordinates.length]
      const k = i * 4

      // THE KEY FIX: Add a small random offset to break up the patterns
      const spread = 0.4
      textPosData[k + 0] = coord.x * 0.05 + (Math.random() - 0.5) * spread
      textPosData[k + 1] = coord.y * 0.05 + (Math.random() - 0.5) * spread
      textPosData[k + 2] = (Math.random() - 0.5) * spread // Give it a tiny bit of depth

      textColorData[k + 0] = textColor.r
      textColorData[k + 1] = textColor.g
      textColorData[k + 2] = textColor.b
    }

    const textPositionTexture = new THREE.DataTexture(textPosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    textPositionTexture.needsUpdate = true
    const textColorTexture = new THREE.DataTexture(textColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    textColorTexture.needsUpdate = true
    const textFormation = { name: 'Text', posTexture: textPositionTexture, colTexture: textColorTexture }

    // --- All other shape logic remains the same ---
    const mesh = gltf.nodes.mesh_0
    const vertices = mesh.geometry.attributes.position.array
    const numVertices = vertices.length / 3
    const shapePosData = new Float32Array(SIZE * SIZE * 4)
    const shapeColorData = new Float32Array(SIZE * SIZE * 4)
    const colorA = new THREE.Color('#ff0022')
    const colorB = new THREE.Color('#0055ff')
    mesh.geometry.computeBoundingBox()
    const minY = mesh.geometry.boundingBox.min.y
    const maxY = mesh.geometry.boundingBox.max.y
    for (let i = 0; i < SIZE * SIZE; i++) {
      const k = i * 4,
        vIndex = (i % numVertices) * 3
      shapePosData[k + 0] = vertices[vIndex + 0] * 3
      shapePosData[k + 1] = vertices[vIndex + 1] * 3
      shapePosData[k + 2] = vertices[vIndex + 2] * 3
      const normalizedY = (vertices[vIndex + 1] - minY) / (maxY - minY)
      const finalColor = new THREE.Color().lerpColors(colorA, colorB, normalizedY)
      shapeColorData[k + 0] = finalColor.r
      shapeColorData[k + 1] = finalColor.g
      shapeColorData[k + 2] = finalColor.b
    }
    const shapePositionTexture = new THREE.DataTexture(shapePosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    shapePositionTexture.needsUpdate = true
    const shapeColorTexture = new THREE.DataTexture(shapeColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    shapeColorTexture.needsUpdate = true
    const homePosData = new Float32Array(SIZE * SIZE * 4)
    const homeColorData = new Float32Array(SIZE * SIZE * 4)
    const homeCol = new THREE.Color(0.3, 0.3, 0.6)
    const s = 0.1
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = (i * SIZE + j) * 4
        homePosData[k + 0] = (i - SIZE / 2) * s
        homePosData[k + 1] = (j - SIZE / 2) * s
        homePosData[k + 2] = -5.0
        homeColorData[k + 0] = homeCol.r
        homeColorData[k + 1] = homeCol.g
        homeColorData[k + 2] = homeCol.b
      }
    }
    const homePositionTexture = new THREE.DataTexture(homePosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    homePositionTexture.needsUpdate = true
    const homeColorTexture = new THREE.DataTexture(homeColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    homeColorTexture.needsUpdate = true

    const allFormations = [{ name: 'Home', posTexture: homePositionTexture, colTexture: homeColorTexture }, { name: 'Monkey', posTexture: shapePositionTexture, colTexture: shapeColorTexture }, textFormation]

    const particleGeometry = new THREE.BufferGeometry()
    const uvs = new Float32Array(SIZE * SIZE * 2)
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = (i * SIZE + j) * 2
        uvs[k] = i / (SIZE - 1)
        uvs[k + 1] = j / (SIZE - 1)
      }
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(SIZE * SIZE * 3), 3))
    particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    const droneData = new Float32Array(SIZE * SIZE * 4)
    for (let i = 0; i < SIZE * SIZE; i++) {
      droneData[i * 4 + 0] = Math.random()
    }
    const droneDataTexture = new THREE.DataTexture(droneData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    droneDataTexture.needsUpdate = true

    setData({
      formations: allFormations,
      initialPositions: homePositionTexture,
      particleGeometry,
      droneDataTexture,
    })
  }, [gltf])

  return data
}
