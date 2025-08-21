'use client'

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Advanced Magnetic Cursor with Trail and Morphing
const AdvancedMagneticCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [cursorState, setCursorState] = useState({
    type: 'default',
    scale: 1,
    color: '#ffffff',
    shape: 'circle',
    trail: true,
  })
  const [trail, setTrail] = useState([])

  // Smooth cursor position with spring physics
  const cursorX = useSpring(0, { stiffness: 600, damping: 30 })
  const cursorY = useSpring(0, { stiffness: 600, damping: 30 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPosition = { x: e.clientX, y: e.clientY }
      setMousePosition(newPosition)

      // Update spring values
      cursorX.set(e.clientX - 12)
      cursorY.set(e.clientY - 12)

      // Add to trail
      if (cursorState.trail) {
        setTrail((prev) => [
          ...prev.slice(-8), // Keep last 8 trail points
          {
            x: e.clientX,
            y: e.clientY,
            id: Date.now() + Math.random(),
            timestamp: Date.now(),
          },
        ])
      }

      // Detect element under cursor
      const element = document.elementFromPoint(e.clientX, e.clientY)
      if (element) {
        updateCursorState(element)
      }
    }

    const updateCursorState = (element) => {
      if (element.classList.contains('cursor-nav')) {
        setCursorState({
          type: 'nav',
          scale: 2,
          color: '#8b5cf6',
          shape: 'square',
          trail: true,
        })
      } else if (element.classList.contains('cursor-project')) {
        setCursorState({
          type: 'project',
          scale: 2.5,
          color: '#06b6d4',
          shape: 'diamond',
          trail: true,
        })
      } else if (element.classList.contains('cursor-cta')) {
        setCursorState({
          type: 'cta',
          scale: 3,
          color: '#10b981',
          shape: 'circle',
          trail: false,
        })
      } else if (element.classList.contains('cursor-text')) {
        setCursorState({
          type: 'text',
          scale: 0.5,
          color: '#f59e0b',
          shape: 'line',
          trail: false,
        })
      } else {
        setCursorState({
          type: 'default',
          scale: 1,
          color: '#ffffff',
          shape: 'circle',
          trail: true,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [cursorState.trail, cursorX, cursorY])

  // Clean up old trail points
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now()
      setTrail((prev) => prev.filter((point) => now - point.timestamp < 1000))
    }, 100)

    return () => clearInterval(cleanup)
  }, [])

  const getCursorShape = () => {
    switch (cursorState.shape) {
      case 'square':
        return { borderRadius: '4px' }
      case 'diamond':
        return { borderRadius: '4px', transform: 'rotate(45deg)' }
      case 'line':
        return { borderRadius: '50px', width: '2px', height: '24px' }
      default:
        return { borderRadius: '50%' }
    }
  }

  return (
    <>
      {/* Trail Effect */}
      <AnimatePresence>
        {trail.map((point, index) => (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-40"
            style={{
              left: point.x - 3,
              top: point.y - 3,
              width: 6,
              height: 6,
              backgroundColor: cursorState.color,
              borderRadius: '50%',
              opacity: 0.6 - index * 0.1,
            }}
            initial={{ scale: 0.8, opacity: 0.8 }}
            animate={{ scale: 0.2, opacity: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {/* Main Cursor */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          width: 24,
          height: 24,
          backgroundColor: cursorState.color,
          ...getCursorShape(),
        }}
        animate={{
          scale: cursorState.scale,
          rotate: cursorState.shape === 'diamond' ? 45 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      />

      {/* Magnetic Field Visualization */}
      {cursorState.type !== 'default' && (
        <motion.div
          className="fixed pointer-events-none z-45"
          style={{
            left: mousePosition.x - 50,
            top: mousePosition.y - 50,
            width: 100,
            height: 100,
            border: `2px solid ${cursorState.color}`,
            borderRadius: '50%',
            opacity: 0.3,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </>
  )
}

// Cyberpunk Navigation
const CyberpunkNav = () => {
  const [activeItem, setActiveItem] = useState('home')

  const navItems = [
    { id: 'home', label: 'INIT', icon: '◉', glitch: 'H0M3' },
    { id: 'about', label: 'DATA', icon: '◎', glitch: 'D4T4' },
    { id: 'work', label: 'EXEC', icon: '◈', glitch: '3X3C' },
    { id: 'contact', label: 'LINK', icon: '◇', glitch: 'L1NK' },
  ]

  return (
    <motion.nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
      <div className="flex items-center space-x-2 bg-black/90 backdrop-blur-xl rounded-lg px-3 py-3 border border-cyan-500/30">
        {navItems.map((item, index) => (
          <motion.button
            key={item.id}
            className={`cursor-nav relative px-4 py-2 rounded-md text-sm font-mono transition-colors ${activeItem === item.id ? 'text-black bg-cyan-400' : 'text-cyan-400 hover:text-cyan-300'}`}
            onClick={() => setActiveItem(item.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: activeItem === item.id ? ['0 0 0px #06b6d4', '0 0 20px #06b6d4', '0 0 0px #06b6d4'] : '0 0 0px #06b6d4',
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity },
            }}
          >
            {activeItem === item.id && <motion.div className="absolute inset-0 bg-cyan-400 rounded-md" layoutId="activeNavCyber" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
            <span className="relative flex items-center space-x-2">
              <span className="text-lg">{item.icon}</span>
              <motion.span
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {item.label}
              </motion.span>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  )
}

// Glitch Text Effect
const GlitchText = ({ children, className = '', delay = 0 }) => {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(
      () => {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 200)
      },
      3000 + delay * 1000
    )

    return () => clearInterval(interval)
  }, [delay])

  return (
    <div className={`relative ${className}`}>
      <motion.div
        className="relative z-10"
        animate={
          isGlitching
            ? {
                x: [0, -2, 2, -1, 1, 0],
                textShadow: ['0 0 0 transparent', '2px 0 0 #ff0000, -2px 0 0 #00ffff', '-2px 0 0 #ff0000, 2px 0 0 #00ffff', '0 0 0 transparent'],
              }
            : {}
        }
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {isGlitching && (
        <>
          <motion.div className="absolute inset-0 text-red-500 opacity-70" style={{ clipPath: 'inset(0 0 50% 0)' }} animate={{ x: [0, 2, -2, 0] }} transition={{ duration: 0.1, repeat: 2 }}>
            {children}
          </motion.div>
          <motion.div className="absolute inset-0 text-cyan-500 opacity-70" style={{ clipPath: 'inset(50% 0 0 0)' }} animate={{ x: [0, -2, 2, 0] }} transition={{ duration: 0.1, repeat: 2 }}>
            {children}
          </motion.div>
        </>
      )}
    </div>
  )
}

// Cyberpunk Hero Section
const CyberpunkHero = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-20 grid-rows-12 h-full w-full">
          {Array.from({ length: 240 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-cyan-500/30"
              animate={{
                opacity: [0.1, 0.5, 0.1],
                borderColor: ['rgba(6, 182, 212, 0.3)', 'rgba(139, 92, 246, 0.3)', 'rgba(6, 182, 212, 0.3)'],
              }}
              transition={{
                duration: 4 + (i % 10) * 0.5,
                repeat: Infinity,
                delay: (i % 20) * 0.1,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Data Streams */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-cyan-400/30 font-mono text-xs"
          style={{
            left: `${10 + i * 12}%`,
            top: '10%',
          }}
          animate={{
            y: ['0vh', '100vh'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j}>
              {Math.random() > 0.5 ? '1' : '0'}
              {Math.random() > 0.5 ? '1' : '0'}
              {Math.random() > 0.5 ? '1' : '0'}
              {Math.random() > 0.5 ? '1' : '0'}
            </div>
          ))}
        </motion.div>
      ))}

      <div className="text-center z-10 max-w-6xl mx-auto px-6">
        {/* Terminal-style Introduction */}
        <motion.div className="font-mono text-cyan-400 text-left mb-8 bg-black/80 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm" initial={{ opacity: 0, y: 50 }} animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }} transition={{ duration: 1 }}>
          <div className="flex items-center mb-2">
            <span className="text-green-400">user@portfolio:~$</span>
            <motion.span className="ml-2" animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              _
            </motion.span>
          </div>
          <motion.div initial={{ width: 0 }} animate={{ width: isLoaded ? '100%' : 0 }} transition={{ duration: 2, delay: 0.5 }} className="overflow-hidden">
            <div>./initialize_portfolio.sh</div>
            <div className="text-green-400">Loading developer profile...</div>
            <div className="text-yellow-400">Status: ONLINE</div>
            <div className="text-cyan-400">Name: LEONG_KAR_WAN</div>
            <div className="text-purple-400">Role: CREATIVE_DEVELOPER</div>
          </motion.div>
        </motion.div>

        {/* Glitch Name */}
        <GlitchText className="text-8xl md:text-9xl font-black text-white mb-8" delay={0}>
          <motion.h1 initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 1.5 }}>
            CYBER_DEV
          </motion.h1>
        </GlitchText>

        {/* Subtitle with Typewriter Effect */}
        <motion.div className="text-2xl md:text-3xl font-mono text-cyan-400 mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2 }}>
          <GlitchText delay={1}>BUILDING_THE_FUTURE.EXE</GlitchText>
        </motion.div>

        {/* CTA Button */}
        <motion.button className="cursor-cta group relative px-12 py-6 bg-transparent border-2 border-cyan-400 text-cyan-400 font-mono font-bold rounded-lg overflow-hidden" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2.5 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <motion.div className="absolute inset-0 bg-cyan-400" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
          <span className="relative z-10 group-hover:text-black transition-colors">ENTER_SYSTEM.EXE</span>

          {/* Scanning Line Effect */}
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} />
        </motion.button>
      </div>

      {/* Scan Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent" animate={{ y: ['-100%', '100%'] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }} style={{ height: '200%' }} />
      </div>
    </section>
  )
}

// Holographic Project Cards
const HolographicProjects = () => {
  const projects = [
    {
      id: 'neural_net',
      title: 'NEURAL_INTERFACE.AI',
      category: 'ARTIFICIAL_INTELLIGENCE',
      description: 'Advanced neural network for human-computer interaction',
      status: 'ACTIVE',
      progress: 87,
      color: '#8b5cf6',
    },
    {
      id: 'quantum_dash',
      title: 'QUANTUM_DASHBOARD.VR',
      category: 'VIRTUAL_REALITY',
      description: 'Real-time quantum computing visualization platform',
      status: 'BETA',
      progress: 64,
      color: '#06b6d4',
    },
    {
      id: 'bio_auth',
      title: 'BIOMETRIC_AUTH.SEC',
      category: 'CYBERSECURITY',
      description: 'Next-generation biometric authentication system',
      status: 'DEPLOYED',
      progress: 100,
      color: '#10b981',
    },
    {
      id: 'holo_ui',
      title: 'HOLOGRAPHIC_UI.AR',
      category: 'AUGMENTED_REALITY',
      description: 'Spatial computing interface for mixed reality',
      status: 'DEVELOPMENT',
      progress: 42,
      color: '#f59e0b',
    },
  ]

  return (
    <section className="py-32 px-6 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <GlitchText className="text-6xl md:text-8xl font-black text-white text-center mb-20 font-mono">ACTIVE_PROJECTS.DIR</GlitchText>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="cursor-project group relative rounded-lg overflow-hidden border border-cyan-500/30 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                rotateX: 5,
                boxShadow: `0 20px 60px ${project.color}40`,
              }}
              style={{ transformStyle: 'preserve-3d' }}
              viewport={{ once: true }}
            >
              {/* Holographic Overlay */}
              <motion.div
                className="absolute inset-0 opacity-30"
                style={{
                  background: `linear-gradient(45deg, ${project.color}20, transparent, ${project.color}20)`,
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              <div className="relative z-10 p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <motion.div className="text-cyan-400 text-sm font-mono mb-2" animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }}>
                      {project.category}
                    </motion.div>
                    <h3 className="text-2xl font-mono font-bold text-white mb-2">{project.title}</h3>
                  </div>

                  <motion.div
                    className={`px-3 py-1 rounded-full text-xs font-mono border ${project.status === 'ACTIVE' ? 'border-green-500 text-green-400' : project.status === 'BETA' ? 'border-yellow-500 text-yellow-400' : project.status === 'DEPLOYED' ? 'border-cyan-500 text-cyan-400' : 'border-purple-500 text-purple-400'}`}
                    animate={{
                      boxShadow: [`0 0 0px ${project.color}`, `0 0 20px ${project.color}`, `0 0 0px ${project.color}`],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {project.status}
                  </motion.div>
                </div>

                {/* Description */}
                <p className="text-gray-300 font-mono text-sm mb-6 leading-relaxed">{project.description}</p>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-cyan-400 text-xs font-mono">PROGRESS</span>
                    <span className="text-white text-xs font-mono">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: project.color }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      transition={{ duration: 2, delay: index * 0.3 }}
                      animate={{
                        boxShadow: [`0 0 0px ${project.color}`, `0 0 10px ${project.color}`, `0 0 0px ${project.color}`],
                      }}
                    />
                  </div>
                </div>

                {/* Access Button */}
                <motion.div className="flex items-center text-cyan-400 font-mono text-sm group-hover:translate-x-2 transition-transform" whileHover={{ x: 5 }}>
                  <span className="mr-2">ACCESS_PROJECT</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    &gt;&gt;
                  </motion.span>
                </motion.div>
              </div>

              {/* Scanning Effect */}
              <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main Design-4 Component
export default function Design4() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <motion.div
          className="text-cyan-400 text-2xl font-mono"
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          INITIALIZING_SYSTEM...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <AdvancedMagneticCursor />
      <CyberpunkNav />
      <CyberpunkHero />
      <HolographicProjects />
    </div>
  )
}
