'use client'

import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
// --- NEW: Import the Text component from Troika ---
import { Text } from 'troika-three-text'

const SIZE = 256

export function useBoidData() {
  const gltf = useGLTF('/monkey.glb')

  const data = useMemo(() => {
    // --- Data generation for Monkey and Home (UNCHANGED) ---
    if (!gltf) return {}
    const mesh = gltf.nodes.mesh_0
    if (!mesh || !mesh.isMesh || !mesh.geometry) return {}
    const vertices = mesh.geometry.attributes.position.array
    const numVertices = vertices.length / 3
    if (numVertices === 0) return {}
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
      shapePosData[k + 3] = 1.0
      const normalizedY = (vertices[vIndex + 1] - minY) / (maxY - minY)
      const finalColor = new THREE.Color().lerpColors(colorA, colorB, normalizedY)
      shapeColorData[k + 0] = finalColor.r
      shapeColorData[k + 1] = finalColor.g
      shapeColorData[k + 2] = finalColor.b
      shapeColorData[k + 3] = 1.0
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

    // --- START OF FIX ---
    const textMesh = new Text()
    textMesh.text = 'FINALE'
    textMesh.fontSize = 2.5
    // Update this URL to point to our local file in the /public folder
    // textMesh.font = '/Raleway-Regular.woff2'
    textMesh.font = '/Raleway-Regular.ttf'
    textMesh.anchorX = 'center'
    textMesh.anchorY = 'middle'
    textMesh.sync()
    // --- END OF FIX ---
    // // --- NEW: Generate Textures for a Text Formation ---
    // const textMesh = new Text()
    // textMesh.text = 'FINALE'
    // textMesh.fontSize = 2.5
    // textMesh.font = 'https://fonts.gstatic.com/s/raleway/v28/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaorCFPrE.woff'
    // textMesh.anchorX = 'center'
    // textMesh.anchorY = 'middle'
    // // This is the magic call that forces Troika to compute the geometry synchronously
    // textMesh.sync()

    let textPositionTexture, textColorTexture
    if (textMesh.geometry.attributes.position) {
      const textVertices = textMesh.geometry.attributes.position.array
      const numTextVertices = textVertices.length / 3
      const textPosData = new Float32Array(SIZE * SIZE * 4)
      const textColorData = new Float32Array(SIZE * SIZE * 4)
      const textColor = new THREE.Color('#fafad2') // Light Goldenrod

      for (let i = 0; i < SIZE * SIZE; i++) {
        const k = i * 4
        // Sample vertices from the text geometry, just like the monkey model
        const vIndex = (i % numTextVertices) * 3
        textPosData[k + 0] = textVertices[vIndex + 0]
        textPosData[k + 1] = textVertices[vIndex + 1]
        textPosData[k + 2] = textVertices[vIndex + 2]
        textPosData[k + 3] = 1.0

        textColorData[k + 0] = textColor.r
        textColorData[k + 1] = textColor.g
        textColorData[k + 2] = textColor.b
        textColorData[k + 3] = 1.0
      }
      textPositionTexture = new THREE.DataTexture(textPosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
      textPositionTexture.needsUpdate = true
      textColorTexture = new THREE.DataTexture(textColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
      textColorTexture.needsUpdate = true
    }
    // --- End of New Text Generation Logic ---

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

    // --- UPDATED: Add our new text formation to the playlist ---
    const formations = [
      { name: 'Home', posTexture: homePositionTexture, colTexture: homeColorTexture },
      { name: 'Monkey', posTexture: shapePositionTexture, colTexture: shapeColorTexture },
    ]

    // Only add the text formation if it was successfully generated
    if (textPositionTexture) {
      formations.push({ name: 'Text', posTexture: textPositionTexture, colTexture: textColorTexture })
    }

    return { formations, initialPositions: homePositionTexture, particleGeometry, droneDataTexture }
  }, [gltf])

  return data
}
