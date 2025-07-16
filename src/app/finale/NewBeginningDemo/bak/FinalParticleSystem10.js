'use client'

import { Html, shaderMaterial, useGLTF } from '@react-three/drei'
import { extend, useFrame, useLoader } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

import { DroneInstancedShader } from './droneInstancedShader.js'
import { FinalInstancedShader } from './finalInstancedShader.js'

// Define the material for the glowing lights. This part is already working.
const LightShaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPulseFrequency: { value: 5.0 },
    uScale: { value: 1.0 },
    uMasterProgress: { value: 0.0 },
    uTextPositions: { value: null },
  },
  vertexShader: DroneInstancedShader.vertexShader,
  fragmentShader: DroneInstancedShader.lightFragmentShader,
  transparent: true,
})

// // This material is for the dark body part of the drone.
// // We use MeshStandardMaterial for this so it can receive real scene lighting and shadows.
// // It's more realistic and simpler than a custom lighting shader.
// const BodyMaterial = new THREE.MeshStandardMaterial({
//   color: '#222222', // Dark grey
//   metalness: 0.8,
//   roughness: 0.4,
// })

const FinalInstancedMaterial = shaderMaterial(
  {
    uTime: 0,
    uScale: 1.0,
    uMasterProgress: 0.0,
    uTextPositions: null, //

    uPulseFrequency: 5.0, //
    uPulseDuration: 4.0, //
    uPulseIsPerpetual: 0.0, //
    // --- NEW UNIFORMS FOR LIGHTING ---
    uSunlightDirection: new THREE.Vector3(0.0, 1.0, 1.0), // Light from top-back
    uSunlightColor: new THREE.Color('#ffffff'), // White light
    uAmbientLight: 0.1,
  },
  FinalInstancedShader.vertexShader,
  FinalInstancedShader.fragmentShader
)

