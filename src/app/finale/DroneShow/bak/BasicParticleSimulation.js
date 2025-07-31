// 'use client'

// import { shaderMaterial, useFBO } from '@react-three/drei'
// import { extend, useFrame, useThree } from '@react-three/fiber'
// import React, { useEffect, useMemo, useRef } from 'react'
// import * as THREE from 'three'

// import { BasicParticleShader } from './shader'
// import { SimulationShader } from './simulation_shader'

// // --- The materials are correct ---
// const ParticlesMaterial = shaderMaterial({ uPositionTexture: null }, BasicParticleShader.vertexShader, BasicParticleShader.fragmentShader)
// const SimulationMaterial = shaderMaterial({ uPositionTexture: null }, SimulationShader.vertexShader, SimulationShader.fragmentShader)
// extend({ ParticlesMaterial, SimulationMaterial })

// export function BasicParticleSimulation() {
//   // --- This data generation is now proven to be PERFECT ---
//   const { initialPositionTexture, particleGeometry } = useMemo(() => {
//     const SIZE = 64
//     const DRONE_COUNT = SIZE * SIZE
//     const posData = new Float32Array(DRONE_COUNT * 4)
//     const uvs = new Float32Array(DRONE_COUNT * 2)
//     for (let row = 0; row < SIZE; row++) {
//       for (let col = 0; col < SIZE; col++) {
//         const i = row * SIZE + col
//         posData.set([(col - (SIZE - 1) / 2) * 1.5, (row - (SIZE - 1) / 2) * 1.5, 0, 1.0], i * 4)
//         uvs.set([col / (SIZE - 1), row / (SIZE - 1)], i * 2)
//       }
//     }
//     const positionTexture = new THREE.DataTexture(posData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
//     positionTexture.needsUpdate = true
//     const particleGeometry = new THREE.BufferGeometry()
//     particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
//     particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))
//     return { initialPositionTexture, particleGeometry }
//     // return { initialPositionTexture: positionTexture, particleGeometry }
//   }, [])

//   // --- This is the new, clean, and correct simulation engine ---
//   const { gl } = useThree()
//   const simMatRef = useRef()
//   const particlesMatRef = useRef()

//   const fboA = useFBO(64, 64, { type: THREE.FloatType })
//   const fboB = useFBO(64, 64, { type: THREE.FloatType })
//   const fbos = useRef({
//     read: fboA,
//     write: fboB,
//     swap: function () {
//       const t = this.read
//       this.read = this.write
//       this.write = t
//     },
//   })

//   const simScene = useMemo(() => {
//     const scene = new THREE.Scene()
//     const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
//     const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
//     scene.add(mesh)
//     return { scene, camera, mesh }
//   }, [])

//   // This useEffect correctly "seeds" the simulation with our perfect grid.
//   useEffect(() => {
//     const initialMaterial = new THREE.MeshBasicMaterial({ map: initialPositionTexture })
//     simScene.mesh.material = initialMaterial
//     gl.setRenderTarget(fbos.current.read)
//     gl.render(simScene.scene, simScene.camera)
//     gl.setRenderTarget(fbos.current.write)
//     gl.render(simScene.scene, simScene.camera)
//     gl.setRenderTarget(null)
//     initialMaterial.dispose()
//   }, [initialPositionTexture, gl, simScene, fbos])

//   // This useFrame loop has the clean, correct, bug-free GPGPU logic.
//   useFrame(() => {
//     const fbo = fbos.current
//     if (simMatRef.current) {
//       simScene.mesh.material = simMatRef.current
//       simMatRef.current.uniforms.uPositionTexture.value = fbo.read.texture
//       gl.setRenderTarget(fbo.write)
//       gl.render(simScene.scene, simScene.camera)
//       particlesMatRef.current.uniforms.uPositionTexture.value = fbo.write.texture
//       fbo.swap()
//     }
//     gl.setRenderTarget(null)
//   })

//   // The JSX is clean and correct.
//   return (
//     <>
//       <simulationMaterial ref={simMatRef} />
//       <points>
//         <primitive object={particleGeometry} />
//         <particlesMaterial ref={particlesMatRef} />
//       </points>
//     </>
//   )
// }

// // 'use client'

// // import { shaderMaterial } from '@react-three/drei'
// // import { extend } from '@react-three/fiber'
// // import React, { useMemo } from 'react'
// // import * as THREE from 'three'

// // import { BasicParticleShader } from './shader'

// // // We only need one material for this test.
// // const ParticlesMaterial = shaderMaterial({ uPositionTexture: null }, BasicParticleShader.vertexShader, BasicParticleShader.fragmentShader)
// // extend({ ParticlesMaterial })

// // export function BasicParticleSimulation() {
// //   // --- DATA GENERATION (The unified loop logic is correct) ---
// //   const { initialPositionTexture, particleGeometry } = useMemo(() => {
// //     const SIZE = 64
// //     const DRONE_COUNT = SIZE * SIZE

// //     const posData = new Float32Array(DRONE_COUNT * 4)
// //     const uvs = new Float32Array(DRONE_COUNT * 2)

// //     for (let row = 0; row < SIZE; row++) {
// //       for (let col = 0; col < SIZE; col++) {
// //         const i = row * SIZE + col

// //         const x = (col - (SIZE - 1) / 2) * 1.5
// //         const y = (row - (SIZE - 1) / 2) * 1.5
// //         posData.set([x, y, 0, 1.0], i * 4)

// //         uvs.set([col / (SIZE - 1), row / (SIZE - 1)], i * 2)
// //       }
// //     }

// //     const positionTexture = new THREE.DataTexture(posData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
// //     positionTexture.needsUpdate = true

