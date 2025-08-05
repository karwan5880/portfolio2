'use client'

import { OrbitControls, PositionalAudio, shaderMaterial } from '@react-three/drei'
import { Instance, Instances, useGLTF } from '@react-three/drei'
import { Canvas, extend, instancedMesh, useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createNoise4D } from 'simplex-noise'
import * as THREE from 'three'
import { mergeBufferGeometries } from 'three-stdlib'
import { create } from 'zustand'
import { shallow } from 'zustand/shallow'

// import { AudioPlayer } from '@/components/AudioPlayer'
import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
import { useGatekeeper } from '@/hooks/useGatekeeper'
// import { useAudioStore } from '@/stores/audioStore'
import {
  BOUNDS,
  NUM_DRONES,
  //
  generateCubePattern,
  generateFinalePattern,
  generateImagePattern,
  generateSpherePattern,
  generateTextPattern,
  generateTorusPattern,
} from '@/utils/patterns'

// ========================================================================
// 1. ZUSTAND AUDIO STORE (Simplified)
// ========================================================================
export const useAudioStore = create((set) => ({
  analyser: null,
  bass: 0,
  treble: 0,
  setAnalyser: (analyser) => set({ analyser }),
  setFrequencyData: ({ bass, treble }) => set({ bass, treble }),
}))

// ========================================================================
// 2. AUDIO PLAYER COMPONENT
// ========================================================================
function AudioPlayer({ url, play }) {
  const sound = useRef()
  const { setAnalyser, setFrequencyData } = useAudioStore()

  const analyser = useMemo(() => {
    if (sound.current) {
      return new THREE.AudioAnalyser(sound.current, 64)
    }
    return null
  }, [sound.current])

  useEffect(() => {
    if (analyser) setAnalyser(analyser)
  }, [analyser, setAnalyser])

  // --- THIS IS THE FIX ---
  // We use a separate useEffect to handle the "play" command.
  useEffect(() => {
    // If the play prop is true AND we have a valid sound object with its buffer loaded...
    if (play && sound.current && sound.current.buffer) {
      // ...then we can safely call .play()
      // We check if it's not already playing to prevent re-starting it on re-renders.
      if (!sound.current.isPlaying) {
        sound.current.play()
        console.log('Audio playback started via direct .play() call.')
      }
    }
    // We also want to handle pausing if the 'play' prop were to become false.
    // This isn't used in our current app, but it's good practice.
    if (!play && sound.current && sound.current.isPlaying) {
      sound.current.pause()
    }
  }, [play, sound.current?.buffer]) // This effect re-runs when `play` changes or when the sound buffer is loaded.
  // -----------------------

  useFrame(() => {
    if (analyser) {
      const data = analyser.getFrequencyData()
      const bass = (data[0] + data[1] + data[2]) / 3 / 255
      const treble = (data[10] + data[11] + data[12]) / 3 / 255
      setFrequencyData({ bass, treble })
    }
  })

  if (!play) return null

  return <PositionalAudio ref={sound} url={url} loop={false} distance={1} />
}

// ========================================================================
// 3. SHADER MATERIAL SETUP
// ========================================================================
const DroneParticleMaterial = shaderMaterial(
  { uSize: 1.0 },
  // Vertex Shader (positions the particles)
  `
    attribute vec3 color;
    varying vec3 vColor;
    uniform float uSize;
    void main() {
      vColor = color;
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewPosition;
      gl_PointSize = uSize * (300.0 / -modelViewPosition.z);
    }
  `,
  // Fragment Shader (colors the particles)
  `
    varying vec3 vColor;
    void main() {
      // Calculate the distance from the center of the particle
      float dist = distance(gl_PointCoord, vec2(0.3));
      // If the pixel is outside the circle's radius, discard it
      if (dist > 0.2) {
        discard;
      }
      // Create a smooth, soft edge
      float alpha = 1.0 - smoothstep(0.45, 0.5, dist);
      gl_FragColor = vec4(vColor, alpha);
    }
  `
)

// 2. Register it with React Three Fiber
extend({ DroneParticleMaterial })

const noise4D = createNoise4D()

