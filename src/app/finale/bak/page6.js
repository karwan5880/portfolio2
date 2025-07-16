'use client'

import { Line, Stars } from '@react-three/drei'
import { InstancedMesh, Plane, useTexture } from '@react-three/drei'
import { shaderMaterial } from '@react-three/drei'
import { extend, useFrame } from '@react-three/fiber'
// import { Canvas, useFrame } from '@react-three/fiber'
import { Canvas } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import { MathUtils, Shape, Vector3 } from 'three'
import * as THREE from 'three'

import { CornerLink } from '@/components/CornerLink'
import { DogEar } from '@/components/DogEar'

import styles from './page.module.css'
import { devHistoryData } from '@/data/dev-history-data'
import { useGatekeeper } from '@/hooks/useGatekeeper'
import { useAudioStore } from '@/stores/audioStore'

const SnowfallMaterial = shaderMaterial(
  // Uniforms (global variables passed from React)
  { uTime: 0, uSize: 15.0, uTexture: null },
  // Vertex Shader (calculates position)
  /*glsl*/ `
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
  // Fragment Shader (calculates color)
  /*glsl*/ `
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

// --- 2. The React Component ---
function Snowflakes3({ count = 2000 }) {
  const materialRef = useRef()
  const texture = useTexture('/textures/snowflake.png')

  // Generate the random attribute buffers just once
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

  // The useFrame loop is now incredibly cheap!
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

function Snowflakes2({ count = 1500 }) {
  const texture = useTexture('/textures/snowflake.png')
  const instancedMeshRef = useRef()

  // 1. Set up the initial random properties for each snowflake
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const position = new THREE.Vector3(
        MathUtils.randFloatSpread(60), // x-axis spread
        MathUtils.randFloat(0, 60), // initial y-position (all start at different heights)
        MathUtils.randFloatSpread(60) // z-axis spread
      )

      const speed = MathUtils.randFloat(0.02, 0.08) // A very slow and slightly varied falling speed
      const rotationSpeed = MathUtils.randFloat(0.1, 0.5) // A slow rotation speed
      const swayFactor = MathUtils.randFloat(0.5, 1.5) // How much it drifts side-to-side

      temp.push({ position, speed, rotationSpeed, swayFactor })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  // 2. Animate each snowflake in the useFrame loop with the CORRECT falling logic
  useFrame((state, delta) => {
    if (!instancedMeshRef.current) return

    particles.forEach((particle, i) => {
      // Get the current position
      const { position, speed, rotationSpeed, swayFactor } = particle

      // This is the core fix: A continuous downward motion
      position.y -= speed

      // Add a gentle, slow side-to-side sway
      position.x += Math.sin(state.clock.elapsedTime * 0.1 * swayFactor + i) * 0.005

      // If the snowflake falls below the view, reset it to the top
      if (position.y < -30) {
        position.y = 30 // Reset to the top
        // Give it a new random x/z position so it doesn't fall in the same line
        position.x = MathUtils.randFloatSpread(60)
        position.z = MathUtils.randFloatSpread(60)
      }

      // Apply the new position to our dummy object
      dummy.position.copy(position)

      // Apply a slow, continuous rotation
      dummy.rotation.x += rotationSpeed * delta * 0.2
      dummy.rotation.y += rotationSpeed * delta * 0.2
      dummy.rotation.z += rotationSpeed * delta * 0.2

      // Update the matrix for this specific instance
      dummy.updateMatrix()
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
    })

    // Tell the renderer that the instanced mesh needs to be updated
    instancedMeshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={instancedMeshRef} args={[null, null, count]}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.8}
        depthWrite={false} // Crucial for correct transparency rendering
        // Use NormalBlending for a softer, more romantic feel instead of a hard glow
        blending={THREE.NormalBlending}
        toneMapped={false}
      />
    </instancedMesh>
  )
}

function Snowflakes({ count = 1000 }) {
  const texture = useTexture('/textures/snowflake.png')
  const instancedMeshRef = useRef()

  // 1. Set up the initial random properties for each snowflake
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100 // time offset
      const factor = 20 + Math.random() * 100 // x-z spread factor
      const speed = 0.01 + Math.random() / 200 // fall speed
      const xFactor = -20 + Math.random() * 40 // x-sway factor
      const yFactor = -20 + Math.random() * 40 // y-sway factor (not used for vertical fall)
      const zFactor = -20 + Math.random() * 40 // z-sway factor

      temp.push({ t, factor, speed, xFactor, yFactor, zFactor })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  // 2. Animate each snowflake in the useFrame loop
  useFrame((state, delta) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, zFactor } = particle
      // Animate time
      t = particle.t += speed / 2

      // Animate position with a gentle sway
      const a = Math.cos(t) + Math.sin(t * 1) / 10
      const b = Math.sin(t) + Math.cos(t * 2) / 10
      const s = Math.max(1.5, Math.cos(t) * 5)

      // Set the new position
      dummy.position.set(
        xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        -10 + (b + Math.sin(t * 1)) * 5, // Fall from top to bottom
        zFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10
      )

      // Reset when it falls too low
      if (dummy.position.y < -30) {
        dummy.position.y = 30
        particle.t = Math.random() * 100 // Reset time to randomize its path
      }

      // Animate scale and rotation
      dummy.scale.setScalar(s / 10)
      dummy.rotation.set(s * 5, s * 5, s * 5)
      dummy.updateMatrix()

      // Apply the transformation to the instanced mesh
      instancedMeshRef.current.setMatrixAt(i, dummy.matrix)
    })
    instancedMeshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={instancedMeshRef} args={[null, null, count]}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending} // This gives a nice glow effect
        depthWrite={false} // Important for transparency rendering
        toneMapped={false}
      />
    </instancedMesh>
  )
}