export function FinalParticleSystem({
  scale = 1.0, //
  pulseFrequency = 5.0,
  pulseDuration = 4.0,
  pulseIsPerpetual = false,
}) {
  const meshRef = useRef()
  const matRef = useRef()
  const DRONE_COUNT = 4096

  const lightMatRef = useRef()
  const lightMeshRef = useRef()
  const bodyMeshRef = useRef()
  const bodyShaderRef = useRef()

  const sunlightDirection = new THREE.Vector3(0.0, 0.8, 1.0).normalize()
  const sunlightColor = new THREE.Color('#ffffff')

  // const modelScene = useManualGLTF('/drone/drone_low_poly.glb')
  // const modelScene = useManualGLTF('/drone/cube2.glb')
  // const modelScene = useManualGLTF('/drone/sphere1.glb')
  // const modelScene = useManualGLTF('/drone/drone7.glb')
  const modelScene = useManualGLTF('/drone/drone_compound.glb')
  console.log(`modelScene: `, modelScene)
  const font = useManualFont('/noto_sans_jp_regular.json')

  // --- We create the BodyMaterial inside a useMemo to ensure it's created only once ---
  const bodyMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      color: '#222222',
      metalness: 0.8,
      roughness: 0.4,
    })

    // --- THIS IS THE MAGIC ---
    // onBeforeCompile lets us patch the material's built-in shader.
    material.onBeforeCompile = (shader) => {
      bodyShaderRef.current = shader

      // 1. We add our custom uniforms to the material's shader.
      shader.uniforms.uTime = { value: 0 }
      shader.uniforms.uScale = { value: 1.0 }
      shader.uniforms.uMasterProgress = { value: 0.0 }
      shader.uniforms.uTextPositions = { value: null }

      // PART 1: Globals, Constants, and Helper Functions
      // These must be defined OUTSIDE of the main() function.

      const shaderGlobals = `
        attribute float a_id;
        uniform sampler2D uTextPositions;
        
        const float PI = 3.14159265359;
        const float DRONE_COUNT = 4096.0;
        const float GRID_SIZE = 16.0;
        const float FLY_UP_HEIGHT = 25.0;
        const float FLIGHT_DURATION = 10.0;

        float random(float n) { return fract(sin(n) * 43758.5453123); }
        vec3 getQuadraticBezier(vec3 A, vec3 B, vec3 C, float t) { return pow(1.0 - t, 2.0) * A + 2.0 * (1.0 - t) * t * B + pow(t, 2.0) * C; }
      `

      // PART 2: The Calculation Logic
      // This part goes INSIDE the main() function.
      const shaderLogic = `
        float layer = floor(a_id / (GRID_SIZE * GRID_SIZE));
        float row = floor(mod(a_id, GRID_SIZE * GRID_SIZE) / GRID_SIZE);
        float col = mod(a_id, GRID_SIZE);
        vec3 endPosA = vec3((col-7.5)*50.0, (row-7.5)*50.0, (layer-7.5)*50.0);
        endPosA.y += FLY_UP_HEIGHT * uScale;
        float droneId_norm = a_id / DRONE_COUNT;
        float phi = acos(1.0 - 2.0 * droneId_norm);
        float theta = 2.0 * PI * random(a_id);
        float radius = 400.0;
        vec3 endPosB = vec3(radius*sin(phi)*cos(theta), radius*sin(phi)*sin(theta), radius*cos(phi));
        endPosB.y += FLY_UP_HEIGHT * uScale;
        float texSize = sqrt(DRONE_COUNT);
        vec2 uv_text = vec2(mod(a_id, texSize)/texSize, floor(a_id/texSize)/texSize);
        vec3 endPosC = texture2D(uTextPositions, uv_text).xyz;
        endPosC.y += FLY_UP_HEIGHT * uScale;
        vec3 finalEndPos = mix(endPosA, endPosB, smoothstep(0.0, 1.0, uMasterProgress));
        finalEndPos = mix(finalEndPos, endPosC, smoothstep(1.0, 2.0, uMasterProgress));
        vec3 startPos = vec3((mod(a_id, 64.0)-31.5)*40.0, -70.0, (floor(a_id/64.0)-31.5)*40.0);
        float rowDelay = (15.0 - row) * 0.2;
        float droneDelay = random(a_id) * 0.1;
        float startTime = rowDelay + droneDelay;
        float progress = smoothstep(0.0, 1.0, clamp((uTime - startTime) / FLIGHT_DURATION, 0.0, 1.0));
        vec3 controlPos = endPosA + normalize(endPosA-vec3(0,FLY_UP_HEIGHT*uScale,0)) * 750.0;
        vec3 finalPos = getQuadraticBezier(startPos, controlPos, finalEndPos, progress);
        transformed = transformed + finalPos;
      `

      // --- Perform the two separate injections ---

      // 1. Prepend the globals to the very top of the shader.

      // --- THE FINAL FIX ---
      // 1. Inject globals AFTER the #include <common> line.
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
          #include <common>
          ${shaderGlobals}
        `
      )
      // 2. Inject the logic inside main() like before.
      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
          #include <begin_vertex>
          ${shaderLogic}
        `
      )
    }

    // This is important for instanced materials that need custom vertex logic.
    material.customProgramCacheKey = () => Math.random()

    return material
  }, [])

  const { lightGeometry, bodyGeometry, textPositionsTexture } = useMemo(() => {
    // ... (This useMemo block is the same as before, no changes needed)
    if (!modelScene || !font) return {}
    let lightGeo = null,
      bodyGeo = null
    modelScene.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'Light_Geo') lightGeo = child.geometry.clone()
        else if (child.name === 'Body_Geo') bodyGeo = child.geometry.clone()
      }
    })
    const modelScale = 3.0
    if (lightGeo) lightGeo.scale(modelScale, modelScale, modelScale)
    if (bodyGeo) bodyGeo.scale(modelScale, modelScale, modelScale)
    const textGeo = new TextGeometry('T H A N K  Y O U', { font: font, size: 300.0, height: 50.0, curveSegments: 12, bevelEnabled: true, bevelThickness: 10.0, bevelSize: 4.0, bevelSegments: 5 })
    textGeo.center()
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
    const positions = new Float32Array(DRONE_COUNT * 4)
    const tempPosition = new THREE.Vector3()
    for (let i = 0; i < DRONE_COUNT; i++) {
      sampler.sample(tempPosition)
      positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
    }
    const textTex = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
    textTex.needsUpdate = true
    return { lightGeometry: lightGeo, bodyGeometry: bodyGeo, textPositionsTexture: textTex }
  }, [modelScene, font])

  // const { lightGeometry, bodyGeometry, textPositionsTexture } = useMemo(() => {
  //   if (!modelScene || !font) return {}
  //   let lightGeo = null
  //   let bodyGeo = null
  //   modelScene.traverse((child) => {
  //     if (child.isMesh) {
  //       // Find the geometries by the names we set in Blender!
  //       if (child.name === 'Light_Geo') {
  //         lightGeo = child.geometry
  //       } else if (child.name === 'Body_Geo') {
  //         bodyGeo = child.geometry
  //       }
  //     }
  //   })
  //   if (lightGeo) lightGeo.scale(2.5, 2.5, 2.5) // Scale them up
  //   if (bodyGeo) bodyGeo.scale(2.5, 2.5, 2.5)
  //   const textGeo = new TextGeometry('藝恬 T H A N K  Y O U', {
  //     font: font,
  //     size: 300.0, //
  //     height: 50.0,
  //     curveSegments: 12,
  //     bevelEnabled: true,
  //     bevelThickness: 10.0,
  //     bevelSize: 4.0,
  //     bevelSegments: 5,
  //   })
  //   textGeo.center()
  //   const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
  //   const positions = new Float32Array(DRONE_COUNT * 4)
  //   const tempPosition = new THREE.Vector3()
  //   for (let i = 0; i < DRONE_COUNT; i++) {
  //     sampler.sample(tempPosition)
  //     positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
  //   }
  //   const textTex = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
  //   textTex.needsUpdate = true
  //   return {
  //     lightGeometry: lightGeo,
  //     bodyGeometry: bodyGeo,
  //     textPositionsTexture: textTex,
  //   }
  // }, [modelScene, font])

  // const { droneGeometry, textPositionsTexture } = useMemo(() => {
  //   // If the font or model isn't loaded yet, do nothing.
  //   if (!modelScene || !font) return { droneGeometry: null, textPositionsTexture: null }
  //   // --- START OF SIMPLIFIED LOGIC ---
  //   let geometry = null
  //   // Find the first mesh in the loaded GLB file and grab its geometry.
  //   modelScene.traverse((child) => {
  //     if (child.isMesh && !geometry) {
  //       geometry = child.geometry
  //     }
  //   })
  //   if (geometry) {
  //     geometry.center()
  //     geometry.scale(2.5, 2.5, 2.5) // Adjust scale as needed
  //   }
  //   const textGeo = new TextGeometry('藝恬 T H A N K  Y O U', {
  //     font: font,
  //     size: 300.0, //
  //     height: 50.0,
  //     curveSegments: 12,
  //     bevelEnabled: true,
  //     bevelThickness: 10.0,
  //     bevelSize: 4.0,
  //     bevelSegments: 5,
  //   })
  //   textGeo.center()
  //   const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
  //   const positions = new Float32Array(DRONE_COUNT * 4)
  //   const tempPosition = new THREE.Vector3()
  //   for (let i = 0; i < DRONE_COUNT; i++) {
  //     sampler.sample(tempPosition)
  //     positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
  //   }
  //   const textTex = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
  //   textTex.needsUpdate = true
  //   // Return the found geometry
  //   return { droneGeometry: geometry, textPositionsTexture: textTex }
  // }, [modelScene, font]) // Dependency array is the same

  // const { droneGeometry, textPositionsTexture } = useMemo(() => {
  //   if (!modelScene || !font) return { droneGeometry: null, textPositionsTexture: null }
  //   const geometriesToMerge = []
  //   modelScene.traverse((child) => {
  //     if (child.isMesh) {
  //       console.log(`isMesh: `, child)
  //       const cleanGeometry = new THREE.BufferGeometry()
  //       cleanGeometry.setAttribute('position', child.geometry.getAttribute('position').clone())
  //       if (child.geometry.index) {
  //         cleanGeometry.setIndex(child.geometry.index.clone())
  //       }
  //       cleanGeometry.applyMatrix4(child.matrixWorld)
  //       geometriesToMerge.push(cleanGeometry)
  //     }
  //   })
  //   const merged = mergeGeometries(geometriesToMerge, false)
  //   if (merged) {
  //     merged.center()
  //     // merged.scale(5.5, 5.5, 5.5)
  //     merged.scale(0.5, 0.5, 0.5)
  //   }
  //   const textGeo = new TextGeometry('藝恬 T H A N K  Y O U', {
  //     font: font,
  //     size: 300.0, //
  //     height: 50.0,
  //     curveSegments: 12,
  //     bevelEnabled: true,
  //     bevelThickness: 10.0,
  //     bevelSize: 4.0,
  //     bevelSegments: 5,
  //   })
  //   textGeo.center()
  //   const sampler = new MeshSurfaceSampler(new THREE.Mesh(textGeo)).build()
  //   const positions = new Float32Array(DRONE_COUNT * 4)
  //   const tempPosition = new THREE.Vector3()
  //   for (let i = 0; i < DRONE_COUNT; i++) {
  //     sampler.sample(tempPosition)
  //     positions.set([tempPosition.x, tempPosition.y, tempPosition.z, 1.0], i * 4)
  //   }
  //   const textTex = new THREE.DataTexture(positions, 64, 64, THREE.RGBAFormat, THREE.FloatType)
  //   textTex.needsUpdate = true
  //   return { droneGeometry: merged, textPositionsTexture: textTex }
  // }, [modelScene, font, scale])

  useEffect(() => {
    // When the geometries are ready, apply the same ID attribute to both meshes
    if (!lightMeshRef.current || !bodyMeshRef.current) return
    const ids = new Float32Array(DRONE_COUNT)
    for (let i = 0; i < DRONE_COUNT; i++) ids[i] = i
    const idAttribute = new THREE.InstancedBufferAttribute(ids, 1)
    lightMeshRef.current.geometry.setAttribute('a_id', idAttribute)
    bodyMeshRef.current.geometry.setAttribute('a_id', idAttribute)
  }, [lightGeometry, bodyGeometry])

  // useEffect(() => {
  //   if (!meshRef.current || !droneGeometry) return
  //   const ids = new Float32Array(DRONE_COUNT)
  //   for (let i = 0; i < DRONE_COUNT; i++) {
  //     ids[i] = i
  //   }
  //   meshRef.current.geometry.setAttribute('a_id', new THREE.InstancedBufferAttribute(ids, 1))
  // }, [droneGeometry])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    let masterProgress = 0.0
    if (time > 15.0) masterProgress = Math.min(1.0, (time - 15.0) / 5.0)
    if (time > 25.0) masterProgress = 1.0 + Math.min(1.0, (time - 25.0) / 5.0)

    // Update the uniforms for BOTH materials
    LightShaderMaterial.uniforms.uTime.value = time
    LightShaderMaterial.uniforms.uMasterProgress.value = masterProgress
    LightShaderMaterial.uniforms.uTextPositions.value = textPositionsTexture
    LightShaderMaterial.uniforms.uScale.value = scale
    LightShaderMaterial.uniforms.uPulseFrequency.value = pulseFrequency

    if (bodyShaderRef.current) {
      bodyShaderRef.current.uniforms.uTime.value = time
      bodyShaderRef.current.uniforms.uMasterProgress.value = masterProgress
      bodyShaderRef.current.uniforms.uTextPositions.value = textPositionsTexture
      bodyShaderRef.current.uniforms.uScale.value = scale
    }
  })

  // useFrame((state) => {
  //   if (!matRef.current) return
  //   const time = state.clock.getElapsedTime()
  //   matRef.current.uniforms.uTime.value = time
  //   let masterProgress = 0.0
  //   if (time > 15.0) {
  //     masterProgress = Math.min(1.0, (time - 15.0) / 5.0)
  //   }
  //   if (time > 25.0) {
  //     masterProgress = 1.0 + Math.min(1.0, (time - 25.0) / 5.0)
  //   }
  //   matRef.current.uniforms.uMasterProgress.value = masterProgress
  // })

  if (!lightGeometry || !bodyGeometry || !textPositionsTexture) {
    return (
      <Html center>
        <div style={{ color: 'white' }}>Loading Drone Components...</div>
      </Html>
    )
  }

  return (
    <group>
      <instancedMesh ref={bodyMeshRef} args={[bodyGeometry, bodyMaterial, DRONE_COUNT]} frustumCulled={false} />
      <instancedMesh ref={lightMeshRef} args={[lightGeometry, LightShaderMaterial, DRONE_COUNT]} frustumCulled={false} />
    </group>

    // <group>
    //   {/* Mesh 1: The Dark Drone Bodies */}
    //   <instancedMesh ref={bodyMeshRef} args={[bodyGeometry, BodyMaterial, DRONE_COUNT]} frustumCulled={false} />
    //   {/* Mesh 2: The Glowing Drone Lights */}
    //   <instancedMesh ref={lightMeshRef} args={[lightGeometry, null, DRONE_COUNT]} frustumCulled={false}>
    //     <primitive
    //       ref={lightMatRef} //
    //       object={new LightShaderMaterial()}
    //       attach="material"
    //       uniforms-uScale-value={scale}
    //       uniforms-uPulseFrequency-value={pulseFrequency}
    //       uniforms-uTextPositions-value={textPositionsTexture}
    //     />
    //   </instancedMesh>
    // </group>

    // <instancedMesh
    //   ref={meshRef} //
    //   args={[droneGeometry, null, DRONE_COUNT]}
    //   frustumCulled={false}
    // >
    //   <primitive
    //     ref={matRef} //
    //     object={new FinalInstancedMaterial()}
    //     attach="material"
    //     uniforms-uScale-value={scale}
    //     uniforms-uPulseFrequency-value={pulseFrequency}
    //     uniforms-uPulseDuration-value={pulseDuration}
    //     uniforms-uPulseIsPerpetual-value={pulseIsPerpetual ? 1.0 : 0.0}
    //     uniforms-uTextPositions-value={textPositionsTexture}
    //     //
    //     uniforms-uSunlightDirection-value={sunlightDirection}
    //     uniforms-uSunlightColor-value={sunlightColor}
    //     uniforms-uAmbientLight-value={0.05} // A little bit of fill ligh
    //   />
    // </instancedMesh>
  )
}

function useManualGLTF(path) {
  const [modelScene, setModelScene] = useState(null)
  useEffect(() => {
    const loader = new GLTFLoader()
    loader.load(
      path,
      (gltf) => {
        setModelScene(gltf.scene)
      },
      undefined,
      (error) => {
        console.error(error)
      }
    )
  }, [path])
  return modelScene
}

function useManualFont(path) {
  const [font, setFont] = useState(null)
  useEffect(() => {
    const loader = new FontLoader()
    loader.load(
      path,
      (loadedFont) => setFont(loadedFont),
      undefined,
      (e) => console.error(e)
    )
  }, [path])
  return font
}
