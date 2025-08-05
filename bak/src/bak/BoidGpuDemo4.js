'use-client'

import { shaderMaterial, useFBO, useGLTF } from '@react-three/drei'
import { OrbitControls } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import React from 'react'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const SIZE = 256

// // --- START OF SIMULATION SHADER EVOLUTION ---
// // This shader is now a complete physics engine for each particle.
// const SimulationMaterial = shaderMaterial(
//   {
//     uPositionTexture: null,
//     uVelocityTexture: null, // NEW: A texture to store the drone's current velocity
//     uTargetPositionTexture: null,
//     uDroneDataTexture: null,
//     uTime: 0,
//     uSwitchTime: 0,
//     uTexelSize: new THREE.Vector2(1 / SIZE, 1 / SIZE),
//     uRepulsionRadius: 0.1,
//     uRepulsionStrength: 0.04,
//     // NEW PHYSICS UNIFORMS
//     uMaxSpeed: 0.1, // The drone's top speed
//     uMaxForce: 0.01, // How quickly a drone can change direction (maneuverability)
//     uDamping: 0.98, // Friction/drag to slow drones down over time
//   },
//   /*glsl*/ `varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`,
//   /*glsl*/ `
//     #version 300 es
//     precision highp float; // Required for GLSL 3 in fragment shaders
//     // Declare your output variables with explicit locations
//     layout(location = 0) out vec4 out_Position;
//     layout(location = 1) out vec4 out_Velocity;
//     varying vec2 vUv;
//     uniform sampler2D uPositionTexture;
//     uniform sampler2D uVelocityTexture;
//     uniform sampler2D uTargetPositionTexture;
//     uniform sampler2D uDroneDataTexture;
//     uniform float uTime;
//     uniform float uSwitchTime;
//     uniform vec2 uTexelSize;
//     uniform float uRepulsionRadius;
//     uniform float uRepulsionStrength;
//     uniform float uMaxSpeed;
//     uniform float uMaxForce;
//     uniform float uDamping;

//     // A utility function to limit a vector's magnitude
//     vec3 limit(vec3 vector, float max) {
//         if (length(vector) > max) {
//             return normalize(vector) * max;
//         }
//         return vector;
//     }

//     void main() {
//       //vec3 currentPos = texture2D(uPositionTexture, vUv).xyz;
//       //vec3 currentVel = texture2D(uVelocityTexture, vUv).xyz;
//       //vec3 targetPos = texture2D(uTargetPositionTexture, vUv).xyz;
//       //vec4 droneData = texture2D(uDroneDataTexture, vUv);

//       vec3 currentPos = texture(uPositionTexture, vUv).xyz;
//       vec3 currentVel = texture(uVelocityTexture, vUv).xyz;
//       vec3 targetPos = texture(uTargetPositionTexture, vUv).xyz;
//       vec4 droneData = texture(uDroneDataTexture, vUv);

//       vec3 newPos = currentPos;
//       vec3 newVel = currentVel;

//       float takeoffDelay = 1.5;
//       float takeoffTime = uSwitchTime + droneData.x * takeoffDelay;

//       if (uTime >= takeoffTime) {
//           // --- STEERING BEHAVIOR (THE "BRAIN") ---
//           // 1. Calculate desired velocity: a vector pointing from current position to target
//           vec3 desiredVel = targetPos - currentPos;

//           // 2. If close to the target, start slowing down
//           float dist = length(desiredVel);
//           if (dist < 1.0) {
//               // Map distance to a speed multiplier (0 at target, maxSpeed at radius 1.0)
//               float speed = mix(0.0, uMaxSpeed, dist / 1.0);
//               desiredVel = normalize(desiredVel) * speed;
//           } else {
//               desiredVel = normalize(desiredVel) * uMaxSpeed;
//           }

//           // 3. Calculate Steering Force = Desired Velocity - Current Velocity
//           vec3 steerForce = desiredVel - currentVel;
//           steerForce = limit(steerForce, uMaxForce); // Limit maneuverability

