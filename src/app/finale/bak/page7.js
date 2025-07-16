'use client'

import { Line, Stars } from '@react-three/drei'
import { useTexture } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MathUtils, Vector3 } from 'three'
import * as THREE from 'three'

import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
import { devHistoryData } from '@/data/dev-history-data'
import { useGatekeeper } from '@/hooks/useGatekeeper'
import { useAudioStore } from '@/stores/audioStore'

const SnowfallMaterial = shaderMaterial(
  { uTime: 0, uSize: 15.0, uTexture: null },
  `
    uniform float uTime;
    uniform float uSize;
    attribute float aSpeed;
    attribute float aSway;
    attribute float aRotation;

    varying float vRotation;

    void main() {
      float y = mod(position.y - (uTime * aSpeed), 20.0) - 10.0;
      float x = position.x + (sin(uTime * 0.2 * aSway) * 0.5);

      vec4 modelPosition = modelMatrix * vec4(x, y, position.z, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectionPosition = projectionMatrix * viewPosition;

      gl_Position = projectionPosition;
      gl_PointSize = uSize * (1.0 / -viewPosition.z);

      vRotation = uTime * aRotation;
    }
  `,
  `
    uniform sampler2D uTexture;
    varying float vRotation;

    void main() {
      float mid = 0.5;
      vec2 rotated = vec2(cos(vRotation) * (gl_PointCoord.x - mid) - sin(vRotation) * (gl_PointCoord.y - mid) + mid,
                          cos(vRotation) * (gl_PointCoord.y - mid) + sin(vRotation) * (gl_PointCoord.x - mid) + mid);

      vec4 textureColor = texture2D(uTexture, rotated);
      gl_FragColor = vec4(textureColor.rgb, textureColor.a * 0.8);
    }
  `
)

extend({ SnowfallMaterial })

function Snowflakes3({ count = 2000 }) {
  const materialRef = useRef()
  const texture = useTexture('/textures/snowflake.png')
  const [positions, speeds, sways, rotations] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    const sways = new Float32Array(count)
    const rotations = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      positions.set(
        [
          MathUtils.randFloatSpread(20), // x
          MathUtils.randFloatSpread(20), // y
          MathUtils.randFloatSpread(20), // z
        ],
        i * 3
      )
      speeds[i] = MathUtils.randFloat(0.5, 1.5)
      sways[i] = MathUtils.randFloat(0.5, 1.5)
      rotations[i] = MathUtils.randFloat(0.5, 1.5)
    }
    return [positions, speeds, sways, rotations]
  }, [count])
  useFrame((state, delta) => {
    materialRef.current.uTime += delta
  })
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSpeed" args={[speeds, 1]} />
        <bufferAttribute attach="attributes-aSway" args={[sways, 1]} />
        <bufferAttribute attach="attributes-aRotation" args={[rotations, 1]} />
      </bufferGeometry>
      <snowfallMaterial ref={materialRef} uTexture={texture} transparent={true} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  )
}

