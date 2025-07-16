'use client'

import { OrbitControls, shaderMaterial } from '@react-three/drei'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createNoise4D } from 'simplex-noise'
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
  { uSize: 15.0, uTime: 0.0 },
  `
    attribute vec3 color; varying vec3 vColor; uniform float uSize;
    varying vec3 vPosition; 
    void main() {
      vColor = color;
      vPosition = position; // Capture the drone's unique position
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
      gl_PointSize = uSize * (300.0 / -modelViewPosition.z);
    }
  `,
  `
    varying vec3 vColor;
    varying vec3 vPosition; // Receive the drone's position
    uniform float uTime; // Receive the global time
    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) { discard; }
      float shimmer = sin(vPosition.y * 10.0 + uTime * 3.0);
      shimmer = smoothstep(0.8, 1.0, shimmer); // Make it a sharp twinkle
      float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
      gl_FragColor = vec4(vColor + shimmer * 0.2, alpha + shimmer * 0.2);
    }
  `
)
extend({ DroneParticleMaterial })
const noise4D = createNoise4D()

// ========================================================================
// 1. THE AUDIO-REACTIVE VISUALIZER (FINAL CORRECTION)
// ========================================================================
function AudioVisualizer({ analyser }) {
  const meshRef = useRef()

  // --- THIS IS THE FIX ---
  // We create a data array once to hold the frequency data.
  // The size of this array depends on the analyser's fftSize.
  const dataArray = useMemo(() => {
    if (analyser) {
      return new Uint8Array(analyser.frequencyBinCount)
    }
  }, [analyser])
  // -----------------------

  useFrame(() => {
    // If we have a working analyser and data array...
    if (analyser && dataArray) {
      // --- THIS IS THE FIX ---
      // Use the correct method for the native AnalyserNode: getByteFrequencyData
      analyser.getByteFrequencyData(dataArray)
      // -----------------------

      // Manually calculate the average of the first few bins to represent the "bass"
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

  // Create a data array once to hold the frequency data.
  const dataArray = useMemo(() => {
    if (analyser) {
      analyser.fftSize = 256
      return new Uint8Array(analyser.frequencyBinCount)
    }
  }, [analyser])

  // All the existing, working logic for patterns, state, and animation remains.
  const [activeDrones, setActiveDrones] = useState(2) // Start with 2 drones
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

  // This effect will handle the growth of the swarm
  useEffect(() => {
    if (!analyser) return
    const growthInterval = setInterval(() => {
      // We stop growing when we reach the max number of drones
      if (activeDrones >= NUM_DRONES) {
        clearInterval(growthInterval)
        return
      }
      // Grow exponentially
      setActiveDrones((currentCount) => Math.min(currentCount * 2, NUM_DRONES))
    }, 2000) // Grow every 2 seconds during the intro
    return () => clearInterval(growthInterval)
  }, [analyser, activeDrones]) // Rerun if analyser is ready or count changes

  useEffect(() => {
    const loadPatterns = async () => {
      const [
        signaturePattern, // Load the new pattern
        spherePattern,
        cubePattern /* ... etc. */,
        torusPattern,
        imagePattern,
        implosionPattern,
        finalePattern,
      ] = await Promise.all([
        generateSvgPattern('/signature.svg'), // Add the call here
        generateSpherePattern(),
        generateCubePattern(),
        generateTorusPattern(),
        // generateTextPattern(),
        // generateImagePattern('/react-logo.png'),
        generateSvgPattern('/react-logo.svg'), // Add the call here
        generateImplosionPattern(),
        generateFinalePattern(),
      ])
      setPatterns([
        { name: 'signature', data: signaturePattern }, // Add it as the first pattern
        { name: 'sphere', data: spherePattern },
        // { name: 'text', data: textPattern },
        { name: 'image', data: imagePattern },
        { name: 'torus', data: torusPattern },
        { name: 'cube', data: cubePattern },
        { name: 'implosion', data: implosionPattern },
        { name: 'finale', data: finalePattern },
      ])
      // try {
      //   console.log('Loading patterns...')
      //   const loadedPatterns = await Promise.all([generateSpherePattern(), generateCubePattern(), generateTorusPattern(), generateTextPattern(), generateImagePattern('/react-logo.png'), generateFinalePattern()])
      //   // On success, set the patterns and log it.
      //   setPatterns([
      //     { name: 'sphere', data: loadedPatterns[0] },
      //     { name: 'text', data: loadedPatterns[3] },
      //     { name: 'image', data: loadedPatterns[4] },
      //     { name: 'torus', data: loadedPatterns[2] },
      //     { name: 'cube', data: loadedPatterns[1] },
      //     { name: 'finale', data: loadedPatterns[5] },
      //   ])
      //   console.log('Patterns loaded successfully!')
      // } catch (error) {
      //   // --- FIX 2: CATCH AND LOG ERRORS ---
      //   console.error('Failed to load one or more patterns:', error)
      // }
    }
    loadPatterns()
  }, [])

  useEffect(() => {
    if (patterns.length === 0) return
    const interval = setInterval(() => {
      setPatternIndex((prevIndex) => {
        if (prevIndex < patterns.length - 2) {
          return prevIndex + 1
        } else {
          clearInterval(interval)
          setIsFinale(true)
          return patterns.length - 1
        }
      })
    }, 35000)
    return () => clearInterval(interval)
  }, [patterns])

  const mousePosition = useRef(new THREE.Vector3())
  const WAVE_DURATION = 4.0
  const WAVE_THICKNESS = 40.0
  const lastPatternIndex = useRef(patternIndex)
  const transitionStartTime = useRef(0)
  // const frequencyData = useMemo(() => new Uint8Array(analyser ? analyser.frequencyBinCount : 0), [analyser])

  useFrame((state, delta) => {
    if (patterns.length === 0 || !pointsRef.current) return
    pointsRef.current.geometry.setDrawRange(0, activeDrones)

    let bass = 0,
      treble = 0,
      overallVolume = 0
    // Use the analyser passed down as a prop to get the audio data.
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

    // Apply the audio data to the material's size uniform.
    const material = pointsRef.current.material
    if (material) {
      // material.uniforms.uSize.value = 15 + bass * 20
      material.uniforms.uSize.value = 5 + bass * 15
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
      // ... (inside the loop)

      const baseColor = drone.targetColor
      // Create a "treble color" (bright yellow)
      const trebleColor = new THREE.Color('#ffff00')
      // Mix the base color with the treble color based on treble intensity
      const finalColor = new THREE.Color().copy(baseColor).lerp(trebleColor, treble * 2.0)

      drone.color.lerp(finalColor, isFinale ? 0.04 : 0.015)

      const i3 = i * 3
      const baseLerpFactor = isFinale ? 0.04 : 0.015
      let finalLerpFactor = baseLerpFactor
      if (!isFinale) {
        const waveMultiplier = THREE.MathUtils.smoothstep(
          drone.position.x, // The drone's current X position
          wavePositionX - WAVE_THICKNESS, // The trailing edge of the wave
          wavePositionX // The leading edge of the wave
        )
        finalLerpFactor *= waveMultiplier
      }
      drone.targetPosition.set(targetPattern.positions[i3], targetPattern.positions[i3 + 1], targetPattern.positions[i3 + 2])
      drone.targetColor.setRGB(targetPattern.colors[i3], targetPattern.colors[i3 + 1], targetPattern.colors[i3 + 2])
      drone.position.lerp(drone.targetPosition, finalLerpFactor)
      drone.color.lerp(drone.targetColor, finalLerpFactor)
      let finalPosition = drone.position.clone()
      if (!isFinale) {
        // Apply audio data to the swarm amplitude
        const swarmAmplitude = 0.4 + bass * 0.6
        // ... (rest of the noise and mouse logic using swarmAmplitude)

        const n = noise4D(finalPosition.x * 0.2, finalPosition.y * 0.2, finalPosition.z * 0.2, time * 0.2)
        finalPosition.add(new THREE.Vector3(n, n, n).multiplyScalar(swarmAmplitude))
        const d = mousePosition.current.distanceTo(finalPosition)
        if (d < 40) {
          const forceDir = finalPosition.clone().sub(mousePosition.current).normalize()
          finalPosition.add(forceDir.multiplyScalar((1 - d / 40) * 3))
        }
      }
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
      <droneParticleMaterial blending={THREE.AdditiveBlending} depthWrite={false} uSize={5} />
    </points>
  )
}

// ========================================================================
// 2. THE MAIN PAGE (THE CONTROLLER) - (This part is correct and unchanged)
// ========================================================================
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

          {/* {analyser && <AudioVisualizer analyser={analyser} />} */}
          {/* <gridHelper /> */}

          {/* <EffectComposer>
            <Bloom intensity={0.5} luminanceThreshold={0.1} mipmapBlur />
          </EffectComposer> */}
        </Canvas>
      </div>
    </div>
  )
}