function IceCrystals2({ count = 40 }) {
  const groupRef = useRef()

  // 1. Define the 2D shape of a hexagonal crystal
  const crystalShape = useMemo(() => {
    const shape = new THREE.Shape()
    const size = 0.5 // The radius of the hexagon
    // Create a hexagon by defining its 6 points
    shape.moveTo(size * Math.cos(0), size * Math.sin(0))
    for (let i = 1; i <= 6; i++) {
      shape.lineTo(size * Math.cos((i * 2 * Math.PI) / 6), size * Math.sin((i * 2 * Math.PI) / 6))
    }
    return shape
  }, [])

  // 2. Define the settings for extruding the 2D shape into 3D
  const extrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth: 0.1, // How thick the crystal is
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 1,
    }),
    []
  )

  // 3. Create data for each crystal's position and rotation
  const crystals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: [MathUtils.randFloatSpread(25), MathUtils.randFloatSpread(25), MathUtils.randFloatSpread(25)],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        scale: MathUtils.randFloat(0.3, 0.8),
        rotationSpeedX: MathUtils.randFloat(0.1, 0.4),
        rotationSpeedY: MathUtils.randFloat(0.1, 0.4),
      })),
    [count]
  )

  // 4. Animate each crystal individually for a more natural "twinkle" effect
  useFrame((state, delta) => {
    groupRef.current.children.forEach((crystal, i) => {
      const data = crystals[i]
      crystal.rotation.x += delta * data.rotationSpeedX
      crystal.rotation.y += delta * data.rotationSpeedY
    })
  })

  return (
    <group ref={groupRef}>
      {crystals.map((data, i) => (
        <mesh key={i} position={data.position} rotation={data.rotation} scale={data.scale}>
          {/* Use Extrude to create a 3D mesh from our 2D shape */}
          <extrudeGeometry args={[crystalShape, extrudeSettings]} />
          <meshPhysicalMaterial
            color="#a0e0ff"
            transmission={0.98} // Increase transmission for a more glassy look
            roughness={0.05} // Very smooth surface
            thickness={1} // Controls how light passes through
            ior={1.5} // Index of refraction for ice/glass
            envMapIntensity={2}
            side={THREE.DoubleSide} // Render both sides of the crystal
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

function Snowfall({ count = 2000 }) {
  const pointsRef = useRef()

  // Generate random positions for the snowflakes inside a box
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

  // Animate the snowflakes in the useFrame loop
  useFrame((state, delta) => {
    const posArray = pointsRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      // Move snowflake down
      posArray[i3 + 1] -= delta * 5 // Adjust speed here
      // If it falls below the screen, reset it to the top
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

// --- Component 2: Floating Ice Crystals ---
function IceCrystals({ count = 40 }) {
  const groupRef = useRef()

  // Create data for each crystal (position, rotation speed, etc.)
  const crystals = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        position: [MathUtils.randFloatSpread(20), MathUtils.randFloatSpread(20), MathUtils.randFloatSpread(20)],
        rotation: [Math.random(), Math.random(), Math.random()],
        scale: MathUtils.randFloat(0.2, 0.5),
        rotationSpeed: MathUtils.randFloat(0.1, 0.3),
      })),
    [count]
  )

  // Rotate the whole group for a gentle floating effect
  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.02
  })

  return (
    <group ref={groupRef}>
      {crystals.map((data, i) => (
        <mesh key={i} position={data.position} rotation={data.rotation} scale={data.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#a0e0ff"
            transmission={0.95} // Makes it look like glass/ice
            roughness={0.1}
            thickness={0.5}
            envMapIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Component 1: A single animated, glowing node ---

function ConstellationNode({ startPos, targetPos, onAnimationComplete }) {
  const nodeRef = useRef()
  // This state tracks if the node has reached its destination
  const [isPlaced, setIsPlaced] = useState(false)

  useFrame((_, delta) => {
    if (!nodeRef.current || isPlaced) return

    // Animate the node from its starting position to its target
    nodeRef.current.position.lerp(targetPos, delta * 0.8)

    // If it's close enough, snap it to the final position and stop animating
    if (nodeRef.current.position.distanceTo(targetPos) < 0.05) {
      nodeRef.current.position.copy(targetPos)
      setIsPlaced(true)
      onAnimationComplete() // Notify the parent component
    }
  })

  return (
    <mesh ref={nodeRef} position={startPos}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="#8a2be2" emissive="#8a2be2" emissiveIntensity={3} toneMapped={false} />
    </mesh>
  )
}

// --- Component 2: A simple connecting line ---

function SynapseLine({ start, end }) {
  const points = useMemo(() => [start, end], [start, end])
  return <Line points={points} color="white" lineWidth={1} transparent opacity={0.25} />
}

// --- Component 3: The main orchestrator ---

function Constellation() {
  const groupRef = useRef()
  const [linesVisible, setLinesVisible] = useState(false)
  const placementCounter = useRef(0)

  // Generate the 3D positions for our nodes using useMemo for performance
  const nodes = useMemo(() => {
    const constellationRadius = 5
    const startRadius = 25 // Start far away

    return devHistoryData.map((item, index) => {
      // Distribute points somewhat evenly on a sphere using math
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

  // This function is called by each node when it finishes animating
  const handleNodePlaced = () => {
    placementCounter.current++
    if (placementCounter.current >= nodes.length) {
      // Once all nodes are in place, make the connecting lines visible
      setTimeout(() => setLinesVisible(true), 500) // Small delay for dramatic effect
    }
  }

  // Gently rotate the entire constellation for a dynamic feel
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  // Find a node's position by its ID, needed for drawing lines
  const getNodePosition = (id) => nodes.find((n) => n.id === id)?.targetPos

  return (
    <group ref={groupRef}>
      {/* Render all the animated nodes */}
      {nodes.map((node) => (
        <ConstellationNode key={node.id} startPos={node.startPos} targetPos={node.targetPos} onAnimationComplete={handleNodePlaced} />
      ))}

      {/* Render the connecting lines, but only when they are visible */}
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

// --- The Main Page Component ---

export default function FinalePage() {
  useGatekeeper('/finale')
  const hasPermission = useAudioStore((state) => state.hasPermission)
  const isInitialized = useAudioStore((state) => state.isInitialized)
  const isPlaying = useAudioStore((state) => state.isPlaying)
  const startExperience = useAudioStore((state) => state.startExperience)
  const [showFinale, setShowFinale] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showLinks, setShowLinks] = useState(false)

  // const { hasPermission, isInitialized, isPlaying, startExperience } = useAudioStore((state) => ({
  //   hasPermission: state.hasPermission,
  //   isInitialized: state.isInitialized,
  //   isPlaying: state.isPlaying,
  //   startExperience: state.startExperience,
  // }))

  useEffect(() => {
    if (hasPermission) {
      const finaleTimer = setTimeout(() => setShowFinale(true), 1000)
      const textTimer = setTimeout(() => setShowText(true), 7000) // Increased delay
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
              {/* A point light to make the crystals shine */}
              <pointLight position={[10, 10, 10]} intensity={1.5} color="#a0e0ff" />
              <Snowfall />
              {/* <IceCrystals /> */}
              {/* <IceCrystals2 /> */}
              {/* <Snowflakes /> */}
              {/* <Snowflakes2 /> */}
              <Snowflakes3 />
            </>
          )}
        </Canvas>
      </div>

      <div className={styles.overlayContent}>
        <div className={`${styles.textContainer} ${showText ? styles.isVisible : ''}`}>Thank You</div>
        {/* <div className={`${styles.textContainer} ${showText ? styles.isVisible : ''}`}>THANK YOU</div> */}
        {/* <div className={`${styles.textContainer} ${showText ? styles.isVisible : ''}`}>T H A N K Y O U</div> */}
        {/* <div className={styles.overlayContent}>
        <div className={`${styles.textOverlay} ${showText ? styles.isVisible : ''}`}>
          <p>Thank you for reading.</p>
        </div>
        <div className={`${styles.linksContainer} ${showLinks ? styles.isVisible : ''}`}>
          <a href="https://github.com/karwan5880/portfolio2" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/karwanleong" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
            LinkedIn
          </a>
        </div>
        </div> */}
      </div>

      {/* <DogEar href="/dev-history" position="bottom-left" aria-label="Return to the timeline" /> */}
      {/* <CornerLink href="/dev-history" position="bottom-left" label="Timeline" aria-label="Return to the timeline" /> */}
      <CornerLink href="/location" position="bottom-left" label="Location" aria-label="Return to location" />
      <CornerLink href="/" position="bottom-right" label="Home" aria-label="Go to Home Page" />
    </div>
  )
}