function Snowfall({ count = 2000 }) {
  const pointsRef = useRef()
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = MathUtils.randFloatSpread(50) // x
      pos[i3 + 1] = MathUtils.randFloat(0, 50) // y
      pos[i3 + 2] = MathUtils.randFloatSpread(50) // z
    }
    return pos
  }, [count])
  useFrame((state, delta) => {
    const posArray = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      posArray[i3 + 1] -= delta * 5 //
      if (posArray[i3 + 1] < -20) {
        posArray[i3 + 1] = 20
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="white" transparent opacity={0.7} />
    </points>
  )
}

function ConstellationNode({ startPos, targetPos, onAnimationComplete }) {
  const nodeRef = useRef()
  const [isPlaced, setIsPlaced] = useState(false)
  useFrame((_, delta) => {
    if (!nodeRef.current || isPlaced) return
    nodeRef.current.position.lerp(targetPos, delta * 0.8)
    if (nodeRef.current.position.distanceTo(targetPos) < 0.05) {
      nodeRef.current.position.copy(targetPos)
      setIsPlaced(true)
      onAnimationComplete() //
    }
  })
  return (
    <mesh ref={nodeRef} position={startPos}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#8a2be2" emissive="#8a2be2" emissiveIntensity={3} toneMapped={false} />
    </mesh>
  )
}
function SynapseLine({ start, end }) {
  const points = useMemo(() => [start, end], [start, end])
  return <Line points={points} color="white" lineWidth={1} transparent opacity={0.25} />
}

function Constellation() {
  const groupRef = useRef()
  const [linesVisible, setLinesVisible] = useState(false)
  const placementCounter = useRef(0)
  const nodes = useMemo(() => {
    const constellationRadius = 5
    const startRadius = 25 //
    return devHistoryData.map((item, index) => {
      const phi = Math.acos(-1 + (2 * index) / devHistoryData.length)
      const theta = Math.sqrt(devHistoryData.length * Math.PI) * phi
      const targetPos = new Vector3().setFromSphericalCoords(constellationRadius, phi, theta)
      const startPos = new Vector3().setFromSphericalCoords(startRadius, Math.random() * Math.PI, Math.random() * 2 * Math.PI)
      return {
        id: item.id,
        connectsTo: item.connectsTo,
        startPos,
        targetPos,
      }
    })
  }, [])

  const handleNodePlaced = () => {
    placementCounter.current++
    if (placementCounter.current >= nodes.length) {
      setTimeout(() => setLinesVisible(true), 500) //
    }
  }
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })
  const getNodePosition = (id) => nodes.find((n) => n.id === id)?.targetPos
  return (
    <group ref={groupRef}>
      {nodes.map((node) => (
        <ConstellationNode key={node.id} startPos={node.startPos} targetPos={node.targetPos} onAnimationComplete={handleNodePlaced} />
      ))}
      {linesVisible &&
        nodes.map((node) =>
          node.connectsTo.map((targetId) => {
            const startPos = getNodePosition(node.id)
            const endPos = getNodePosition(targetId)
            if (!startPos || !endPos) return null
            return <SynapseLine key={`${node.id}-${targetId}`} start={startPos} end={endPos} />
          })
        )}
    </group>
  )
}

export default function FinalePage() {
  useGatekeeper('/finale')
  const hasPermission = useAudioStore((state) => state.hasPermission)
  const isInitialized = useAudioStore((state) => state.isInitialized)
  const isPlaying = useAudioStore((state) => state.isPlaying)
  const startExperience = useAudioStore((state) => state.startExperience)
  const [showFinale, setShowFinale] = useState(false)
  const [showText, setShowText] = useState(false)
  useEffect(() => {
    if (hasPermission) {
      const finaleTimer = setTimeout(() => setShowFinale(true), 1000)
      const textTimer = setTimeout(() => setShowText(true), 7000) //
      const linksTimer = setTimeout(() => setShowLinks(true), 8500)

      return () => {
        clearTimeout(finaleTimer)
        clearTimeout(textTimer)
        clearTimeout(linksTimer)
      }
    }
  }, [hasPermission])
  useEffect(() => {
    if (hasPermission && !isInitialized) {
      const audioStartTimer = setTimeout(() => {
        startExperience()
      }, 10000)
      return () => {
        clearTimeout(audioStartTimer)
      }
    }
  }, [hasPermission, isInitialized, startExperience])
  if (!hasPermission) {
    return (
      <div className={styles.gateContainer}>
        <h1>Access Denied</h1>
        <p>Please view the development history first to unlock the finale.</p>
        <a href="/location" className={styles.gateLink}>
          Return to Journey
        </a>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
          <ambientLight intensity={0.8} />
          <Stars count={5000} factor={4} saturation={0} fade speed={1} />
          {showFinale && <Constellation />}
          {isPlaying && (
            <>
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#a0e0ff" />
              <Snowfall />
              <Snowflakes3 />
            </>
          )}
        </Canvas>
      </div>
      <div className={styles.overlayContent}>
        <div className={`${styles.textContainer} ${showText ? styles.isVisible : ''}`}>Thank You</div>
      </div>
      <CornerLink href="/location" position="bottom-left" label="Location" aria-label="Return to location" />
      <CornerLink href="/" position="bottom-right" label="Home" aria-label="Go to Home Page" />
    </div>
  )
}

// this version is the one with Thank You and rotating purple dot.
