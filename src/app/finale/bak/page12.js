'use client'

import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
import { useGatekeeper } from '@/hooks/useGatekeeper'
import {
  BOUNDS,
  NUM_DRONES,
  generateCubePattern,
  generateFinalePattern,
  generateImagePattern,
  generateImplosionPattern,
  generateSpherePattern,
  //
  generateSvgPattern,
  generateTextPattern,
  generateTorusPattern,
} from '@/utils/patterns'

const DroneParticleMaterial = shaderMaterial(
  // 1. Add uOpacity to the uniforms
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
  // 2. Replace the fragment shader with a more artistic one
  `
    varying vec3 vColor;
    varying vec3 vPosition;
    uniform float uTime;
    uniform float uOpacity; // Receive the global opacity

    // 2D noise function to be used for subtle shimmer
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    void main() {
      // 3. Create a soft, glowing orb shape instead of a hard circle
      float dist = distance(gl_PointCoord, vec2(0.5));
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);

      // 4. Create a subtle, slow-moving shimmer using noise
      float subtleShimmer = random(vPosition.xy + uTime * 0.1) * 0.3 + 0.7;

      // 5. Combine everything for the final color and transparency
      float finalAlpha = strength * uOpacity * subtleShimmer;
      
      // Additive blending works best with this setup
      gl_FragColor = vec4(vColor, finalAlpha);
    }
  `
)
extend({ DroneParticleMaterial })

function AudioVisualizer({ analyser }) {
  const meshRef = useRef()

  const dataArray = useMemo(() => {
    if (analyser) {
      return new Uint8Array(analyser.frequencyBinCount)
    }
  }, [analyser])

  useFrame(() => {
    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray)

      const avg = (dataArray[0] + dataArray[1] + dataArray[2]) / 3

      const scale = 1 + (avg / 255) * 5
      if (meshRef.current) {
        meshRef.current.scale.set(scale, scale, scale)
      }
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="red" />
    </mesh>
  )
}

