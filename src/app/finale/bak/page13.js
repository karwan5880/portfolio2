'use client'

import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { GpgpuBoidsDemo } from './BoidGpuDemo'
import styles from './page.module.css'

// --- 1. MODIFIED SHADER for Opaque Particles ---
const DroneParticleMaterial = shaderMaterial(
  { uSize: 15.0, uTime: 0.0, uOpacity: 1.0 },
  // Vertex shader remains the same
  `
    attribute vec3 color; varying vec3 vColor; uniform float uSize;
    varying vec3 vPosition; 
    void main() {
      vColor = color;
      vPosition = position;
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
      gl_PointSize = uSize * (300.0 / -modelViewPosition.z);
    }
  `,
  // New fragment shader: edges are darker, not transparent
  `
    varying vec3 vColor;
    varying vec3 vPosition;
    uniform float uTime;

    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) {
        discard;
      }
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);
      float subtleShimmer = random(vPosition.xy + uTime * 0.1) * 0.3 + 0.7;
      vec3 finalColor = vColor * strength * subtleShimmer;
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
)
extend({ DroneParticleMaterial })

const NUM_DRONES = 500
const BOUNDS = 50

// --- 2. PATTERN GENERATORS ---
const generateSpherePattern = () => {
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  const color = new THREE.Color()
  for (let i = 0; i < NUM_DRONES; i++) {
    const i3 = i * 3
    const p = new THREE.Vector3().randomDirection().multiplyScalar(BOUNDS * 0.6)
    positions[i3] = p.x
    positions[i3 + 1] = p.y
    positions[i3 + 2] = p.z
    color.setHSL(0.6 + (p.y / BOUNDS) * 0.2, 0.7, 0.7) // Blue/purple hues
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }
  return { positions, colors }
}

const generateCubePattern = () => {
  const positions = new Float32Array(NUM_DRONES * 3)
  const colors = new Float32Array(NUM_DRONES * 3)
  const color = new THREE.Color()
  for (let i = 0; i < NUM_DRONES; i++) {
    const i3 = i * 3
    const p = new THREE.Vector3((Math.random() - 0.5) * BOUNDS * 0.8, (Math.random() - 0.5) * BOUNDS * 0.8, (Math.random() - 0.5) * BOUNDS * 0.8)
    positions[i3] = p.x
    positions[i3 + 1] = p.y
    positions[i3 + 2] = p.z
    color.setHSL(0.1 + (p.z / BOUNDS) * 0.2, 0.7, 0.7) // Orange/yellow hues
    colors[i3] = color.r
    colors[i3 + 1] = color.g
    colors[i3 + 2] = color.b
  }
  return { positions, colors }
}

const boidsConfig = {
  maxSpeed: 0.6,
  maxForce: 0.04,
  perceptionRadius: 10,
  separationWeight: 1.5,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  goalSeekingWeight: 0.08,
  boundaryWeight: 0.2,
  repulsionWeight: 2.5, // New weight for mouse interaction
  repulsionRadius: 15, // New radius for mouse interaction
}

function BoidsSwarm({ mousePos, analyser }) {
  // Accept mousePos as a prop
  const pointsRef = useRef()

  // --- 2. SHAPE-SHIFTING LOGIC ---
  const [patterns, setPatterns] = useState([])
  const [patternIndex, setPatternIndex] = useState(0)

  useEffect(() => {
    const sphere = generateSpherePattern()
    const cube = generateCubePattern()
    setPatterns([sphere, cube])
  }, [])

  useEffect(() => {
    if (patterns.length === 0) return
    const interval = setInterval(() => {
      setPatternIndex((prev) => (prev + 1) % patterns.length)
    }, 10000) // Transition every 10 seconds
    return () => clearInterval(interval)
  }, [patterns])

  const droneData = useMemo(
    () =>
      Array.from({ length: NUM_DRONES }, () => ({
        position: new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * BOUNDS),
        velocity: new THREE.Vector3().randomDirection().setLength(Math.random() * boidsConfig.maxSpeed),
        acceleration: new THREE.Vector3(),
        targetPosition: new THREE.Vector3(),
        targetColor: new THREE.Color(),
        color: new THREE.Color('white'),
      })),
    []
  )

  const dataArray = useMemo(() => {
    if (analyser) return new Uint8Array(analyser.frequencyBinCount)
  }, [analyser])

  // Re-usable vectors for performance
  const separation = new THREE.Vector3(),
    alignment = new THREE.Vector3(),
    cohesion = new THREE.Vector3()
  const goal = new THREE.Vector3(),
    boundary = new THREE.Vector3(),
    diff = new THREE.Vector3()
  const repulsion = new THREE.Vector3() // New vector for mouse repulsion

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current || patterns.length === 0) return

    let bass = 0
    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray)
      // Sum the first few frequency bins for a stable bass value
      bass = (dataArray[0] + dataArray[1] + dataArray[2] + dataArray[3]) / 4 / 255
    }
    // Make the bass effect more pronounced
    const bassPulse = bass * 3.0

    const currentPattern = patterns[patternIndex]

    droneData.forEach((drone, i) => {
      // Update target from current pattern
      drone.targetPosition.fromArray(currentPattern.positions, i * 3)
      drone.targetColor.fromArray(currentPattern.colors, i * 3)

      separation.set(0, 0, 0)
      alignment.set(0, 0, 0)
      cohesion.set(0, 0, 0)
      let perceptionCount = 0

      const checks = 75
      for (let j = 0; j < checks; j++) {
        const other = droneData[Math.floor(Math.random() * NUM_DRONES)]
        const distance = drone.position.distanceTo(other.position)
        if (other !== drone && distance < boidsConfig.perceptionRadius) {
          diff.subVectors(drone.position, other.position).divideScalar(distance * distance)
          separation.add(diff)
          alignment.add(other.velocity)
          cohesion.add(other.position)
          perceptionCount++
        }
      }

      if (perceptionCount > 0) {
        /* ... force calculations ... */
      }

      // --- 3. MOUSE INTERACTION FORCE ---
      repulsion.set(0, 0, 0)
      const distanceToMouse = drone.position.distanceTo(mousePos.current)
      if (distanceToMouse < boidsConfig.repulsionRadius) {
        repulsion
          .subVectors(drone.position, mousePos.current)
          .normalize()
          .multiplyScalar((boidsConfig.repulsionRadius - distanceToMouse) / boidsConfig.repulsionRadius)
        repulsion.setLength(boidsConfig.maxSpeed).sub(drone.velocity).clampLength(0, boidsConfig.maxForce)
      }

      goal.subVectors(drone.targetPosition, drone.position).setLength(boidsConfig.maxSpeed).sub(drone.velocity).clampLength(0, boidsConfig.maxForce)
      boundary.set(0, 0, 0)
      if (drone.position.length() > BOUNDS) boundary.copy(drone.position).multiplyScalar(-1)
      boundary.setLength(boidsConfig.maxSpeed).sub(drone.velocity).clampLength(0, boidsConfig.maxForce)

      drone.acceleration.addScaledVector(separation, boidsConfig.separationWeight)
      drone.acceleration.addScaledVector(alignment, boidsConfig.alignmentWeight)
      drone.acceleration.addScaledVector(cohesion, boidsConfig.cohesionWeight)
      drone.acceleration.addScaledVector(goal, boidsConfig.goalSeekingWeight)
      drone.acceleration.addScaledVector(boundary, boidsConfig.boundaryWeight)
      drone.acceleration.addScaledVector(repulsion, boidsConfig.repulsionWeight)

      const modifiedGoalWeight = boidsConfig.goalSeekingWeight * (1 + bassPulse)

      /* ... Add forces to acceleration, using the modified weight for the goal ... */
      drone.acceleration.addScaledVector(goal, modifiedGoalWeight)
    })

    const positions = pointsRef.current.geometry.attributes.position.array
    const colors = pointsRef.current.geometry.attributes.color.array
    droneData.forEach((drone, i) => {
      drone.velocity.addScaledVector(drone.acceleration, delta)
      drone.velocity.clampLength(0, boidsConfig.maxSpeed)
      drone.position.addScaledVector(drone.velocity, delta)
      drone.acceleration.set(0, 0, 0)

      drone.color.lerp(drone.targetColor, 0.05)

      const i3 = i * 3
      positions[i3] = drone.position.x
      positions[i3 + 1] = drone.position.y
      positions[i3 + 2] = drone.position.z
      colors[i3] = drone.color.r
      colors[i3 + 1] = drone.color.g
      colors[i3 + 2] = drone.color.b
    })

    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true
    pointsRef.current.material.uniforms.uTime.value = clock.getElapsedTime()
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={NUM_DRONES} array={new Float32Array(NUM_DRONES * 3)} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={NUM_DRONES} array={new Float32Array(NUM_DRONES * 3)} itemSize={3} />
      </bufferGeometry>
      {/* --- 1. MODIFIED MATERIAL PROPERTIES for Opaque Particles --- */}
      <droneParticleMaterial
        blending={THREE.NormalBlending} //
        depthWrite={true}
        transparent={false}
        uSize={15}
        uOpacity={1.0}
      />
    </points>
  )
}

export default function FinalePage() {
  // --- 3. MOUSE TRACKING STATE ---
  const mousePos = useRef(new THREE.Vector3(9999, 9999, 9999)) // Start it far away

  const [hasStarted, setHasStarted] = useState(false)
  const [analyser, setAnalyser] = useState(null)
  const audioRef = useRef(null)
  const audioContextRef = useRef(null)

  const handleBegin = () => {
    const audio = audioRef.current
    if (!audio) return

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }
    const audioContext = audioContextRef.current

    if (audioContext.state === 'suspended') audioContext.resume()
    if (audio.dataset.connected) return

    const source = audioContext.createMediaElementSource(audio)
    const newAnalyser = audioContext.createAnalyser()
    newAnalyser.fftSize = 64 // Low resolution is fine for this

    source.connect(newAnalyser)
    newAnalyser.connect(audioContext.destination)

    setAnalyser(newAnalyser)
    audio.play().catch((e) => console.error('Playback failed:', e))
    audio.dataset.connected = true
    setHasStarted(true)
  }

  // This function will be called on every mouse move over the canvas
  const handlePointerMove = (event) => {
    // `event.point` is the intersection point in 3D space
    mousePos.current.copy(event.point)
  }

  const handlePointerOut = () => {
    // Move the target far away so it doesn't affect the swarm
    mousePos.current.set(9999, 9999, 9999)
  }

  return (
    <GpgpuBoidsDemo />
    // <div className={styles.wrapper}>
    //   <audio ref={audioRef} src="/sound/nezuko.mp3" loop={true} style={{ display: 'none' }} />
    //   {!hasStarted && (
    //     <div className={styles.beginOverlay}>
    //       <button onClick={handleBegin} className={styles.beginButton}>
    //         Begin
    //       </button>
    //     </div>
    //   )}
    //   <div className={styles.canvasContainer}>
    //     <Canvas camera={{ position: [0, 0, 120] }} style={{ backgroundColor: '#050505' }}>
    //       <ambientLight intensity={0.8} />
    //       {hasStarted && <BoidsSwarm mousePos={mousePos} analyser={analyser} />}
    //       <OrbitControls enableDamping dampingFactor={0.05} />
    //       <EffectComposer>
    //         <Bloom intensity={0.6} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
    //       </EffectComposer>
    //       <mesh
    //         position={[0, 0, 0]} // Sits at the center of the scene
    //         onPointerMove={handlePointerMove}
    //         onPointerOut={handlePointerOut}
    //       >
    //         <planeGeometry args={[200, 200]} />
    //         <meshBasicMaterial visible={false} />
    //       </mesh>
    //     </Canvas>
    //   </div>
    // </div>
  )
}