function DroneShow() {
  const pointsRef = useRef()
  const instancesRef = useRef()
  const [patterns, setPatterns] = useState([])
  const [isFinale, setIsFinale] = useState(false)
  const [patternIndex, setPatternIndex] = useState(0)
  const { nodes } = useGLTF('/drone.glb')
  const { geometry, scale } = useMemo(() => {
    if (!nodes.Body) return { geometry: null, scale: 1 }
    const geometries = [nodes.Body.geometry, nodes.Rotor_FL.geometry, nodes.Rotor_FR.geometry, nodes.Rotor_BL.geometry, nodes.Rotor_BR.geometry]
    const merged = mergeBufferGeometries(geometries)
    merged.center()
    merged.computeBoundingSphere()
    const radius = merged.boundingSphere.radius
    const desiredSize = 10
    const scaleFactor = desiredSize / radius
    return { geometry: merged, scale: scaleFactor }
  }, [nodes])
  const droneData = useRef(
    Array.from({ length: NUM_DRONES }, () => ({
      position: new THREE.Vector3(0, 0, 0),
      color: new THREE.Color('white'),
      targetPosition: new THREE.Vector3(),
      targetColor: new THREE.Color(),
    }))
  )
  const WAVE_DURATION = 4.0
  const WAVE_THICKNESS = 40.0
  const lastPatternIndex = useRef(patternIndex)
  const transitionStartTime = useRef(0)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const mousePosition = useRef(new THREE.Vector3())
  const analyser = useAudioStore((state) => state.analyser)
  const frequencyData = useMemo(() => new Uint8Array(analyser ? analyser.frequencyBinCount : 0), [analyser])

  useEffect(() => {
    const loadPatterns = async () => {
      try {
        console.log('Loading patterns...')
        const loadedPatterns = await Promise.all([generateSpherePattern(), generateCubePattern(), generateTorusPattern(), generateTextPattern(), generateImagePattern('/react-logo.png'), generateFinalePattern()])

        // On success, set the patterns and log it.
        setPatterns([
          { name: 'sphere', data: loadedPatterns[0] },
          { name: 'text', data: loadedPatterns[3] },
          { name: 'image', data: loadedPatterns[4] },
          { name: 'torus', data: loadedPatterns[2] },
          { name: 'cube', data: loadedPatterns[1] },
          { name: 'finale', data: loadedPatterns[5] },
        ])
        console.log('Patterns loaded successfully!')
      } catch (error) {
        // --- FIX 2: CATCH AND LOG ERRORS ---
        console.error('Failed to load one or more patterns:', error)
      }
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

  useFrame((state, delta) => {
    if (patterns.length === 0 || !pointsRef.current) return
    const { bass, treble } = useAudioStore.getState()
    const material = pointsRef.current.material
    if (material) {
      // Make the particle size pulse with the bass
      // material.uniforms.uSize.value = 15 + (avgBass / 255) * 10
      material.uniforms.uSize.value = 15 + bass * 15
    }
    let avgBass = 0
    let avgTreble = 0
    if (analyser) {
      analyser.getByteFrequencyData(frequencyData)

      // Calculate average bass (e.g., first 5 bins)
      for (let i = 0; i < 5; i++) {
        avgBass += frequencyData[i]
      }
      avgBass /= 5

      // Calculate average treble (e.g., bins 50-60)
      for (let i = 50; i < 60; i++) {
        avgTreble += frequencyData[i]
      }
      avgTreble /= 10
    }
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
    // const lerpFactor = isFinale ? 0.04 : 0.015
    droneData.current.forEach((drone, i) => {
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
        // ... (swarm and mouse logic is unchanged)
        const swarmAmplitude = 0.4 + bass * 0.6
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
    })
    pointsRef.current.geometry.attributes.position.needsUpdate = true
    pointsRef.current.geometry.attributes.color.needsUpdate = true
  })

  if (!geometry) return null

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={NUM_DRONES} array={new Float32Array(NUM_DRONES * 3)} itemSize={3} usage={THREE.DynamicDrawUsage} />
        <bufferAttribute attach="attributes-color" count={NUM_DRONES} array={new Float32Array(NUM_DRONES * 3)} itemSize={3} usage={THREE.DynamicDrawUsage} />
      </bufferGeometry>
      <droneParticleMaterial blending={THREE.AdditiveBlending} depthWrite={false} uSize={1} />
    </points>
  )
}

function DroneShowTest() {
  const { nodes } = useGLTF('/drone.glb')

  const { geometry, scale } = useMemo(() => {
    if (!nodes.Body) return { geometry: null, scale: 1 }
    const geometries = [nodes.Body.geometry, nodes.Rotor_FL.geometry, nodes.Rotor_FR.geometry, nodes.Rotor_BL.geometry, nodes.Rotor_BR.geometry]
    const merged = mergeBufferGeometries(geometries)
    merged.center()
    merged.computeBoundingSphere()
    const radius = merged.boundingSphere.radius
    const desiredSize = 0.5
    const scaleFactor = desiredSize / radius

    console.log('Calculated Scale Factor:', scaleFactor)

    return { geometry: merged, scale: scaleFactor }
  }, [nodes])

  const droneStates = useMemo(() => {
    return Array.from({ length: NUM_DRONES }, () => ({
      position: new THREE.Vector3(0, 0, 0), // All at the origin
      rotation: new THREE.Euler(0, 0, 0),
      color: new THREE.Color('white'), // All are white
    }))
  }, [])

  if (!geometry || scale <= 0 || isNaN(scale)) {
    console.error("Geometry or scale is invalid. Can't render.", { geometry, scale })
    return null
  }

  return (
    <Instances geometry={geometry}>
      <meshStandardMaterial />
      {droneStates.map((drone, i) => (
        <Instance key={i} color={drone.color} position={drone.position} rotation={drone.rotation} scale={scale} />
      ))}
    </Instances>
  )
}

export default function FinalePage() {
  useGatekeeper('/finale')

  const startExperience = useAudioStore((state) => state.startExperience)
  const cleanup = useAudioStore((state) => state.cleanup)
  const isInitialized = useAudioStore((state) => state.isInitialized)
  const audioContext = useAudioStore((state) => state.analyser?.context)
  const [start, setStart] = useState(false)

  // useEffect(() => {
  //   // Only start if it hasn't been started already
  //   if (!isInitialized) {
  //     startExperience()
  //   }
  //   // This is the crucial part for stopping the music when you navigate away
  //   return () => {
  //     cleanup()
  //   }
  // }, [isInitialized, startExperience, cleanup]) // Add dependencies

  // useEffect(() => {
  //   // The return function is the cleanup.
  //   return () => {
  //     cleanup()
  //   }
  // }, []) // Empty array is key here.

  // --- FIX 2: THE "BEGIN" BUTTON ---
  // This function will be called by our button.
  // It provides the user interaction required by the browser.
  const handleBegin = () => {
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume()
      console.log('AudioContext resumed!')
    }
    startExperience()
  }

  return (
    <div className={styles.wrapper}>
      {!start && (
        <div className={styles.beginOverlay}>
          <button onClick={() => setStart(true)} className={styles.beginButton}>
            Thank You
          </button>
        </div>
      )}

      {/* --- TEMPORARY DEBUGGING ELEMENT --- */}
      {/* <audio
        src="/sound/nezuko.mp3"
        controls
        style={{
          position: 'absolute',
          bottom: '10px',
          left: '10px',
          zIndex: 100,
          opacity: 0.5,
        }}
      /> */}
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 80], fov: 75 }} style={{ backgroundColor: '#050505' }}>
          {/* {isInitialized && ( */}
          {/* <> */}
          <ambientLight intensity={0.2} />
          <DroneShow />
          {/* <DroneShowTest /> */}
          <OrbitControls enableDamping dampingFactor={0.05} />
          {start && <AudioPlayer url="/sound/nezuko.mp3" play={start} />}
          {/* <EffectComposer>
            <Bloom intensity={0.6} luminanceThreshold={0.01} luminanceSmoothing={0.025} mipmapBlur />
          </EffectComposer> */}
          {/* </> */}
          {/* )} */}
        </Canvas>
      </div>
      <div className={styles.overlayContent}>
        <p>Thank You</p>
      </div>
      <CornerLink href="/location" position="bottom-left" label="Location" aria-label="Return to location" />
      <CornerLink href="/" position="bottom-right" label="Home" aria-label="Go to Home Page" />
    </div>
  )
}