//           // --- PHYSICS (THE "MUSCLES") ---
//           // 4. Apply force to velocity (F=ma, but we assume mass=1, so a=F)
//           newVel += steerForce;
//       }

//       // --- COLLISION AVOIDANCE (THE "REFLEXES") ---
//       vec3 repulsionVector = vec3(0.0);
//       // (This logic is unchanged, but now operates on velocity instead of position)
//       vec3 neighbor_left=texture2D(uPositionTexture,vUv-vec2(uTexelSize.x,0.0)).xyz;vec3 neighbor_right=texture2D(uPositionTexture,vUv+vec2(uTexelSize.x,0.0)).xyz;vec3 neighbor_top=texture2D(uPositionTexture,vUv+vec2(0.0,uTexelSize.y)).xyz;vec3 neighbor_bottom=texture2D(uPositionTexture,vUv-vec2(0.0,uTexelSize.y)).xyz;
//       vec3 diff_left=currentPos-neighbor_left;if(length(diff_left)<uRepulsionRadius){repulsionVector+=normalize(diff_left)*(uRepulsionRadius-length(diff_left));}
//       vec3 diff_right=currentPos-neighbor_right;if(length(diff_right)<uRepulsionRadius){repulsionVector+=normalize(diff_right)*(uRepulsionRadius-length(diff_right));}
//       vec3 diff_top=currentPos-neighbor_top;if(length(diff_top)<uRepulsionRadius){repulsionVector+=normalize(diff_top)*(uRepulsionRadius-length(diff_top));}
//       vec3 diff_bottom=currentPos-neighbor_bottom;if(length(diff_bottom)<uRepulsionRadius){repulsionVector+=normalize(diff_bottom)*(uRepulsionRadius-length(diff_bottom));}
//       newVel += repulsionVector * uRepulsionStrength;

//       // --- FINAL UPDATES ---
//       // 5. Apply damping (friction) to slow down over time
//       newVel *= uDamping;

//       // 6. Update position with the new velocity
//       newPos += newVel;

//       // Output to the FBOs
//       // gl_FragData is an array where each index corresponds to a render target.
//       //gl_FragData[0] = vec4(newPos, 1.0);     // Write to position FBO
//       //gl_FragData[1] = vec4(newVel, 1.0);     // Write to velocity FBO
//       out_Position = vec4(newPos, 1.0);     // Write to position FBO
//       out_Velocity = vec4(newVel, 1.0);     // Write to velocity FBO
//     }
//   `
// )
// // --- END OF SIMULATION SHADER EVOLUTION ---

// Render shader is unchanged from the multi-color step.
const ParticlesMaterial = shaderMaterial({ uPositionTexture: null, uTargetColorTexture: null }, /*glsl*/ `uniform sampler2D uPositionTexture;varying vec2 vUv;void main(){vec3 pos=texture2D(uPositionTexture,uv).xyz;vUv=uv;vec4 modelPosition=modelMatrix*vec4(pos,1.0);vec4 viewPosition=viewMatrix*modelPosition;vec4 projectedPosition=projectionMatrix*viewPosition;gl_Position=projectedPosition;gl_PointSize=1.7;}`, /*glsl*/ `varying vec2 vUv;uniform sampler2D uTargetColorTexture;void main(){vec3 finalColor=texture2D(uTargetColorTexture,vUv).rgb;float brightness=length(finalColor);float glow=brightness<0.6?0.8:1.5;gl_FragColor=vec4(finalColor*glow,0.8);}`)
// extend({ SimulationMaterial, ParticlesMaterial })
extend({ ParticlesMaterial })
useGLTF.preload('/monkey.glb')

