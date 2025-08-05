'use client'

import { animated, config, useSpring, useTrail } from '@react-spring/web'
import { Float, MeshDistortMaterial, OrbitControls, Sphere } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useGesture } from '@use-gesture/react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'

// Seeded random for consistent rendering
const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// 3D Floating Sphere Component
const FloatingSphere = ({ position, color, scale = 1 }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1 * scale, 32, 32]} position={position}>
        <MeshDistortMaterial color={color} attach="material" distort={0.4} speed={2} roughness={0.1} metalness={0.8} />
      </Sphere>
    </Float>
  )
}

// 3D Scene Component
const ThreeScene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <FloatingSphere position={[-2, 1, 0]} color="#8b5cf6" scale={0.8} />
      <FloatingSphere position={[2, -1, 0]} color="#06b6d4" scale={0.6} />
      <FloatingSphere position={[0, 0, -2]} color="#10b981" scale={1.2} />
      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  )
}

// React Spring Morphing Card
const SpringCard = ({ title, description, color, delay = 0 }) => {
  const [hovered, setHovered] = useState(false)

  const springProps = useSpring({
    transform: hovered ? 'scale(1.1) rotateY(10deg)' : 'scale(1) rotateY(0deg)',
    background: hovered ? `linear-gradient(135deg, ${color}40, ${color}20)` : `linear-gradient(135deg, ${color}20, ${color}10)`,
    borderColor: hovered ? `${color}80` : `${color}40`,
    config: config.wobbly,
    delay: delay * 100,
  })

  return (
    <animated.div style={springProps} className="p-6 rounded-2xl border backdrop-blur-sm cursor-pointer" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </animated.div>
  )
}

// Gesture-Controlled Element
const GestureBox = () => {
  const [{ x, y, scale }, api] = useSpring(() => ({ x: 0, y: 0, scale: 1 }))

  const bind = useGesture({
    onDrag: ({ offset: [ox, oy] }) => api.start({ x: ox, y: oy }),
    onPinch: ({ offset: [s] }) => api.start({ scale: s }),
    onHover: ({ hovering }) => api.start({ scale: hovering ? 1.1 : 1 }),
  })

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        scale,
        touchAction: 'none',
      }}
      className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-bold"
    >
      DRAG
    </animated.div>
  )
}

// Particle System (CSS-based for performance)
const ParticleField = () => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: seededRandom(i * 123) * 100,
    y: seededRandom(i * 456) * 100,
    size: seededRandom(i * 789) * 4 + 2,
    duration: seededRandom(i * 987) * 3 + 2,
    delay: seededRandom(i * 654) * 2,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Library Showcase Grid
