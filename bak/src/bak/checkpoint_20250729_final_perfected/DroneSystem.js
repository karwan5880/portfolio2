'use client'

import { Html, useFBO } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { TextRenderer, createDefaultTimeline } from './TextRenderer.js'
import { bodyShaderFS, droneRenderShaderVS, lightShaderFS } from './lightShader.js'
import { dronePositionShader } from './positionShader.js'

// DroneSystem configuration
const SYSTEM_CONFIG = {
  DRONE_COUNT: 4096,
  TEXTURE_SIZE: 64, // Math.sqrt(4096)

  // Material settings
  LIGHT_INSTANCE_SCALE: 1.5,
  BODY_INSTANCE_SCALE: 2.0,
  AMBIENT_LIGHT: 0.2,

  // Animation settings
  SCALE_START_TIME: 42.0,
  SCALE_DURATION: 30.0,
  INITIAL_SCALE: 1.0,
  FINAL_SCALE: 4.0,
}

export function DroneSystem({ scale = 1.0, pulseFrequency = 5.0, speedMultiplier = 1.0 }) {
  const { DRONE_COUNT, TEXTURE_SIZE } = SYSTEM_CONFIG

  const lightMeshRef = useRef()
  const bodyMeshRef = useRef()

  // Text rendering system
  const textRenderer = useMemo(() => new TextRenderer(), [])
  const textTimeline = useMemo(() => createDefaultTimeline(), [])
  const [currentTextTexture, setCurrentTextTexture] = useState(null)

  // FBO for position computation
  const fboOptions = { format: THREE.RGBAFormat, type: THREE.FloatType, minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter }
  const positionFBO = useFBO(TEXTURE_SIZE, TEXTURE_SIZE, fboOptions)

  // Compute scene setup
  const computeScene = useMemo(() => new THREE.Scene(), [])
  const computeCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])
  const computeQuad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), [])

  const positionMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ` 
          void main(){
            gl_Position=vec4(position,1.0);
          }
        `,
        fragmentShader: dronePositionShader,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: scale },
          uTextureSize: { value: TEXTURE_SIZE },
          uSpeedMultiplier: { value: speedMultiplier },
        },
      }),
    [scale, TEXTURE_SIZE]
  )

  const [lightMaterial, bodyMaterial] = useMemo(() => {
    const commonUniforms = {
      uPositionTexture: { value: positionFBO.texture },
      uTime: { value: 0 },
      uSpeedMultiplier: { value: speedMultiplier },
    }

    const lightMat = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        uPulseFrequency: { value: pulseFrequency },
        uInstanceScale: { value: SYSTEM_CONFIG.LIGHT_INSTANCE_SCALE },
        uTextTexture: { value: null },
        uTextActive: { value: 0.0 },
        uTextColor: { value: new THREE.Vector3(1, 1, 1) },
      },
      vertexShader: droneRenderShaderVS,
      fragmentShader: lightShaderFS,
      transparent: false,
      blending: THREE.NormalBlending,
      depthWrite: true,
    })

    const bodyMat = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        uSunlightDirection: { value: new THREE.Vector3(0, 1, 1).normalize() },
        uAmbientLight: { value: SYSTEM_CONFIG.AMBIENT_LIGHT },
        uInstanceScale: { value: SYSTEM_CONFIG.BODY_INSTANCE_SCALE },
        uTextTexture: { value: null },
        uTextActive: { value: 0.0 },
        uTextColor: { value: new THREE.Vector3(1, 1, 1) },
      },
      vertexShader: droneRenderShaderVS,
      fragmentShader: bodyShaderFS,
    })

    return [lightMat, bodyMat]
  }, [positionFBO, pulseFrequency])

  const { model: modelScene, error: modelError } = useManualGLTF('/drone_compound.glb')

  const { lightGeometry, bodyGeometry } = useMemo(() => {
    if (!modelScene) return {}

    let lightGeo = null,
      bodyGeo = null

    modelScene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'Light_Geo') lightGeo = child.geometry.clone()
        else if (child.name === 'Body_Geo') bodyGeo = child.geometry.clone()
      }
    })

    if (!lightGeo || !bodyGeo) {
      console.warn('Could not find Light_Geo or Body_Geo in the model')
      return {}
    }

    const modelScale = 1.0
    const lightScale = 1.0
    lightGeo.scale(lightScale, lightScale, lightScale)
    bodyGeo.scale(modelScale, modelScale, modelScale)

    return { lightGeometry: lightGeo, bodyGeometry: bodyGeo }
  }, [modelScene])

  useEffect(() => {
    if (!lightGeometry || !bodyGeometry) return
    computeScene.add(computeQuad)

    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) ids[i] = i
    const idAttribute = new THREE.InstancedBufferAttribute(ids, 1)

    lightMeshRef.current.geometry.setAttribute('a_id', idAttribute)
    bodyMeshRef.current.geometry.setAttribute('a_id', idAttribute)
  }, [lightGeometry, bodyGeometry, computeScene, computeQuad, DRONE_COUNT])

  useFrame((state) => {
    const { gl, clock } = state
    const time = clock.getElapsedTime() * speedMultiplier // Apply speed multiplier

    // TEXT DISPLAY SYSTEM UPDATE
    const currentMessage = textTimeline.getCurrentMessage(time)
    const isTextActive = currentMessage !== null

    if (isTextActive && currentMessage) {
      // Create or update text texture if message changed
      if (!currentTextTexture || currentTextTexture.lastMessage !== currentMessage.text) {
        // Dispose old texture
        if (currentTextTexture && currentTextTexture.texture) {
          currentTextTexture.texture.dispose()
        }

        // Create new texture
        const newTexture = textRenderer.createTextTexture(currentMessage.text, currentMessage.options)
        setCurrentTextTexture({
          texture: newTexture,
          lastMessage: currentMessage.text,
        })

        // Update shader uniforms
        lightMaterial.uniforms.uTextTexture.value = newTexture
        bodyMaterial.uniforms.uTextTexture.value = newTexture
      }

      // Update text color and active state
      lightMaterial.uniforms.uTextActive.value = 1.0
      lightMaterial.uniforms.uTextColor.value.set(currentMessage.color[0], currentMessage.color[1], currentMessage.color[2])
      bodyMaterial.uniforms.uTextActive.value = 1.0
      bodyMaterial.uniforms.uTextColor.value.set(currentMessage.color[0], currentMessage.color[1], currentMessage.color[2])
    } else {
      // No text active - use random colors
      lightMaterial.uniforms.uTextActive.value = 0.0
      bodyMaterial.uniforms.uTextActive.value = 0.0
    }

    // Light scale animation - gradual scaling for better visibility at distance
    const scaleStartTime = SYSTEM_CONFIG.SCALE_START_TIME / speedMultiplier
    const scaleDuration = SYSTEM_CONFIG.SCALE_DURATION / speedMultiplier

    if (lightMaterial) {
      let currentScale = SYSTEM_CONFIG.INITIAL_SCALE
      if (clock.getElapsedTime() > scaleStartTime) {
        const progress = Math.min(1.0, (clock.getElapsedTime() - scaleStartTime) / scaleDuration)
        currentScale = SYSTEM_CONFIG.INITIAL_SCALE + progress * (SYSTEM_CONFIG.FINAL_SCALE - SYSTEM_CONFIG.INITIAL_SCALE)
      }
      lightMaterial.uniforms.uInstanceScale.value = currentScale
    }

    // Position compute pass
    computeQuad.material = positionMaterial
    positionMaterial.uniforms.uTime.value = time
    gl.setRenderTarget(positionFBO)
    gl.render(computeScene, computeCamera)

    // Final render to screen
    gl.setRenderTarget(null)
    lightMaterial.uniforms.uTime.value = time
    bodyMaterial.uniforms.uTime.value = time
  })

  if (modelError) {
    return (
      <Html center style={{ color: 'red' }}>
        Error loading model: {modelError?.message}
      </Html>
    )
  }

  if (!lightGeometry || !bodyGeometry) {
    return <Html center></Html>
  }

  return (
    <group>
      <instancedMesh ref={bodyMeshRef} args={[bodyGeometry, bodyMaterial, DRONE_COUNT]} frustumCulled={false} />
      <instancedMesh ref={lightMeshRef} args={[lightGeometry, lightMaterial, DRONE_COUNT]} frustumCulled={false} />
    </group>
  )
}

// Helper hook for loading GLTF
function useManualGLTF(path) {
  const [model, setModel] = useState(null)
  const [error, setError] = useState(null)
  useEffect(() => {
    new GLTFLoader().load(
      path,
      (gltf) => setModel(gltf.scene),
      undefined,
      (error) => {
        console.error('Error loading GLTF:', error)
        setError(error)
      }
    )
  }, [path])
  return { model, error }
}
