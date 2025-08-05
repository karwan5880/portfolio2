'use client'

import {
  CubicBezierLine,
  Html,
  Line,
  PointMaterial,
  Points,
  ScrollControls,
  Stars,
  Text,
  useScroll,
  useTexture,
} from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as random from 'maath/random/dist/maath-random.esm'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { MathUtils, Vector3 } from 'three'

import { DogEar } from '@/components/DogEar'

import styles from './dev-history.module.css'
import { devHistoryData } from '@/data/dev-history-data'
import { useStore } from '@/stores/useStore'

function DescriptionOverlay() {
  const selectedNodeId = useStore((state) => state.selectedNode)
  const nodeData = devHistoryData.find((n) => n.id === selectedNodeId)

  // We add the GlitchedText component here now!
  return (
    <div className={`${styles.overlayContainer} ${selectedNodeId ? styles.isVisible : ''}`}>
      {nodeData && (
        <>
          <h2>
            {nodeData.title} ({nodeData.year})
          </h2>
          <GlitchedText text={nodeData.description} isActive={!!selectedNodeId} />
          <button className={styles.closeButton}>Scroll to Resume Journey</button>
        </>
      )}
    </div>
  )
}

function Synapse({ start, end, targetId }) {
  const activeNodeId = useStore((state) => state.selectedNode)
  // The synapse is "active" if it leads to the currently selected node
  const isActive = activeNodeId === targetId

  // --- Calculate Control Points for the Curve ---
  const midPoint = new Vector3().addVectors(start, end).multiplyScalar(0.5)
  // Add an offset to pull the curve outwards. The offset direction is based on the line's angle.
  const controlOffset = new Vector3(end.y - start.y, start.x - end.x, 0).normalize().multiplyScalar(5)

  const controlPoint1 = new Vector3().addVectors(midPoint, controlOffset)
  const controlPoint2 = new Vector3().addVectors(midPoint, controlOffset)

  return (
    <CubicBezierLine
      start={start}
      end={end}
      midA={controlPoint1} // First control point
      midB={controlPoint2} // Second control point
      // --- THE AESTHETIC UPGRADE ---
      lineWidth={isActive ? 2.5 : 0.75} // Thicker when active
      color="#fff" // Base color is now white for opacity control
      dashed={true}
      dashScale={isActive ? 10 : 20} // Dashes get tighter when active
      gapSize={isActive ? 5 : 15}
      // --- THE TECHNICAL FIX ---
      frustumCulled={false} // This tells the engine to ALWAYS render the line
      // --- THE ANIMATION ---
      // We animate the opacity to make it feel ghostly or solid
      transparent // Use the direct 'transparent' prop
      opacity={isActive ? 1.0 : 0.15} // Use the direct 'opacity' prop
      // material-transparent={true}
      // material-opacity={isActive ? 1.0 : 0.15}
      // color={isActive ? '#00ff00' : '#8a2be2'}
      // lineWidth={isActive ? 3 : 1}
      // dashed={!isActive}
      // dashScale={20}
      // gapSize={15}
    />
    // <Line
    //   points={[start, end]}
    //   color={isActive ? '#00ff00' : '#8a2be2'} // Bright green when active, purple otherwise
    //   lineWidth={isActive ? 2.5 : 1}
    //   dashed={!isActive} // Solid when active, dashed otherwise
    //   dashScale={15}
    //   gapSize={10}
    // />
  )
}

// --- NEW: Glitched Text for the HTML Overlay ---
function GlitchedText({ text, isActive }) {
  const [displayText, setDisplayText] = useState('')
  const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'

  useEffect(() => {
    let interval
    if (isActive) {
      let iteration = 0
      interval = setInterval(() => {
        const newText = text
          .split('')
          .map((char, index) => {
            if (index < iteration) return text[index]
            if (char === ' ') return ' '
            return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
          })
          .join('')
        setDisplayText(newText)
        if (iteration >= text.length) clearInterval(interval)
        iteration += text.length / 45
      }, 30)
    } else {
      setDisplayText('')
    }
    return () => clearInterval(interval)
  }, [isActive, text])

  return <p>{displayText}</p>
}

function Petal({ rotation, isActive }) {
  const ref = useRef()

  // This animation controls the "unfolding"
  useFrame((state, delta) => {
    if (ref.current) {
      // If active, move the petal outwards; otherwise, move it back to the center.
      const targetPosition = isActive ? 1.2 : 0
      ref.current.position.z = MathUtils.lerp(ref.current.position.z, targetPosition, delta * 4)
    }
  })

  return (
    // We use groups to control rotation and position independently
    <group rotation={rotation}>
      <group ref={ref}>
        {/* This is the mesh for a single petal segment */}
        <mesh>
          <sphereGeometry args={[1, 32, 32, 0, Math.PI / 2, 0, Math.PI / 2]} />
          <meshPhysicalMaterial roughness={0} transmission={1} thickness={1.5} />
        </mesh>
      </group>
    </group>
  )
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform float u_time;
  uniform vec3 u_color;
  uniform bool u_isActive;
  varying vec2 vUv;

  // --- CORRECTED AND ROBUST NOISE FUNCTION (GLSL) ---
  // Source: https://github.com/hughsk/glsl-noise/blob/master/simplex/2d.glsl
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m;
    m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }
  // --- END OF CORRECTED NOISE FUNCTION ---

  void main() {
    // The core logic remains the same
    float noise = snoise(vUv * (u_isActive ? 8.0 : 4.0) + u_time * (u_isActive ? 1.0 : 0.3));
    float rim = 1.0 - vUv.y;
    rim = pow(rim, u_isActive ? 1.5 : 0.5);
    vec3 color = u_color * (0.2 + abs(noise) * 0.8) + rim * (u_isActive ? 0.5 : 0.1);
    gl_FragColor = vec4(color, 1.0);
  }