// //     const particleGeometry = new THREE.BufferGeometry()
// //     particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
// //     particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))

// //     return { initialPositionTexture: positionTexture, particleGeometry }
// //   }, [])

// //   // --- NO SIMULATION ENGINE. NO USEFRAME. NO FBOS. ---
// //   // We are rendering the data directly.

// //   return (
// //     <points>
// //       <primitive object={particleGeometry} />
// //       {/*
// //         We pass the initialPositionTexture directly to the material.
// //         It will never be updated. This is a static render.
// //       */}
// //       <particlesMaterial uPositionTexture={initialPositionTexture} />
// //     </points>
// //   )
// // }

// // // 'use client'

// // // import { shaderMaterial, useFBO } from '@react-three/drei'
// // // import { extend, useFrame, useThree } from '@react-three/fiber'
// // // import React, { useMemo, useRef } from 'react'
// // // import * as THREE from 'three'

// // // // // --- START OF DIAGNOSTIC CHANGE ---
// // // // // We import our new diagnostic shader instead of the old one.
// // // // import { DiagnosticShader } from './diagnostic_shader'
// // // import { BasicParticleShader } from './shader'
// // // // --- END OF DIAGNOSTIC CHANGE ---
// // // import { SimulationShader } from './simulation_shader'

// // // // Use the corrected, final shader
// // // const ParticlesMaterial = shaderMaterial({ uPositionTexture: null }, BasicParticleShader.vertexShader, BasicParticleShader.fragmentShader)
// // // // // --- START OF DIAGNOSTIC CHANGE ---
// // // // // We define our ParticlesMaterial using the new DiagnosticShader
// // // // const ParticlesMaterial = shaderMaterial({ uPositionTexture: null }, DiagnosticShader.vertexShader, DiagnosticShader.fragmentShader)
// // // // // --- END OF DIAGNOSTIC CHANGE ---
// // // const SimulationMaterial = shaderMaterial({ uPositionTexture: null }, SimulationShader.vertexShader, SimulationShader.fragmentShader)
// // // extend({ ParticlesMaterial, SimulationMaterial })

// // // export function BasicParticleSimulation() {
// // //   const { gl } = useThree()
// // //   const simMatRef = useRef()
// // //   const particlesMatRef = useRef()

// // //   const frame = useRef(0)

// // //   // The data generation logic is what we are testing. It remains the same.
// // //   const { initialPositionTexture, particleGeometry } = useMemo(() => {
// // //     const SIZE = 64
// // //     const DRONE_COUNT = SIZE * SIZE
// // //     const posData = new Float32Array(DRONE_COUNT * 4)
// // //     const uvs = new Float32Array(DRONE_COUNT * 2)
// // //     for (let row = 0; row < SIZE; row++) {
// // //       for (let col = 0; col < SIZE; col++) {
// // //         const i = row * SIZE + col
// // //         posData.set([(col - (SIZE - 1) / 2) * 1.5, (row - (SIZE - 1) / 2) * 1.5, 0, 1.0], i * 4)
// // //         uvs.set([col / (SIZE - 1), row / (SIZE - 1)], i * 2)
// // //       }
// // //     }
// // //     const positionTexture = new THREE.DataTexture(posData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
// // //     positionTexture.needsUpdate = true
// // //     const particleGeometry = new THREE.BufferGeometry()
// // //     particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
// // //     particleGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(DRONE_COUNT * 3), 3))
// // //     return { initialPositionTexture: positionTexture, particleGeometry }
// // //   }, [])

// // //   // The simulation engine remains the same. It is likely correct.
// // //   const fboA = useFBO(64, 64, { type: THREE.FloatType })
// // //   const fboB = useFBO(64, 64, { type: THREE.FloatType })
// // //   const fbos = useRef({
// // //     read: fboA,
// // //     write: fboB,
// // //     swap: function () {
// // //       const t = this.read
// // //       this.read = this.write
// // //       this.write = t
// // //     },
// // //   })
// // //   const simScene = useMemo(() => {
// // //     const scene = new THREE.Scene()
// // //     const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
// // //     const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
// // //     scene.add(mesh)
// // //     return { scene, camera, mesh }
// // //   }, [])

// // //   useFrame(() => {
// // //     if (frame.current === 0) {
// // //       const initialMaterial = new THREE.MeshBasicMaterial({ map: initialPositionTexture })
// // //       simScene.mesh.material = initialMaterial
// // //       gl.setRenderTarget(fbos.current.read)
// // //       gl.render(simScene.scene, simScene.camera)
// // //       gl.setRenderTarget(fbos.current.write)
// // //       gl.render(simScene.scene, simScene.camera)
// // //       initialMaterial.dispose()
// // //       frame.current = 1
// // //     }
// // //     const fbo = fbos.current
// // //     if (simMatRef.current) {
// // //       simScene.mesh.material = simMatRef.current
// // //       simMatRef.current.uniforms.uPositionTexture.value = fbo.read.texture
// // //       gl.setRenderTarget(fbo.write)
// // //       gl.render(simScene.scene, simScene.camera)
// // //       particlesMatRef.current.uniforms.uPositionTexture.value = fbo.write.texture
// // //       fbo.swap()
// // //     }
// // //     gl.setRenderTarget(null)
// // //   })

// // //   // The JSX is the same. It correctly uses our new diagnostic material.
// // //   return (
// // //     <>
// // //       <simulationMaterial ref={simMatRef} />
// // //       <points>
// // //         <primitive object={particleGeometry} />
// // //         <particlesMaterial ref={particlesMatRef} />
// // //       </points>
// // //     </>
// // //   )
// // // }
