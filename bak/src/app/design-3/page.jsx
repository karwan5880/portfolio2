'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Seeded random for consistent effects
const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Magnetic Cursor Effect
const MagneticCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Check if hovering over magnetic elements
      const element = document.elementFromPoint(e.clientX, e.clientY)
      if (element && element.classList && element.classList.contains('magnetic')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <motion.div
      className="fixed w-6 h-6 bg-white rounded-full pointer-events-none z-50 mix-blend-difference"
      animate={{
        x: mousePosition.x - 12,
        y: mousePosition.y - 12,
        scale: isHovering ? 2 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
      }}
    />
  )
}

// Floating Navigation
const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState('hero')

  const navItems = [
    { id: 'hero', label: 'Home', icon: '◉' },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'work', label: 'Work', icon: '◈' },
    { id: 'contact', label: 'Contact', icon: '◇' },
  ]

  return (
    <motion.nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 2 }}>
      <div className="flex items-center space-x-1 bg-black/80 backdrop-blur-xl rounded-full px-2 py-2 border border-white/10">
        {navItems.map((item) => (
          <motion.button key={item.id} className={`magnetic relative px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeSection === item.id ? 'text-black' : 'text-white hover:text-gray-300'}`} onClick={() => setActiveSection(item.id)} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            {activeSection === item.id && <motion.div className="absolute inset-0 bg-white rounded-full" layoutId="activeNav" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
            <span className="relative flex items-center space-x-2">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  )
}

// Kinetic Typography Hero
const KineticHero = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -500])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  const name = 'LEONG KAR WAN'
  const title = 'CREATIVE DEVELOPER'

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
          {Array.from({ length: 96 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-white/20"
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3 + seededRandom(i) * 2,
                repeat: Infinity,
                delay: seededRandom(i * 123) * 2,
              }}
            />
          ))}
        </div>
      </div>

      <motion.div className="text-center z-10" style={{ y, opacity, scale }}>
        {/* Kinetic Name Animation */}
        <div className="mb-8 overflow-hidden">
          <motion.h1 className="text-8xl md:text-9xl font-black text-white leading-none">
            {name.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 200, rotateX: -90, opacity: 0 }}
                animate={{ y: 0, rotateX: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{
                  y: -20,
                  rotateX: 15,
                  color: '#8b5cf6',
                  transition: { duration: 0.3 },
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Morphing Title */}
        <motion.div className="text-2xl md:text-3xl font-light text-gray-300 mb-12 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.5 }}>
          {title.split('').map((char, i) => (
            <motion.span
              key={i}
              className="inline-block magnetic"
              animate={{
                y: [0, -10, 0],
                color: ['#d1d5db', '#8b5cf6', '#06b6d4', '#10b981', '#d1d5db'],
              }}
              transition={{
                duration: 4,
                delay: i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </motion.div>

        {/* Floating Action Button */}
        <motion.button className="magnetic group relative px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-full overflow-hidden" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 2 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <motion.div className="absolute inset-0 bg-white" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
          <span className="relative z-10 group-hover:text-black transition-colors">Explore My Universe</span>
        </motion.button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ opacity }} animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="flex flex-col items-center text-white/60">
          <span className="text-sm mb-2">Scroll</span>
          <div className="w-px h-12 bg-white/30 relative">
            <motion.div className="absolute top-0 w-px h-4 bg-white" animate={{ y: [0, 32, 0] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </div>
      </motion.div>
    </section>
  )
}

// Liquid Morphing Cards
const LiquidCards = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const projects = [
    {
      title: 'Neural Interface',
      category: 'AI/ML',
      description: 'Brain-computer interface for seamless human-AI collaboration',
      color: '#8b5cf6',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      title: 'Quantum Dashboard',
      category: 'Data Viz',
      description: 'Real-time quantum computing visualization platform',
      color: '#06b6d4',
      gradient: 'from-cyan-600 to-blue-600',
    },
    {
      title: 'Biometric Auth',
      category: 'Security',
      description: 'Next-gen biometric authentication system',
      color: '#10b981',
      gradient: 'from-green-600 to-emerald-600',
    },
    {
      title: 'Holographic UI',
      category: 'AR/VR',
      description: 'Spatial computing interface for mixed reality',
      color: '#f59e0b',
      gradient: 'from-yellow-600 to-orange-600',
    },
  ]

  return (
    <section ref={containerRef} className="py-32 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.h2 className="text-6xl md:text-8xl font-black text-white text-center mb-20" initial={{ opacity: 0, y: 100 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1 }}>
          FEATURED WORK
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="magnetic group relative h-96 rounded-3xl overflow-hidden cursor-pointer"
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                rotateX: 5,
              }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Liquid Background */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-80`}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                }}
                transition={{ duration: 0.6 }}
              />

              {/* Morphing Overlay */}
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${project.color}40, transparent)`,
                }}
                animate={{
                  background: [`radial-gradient(circle at 20% 80%, ${project.color}40, transparent)`, `radial-gradient(circle at 80% 20%, ${project.color}40, transparent)`, `radial-gradient(circle at 20% 80%, ${project.color}40, transparent)`],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div>
                  <motion.div className="text-white/80 text-sm font-medium mb-2" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 + 0.3 }}>
                    {project.category}
                  </motion.div>

                  <motion.h3 className="text-3xl font-bold text-white mb-4" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 + 0.4 }}>
                    {project.title}
                  </motion.h3>

                  <motion.p className="text-white/90 leading-relaxed" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 + 0.5 }}>
                    {project.description}
                  </motion.p>
                </div>

                <motion.div className="flex items-center text-white group-hover:translate-x-2 transition-transform" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.2 + 0.6 }}>
                  <span className="mr-2">Explore Project</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    →
                  </motion.span>
                </motion.div>
              </div>

              {/* Hover Glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${project.color}30, transparent)`,
                  filter: 'blur(20px)',
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Experimental Contact Section
const ExperimentalContact = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <section className="py-32 px-6 bg-black relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${seededRandom(i * 123) * 100}%`,
              top: `${seededRandom(i * 456) * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + seededRandom(i * 789) * 2,
              repeat: Infinity,
              delay: seededRandom(i * 987) * 3,
            }}
          />
        ))}
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.h2 className="text-6xl md:text-8xl font-black text-white mb-12" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          LET'S CREATE
        </motion.h2>

        <motion.p className="text-xl text-gray-300 mb-16 max-w-2xl mx-auto" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }} viewport={{ once: true }}>
          Ready to build something extraordinary? Let's push the boundaries of what's possible.
        </motion.p>

        <motion.div className="magnetic relative inline-block" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)} whileHover={{ scale: 1.05 }}>
          <motion.button className="relative px-12 py-6 bg-transparent border-2 border-white text-white font-bold text-xl rounded-full overflow-hidden" whileTap={{ scale: 0.95 }}>
            <motion.div className="absolute inset-0 bg-white" initial={{ scale: 0 }} animate={{ scale: isHovered ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ borderRadius: '50px' }} />
            <span className={`relative z-10 transition-colors ${isHovered ? 'text-black' : 'text-white'}`}>Start a Project</span>
          </motion.button>

          {/* Magnetic Field Effect */}
          {isHovered && <motion.div className="absolute inset-0 border-2 border-white/30 rounded-full" initial={{ scale: 1, opacity: 1 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1, repeat: Infinity }} />}
        </motion.div>
      </div>
    </section>
  )
}

// Main Design-3 Component
export default function Design3() {
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
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Loading Design-3...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <MagneticCursor />
      <FloatingNav />
      <KineticHero />
      <LiquidCards />
      <ExperimentalContact />
    </div>
  )
}