`

function SingularityNode({ id, title, year, description, position }) {
  const materialRef = useRef()
  const activeNodeId = useStore((state) => state.selectedNode)
  const isActive = activeNodeId === id

  // This is the data we pass into our shader
  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_isActive: { value: false },
      u_color: { value: new THREE.Color(isActive ? '#00ff00' : '#8a2be2') },
    }),
    [isActive]
  )

  useFrame((state) => {
    // Animate the shader uniforms on every frame
    if (materialRef.current) {
      materialRef.current.uniforms.u_time.value = state.clock.getElapsedTime()
      materialRef.current.uniforms.u_isActive.value = isActive
      // Smoothly transition the color when state changes
      materialRef.current.uniforms.u_color.value.lerp(new THREE.Color(isActive ? '#00ff00' : '#8a2be2'), 0.05)
    }
  })

  return (
    <group position={position}>
      <Text
        position={[0, 1.5, 0]} // Positioned above the node
        fontSize={0.5}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        // The text fades in and out with the active state
        material-opacity={isActive ? 1.0 : 0.4}
        material-transparent={true}
      >
        {title}
      </Text>
      <Text
        position={[0, -1.5, 0]} // Positioned below the node
        fontSize={0.3}
        color="#999"
        anchorX="center"
        anchorY="middle"
        material-opacity={isActive ? 0.8 : 0.2}
        material-transparent={true}
      >
        {year}
      </Text>

      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial
          ref={materialRef}
          key={Date.now()} // A trick to force re-compilation on state change
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </group>
  )
}

// --- The NEW Data Core Node Component (replaces old Node) ---
function DataCoreNode({ id, title, year, description, position }) {
  const innerRef1 = useRef()
  const innerRef2 = useRef()
  const auraRef = useRef() // <-- NEW: A ref for our new aura mesh

  const activeNodeId = useStore((state) => state.selectedNode)
  const isActive = activeNodeId === id

  useFrame((state, delta) => {
    if (innerRef1.current) innerRef1.current.rotation.y += delta * 0.5
    if (innerRef2.current) innerRef2.current.rotation.y -= delta * 0.3

    if (auraRef.current) {
      // Define the target scale and opacity based on the active state
      const targetScale = isActive ? 3 : 0 // Expands to 3x size, or shrinks to nothing
      const targetOpacity = isActive ? 0.25 : 0 // Becomes slightly visible, or fully transparent

      // Use lerp for a smooth, animated transition
      auraRef.current.scale.lerp(new Vector3(targetScale, targetScale, targetScale), delta * 3)
      auraRef.current.material.opacity = MathUtils.lerp(auraRef.current.material.opacity, targetOpacity, delta * 3)
    }
  })

  const petalRotations = [
    [0, 0, 0],
    [0, Math.PI, 0],
    [Math.PI / 2, 0, 0],
    [-Math.PI / 2, 0, 0],
    [0, Math.PI / 2, Math.PI / 2],
    [0, -Math.PI / 2, Math.PI / 2],
    [0, Math.PI / 2, -Math.PI / 2],
    [0, -Math.PI / 2, -Math.PI / 2],
  ]

  return (
    <group position={position}>
      <Text
        position={[0, 1.5, 0]} // Positioned above the node
        fontSize={0.5}
        color="#fff"
        anchorX="center"
        anchorY="middle"
        // The text fades in and out with the active state
        material-opacity={isActive ? 1.0 : 0.4}
        material-transparent={true}
      >
        {title}
      </Text>
      <Text
        position={[0, -1.5, 0]} // Positioned below the node
        fontSize={0.3}
        color="#999"
        anchorX="center"
        anchorY="middle"
        material-opacity={isActive ? 0.8 : 0.2}
        material-transparent={true}
      >
        {year}
      </Text>
      {/* {petalRotations.map((rot, i) => (
        <Petal key={i} rotation={rot} isActive={isActive} />
      ))} */}
      {/* <group scale={isActive ? 1 : 0} style={{ transition: 'all 0.5s' }}> */}
      <group scale={1}>
        <mesh ref={innerRef1}>
          <sphereGeometry args={[0.8, 16, 16]} />
          <meshBasicMaterial color="#8a2be2" wireframe />
        </mesh>
        <mesh ref={innerRef2}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshBasicMaterial color="#00ff00" wireframe />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#fff" emissive="#00ff00" emissiveIntensity={2.5} toneMapped={false} />
        </mesh>
      </group>
      {/* <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial roughness={0} transmission={1} thickness={1.5} />
      </mesh>
      <mesh ref={innerRef1}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial color="#8a2be2" wireframe />
      </mesh>
      <mesh ref={innerRef2}>
        <sphereGeometry args={[0.6, 16, 16]} />
        <meshBasicMaterial color="#00ff00" wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#00ff00"
          emissiveIntensity={isActive ? 2.5 : 0.5}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={auraRef} scale={0}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color="#8a2be2" // The purple from our theme
          transparent={true}
          opacity={0}
        />
      </mesh> */}
      {/* <Html position={[1.5, 0, 0]} center>
        <div className={`${styles.htmlContainer} ${isActive ? styles.htmlVisible : ''}`}>
          <h2>{title}</h2>
          <GlitchedText text={description} isActive={isActive} />
        </div>
      </Html> */}
    </group>
  )
}

function ArtifactNode({ id, title, year, description, position, type = 'cube' }) {
  const groupRef = useRef()
  const textGroupRef = useRef()
  const activeNodeId = useStore((state) => state.selectedNode)
  const isActive = activeNodeId === id

  // We'll use this to animate the whole node group
  useFrame(() => {
    if (groupRef.current) {
      // Add a slow, constant tumble to the whole group for visual interest
      groupRef.current.rotation.x += 0.001
      groupRef.current.rotation.y += 0.001
      if (textGroupRef.current) {
        textGroupRef.current.quaternion.copy(groupRef.current.quaternion).invert()
      }
    }
  })

  return (
    <group position={position} ref={groupRef}>
      <group ref={textGroupRef}>
        <Text
          position={[0, 0.3, 0]} // Positioned above the node
          fontSize={0.5}
          color="#fff"
          anchorX="center"
          anchorY="middle"
          // The text fades in and out with the active state
          material-opacity={isActive ? 1.0 : 0.7}
          material-transparent={true}
        >
          {title}
        </Text>
        <Text
          position={[0, -0.3, 0]} // Positioned below the node
          fontSize={0.3}
          color="#999"
          anchorX="center"
          anchorY="middle"
          material-opacity={isActive ? 0.8 : 0.6}
          material-transparent={true}
        >
          {year}
        </Text>
      </group>

      {/* --- RENDER THE CORRECT ARTIFACT TYPE --- */}
      {/* {type === 'cube' && <GenesisCube isActive={isActive} />}
      {type === 'crystal' && <DataCrystal isActive={isActive} />}
      {type === 'ring' && <ContainmentRing isActive={isActive} />}
      {type === 'gyroscope' && <GyroscopeCore isActive={isActive} />}
      {type === 'circuit' && <FloatingCircuit isActive={isActive} />}
      {type === 'cluster' && <SkillCluster isActive={isActive} />}
      {type === 'assembler' && <LivingAssembler isActive={isActive} />} */}
    </group>
  )
}

function LivingAssembler({ isActive }) {
  const groupRef = useRef()
  const cubesRef = useRef([])

  // Create a set number of cubes for our swarm
  const numCubes = 50

  // Initialize random data for each cube (we use useMemo to do this only once)
  const cubeData = useMemo(
    () =>
      [...Array(numCubes)].map(() => ({
        // Random starting position on the surface of a sphere
        position: new Vector3().setFromSphericalCoords(2, Math.random() * Math.PI, Math.random() * 2 * Math.PI),
        // Random rotation speed and direction
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      })),
    []
  )

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime()

    cubesRef.current.forEach((cube, i) => {
      if (cube) {
        const data = cubeData[i]
        let targetPosition = data.position // Default to its random orbit position

        // Animate the cube's individual rotation
        cube.rotation.y += data.rotationSpeed
        cube.rotation.x += data.rotationSpeed

        if (isActive) {
          // --- ACTIVE STATE: Assemble into a perfect cube ---
          // Calculate the position this cube should be in to form a larger cube
          const sideLength = Math.cbrt(numCubes) // ~3.6, so we'll use 4x4x4 structure
          const x = (i % 4) - 1.5
          const y = (Math.floor(i / 4) % 4) - 1.5
          const z = Math.floor(i / 16) - 1.5
          targetPosition = new Vector3(x, y, z).multiplyScalar(0.5) // Scale down the cube
        }

        // Smoothly move the cube towards its target position
        cube.position.lerp(targetPosition, delta * 2.0)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Render all the cubes in the swarm */}
      {[...Array(numCubes)].map((_, i) => (
        <mesh key={i} ref={(el) => (cubesRef.current[i] = el)}>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial
            color="#00ff00"
            emissive="#00ff00"
            emissiveIntensity={isActive ? 1.0 : 0.2}
            transparent
            opacity={isActive ? 1.0 : 0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function SkillCluster({ isActive }) {
  const groupRef = useRef()
  const shardsRef = useRef([])
  const tethersRef = useRef([])

  // The base data for our orbiting shards
  const shards = [
    { type: 'box', size: 0.3, distance: 1.5, color: '#ff4d4d' }, // Red - Drivers/Low-level
    { type: 'tetrahedron', size: 0.35, distance: 1.8, color: '#4d94ff' }, // Blue - Flutter
    { type: 'octahedron', size: 0.3, distance: 2.1, color: '#4dff4d' }, // Green - Godot
    { type: 'dodecahedron', size: 0.3, distance: 2.4, color: '#ffff4d' }, // Yellow - RL
  ]

  useFrame((state, delta) => {
    if (groupRef.current) {
      // The entire cluster has a slow, constant rotation
      groupRef.current.rotation.y += delta * 0.1
    }

    // Animate each shard
    shardsRef.current.forEach((shard, i) => {
      if (shard) {
        // Each shard orbits at a different speed
        shard.rotation.y += delta * (0.2 + i * 0.05)

        // When active, pull the shards into a stable, equatorial orbit
        const targetY = isActive ? 0 : Math.sin(state.clock.getElapsedTime() * (0.5 + i * 0.1)) * 0.5
        shard.position.y = MathUtils.lerp(shard.position.y, targetY, delta * 2)
      }
    })

    // Animate the tethers
    tethersRef.current.forEach((tether, i) => {
      if (tether) {
        // The tether is only visible when the node is active
        const targetScale = isActive ? 1 : 0
        tether.scale.set(targetScale, targetScale, targetScale)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {/* Render the orbiting shards */}
      {shards.map((shard, i) => (
        <mesh key={i} ref={(el) => (shardsRef.current[i] = el)} position={[shard.distance, 0, 0]}>
          {shard.type === 'box' && <boxGeometry args={[shard.size, shard.size, shard.size]} />}
          {shard.type === 'tetrahedron' && <tetrahedronGeometry args={[shard.size, 0]} />}
          {shard.type === 'octahedron' && <octahedronGeometry args={[shard.size, 0]} />}
          {shard.type === 'dodecahedron' && <dodecahedronGeometry args={[shard.size, 0]} />}
          <meshStandardMaterial color={shard.color} emissive={shard.color} emissiveIntensity={0.5} roughness={0.2} />
        </mesh>
      ))}

      {/* Render the energy tethers (visible only when active) */}
      {shards.map((shard, i) => (
        <mesh key={i} ref={(el) => (tethersRef.current[i] = el)} scale={0}>
          <cylinderGeometry args={[0.01, 0.01, shard.distance, 6]} />
          <meshBasicMaterial color="#fff" transparent opacity={0.5} />
        </mesh>
      ))}

      {/* The Central Core */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={isActive ? 2 : 0} toneMapped={false} />
      </mesh>
    </group>
  )
}

function FloatingCircuit({ isActive }) {
  // We load a texture for the circuit traces. You'll need to create this image.
  // For now, it will fail gracefully, but we'll add the image in the next step.
  const traceTexture = useTexture('/textures/circuit_traces.png')

  // We want the texture to repeat across the surface
  traceTexture.wrapS = traceTexture.wrapT = THREE.RepeatWrapping

  const materialRef = useRef()

  useFrame((state, delta) => {
    if (materialRef.current) {
      // Animate the texture's offset to make it look like it's flowing
      // It flows faster when the node is active.
      materialRef.current.map.offset.y += delta * (isActive ? 0.2 : 0.05)

      // Make the material glow when active
      const targetIntensity = isActive ? 1.5 : 0
      materialRef.current.emissiveIntensity = MathUtils.lerp(
        materialRef.current.emissiveIntensity,
        targetIntensity,
        delta * 3
      )
    }
  })

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* A thin, square plane for the circuit board */}
      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          color="#001a00" // A very dark green, like a PCB
          roughness={0.1}
          metalness={0.2}
        />
      </mesh>
      {/* A second mesh on top to display the glowing traces */}
      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          ref={materialRef}
          map={traceTexture} // Apply our texture here
          transparent={true}
          blending={THREE.AdditiveBlending}
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function GyroscopeCore({ isActive }) {
  const ring1Ref = useRef()
  const ring2Ref = useRef()
  const ring3Ref = useRef()
  const coreRef = useRef()

  useFrame((state, delta) => {
    if (ring1Ref.current && ring2Ref.current && ring3Ref.current) {
      if (isActive) {
        // --- ACTIVE STATE: Aligned, high-speed rotation ---
        // Rings align to spin on a single axis, but at different speeds
        ring1Ref.current.rotation.y = MathUtils.lerp(ring1Ref.current.rotation.y, 0, delta * 2)
        ring2Ref.current.rotation.x = MathUtils.lerp(ring2Ref.current.rotation.x, 0, delta * 2)
        ring3Ref.current.rotation.x = MathUtils.lerp(ring3Ref.current.rotation.x, 0, delta * 2)

        ring1Ref.current.rotation.z += delta * 2.0
        ring2Ref.current.rotation.z += delta * 2.5
        ring3Ref.current.rotation.z += delta * 3.0
      } else {
        // --- INACTIVE STATE: Slow, chaotic, tumbling motion ---
        ring1Ref.current.rotation.y += delta * 0.1
        ring2Ref.current.rotation.x += delta * 0.15
        ring3Ref.current.rotation.z += delta * 0.2
      }
    }

    // The core's glow is always tied to the active state
    if (coreRef.current) {
      const coreTargetScale = isActive ? 1 : 0.5
      coreRef.current.scale.lerp(new Vector3(coreTargetScale, coreTargetScale, coreTargetScale), delta * 3)
    }
  })

  // We use a Torus shape for the rings
  const Ring = ({ ...props }) => (
    <mesh {...props}>
      <torusGeometry args={[1, 0.05, 16, 100]} />
      <meshStandardMaterial color="#fff" roughness={0.1} metalness={0.9} />
    </mesh>
  )

  return (
    <group scale={0.8}>
      {' '}
      {/* Scale down the whole artifact slightly */}
      {/* The three nested, independently rotating rings */}
      <group ref={ring1Ref}>
        <Ring />
      </group>
      <group ref={ring2Ref} rotation-x={Math.PI / 2}>
        <Ring />
      </group>
      <group ref={ring3Ref} rotation-x={Math.PI / 2} rotation-y={Math.PI / 2}>
        <Ring />
      </group>
      {/* The Central Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#00ff00"
          emissive="#00ff00"
          emissiveIntensity={isActive ? 3 : 0}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function ContainmentRing({ isActive }) {
  const ringRef = useRef()
  const coreRef = useRef()

  useFrame((state, delta) => {
    if (ringRef.current && coreRef.current) {
      // --- Animation Logic ---
      // The ring continuously spins, but speeds up when active
      ringRef.current.rotation.z += delta * (isActive ? 2.5 : 0.5)

      // The ring's radius shrinks to 0 when active, and expands back out when inactive
      const targetRadius = isActive ? 0 : 1
      // We access the geometry's parameters directly to animate the radius
      const currentRadius = ringRef.current.geometry.parameters.radius
      ringRef.current.geometry = new THREE.TorusGeometry(
        MathUtils.lerp(currentRadius, targetRadius, delta * 5), // Animate radius
        0.1, // Tube thickness
        16,
        100
      )

      // The core's glow is tied to the ring's contraction
      const coreTargetScale = isActive ? 1 : 0
      coreRef.current.scale.lerp(new Vector3(coreTargetScale, coreTargetScale, coreTargetScale), delta * 5)
    }
  })

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {' '}
      {/* Rotate to lay it flat */}
      {/* The Torus (Ring) */}
      <mesh ref={ringRef}>
        <torusGeometry args={[1, 0.1, 16, 100]} />
        <meshStandardMaterial color="#8a2be2" emissive="#8a2be2" emissiveIntensity={1.5} toneMapped={false} />
      </mesh>
      {/* The Central Core (only visible when the ring contracts) */}
      <mesh ref={coreRef} scale={0}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#fff" emissive="#8a2be2" emissiveIntensity={3} toneMapped={false} />
      </mesh>
    </group>
  )
}

function GenesisCube({ isActive }) {
  const panelsRef = useRef([])

  // The "unfolding" animation for the cube panels
  useFrame((state, delta) => {
    panelsRef.current.forEach((panel, index) => {
      if (panel) {
        // Determine the target position based on the active state
        const targetPos = isActive ? (index < 2 ? 1 : index < 4 ? -1 : 0) : 0
        const axis = index < 2 ? 'x' : index < 4 ? 'x' : index < 6 ? 'y' : 'z'

        // Smoothly animate the panel's position
        panel.position[axis] = MathUtils.lerp(panel.position[axis], targetPos, delta * 3)
      }
    })
  })

  return (
    <group>
      {/* Create the 6 panels of the cube */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} ref={(el) => (panelsRef.current[i] = el)}>
          <boxGeometry args={[1, 1, 0.1]} />
          <meshPhysicalMaterial roughness={0} transmission={1} thickness={1.5} />
        </mesh>
      ))}
      {/* Rotate the last two panels to form the top and bottom */}
      <mesh rotation={[Math.PI / 2, 0, 0]} ref={(el) => (panelsRef.current[4] = el)}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshPhysicalMaterial roughness={0} transmission={1} thickness={1.5} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} ref={(el) => (panelsRef.current[5] = el)}>
        <boxGeometry args={[1, 1, 0.1]} />
        <meshPhysicalMaterial roughness={0} transmission={1} thickness={1.5} />
      </mesh>

      {/* The Glowing Heart */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial
          color="#fff"
          emissive="#fff" // A pure white heart for the genesis
          emissiveIntensity={isActive ? 2.5 : 0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function DataCrystal({ isActive }) {
  const crystalRef = useRef()
  const lightBeamsRef = useRef([])

  // Give the crystal a constant, slow rotation
  useFrame((state, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group>
      {/* The main crystal body */}
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[1, 0]} /> {/* 1=radius, 0=detail */}
        <meshPhysicalMaterial
          roughness={0}
          transmission={1} // Makes it glassy
          thickness={1.5}
          ior={2.3} // Index of Refraction for a diamond-like effect
        />
      </mesh>

      {/* --- The Awakening Animation: Light Beams --- */}
      {/* We create 6 beams, one for each vertex of the octahedron */}
      {[...Array(6)].map((_, i) => (
        <mesh key={i} ref={(el) => (lightBeamsRef.current[i] = el)}>
          {/* Each beam is a long, thin cylinder */}
          <cylinderGeometry args={[0.02, 0.02, 2, 8]} />
          <meshBasicMaterial
            color="#fff"
            transparent={true}
            // The beam is only visible when the node is active
            opacity={isActive ? 0.8 : 0}
            blending={THREE.AdditiveBlending} // Makes the light feel like it's adding to the scene
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Nebula Component (from before) ---
function Nebula(props) {
  const ref = useRef()
  const positions = useMemo(() => {
    const sphere = new Float32Array(15000)
    random.inSphere(sphere, { radius: 150 })
    return sphere
  }, [])

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10
    ref.current.rotation.y -= delta / 15
    ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.pointer.x * 5, 0.01)
  })

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#8a2be2" size={0.1} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  )
}

// --- Camera Controller (with Proximity Detection) ---
function CameraRig() {
  const [isWarping, setIsWarping] = useState(true)
  const { camera } = useThree()
  const scroll = useScroll()
  const setSelectedNode = useStore((state) => state.setSelectedNode)
  const cameraTarget = new Vector3()
  const lookAtTarget = new Vector3()

  const WARP_START_POS = new Vector3(10, 20, 150)
  const NORMAL_FOV = 75
  const WARP_FOV = 140

  useEffect(() => {
    camera.position.copy(WARP_START_POS)
    camera.fov = WARP_FOV
    camera.updateProjectionMatrix()
    const timer = setTimeout(() => setIsWarping(false), 2500)
    return () => clearTimeout(timer)
  }, [camera])

  useFrame((state, delta) => {
    if (isWarping) {
      const firstNodePos = new Vector3(...devHistoryData[0].position)
      const arrivalTarget = new Vector3(firstNodePos.x, firstNodePos.y + 1, firstNodePos.z + 5)
      state.camera.position.lerp(arrivalTarget, delta * 1.5)
      state.camera.fov = MathUtils.lerp(state.camera.fov, NORMAL_FOV, delta * 2.0)
      state.camera.updateProjectionMatrix()
      state.camera.lookAt(firstNodePos)
      return
    }

    const offset = MathUtils.clamp(scroll.offset, 0, 1)
    const sectionIndex = Math.floor(offset * (devHistoryData.length - 1))
    const nextSectionIndex = Math.min(sectionIndex + 1, devHistoryData.length - 1)
    const startNode = new Vector3(...devHistoryData[sectionIndex].position)
    const endNode = new Vector3(...devHistoryData[nextSectionIndex].position)
    const sectionProgress = (offset * (devHistoryData.length - 1)) % 1
    cameraTarget.lerpVectors(startNode, endNode, sectionProgress)
    cameraTarget.x += state.pointer.x * 0.5
    cameraTarget.y += state.pointer.y * 0.5
    cameraTarget.z += 5
    state.camera.position.lerp(cameraTarget, delta * 2)
    lookAtTarget.lerpVectors(startNode, endNode, sectionProgress)
    state.camera.lookAt(lookAtTarget)

    let closestNode = null
    let minDistance = Infinity
    const focusRadius = 12.0
    devHistoryData.forEach((node) => {
      const nodePosition = new Vector3(...node.position)
      const distance = state.camera.position.distanceTo(nodePosition)
      if (distance < minDistance) {
        minDistance = distance
        closestNode = node.id
      }
    })

    if (minDistance < focusRadius) {
      setSelectedNode(closestNode)
    } else {
      setSelectedNode(null)
    }
  })

  return null
}

// --- Main Page Component ---
export default function DevHistoryPage() {
  const selectedNode = useStore((state) => state.selectedNode)
  const ambientAudioRef = useRef()

  useEffect(() => {
    let audio = new Audio('/sound/ambient.mp3')
    audio.loop = true
    audio.volume = 0.3
    ambientAudioRef.current = audio
    let isMounted = true
    const playAudio = async () => {
      try {
        await audio.play()
      } catch (error) {
        if (isMounted) console.error('Audio playback failed:', error)
      }
    }
    playAudio()
    return () => {
      isMounted = false
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    if (selectedNode) {
      if (ambientAudioRef.current) ambientAudioRef.current.volume = 0.1
      const ping = new Audio('/sound/ping.mp3')
      ping.volume = 0.5
      ping.play()
    } else {
      if (ambientAudioRef.current) ambientAudioRef.current.volume = 0.3
    }
  }, [selectedNode])

  return (
    <div className={styles.wrapper}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Nebula />
        <ScrollControls pages={devHistoryData.length - 1} damping={0.3}>
          {/* Render the Nodes */}
          {devHistoryData.map((node) => (
            // <DataCoreNode key={node.id} {...node} />
            // <SingularityNode key={node.id} {...node} />
            <ArtifactNode key={node.id} {...node} />
          ))}
          {/* Render the Synapses */}
          {devHistoryData.map((node) =>
            node.connectsTo.map((targetId) => {
              const targetNodeData = devHistoryData.find((n) => n.id === targetId)
              if (!targetNodeData) return null
              // The start and end points must be Vector3 for the curve calculation
              const start = new Vector3(...node.position)
              const end = new Vector3(...targetNodeData.position)
              return (
                <Synapse
                  key={`${node.id}-${targetId}`}
                  start={start}
                  end={end}
                  targetId={node.id} // This is the node it's connecting TO
                />
              )
            })
          )}
          <CameraRig />
        </ScrollControls>
      </Canvas>
      <DescriptionOverlay />
      <DogEar href="/applications" position="bottom-left" aria-label="Return to applications" />
      <DogEar href="/finale" position="bottom-right" aria-label="View finale" />
    </div>
  )
}

// 'use client'

// import { Html, Line, PointMaterial, Points, ScrollControls, Stars, Text, useScroll } from '@react-three/drei'
// import { Canvas, useFrame, useThree } from '@react-three/fiber'
// import * as random from 'maath/random/dist/maath-random.esm'
// import { useEffect, useMemo, useRef, useState } from 'react'
// import { MathUtils, Vector3 } from 'three'
// import * as THREE from 'three'

// import { DogEar } from '@/components/DogEar'

// import styles from './dev-history.module.css'
// import { devHistoryData } from '@/data/dev-history-data'
// import { useStore } from '@/stores/useStore'

// function DescriptionOverlay() {
//   const selectedNodeId = useStore((state) => state.selectedNode)
//   const nodeData = devHistoryData.find((n) => n.id === selectedNodeId)

//   return (
//     <div className={`${styles.overlayContainer} ${selectedNodeId ? styles.isVisible : ''}`}>
//       {nodeData && (
//         <>
//           <h2>
//             {nodeData.title} ({nodeData.year})
//           </h2>
//           <p>{nodeData.description}</p>
//           <button className={styles.closeButton}>Scroll to Resume Journey</button>
//         </>
//       )}
//     </div>
//   )
// }

// function GlitchedText({ text, isActive }) {
//   const [displayText, setDisplayText] = useState('')
//   const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'

//   useEffect(() => {
//     let interval
//     if (isActive) {
//       let iteration = 0
//       interval = setInterval(() => {
//         const newText = text
//           .split('')
//           .map((char, index) => {
//             if (index < iteration) return text[index]
//             if (char === ' ') return ' '
//             return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
//           })
//           .join('')

//         setDisplayText(newText)

//         if (iteration >= text.length) {
//           clearInterval(interval)
//         }
//         iteration += text.length / 45 // Controls scramble speed
//       }, 30)
//     } else {
//       setDisplayText('') // Clear text when not active
//     }
//     return () => clearInterval(interval)
//   }, [isActive, text])

//   return <p>{displayText}</p>
// }

// // --- The NEW Data Core Node Component ---
// function DataCoreNode({ id, title, year, description, position }) {
//   const innerRef1 = useRef()
//   const innerRef2 = useRef()
//   const activeNodeId = useStore((state) => state.selectedNode)
//   const isActive = activeNodeId === id

//   useFrame((state, delta) => {
//     // Animate the inner wireframe spheres
//     if (innerRef1.current) innerRef1.current.rotation.y += delta * 0.5
//     if (innerRef2.current) innerRef2.current.rotation.y -= delta * 0.3
//   })

//   return (
//     <group position={position}>
//       {/* Outer Glassy Shell */}
//       <mesh>
//         <sphereGeometry args={[1, 32, 32]} />
//         <meshPhysicalMaterial roughness={0} transmission={1} thickness={1.5} />
//       </mesh>
//       {/* Inner Wireframe Layers */}
//       <mesh ref={innerRef1}>
//         <sphereGeometry args={[0.8, 16, 16]} />
//         <meshBasicMaterial color="#8a2be2" wireframe />
//       </mesh>
//       <mesh ref={innerRef2}>
//         <sphereGeometry args={[0.6, 16, 16]} />
//         <meshBasicMaterial color="#00ff00" wireframe />
//       </mesh>
//       {/* The Glowing Heart */}
//       <mesh>
//         <sphereGeometry args={[0.2, 16, 16]} />
//         <meshStandardMaterial
//           color="#fff"
//           emissive="#00ff00"
//           emissiveIntensity={isActive ? 2.5 : 0.5} // Glows intensely when active
//           toneMapped={false}
//         />
//       </mesh>

//       {/* The In-Scene HTML Description */}
//       <Html position={[1.5, 0, 0]} center>
//         <div className={`${styles.htmlContainer} ${isActive ? styles.htmlVisible : ''}`}>
//           <h2>{title}</h2>
//           <GlitchedText text={description} isActive={isActive} />
//         </div>
//       </Html>
//     </group>
//   )
// }

// // --- 3D Node Component ---
// function Node({ position, title, year, id }) {
//   const meshRef = useRef()
//   const setSelectedNode = useStore((state) => state.setSelectedNode)

//   // Add a breathing/pulsing animation
//   useFrame((state) => {
//     if (meshRef.current) {
//       const time = state.clock.getElapsedTime()
//       const scale = 1 + Math.sin(time) * 0.1 // Oscillate scale between 0.9 and 1.1
//       meshRef.current.scale.set(scale, scale, scale)
//     }
//   })

//   return (
//     <group position={position} onClick={() => setSelectedNode(id)}>
//       {/* <mesh>
//         <sphereGeometry args={[0.2, 16, 16]} />
//         <meshBasicMaterial color="#00ff00" transparent opacity={0.5} />
//       </mesh>
//       <Html position={[0.5, 0.5, 0]} transform>
//         <div className={styles.infoPanel}>
//           <h4>{year}</h4>
//           <h3>{title}</h3>
//           <p>{description}</p>
//         </div>
//       </Html> */}
//       <Text position={[0, 0.5, 0]} fontSize={0.5} color="#00ff00" anchorX="center" anchorY="middle">
//         {title}
//       </Text>
//       <Text position={[0, -0.5, 0]} fontSize={0.3} color="#999" anchorX="center" anchorY="middle">
//         {year}
//       </Text>
//       <mesh ref={meshRef}>
//         <sphereGeometry args={[0.2, 16, 16]} />
//         <meshStandardMaterial color="#00ff00" emissive="#00ff00" emissiveIntensity={0.5} />
//       </mesh>
//     </group>
//   )
// }

// // --- 3D Synapse Component ---
// function Synapse({ start, end }) {
//   const lineRef = useRef()

//   // Animate the line to look like flowing energy
//   useFrame((state, delta) => {
//     if (lineRef.current) {
//       // This makes the dashes appear to move along the line
//       lineRef.current.material.uniforms.dashOffset.value -= delta * 5
//     }
//   })

//   return (
//     <Line
//       ref={lineRef}
//       points={[start, end]}
//       color="#8a2be2"
//       lineWidth={1.5}
//       dashed={true}
//       dashScale={10}
//       gapSize={5}
//     />
//   )
// }

// function CameraRig() {
//   const [isWarping, setIsWarping] = useState(true)
//   const { camera } = useThree() // Get direct access to the camera
//   const scroll = useScroll()

//   const setSelectedNode = useStore((state) => state.setSelectedNode)
//   const selectedNode = useStore((state) => state.selectedNode)
//   const clearSelectedNode = useStore((state) => state.clearSelectedNode)

//   const cameraTarget = new Vector3()
//   const lookAtTarget = new Vector3()

//   // --- WARP DRIVE PARAMETERS ---
//   const WARP_START_POS = new Vector3(10, 20, 150) // Start MUCH further away
//   const NORMAL_FOV = 75
//   const WARP_FOV = 140 // A very high FOV creates the "streaking" effect
//   // --- END PARAMETERS ---

//   // Set the initial camera state immediately
//   useEffect(() => {
//     camera.position.copy(WARP_START_POS)
//     camera.fov = WARP_FOV
//     camera.updateProjectionMatrix() // IMPORTANT: Must be called after changing FOV

//     // End the warp after a short duration
//     const timer = setTimeout(() => {
//       setIsWarping(false)
//     }, 2500) // 2.5-second warp sequence
//     return () => clearTimeout(timer)
//   }, [camera])

//   // Add a listener to resume flight when the user scrolls while inspecting
//   useEffect(() => {
//     const unsubscribe = useStore.subscribe(
//       (state) => state.selectedNode,
//       (nodeId) => {
//         if (nodeId) {
//           // If a node is selected...
//           const handleScroll = () => {
//             clearSelectedNode() // ...clear selection on scroll
//             window.removeEventListener('wheel', handleScroll)
//           }
//           window.addEventListener('wheel', handleScroll)
//         }
//       }
//     )
//     return () => unsubscribe()
//   }, [clearSelectedNode])

//   useFrame((state, delta) => {
//     if (selectedNode) {
//       const nodeData = devHistoryData.find((n) => n.id === selectedNode)
//       if (nodeData) {
//         // const nodePosition = new Vector3(...nodeData.position)
//         // // Orbit around the selected node
//         // const radius = 5
//         // const angle = state.clock.getElapsedTime() * 0.3
//         // const x = nodePosition.x + Math.sin(angle) * radius
//         // const z = nodePosition.z + Math.cos(angle) * radius
//         // cameraTarget.set(x, nodePosition.y + 2, z)
//         // lookAtTarget.copy(nodePosition)
//       }
//     }
//     // --- STATE 1: WARPING IN ---
//     else if (isWarping) {
//       // --- WARP JUMP ANIMATION ---
//       const firstNodePos = new Vector3(...devHistoryData[0].position)
//       const arrivalTarget = new Vector3(firstNodePos.x, firstNodePos.y + 1, firstNodePos.z + 5)

//       // Animate position much faster
//       state.camera.position.lerp(arrivalTarget, delta * 1.5)
//       // Animate FOV back to normal
//       state.camera.fov = MathUtils.lerp(state.camera.fov, NORMAL_FOV, delta * 2.0)
//       state.camera.updateProjectionMatrix()

//       state.camera.lookAt(firstNodePos)
//       return // Stop here during the warp
//     }
//     // --- STATE 2: SCROLLING (FLYING) ---
//     else {
//       let closestNode = null
//       let minDistance = Infinity
//       const focusRadius = 12.0 // The distance at which a node becomes "active"
//       devHistoryData.forEach((node) => {
//         const nodePosition = new Vector3(...node.position)
//         const distance = state.camera.position.distanceTo(nodePosition)
//         if (distance < minDistance) {
//           minDistance = distance
//           closestNode = node.id
//         }
//       })
//       // If the closest node is within our focus radius, set it as active
//       if (minDistance < focusRadius) {
//         setSelectedNode(closestNode)
//       } else {
//         setSelectedNode(null) // No node is in focus
//       }
//       // --- NORMAL SCROLL-BASED ANIMATION ---
//       const offset = MathUtils.clamp(scroll.offset, 0, 1)
//       // ... The rest of your stable scroll code remains exactly the same ...
//       const sectionIndex = Math.floor(offset * (devHistoryData.length - 1))
//       const nextSectionIndex = Math.min(sectionIndex + 1, devHistoryData.length - 1)
//       const startNode = new Vector3(...devHistoryData[sectionIndex].position)
//       const endNode = new Vector3(...devHistoryData[nextSectionIndex].position)
//       const sectionProgress = (offset * (devHistoryData.length - 1)) % 1
//       cameraTarget.lerpVectors(startNode, endNode, sectionProgress)
//       cameraTarget.x += state.pointer.x * 0.5
//       cameraTarget.y += state.pointer.y * 0.5
//       cameraTarget.z += 5
//       lookAtTarget.lerpVectors(startNode, endNode, sectionProgress)
//     }
//     state.camera.position.lerp(cameraTarget, delta * 2)
//     state.camera.lookAt(lookAtTarget)
//   })

//   return null // The camera is controlled directly, so we don't need to return a primitive
// }

// function Nebula(props) {
//   const ref = useRef()
//   // Generate 5000 random 3D points within a sphere
//   // const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 150 }))

//   const positions = useMemo(() => {
//     const sphere = new Float32Array(15000) // 3 coordinates (x,y,z) * 5000 points
//     random.inSphere(sphere, { radius: 150 })
//     return sphere
//   }, [])

//   // Animate the nebula to slowly rotate and react to the mouse
//   useFrame((state, delta) => {
//     ref.current.rotation.x -= delta / 10
//     ref.current.rotation.y -= delta / 15
//     // Gently move towards the mouse position
//     // ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.mouse.x * 10, 0.01)
//     ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, state.pointer.x * 5, 0.01)
//   })

//   return (
//     <group rotation={[0, 0, Math.PI / 4]}>
//       <Points ref={ref} positions={positions} stride={3} frustumCulled={false} {...props}>
//         <PointMaterial
//           transparent
//           color="#8a2be2" // The purple from our theme
//           size={0.1}
//           sizeAttenuation={true}
//           depthWrite={false}
//         />
//       </Points>
//     </group>
//   )
// }

// // --- Main Page Component ---
// export default function DevHistoryPage() {
//   const selectedNode = useStore((state) => state.selectedNode)
//   const ambientAudioRef = useRef()

//   // Manage Ambient Sound
//   useEffect(() => {
//     const audio = new Audio('/sound/ambient.mp3') // https://www.youtube.com/watch?v=nHONksx5R_0
//     audio.loop = true
//     audio.volume = 0.3
//     ambientAudioRef.current = audio
//     let isMounted = true
//     const playAudio = async () => {
//       try {
//         await audio.play()
//       } catch (error) {
//         if (isMounted) {
//           console.error('Audio playback failed:', error)
//         }
//       }
//     }
//     playAudio()
//     return () => {
//       isMounted = false
//       audio.pause()
//       audio.src = ''
//     }
//   }, [])

//   // Manage Ping Sound on Node Selection
//   useEffect(() => {
//     if (selectedNode) {
//       // Fade down ambient sound
//       if (ambientAudioRef.current) ambientAudioRef.current.volume = 0.1

//       // Play ping sound
//       const ping = new Audio('/sound/ping.mp3')
//       ping.volume = 0.5
//       // ping.play()
//       var playPromise = ping.play()
//       if (playPromise !== undefined) {
//         playPromise
//           .then((_) => {
//             // Automatic playback started!
//             // Show playing UI.
//           })
//           .catch((e) => {
//             // Auto-play was prevented
//             // Show paused UI.
//             console.error('Audio autoplay failed:', e)
//           })
//       }
//     } else {
//       // Restore ambient sound volume
//       if (ambientAudioRef.current) ambientAudioRef.current.volume = 0.3
//     }
//   }, [selectedNode])

//   return (
//     <div className={styles.wrapper}>
//       <Canvas>
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[10, 10, 5]} intensity={1} />

//         <Stars
//           radius={100} // The radius of the sphere which the stars are mapped to
//           depth={50} // The depth of the stars
//           count={5000} // The number of stars
//           factor={4} // The size factor of the stars
//           saturation={0} // Saturation of the stars color (0 = white)
//           fade // Makes stars fade out at the edges
//           speed={1} // The speed of the star's rotation
//         />

//         <Nebula />

//         <ScrollControls pages={devHistoryData.length - 1} damping={0.3}>
//           {/* Render all nodes and synapses */}
//           {devHistoryData.map((node) => (
//             <Node key={node.id} {...node} />
//           ))}
//           {devHistoryData.map((node) =>
//             node.connectsTo.map((targetId) => {
//               const targetNode = devHistoryData.find((n) => n.id === targetId)
//               if (!targetNode) return null
//               return <Synapse key={`${node.id}-${targetId}`} start={node.position} end={targetNode.position} />
//             })
//           )}
//           <CameraRig />
//         </ScrollControls>
//       </Canvas>
//       <DescriptionOverlay /> {/* <-- ADD THE OVERLAY HERE */}
//       {/* UI elements must be outside the Canvas */}
//       <DogEar href="/dossier" position="bottom-left" aria-label="Return to dossier" />
//       <DogEar href="/job-hunt" position="bottom-right" aria-label="View job-hunt" />
//     </div>
//   )
// }
