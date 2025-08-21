'use client'

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

// Individual particle component
const Particle = ({ id, initialX, initialY, mouseX, mouseY, section, onParticleClick }) => {
  const x = useSpring(initialX, { stiffness: 100, damping: 20 })
  const y = useSpring(initialY, { stiffness: 100, damping: 20 })

  // Mouse attraction effect
  const attractionX = useTransform([mouseX, x], ([mx, px]) => {
    const distance = Math.abs(mx - px)
    const attraction = Math.max(0, 100 - distance) / 100
    return px + (mx - px) * attraction * 0.1
  })

  const attractionY = useTransform([mouseY, y], ([my, py]) => {
    const distance = Math.abs(my - py)
    const attraction = Math.max(0, 100 - distance) / 100
    return py + (my - py) * attraction * 0.1
  })

  // Particle colors based on section
  const colors = {
    about: '#3b82f6',
    skills: '#10b981',
    projects: '#f59e0b',
    contact: '#ef4444',
  }

  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full cursor-pointer"
      style={{
        x: attractionX,
        y: attractionY,
        backgroundColor: colors[section] || '#6b7280',
      }}
      whileHover={{
        scale: 3,
        backgroundColor: '#ffffff',
        boxShadow: '0 0 20px rgba(255,255,255,0.8)',
      }}
      onClick={() => onParticleClick(id, section)}
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 2 + Math.random() * 2,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  )
}

// Particle system that forms shapes
const ParticleSystem = ({ shape, mouseX, mouseY, onParticleClick }) => {
  const particles = useMemo(() => {
    const particleCount = 150
    const particles = []

    for (let i = 0; i < particleCount; i++) {
      let x, y, section

      if (shape === 'about') {
        // Form a circle
        const angle = (i / particleCount) * Math.PI * 2
        const radius = 100 + Math.random() * 50
        x = Math.cos(angle) * radius + 400
        y = Math.sin(angle) * radius + 200
        section = 'about'
      } else if (shape === 'skills') {
        // Form a grid pattern
        const cols = 15
        const rows = 10
        const col = i % cols
        const row = Math.floor(i / cols)
        x = col * 20 + 200 + Math.random() * 10
        y = row * 20 + 150 + Math.random() * 10
        section = 'skills'
      } else if (shape === 'projects') {
        // Form a spiral
        const angle = i * 0.3
        const radius = i * 2
        x = Math.cos(angle) * radius + 600
        y = Math.sin(angle) * radius + 300
        section = 'projects'
      } else if (shape === 'contact') {
        // Form a heart shape
        const t = (i / particleCount) * Math.PI * 2
        const heartX = 16 * Math.pow(Math.sin(t), 3)
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
        x = heartX * 5 + 300
        y = heartY * 5 + 400
        section = 'contact'
      } else {
        // Random distribution
        x = Math.random() * 800
        y = Math.random() * 600
        section = 'default'
      }

      particles.push({
        id: i,
        x,
        y,
        section,
      })
    }

    return particles
  }, [shape])

  return (
    <>
      {particles.map((particle) => (
        <Particle key={particle.id} id={particle.id} initialX={particle.x} initialY={particle.y} mouseX={mouseX} mouseY={mouseY} section={particle.section} onParticleClick={onParticleClick} />
      ))}
    </>
  )
}

// Gravity well effect
const GravityWell = ({ x, y, strength = 1 }) => {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ x: x - 50, y: y - 50 }}
      animate={{
        scale: [1, 1.5, 1],
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
    >
      <div className="w-24 h-24 rounded-full border-2 border-purple-500 bg-purple-500/20" />
      <div className="absolute inset-4 rounded-full border border-purple-400 bg-purple-400/10" />
      <div className="absolute inset-8 rounded-full border border-purple-300 bg-purple-300/5" />
    </motion.div>
  )
}