const LibraryShowcase = () => {
  const libraries = [
    {
      name: 'React Spring',
      description: 'Physics-based animations with spring mechanics',
      color: '#10b981',
      demo: 'Liquid morphing cards',
      route: '/animation-universe/spring',
    },
    {
      name: 'React Three Fiber',
      description: '3D scenes and WebGL effects',
      color: '#8b5cf6',
      demo: '3D glass spheres',
      route: '/animation-universe/three',
    },
    {
      name: 'Lottie React',
      description: 'After Effects animations in React',
      color: '#06b6d4',
      demo: 'Interactive micro-animations',
      route: '/animation-universe/lottie',
    },
    {
      name: 'Use Gesture',
      description: 'Advanced gesture recognition',
      color: '#f59e0b',
      demo: 'Multi-touch interactions',
      route: '/animation-universe/gestures',
    },
    {
      name: 'Framer Motion',
      description: 'Declarative animations and layout',
      color: '#ef4444',
      demo: 'Complex UI animations',
      route: '/animation-universe/framer',
    },
    {
      name: 'Glass UI',
      description: 'Glassmorphism and frosted effects',
      color: '#ec4899',
      demo: 'Crystal clear interfaces',
      route: '/animation-universe/glass',
    },
    {
      name: 'GSAP Power',
      description: 'Professional timeline animations',
      color: '#22c55e',
      demo: 'Timeline control & morphing',
      route: '/animation-universe/gsap',
    },
    {
      name: 'Interactive Playground',
      description: 'Live code editor and animation builder',
      color: '#f97316',
      demo: 'Real-time code editing',
      route: '/animation-universe/playground',
    },
  ]

  const trail = useTrail(libraries.length, {
    from: { opacity: 0, transform: 'translate3d(0,40px,0)' },
    to: { opacity: 1, transform: 'translate3d(0,0px,0)' },
    config: config.gentle,
  })

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2 className="text-6xl font-black text-center mb-16 text-white" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <motion.span
            className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            style={{ backgroundSize: '200% 200%' }}
          >
            ANIMATION LIBRARIES
          </motion.span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trail.map((style, index) => {
            const library = libraries[index]
            return (
              <animated.div key={library.name} style={style}>
                <Link href={library.route}>
                  <motion.div
                    className="group relative p-8 rounded-2xl border border-white/10 backdrop-blur-sm cursor-pointer overflow-hidden"
                    whileHover={{
                      scale: 1.05,
                      rotateY: 5,
                      rotateX: 5,
                    }}
                    style={{
                      background: `linear-gradient(135deg, ${library.color}20, ${library.color}10)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Animated background */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${library.color}40, transparent)`,
                      }}
                      transition={{ duration: 0.3 }}
                    />

                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold text-white mb-4">{library.name}</h3>
                      <p className="text-gray-300 mb-4 leading-relaxed">{library.description}</p>
                      <div className="text-sm text-gray-400 mb-6">Demo: {library.demo}</div>

                      <motion.div className="flex items-center text-white group-hover:text-gray-200" animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <span className="mr-2">Explore</span>
                        <span>→</span>
                      </motion.div>
                    </div>

                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, ${library.color}30, transparent)`,
                        filter: 'blur(20px)',
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </Link>
              </animated.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Hero Section
const AnimationHero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -500])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-black">
      <ParticleField />

      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        <Suspense fallback={<div />}>
          <ThreeScene />
        </Suspense>
      </div>

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ y, opacity }}>
        <div className="text-center max-w-6xl mx-auto px-6">
          <motion.h1
            className="text-8xl md:text-9xl font-black mb-8"
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{
              duration: 2,
              type: 'spring',
              stiffness: 100,
              delay: 0.5,
            }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-purple-400 via-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                rotateY: [0, 5, 0, -5, 0],
              }}
              transition={{
                backgroundPosition: { duration: 3, repeat: Infinity },
                rotateY: { duration: 8, repeat: Infinity },
              }}
              style={{
                backgroundSize: '400% 400%',
                filter: 'drop-shadow(0 0 50px rgba(139, 92, 246, 0.8))',
              }}
            >
              ANIMATION
            </motion.span>
          </motion.h1>

          <motion.h2 className="text-4xl md:text-6xl font-bold mb-12 text-white" initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1.2 }}>
            <motion.span
              animate={{
                color: ['#ffffff', '#8b5cf6', '#06b6d4', '#10b981', '#ffffff'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              UNIVERSE
            </motion.span>
          </motion.h2>

          <motion.p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.8 }}>
            Explore the most powerful React animation libraries through interactive demos, stunning visual effects, and real-world examples. From physics-based springs to 3D WebGL scenes - discover what's possible.
          </motion.p>

          {/* Interactive Demo Elements */}
          <motion.div className="flex flex-wrap justify-center items-center gap-8 mb-16" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 2.2 }}>
            <SpringCard title="React Spring" description="Physics-based animations" color="#10b981" delay={0} />

            <div className="flex items-center justify-center">
              <GestureBox />
            </div>

            <SpringCard title="Three.js" description="3D WebGL scenes" color="#8b5cf6" delay={1} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.8 }}>
            <motion.button
              className="px-12 py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl font-bold text-xl text-white"
              whileHover={{
                scale: 1.1,
                boxShadow: '0 20px 60px rgba(139, 92, 246, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                backgroundPosition: { duration: 3, repeat: Infinity },
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              START EXPLORING
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ opacity }} animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div className="w-1 h-3 bg-white/60 rounded-full mt-2" animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  )
}

// Main Component
export const AnimationUniverse = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <motion.div
          className="text-white text-2xl font-bold"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Loading Animation Universe...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      <AnimationHero />
      <LibraryShowcase />

      {/* Coming Soon Section */}
      <section className="py-20 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          <h3 className="text-4xl font-bold text-white mb-8">More Libraries Coming Soon</h3>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">Shader effects, particle systems, advanced gestures, and more spectacular demos are on the way!</p>
        </motion.div>
      </section>
    </div>
  )
}
