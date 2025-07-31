'use client'

import { Html, useFBO } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { optimizedDronePositionShader } from './optimizedPositionShader.js'
import { bodyShaderFS, droneRenderShaderVS, lightShaderFS } from './renderShader.js'

export function DroneSystem({ scale = 1.0, pulseFrequency = 5.0, speedMultiplier = 1.0 }) {
  const DRONE_COUNT = 4096
  const TEXTURE_SIZE = Math.sqrt(DRONE_COUNT)

  const lightMeshRef = useRef()
  const bodyMeshRef = useRef()

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
        fragmentShader: optimizedDronePositionShader,
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
        uInstanceScale: { value: 1.5 }, // Reduced from 2.0 to make lights more contained
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
        uAmbientLight: { value: 0.2 },
        uInstanceScale: { value: 2.0 },
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

    // Light scale animation (adjusted for speed) - GRADUAL scaling when fully in sky
    const scaleStartTime = 42.0 / speedMultiplier // Start scaling when drones are fully in sky
    const scaleDuration = 30.0 / speedMultiplier // Much slower, gradual scaling over 30 seconds
    const initialScale = 1.0
    const finalScale = 4.0 // 4x larger for better visibility at distance

    if (lightMaterial) {
      let currentScale = initialScale
      if (clock.getElapsedTime() > scaleStartTime) {
        const progress = Math.min(1.0, (clock.getElapsedTime() - scaleStartTime) / scaleDuration)
        currentScale = initialScale + progress * (finalScale - initialScale)
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