function DroneShow({ analyser }) {
  const pointsRef = useRef()

  const dataArray = useMemo(() => {
    if (analyser) {
      analyser.fftSize = 256
      return new Uint8Array(analyser.frequencyBinCount)
    }
  }, [analyser])

  const [activeDrones, setActiveDrones] = useState(2)
  const [patterns, setPatterns] = useState([])
  const [isFinale, setIsFinale] = useState(false)
  const [patternIndex, setPatternIndex] = useState(0)
  const droneData = useRef(
    Array.from({ length: NUM_DRONES }, () => ({
      position: new THREE.Vector3(0, 0, 0),
      color: new THREE.Color('white'),
      targetPosition: new THREE.Vector3(),
      targetColor: new THREE.Color(),
    }))
  )

  useEffect(() => {
    if (!analyser) return
    const growthInterval = setInterval(() => {
      if (activeDrones >= NUM_DRONES) {
        clearInterval(growthInterval)
        return
      }
      setActiveDrones((currentCount) => Math.min(currentCount * 2, NUM_DRONES))
    }, 2000)
    return () => clearInterval(growthInterval)
  }, [analyser, activeDrones])

  useEffect(() => {
    const loadPatterns = async () => {
      const [signaturePattern, spherePattern, cubePattern, torusPattern, imagePattern, implosionPattern, finalePattern] = await Promise.all([
        generateSvgPattern('/signature.svg'), //
        generateSpherePattern(),
        generateCubePattern(),
        generateTorusPattern(),
        generateSvgPattern('/react-logo.svg'), //
        generateImplosionPattern(),
        generateFinalePattern(),
      ])
      setPatterns([
        { name: 'signature', data: signaturePattern }, //
        { name: 'sphere', data: spherePattern },
        { name: 'image', data: imagePattern },
        { name: 'torus', data: torusPattern },
        { name: 'cube', data: cubePattern },
        { name: 'implosion', data: implosionPattern },
        { name: 'finale', data: finalePattern },
      ])
    }
    loadPatterns()
  }, [])

  useEffect(() => {
    if (isFinale || patterns.length === 0) {
      return
    }

    const interval = setInterval(() => {
      setPatternIndex((prevIndex) => {
        if (prevIndex >= patterns.length - 2) {
          setIsFinale(true)
          return patterns.length - 1
        }
        return prevIndex + 1
      })
    }, 35000)

    return () => clearInterval(interval)
  }, [patterns, isFinale])

  const mousePosition = useRef(new THREE.Vector3())
  const WAVE_DURATION = 4.0
  const WAVE_THICKNESS = 40.0
  const lastPatternIndex = useRef(patternIndex)
  const transitionStartTime = useRef(0)

  useFrame((state, delta) => {
    if (patterns.length === 0 || !pointsRef.current) return
    pointsRef.current.geometry.setDrawRange(0, activeDrones)

    let bass = 0,
      treble = 0,
      overallVolume = 0
    if (analyser && dataArray) {
      analyser.getByteFrequencyData(dataArray)
      bass = (dataArray[0] + dataArray[1] + dataArray[2]) / 3 / 255
      treble = (dataArray[20] + dataArray[30] + dataArray[40]) / 3 / 255 // Higher frequencies
      let sum = 0
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i]
      }
      overallVolume = sum / dataArray.length / 255
    }

    const material = pointsRef.current.material
    if (material) {
      material.uniforms.uSize.value = 1.0 // Static size for our blank canvas
      material.uniforms.uTime.value = state.clock.getElapsedTime()
    }
    pointsRef.current.rotation.y += (0.01 + overallVolume * 0.05) * delta

    if (patternIndex !== lastPatternIndex.current) {
      transitionStartTime.current = state.clock.getElapsedTime()
      lastPatternIndex.current = patternIndex
    }
    const positions = pointsRef.current.geometry.attributes.position.array
    const colors = pointsRef.current.geometry.attributes.color.array
    mousePosition.current.set((state.pointer.x * state.viewport.width) / 2, (state.pointer.y * state.viewport.height) / 2, 0)
    const targetPattern = patterns[patternIndex].data
    const time = state.clock.getElapsedTime()
    const elapsed = state.clock.getElapsedTime() - transitionStartTime.current
    const wavePositionX = THREE.MathUtils.lerp(-BOUNDS, BOUNDS, Math.min(elapsed / WAVE_DURATION, 1.0))
    droneData.current.forEach((drone, i) => {
      drone.color.lerp(drone.targetColor, isFinale ? 0.04 : 0.015)

      const i3 = i * 3
      const baseLerpFactor = isFinale ? 0.04 : 0.015
      let finalLerpFactor = baseLerpFactor
      if (!isFinale) {
        const waveMultiplier = THREE.MathUtils.smoothstep(
          drone.position.x, //
          wavePositionX - WAVE_THICKNESS, //
          wavePositionX //
        )
        finalLerpFactor *= waveMultiplier
      }
      drone.targetPosition.set(targetPattern.positions[i3], targetPattern.positions[i3 + 1], targetPattern.positions[i3 + 2])
      drone.targetColor.setRGB(targetPattern.colors[i3], targetPattern.colors[i3 + 1], targetPattern.colors[i3 + 2])
      drone.position.lerp(drone.targetPosition, finalLerpFactor)
      drone.color.lerp(drone.targetColor, finalLerpFactor)
      let finalPosition = drone.position.clone()

      positions[i3] = finalPosition.x
      positions[i3 + 1] = finalPosition.y
      positions[i3 + 2] = finalPosition.z
      colors[i3] = drone.color.r
      colors[i3 + 1] = drone.color.g
      colors[i3 + 2] = drone.color.b
      // ...
    })
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={NUM_DRONES} array={new Float32Array(NUM_DRONES * 3)} itemSize={3} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-color" count={NUM_DRONES} array={new Float32Array(NUM_DRONES * 3)} itemSize={3} usage={THREE.DynamicDrawUsage} />
      </bufferGeometry>
      <droneParticleMaterial blending={THREE.AdditiveBlending} depthWrite={false} uSize={1} uOpacity={0.7} transparent={true} />
    </points>
  )
}

export default function FinalePage() {
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

    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }
    if (audio.dataset.connected) return

    const source = audioContext.createMediaElementSource(audio)
    const newAnalyser = audioContext.createAnalyser()
    newAnalyser.fftSize = 64

    source.connect(newAnalyser)
    newAnalyser.connect(audioContext.destination)

    setAnalyser(newAnalyser)

    audio.play().catch((e) => console.error('Playback failed:', e))
    audio.dataset.connected = true

    setHasStarted(true)
  }

  return (
    <div className={styles.wrapper}>
      <audio ref={audioRef} src="/sound/nezuko.mp3" loop={true} style={{ display: 'none' }} />

      {!hasStarted && (
        <div className={styles.beginOverlay}>
          <button onClick={handleBegin} className={styles.beginButton}>
            Begin
          </button>
        </div>
      )}

      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 100] }} style={{ backgroundColor: '#050505' }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[100, 100, 100]} intensity={1} />
          <DroneShow analyser={analyser} />
          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
      </div>
    </div>
  )
}
