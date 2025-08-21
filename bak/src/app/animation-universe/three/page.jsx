'use client'

import { Box, ContactShadows, Environment, Float, MeshDistortMaterial, MeshWobbleMaterial, OrbitControls, Sphere, Stars } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Interactive 3D Sphere with realistic glass material
const GlassSphere = ({ position, color, scale = 1, ...props }) => {
  const meshRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.2
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1
    }
  })

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[1 * scale, 64, 64]} position={position} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} {...props}>
        <meshPhysicalMaterial color={color} transmission={0.9} opacity={0.8} metalness={0.1} roughness={0.1} ior={1.5} thickness={0.5} specularIntensity={1} specularColor="#ffffff" envMapIntensity={1} clearcoat={1} clearcoatRoughness={0.1} normalScale={[0.15, 0.15]} clearcoatNormalScale={[0.2, 0.2]} transparent />
      </Sphere>
    </Float>
  )
}

// Morphing Crystal
const MorphingCrystal = ({ position }) => {
  const meshRef = useRef()
  const [clicked, setClicked] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Box ref={meshRef} args={[1.5, 1.5, 1.5]} position={position} onClick={() => setClicked(!clicked)} scale={clicked ? 1.5 : 1}>
      <MeshDistortMaterial color={clicked ? '#ff6b6b' : '#4ecdc4'} attach="material" distort={clicked ? 0.8 : 0.4} speed={clicked ? 5 : 2} roughness={0.2} metalness={0.8} />
    </Box>
  )
}

// Wobbling Liquid Blob
const LiquidBlob = ({ position, color }) => {
  const meshRef = useRef()

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={3}>
      <Sphere ref={meshRef} args={[1.2, 32, 32]} position={position}>
        <MeshWobbleMaterial color={color} attach="material" factor={1} speed={2} roughness={0.1} metalness={0.9} />
      </Sphere>
    </Float>
  )
}

// Interactive 3D Cube
const Interactive3DCube = () => {
  const cubeRef = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (cubeRef.current) {
      cubeRef.current.rotation.x = state.clock.elapsedTime * 0.5
      cubeRef.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  return (
    <Box ref={cubeRef} args={[2, 2, 2]} position={[0, 1, 0]} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)} scale={hovered ? 1.3 : 1}>
      <meshNormalMaterial />
    </Box>
  )
}

// Particle Galaxy
const ParticleGalaxy = () => {
  const pointsRef = useRef()
  const particleCount = 1000

  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    const radius = Math.random() * 10
    const spinAngle = radius * 0.5
    const branchAngle = (i % 3) * ((Math.PI * 2) / 3)

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius
    positions[i3 + 1] = (Math.random() - 0.5) * 2
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius

    const mixedColor = new THREE.Color()
    mixedColor.setHSL(0.6 + Math.random() * 0.4, 0.8, 0.6)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={particleCount} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} sizeAttenuation={true} vertexColors={true} transparent opacity={0.8} />
    </points>
  )
}

// Main 3D Scene Component
const ThreeScene = ({ sceneType = 'glass' }) => {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(0, 0, 8)
  }, [camera])

  const renderScene = () => {
    switch (sceneType) {
      case 'glass':
        return (
          <>
            <GlassSphere position={[-3, 1, 0]} color="#8b5cf6" scale={0.8} />
            <GlassSphere position={[3, -1, 0]} color="#06b6d4" scale={1.2} />
            <GlassSphere position={[0, 0, -2]} color="#10b981" scale={1} />
            <ContactShadows opacity={0.4} scale={10} blur={1} far={10} resolution={256} color="#000000" />
          </>
        )
      case 'morphing':
        return (
          <>
            <MorphingCrystal position={[-2, 0, 0]} />
            <LiquidBlob position={[2, 0, 0]} color="#ff6b6b" />
            <Interactive3DCube />
          </>
        )
      case 'galaxy':
        return (
          <>
            <ParticleGalaxy />
            <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade />
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      <Environment preset="city" />
      {renderScene()}
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} autoRotate={sceneType === 'galaxy'} autoRotateSpeed={0.5} />
    </>
  )
}