function BoidsSimulation() {
  const simulationMaterial = useRef()
  const simulationShader = useMemo(
    () => ({
      glslVersion: THREE.GLSL3,
      vertexShader: /*glsl*/ `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
      fragmentShader: /*glsl*/ `
        // NO #version directive needed. glslVersion property handles it.
        // The GLSL 3 'out' variables for Multiple Render Targets
        layout(location = 0) out vec4 out_Position;
        layout(location = 1) out vec4 out_Velocity;

        varying vec2 vUv;
        uniform sampler2D uPositionTexture;
        uniform sampler2D uVelocityTexture;
        uniform sampler2D uTargetPositionTexture;
        uniform sampler2D uDroneDataTexture;
        uniform float uTime;
        uniform float uSwitchTime;
        uniform vec2 uTexelSize;
        uniform float uRepulsionRadius;
        uniform float uRepulsionStrength;
        uniform float uMaxSpeed;
        uniform float uMaxForce;
        uniform float uDamping;

        vec3 limit(vec3 vector, float max) {
            if (length(vector) > max) {
                return normalize(vector) * max;
            }
            return vector;
        }

        void main() {
            // Use texture() instead of texture2D() for GLSL 3
            vec3 currentPos = texture(uPositionTexture, vUv).xyz;
            vec3 currentVel = texture(uVelocityTexture, vUv).xyz;
            vec3 targetPos = texture(uTargetPositionTexture, vUv).xyz;
            vec4 droneData = texture(uDroneDataTexture, vUv);

            vec3 newPos = currentPos;
            vec3 newVel = currentVel;

            float takeoffDelay = 1.5;
            float takeoffTime = uSwitchTime + droneData.x * takeoffDelay;

            if (uTime >= takeoffTime) {
                vec3 desiredVel = targetPos - currentPos;
                float dist = length(desiredVel);
                if (dist < 1.0) {
                    float speed = mix(0.0, uMaxSpeed, dist / 1.0);
                    desiredVel = normalize(desiredVel) * speed;
                } else {
                    desiredVel = normalize(desiredVel) * uMaxSpeed;
                }
                vec3 steerForce = desiredVel - currentVel;
                steerForce = limit(steerForce, uMaxForce);
                newVel += steerForce;
            }
            
            vec3 repulsionVector = vec3(0.0);
            vec3 neighbor_left=texture(uPositionTexture,vUv-vec2(uTexelSize.x,0.0)).xyz;vec3 neighbor_right=texture(uPositionTexture,vUv+vec2(uTexelSize.x,0.0)).xyz;vec3 neighbor_top=texture(uPositionTexture,vUv+vec2(0.0,uTexelSize.y)).xyz;vec3 neighbor_bottom=texture(uPositionTexture,vUv-vec2(0.0,uTexelSize.y)).xyz;
            vec3 diff_left=currentPos-neighbor_left;if(length(diff_left)<uRepulsionRadius){repulsionVector+=normalize(diff_left)*(uRepulsionRadius-length(diff_left));}
            vec3 diff_right=currentPos-neighbor_right;if(length(diff_right)<uRepulsionRadius){repulsionVector+=normalize(diff_right)*(uRepulsionRadius-length(diff_right));}
            vec3 diff_top=currentPos-neighbor_top;if(length(diff_top)<uRepulsionRadius){repulsionVector+=normalize(diff_top)*(uRepulsionRadius-length(diff_top));}
            vec3 diff_bottom=currentPos-neighbor_bottom;if(length(diff_bottom)<uRepulsionRadius){repulsionVector+=normalize(diff_bottom)*(uRepulsionRadius-length(diff_bottom));}
            newVel += repulsionVector * uRepulsionStrength;
            
            newVel *= uDamping;
            newPos += newVel;
            
            // Assign to the 'out' variables instead of gl_FragData
            out_Position = vec4(newPos, 1.0);
            out_Velocity = vec4(newVel, 1.0);
        }
    `,
    }),
    []
  )

  const particlesMaterial = useRef()
  const frame = useRef(0)
  const switchTimeRef = useRef(0)
  const lastPhaseRef = useRef(-1)
  const currentTargetPosRef = useRef(null)
  const currentTargetColorRef = useRef(null)
  const gltf = useGLTF('/monkey.glb')

  // --- START OF FBO AND DATA CHANGES ---
  // We now need two sets of FBOs to ping-pong both position and velocity data
  const positionFbos = useRef({
    read: useFBO(SIZE, SIZE, { type: THREE.FloatType }),
    write: useFBO(SIZE, SIZE, { type: THREE.FloatType }),
    swap: function () {
      const t = this.read
      this.read = this.write
      this.write = t
    },
  })
  const velocityFbos = useRef({
    read: useFBO(SIZE, SIZE, { type: THREE.FloatType }),
    write: useFBO(SIZE, SIZE, { type: THREE.FloatType }),
    swap: function () {
      const t = this.read
      this.read = this.write
      this.write = t
    },
  })

  const { shapePositionTexture, shapeColorTexture, homePositionTexture, homeColorTexture, initialPositions, initialVelocities, particleGeometry } = useMemo(() => {
    if (!gltf) return {}
    const mesh = gltf.nodes.mesh_0
    if (!mesh || !mesh.isMesh || !mesh.geometry) {
      return {}
    }
    const vertices = mesh.geometry.attributes.position.array
    const numVertices = vertices.length / 3
    if (numVertices === 0) {
      return {}
    }
    const shapePosData = new Float32Array(SIZE * SIZE * 4)
    const shapeColorData = new Float32Array(SIZE * SIZE * 4)
    const colorA = new THREE.Color('#ff0022')
    const colorB = new THREE.Color('#0055ff')
    mesh.geometry.computeBoundingBox()
    const minY = mesh.geometry.boundingBox.min.y
    const maxY = mesh.geometry.boundingBox.max.y
    for (let i = 0; i < SIZE * SIZE; i++) {
      const k = i * 4
      const vIndex = (i % numVertices) * 3
      const px = vertices[vIndex + 0] * 3
      const py = vertices[vIndex + 1] * 3
      const pz = vertices[vIndex + 2] * 3
      shapePosData[k + 0] = px
      shapePosData[k + 1] = py
      shapePosData[k + 2] = pz
      shapePosData[k + 3] = 1.0
      const normalizedY = (vertices[vIndex + 1] - minY) / (maxY - minY)
      const finalColor = new THREE.Color().lerpColors(colorA, colorB, normalizedY)
      shapeColorData[k + 0] = finalColor.r
      shapeColorData[k + 1] = finalColor.g
      shapeColorData[k + 2] = finalColor.b
      shapeColorData[k + 3] = 1.0
    }
    const shapePosTexture = new THREE.DataTexture(shapePosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    shapePosTexture.needsUpdate = true
    const shapeColTexture = new THREE.DataTexture(shapeColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    shapeColTexture.needsUpdate = true
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
        homePosData[k + 3] = 1.0
        homeColorData[k + 0] = homeCol.r
        homeColorData[k + 1] = homeCol.g
        homeColorData[k + 2] = homeCol.b
        homeColorData[k + 3] = 1.0
      }
    }
    const homePosTexture = new THREE.DataTexture(homePosData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    homePosTexture.needsUpdate = true
    const homeColTexture = new THREE.DataTexture(homeColorData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    homeColTexture.needsUpdate = true

    // NEW: Create an initial velocity texture (all drones start at rest)
    const initialVelData = new Float32Array(SIZE * SIZE * 4).fill(0)
    const initialVelTexture = new THREE.DataTexture(initialVelData, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    initialVelTexture.needsUpdate = true

    const count = SIZE * SIZE
    const geometry = new THREE.BufferGeometry()
    const uvs = new Float32Array(count * 2)
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        const k = (i * SIZE + j) * 2
        uvs[k] = i / (SIZE - 1)
        uvs[k + 1] = j / (SIZE - 1)
      }
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3))
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
    return { shapePositionTexture: shapePosTexture, shapeColorTexture: shapeColTexture, homePositionTexture: homePosTexture, homeColorTexture: homeColTexture, initialPositions: homePosTexture, initialVelocities: initialVelTexture, particleGeometry: geometry }
  }, [gltf])
  // --- END OF FBO AND DATA CHANGES ---

  const droneDataTexture = useMemo(() => {
    const d = new Float32Array(SIZE * SIZE * 4)
    for (let i = 0; i < SIZE * SIZE; i++) {
      const k = i * 4
      d[k + 0] = Math.random()
      d[k + 1] = 0
      d[k + 2] = 0
      d[k + 3] = 1
    }
    const t = new THREE.DataTexture(d, SIZE, SIZE, THREE.RGBAFormat, THREE.FloatType)
    t.needsUpdate = true
    return t
  }, [])
  const simScene = useMemo(() => {
    const s = new THREE.Scene()
    const c = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2, 2))
    s.add(m)
    return { scene: s, camera: c, mesh: m }
  }, [])

  useFrame(({ gl, clock }) => {
    if (!shapePositionTexture) return
    const posFbo = positionFbos.current
    const velFbo = velocityFbos.current
    const time = clock.getElapsedTime()
    const interval = 8.0
    const phaseDuration = interval / 2.0
    const timeInInterval = time % interval
    const currentPhase = Math.floor(timeInInterval / phaseDuration)
    if (currentPhase === 0) {
      currentTargetPosRef.current = shapePositionTexture
      currentTargetColorRef.current = shapeColorTexture
    } else {
      currentTargetPosRef.current = homePositionTexture
      currentTargetColorRef.current = homeColorTexture
    }
    if (currentPhase !== lastPhaseRef.current) {
      switchTimeRef.current = time
      lastPhaseRef.current = currentPhase
    }

    // --- START OF MAIN LOOP CHANGES ---
    simScene.mesh.material = simulationMaterial.current
    simulationMaterial.current.uTime = time
    simulationMaterial.current.uSwitchTime = switchTimeRef.current
    simulationMaterial.current.uTargetPositionTexture = currentTargetPosRef.current
    simulationMaterial.current.uDroneDataTexture = droneDataTexture

    // Set the input textures for the simulation
    simulationMaterial.current.uPositionTexture = frame.current === 0 ? initialPositions : posFbo.read.texture
    simulationMaterial.current.uVelocityTexture = frame.current === 0 ? initialVelocities : velFbo.read.texture

    // Set render targets: we are now writing to two textures at once
    gl.setRenderTarget(posFbo.write, 0) // location 0
    gl.setRenderTarget(velFbo.write, 1) // location 1
    gl.render(simScene.scene, simScene.camera)
    gl.setRenderTarget(null)

    // Pass the final calculated position texture to the render material
    particlesMaterial.current.uPositionTexture = posFbo.write.texture
    particlesMaterial.current.uTargetColorTexture = currentTargetColorRef.current

    // Ping-pong both sets of FBOs
    posFbo.swap()
    velFbo.swap()
    frame.current++
    // --- END OF MAIN LOOP CHANGES ---
  })

  if (!particleGeometry) {
    return null
  }
  return (
    <>
      {/* <simulationMaterial ref={simulationMaterial} /> */}
      <shaderMaterial ref={simulationMaterial} args={[simulationShader]} />
      <points>
        <primitive object={particleGeometry} />
        <particlesMaterial ref={particlesMaterial} transparent={true} blending={THREE.AdditiveBlending} depthWrite={false} />
      </points>
    </>
  )
}

export function GpgpuBoidsDemo() {
  return (
    <React.Suspense fallback={null}>
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <BoidsSimulation />
        <OrbitControls autoRotate autoRotateSpeed={0.3} enableZoom={true} />
      </Canvas>
    </React.Suspense>
  )
}
