// Debug particle system to test countdown digits
'use client'

import { cinematicPositionShader } from '../cinematicShader.js'
import { DRONE_CONFIG } from '../config/constants.js'
import { debugLightShaderFS } from '../shaders/debugFragmentShader.js'
import { bodyShaderFS } from '../shaders/fragmentShaders.js'
import { finalRenderShaderVS } from '../shaders/vertexShader.js'
import { Html, useFBO } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

// Debug particle system to test countdown digits

export function DebugParticleSystem() {
  const lightMeshRef = useRef()
  const bodyMeshRef = useRef()
  const masterProgress = useRef(0)

  // FBO for position computation
  const fboOptions = {
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
  }
  const positionFBO = useFBO(DRONE_CONFIG.TEXTURE_SIZE, DRONE_CONFIG.TEXTURE_SIZE, fboOptions)

  // Compute scene setup
  const computeScene = useMemo(() => new THREE.Scene(), [])
  const computeCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), [])
  const computeQuad = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(2, 2)), [])

  // Position computation material
  const positionMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ` 
          void main(){
            gl_Position=vec4(position,1.0);
          }
        `,
        fragmentShader: cinematicPositionShader,
        uniforms: {
          uTime: { value: 0 },
          uScale: { value: 1.0 },
          uMasterProgress: { value: 0 },
          uTextPositions: { value: null },
          uTextureSize: { value: DRONE_CONFIG.TEXTURE_SIZE },
        },
      }),
    []
  )

  // Rendering materials
  const [lightMaterial, bodyMaterial] = useMemo(() => {
    const commonUniforms = {
      uPositionTexture: { value: positionFBO.texture },
      uTime: { value: 0 },
      uSafetyRadius: { value: 150.0 },
      uSeparationStrength: { value: 20.0 },
    }

    const lightMat = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        uPulseFrequency: { value: 5.0 },
        uInstanceScale: { value: DRONE_CONFIG.LIGHT_SCALE.INITIAL },
      },
      vertexShader: finalRenderShaderVS,
      fragmentShader: debugLightShaderFS, // Use debug shader
      transparent: false,
      blending: THREE.NormalBlending,
      depthWrite: true,
    })

    const bodyMat = new THREE.ShaderMaterial({
      uniforms: {
        ...commonUniforms,
        uSunlightDirection: { value: new THREE.Vector3(0, 1, 1).normalize() },
        uAmbientLight: { value: 0.2 },
        uInstanceScale: { value: DRONE_CONFIG.SCALE },
      },
      vertexShader: finalRenderShaderVS,
      fragmentShader: bodyShaderFS,
    })

    return [lightMat, bodyMat]
  }, [positionFBO])

  // Asset loading
  const { model: modelScene, error: modelError } = useManualGLTF('/drone_compound.glb')
  const { font, error: fontError } = useManualFont('/noto_sans_jp_regular.json')

  // Geometry and texture preparation
  const { lightGeometry, bodyGeometry, textPositionsTexture } = useMemo(() => {
    if (!modelScene || !font) return {}

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

    // Scale geometries
    const lightScale = 2.0
    lightGeo.scale(lightScale, lightScale, lightScale)
    bodyGeo.scale(DRONE_CONFIG.SCALE, DRONE_CONFIG.SCALE, DRONE_CONFIG.SCALE)

    // Create text geometry and sample positions
    const textGeo = new TextGeometry('DEBUG TEST', {
      font,
      size: 300,
      height: 50,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 10,
      bevelSize: 4,
      bevelSegments: 5,
    })
    textGeo.center()

    const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
    const positions = new Float32Array(DRONE_CONFIG.COUNT * 4)
    const temp = new THREE.Vector3()

    for (let i = 0; i < DRONE_CONFIG.COUNT; i++) {
      sampler.sample(temp)
      positions.set([temp.x, temp.y, temp.z, 1.0], i * 4)
    }

    const textTex = new THREE.DataTexture(positions, DRONE_CONFIG.TEXTURE_SIZE, DRONE_CONFIG.TEXTURE_SIZE, THREE.RGBAFormat, THREE.FloatType)
    textTex.needsUpdate = true

    return {
      lightGeometry: lightGeo,
      bodyGeometry: bodyGeo,
      textPositionsTexture: textTex,
    }
  }, [modelScene, font])

  // Setup instanced attributes
  useEffect(() => {
    if (!lightGeometry || !bodyGeometry) return

    computeScene.add(computeQuad)

    const ids = new Float32Array(DRONE_CONFIG.COUNT)
    for (let i = 0; i < DRONE_CONFIG.COUNT; i++) ids[i] = i
    const idAttribute = new THREE.InstancedBufferAttribute(ids, 1)

    if (lightMeshRef.current) {
      lightMeshRef.current.geometry.setAttribute('a_id', idAttribute)
    }
    if (bodyMeshRef.current) {
      bodyMeshRef.current.geometry.setAttribute('a_id', idAttribute)
    }
  }, [lightGeometry, bodyGeometry, computeScene, computeQuad])

  // Animation loop
  useFrame((state) => {
    const { gl, clock } = state
    const time = clock.getElapsedTime()

    // Update master progress for text formation
    if (time > 15.0) {
      masterProgress.current = Math.min(1.0, (time - 15.0) / 10.0)
    } else {
      masterProgress.current = 0.0
    }

    // Position compute pass
    computeQuad.material = positionMaterial
    positionMaterial.uniforms.uTime.value = time
    positionMaterial.uniforms.uMasterProgress.value = masterProgress.current
    positionMaterial.uniforms.uTextPositions.value = textPositionsTexture

    gl.setRenderTarget(positionFBO)
    gl.render(computeScene, computeCamera)

    // Final render to screen
    gl.setRenderTarget(null)
    lightMaterial.uniforms.uTime.value = time
    bodyMaterial.uniforms.uTime.value = time
  })

  // Error handling
  if (modelError || fontError) {
    return (
      <Html center style={{ color: 'red' }}>
        Error loading assets: {modelError?.message || fontError?.message}
      </Html>
    )
  }

  if (!lightGeometry || !bodyGeometry || !textPositionsTexture) {
    return <Html center>Loading Debug System...</Html>
  }

  return (
    <group>
      <instancedMesh ref={bodyMeshRef} args={[bodyGeometry, bodyMaterial, DRONE_CONFIG.COUNT]} frustumCulled={false} />
      <instancedMesh ref={lightMeshRef} args={[lightGeometry, lightMaterial, DRONE_CONFIG.COUNT]} frustumCulled={false} />
    </group>
  )
}

// Helper hooks for asset loading
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

function useManualFont(path) {
  const [font, setFont] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    new FontLoader().load(
      path,
      (font) => setFont(font),
      undefined,
      (error) => {
        console.error('Error loading font:', error)
        setError(error)
      }
    )
  }, [path])

  return { font, error }
}