// Scene Selector Component
const SceneSelector = ({ currentScene, onSceneChange }) => {
  const scenes = [
    { id: 'glass', name: 'Glass Materials', description: 'Realistic glass spheres with refraction' },
    { id: 'morphing', name: 'Morphing Objects', description: 'Interactive distortion and wobble effects' },
    { id: 'galaxy', name: 'Particle Galaxy', description: 'Thousands of animated particles' },
  ]

  return (
    <div className="absolute top-6 left-6 z-10">
      <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <h3 className="text-white font-bold mb-3">3D Scenes</h3>
        <div className="space-y-2">
          {scenes.map((scene) => (
            <button key={scene.id} onClick={() => onSceneChange(scene.id)} className={`block w-full text-left p-3 rounded-lg transition-colors ${currentScene === scene.id ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'}`}>
              <div className="font-medium">{scene.name}</div>
              <div className="text-sm opacity-80">{scene.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Loading Component
const SceneLoader = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshBasicMaterial color="#8b5cf6" />
  </mesh>
)

// Performance Monitor
const PerformanceMonitor = () => {
  const [fps, setFps] = useState(60)

  useEffect(() => {
    let lastTime = performance.now()
    let frameCount = 0

    const updateFPS = () => {
      frameCount++
      const currentTime = performance.now()

      if (currentTime - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (currentTime - lastTime)))
        frameCount = 0
        lastTime = currentTime
      }

      requestAnimationFrame(updateFPS)
    }

    updateFPS()
  }, [])

  return (
    <div className="absolute top-6 right-6 z-10">
      <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <div className="text-white font-bold">Performance</div>
        <div className="text-green-400">{fps} FPS</div>
      </div>
    </div>
  )
}

export default function ThreeShowcase() {
  const [currentScene, setCurrentScene] = useState('glass')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl font-bold animate-pulse">Loading 3D Universe...</div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 bg-gradient-to-b from-black/80 to-transparent">
        <Link href="/animation-universe" className="text-blue-400 hover:text-blue-300">
          ← Back to Animation Universe
        </Link>
      </div>

      {/* 3D Canvas */}
      <div className="h-screen relative">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
          <Suspense fallback={<SceneLoader />}>
            <ThreeScene sceneType={currentScene} />
          </Suspense>
        </Canvas>

        <PerformanceMonitor />

        <SceneSelector currentScene={currentScene} onSceneChange={setCurrentScene} />

        {/* Instructions */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4 border border-white/20 text-center">
            <div className="text-white font-medium mb-2">Interactive Controls</div>
            <div className="text-gray-300 text-sm">🖱️ Drag to rotate • 🔍 Scroll to zoom • 👆 Click objects to interact</div>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.h1 className="text-6xl md:text-8xl font-black text-center mb-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">React Three Fiber</span>
          </motion.h1>

          <motion.p className="text-xl text-gray-300 text-center max-w-4xl mx-auto mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            Bringing Three.js to React with declarative, reusable components. Create stunning 3D scenes, realistic materials, and interactive experiences that run smoothly in the browser.
          </motion.p>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Realistic Materials</h3>
              <p className="text-gray-300">Physical-based rendering with glass, metal, and liquid materials. Realistic lighting, reflections, and refractions.</p>
            </motion.div>

            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">Interactive 3D</h3>
              <p className="text-gray-300">Click, drag, and interact with 3D objects. Hover effects, animations, and responsive controls that feel natural.</p>
            </motion.div>

            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400">Performance</h3>
              <p className="text-gray-300">Hardware-accelerated WebGL rendering with 60fps animations. Optimized for both desktop and mobile devices.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-20 px-6 text-center bg-gray-900/50">
        <h3 className="text-3xl font-bold mb-8">Explore More Libraries</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/animation-universe/spring" className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors">
            ← React Spring
          </Link>
          <Link href="/animation-universe/lottie" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors">
            Lottie Animations →
          </Link>
        </div>
      </section>
    </div>
  )
}