// Section content overlay
const SectionOverlay = ({ section, onClose }) => {
  const content = {
    about: {
      title: 'About Me',
      text: "I'm Leong Kar Wan, a Full Stack Developer passionate about AI and creating innovative solutions. Each particle represents a part of my journey in technology.",
    },
    skills: {
      title: 'Skills Universe',
      text: "My technical skills form constellations in this digital space. Python, React, AI/ML, and more - each particle is a skill I've mastered.",
    },
    projects: {
      title: 'Project Galaxy',
      text: 'Every project is a star in my development galaxy. From AI systems to 3D visualizations, each one represents innovation and creativity.',
    },
    contact: {
      title: 'Connect',
      text: "Let's create something amazing together. The heart-shaped constellation represents my passion for collaborative development.",
    },
  }

  const sectionData = content[section] || { title: 'Unknown', text: 'Exploring the particle universe...' }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-slate-900/90 border border-white/20 rounded-2xl p-8 max-w-md mx-4 text-center" onClick={(e) => e.stopPropagation()}>
        <motion.h2
          className="text-3xl font-light text-white mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
          animate={{
            textShadow: ['0 0 10px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.8)', '0 0 10px rgba(255,255,255,0.5)'],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {sectionData.title}
        </motion.h2>
        <p className="text-gray-300 leading-relaxed mb-6">{sectionData.text}</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// Main Particle Universe component
export const ParticleUniverse = () => {
  const [currentShape, setCurrentShape] = useState('default')
  const [selectedSection, setSelectedSection] = useState(null)
  const [gravityWells, setGravityWells] = useState([])
  const containerRef = useRef(null)

  // Mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('mousemove', handleMouseMove)
      return () => container.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  // Handle particle clicks
  const handleParticleClick = (particleId, section) => {
    if (section !== 'default') {
      setSelectedSection(section)

      // Add gravity well at click position
      const newWell = {
        id: Date.now(),
        x: mouseX.get(),
        y: mouseY.get(),
      }
      setGravityWells((prev) => [...prev, newWell])

      // Remove gravity well after animation
      setTimeout(() => {
        setGravityWells((prev) => prev.filter((well) => well.id !== newWell.id))
      }, 3000)
    }
  }

  // Auto-cycle through shapes
  useEffect(() => {
    const shapes = ['about', 'skills', 'projects', 'contact']
    let currentIndex = 0

    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % shapes.length
      setCurrentShape(shapes[currentIndex])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Starfield background */}
      <div className="fixed inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Main particle container */}
      <div ref={containerRef} className="relative w-full h-screen cursor-crosshair">
        <ParticleSystem shape={currentShape} mouseX={mouseX} mouseY={mouseY} onParticleClick={handleParticleClick} />

        {/* Gravity wells */}
        {gravityWells.map((well) => (
          <GravityWell key={well.id} x={well.x} y={well.y} />
        ))}
      </div>

      {/* UI Overlay */}
      <div className="fixed top-8 left-8 z-40">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-black/50 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <h1 className="text-2xl font-light mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Particle Universe
          </h1>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• Move mouse to attract particles</p>
            <p>• Click particles to explore sections</p>
            <p>• Shapes auto-cycle every 5 seconds</p>
            <p className="text-purple-400">Current: {currentShape}</p>
          </div>
        </motion.div>
      </div>

      {/* Shape selector */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
          {['about', 'skills', 'projects', 'contact'].map((shape) => (
            <motion.button key={shape} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setCurrentShape(shape)} className={`px-4 py-2 rounded-lg border transition-colors ${currentShape === shape ? 'bg-purple-600 border-purple-500 text-white' : 'bg-black/50 border-white/20 text-gray-300 hover:border-white/40'}`}>
              {shape.charAt(0).toUpperCase() + shape.slice(1)}
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="fixed top-8 right-8 z-40">
        <motion.a href="/test" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/20 rounded-lg hover:border-white/40 transition-colors">
          ← Back to Test Lab
        </motion.a>
      </div>

      {/* Section overlay */}
      <AnimatePresence>{selectedSection && <SectionOverlay section={selectedSection} onClose={() => setSelectedSection(null)} />}</AnimatePresence>
    </div>
  )
}
