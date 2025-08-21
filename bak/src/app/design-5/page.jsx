'use client'

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'

// Advanced Liquid Cursor with Gravity Physics
const LiquidGravityCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState([])
  const [isAttracting, setIsAttracting] = useState(false)

  // Smooth cursor movement
  const cursorX = useSpring(0, { stiffness: 400, damping: 25 })
  const cursorY = useSpring(0, { stiffness: 400, damping: 25 })

  // Generate liquid mercury particles
  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.8 + 0.2,
    }))
    setParticles(newParticles)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e) => {
      const newPos = { x: e.clientX, y: e.clientY }
      setMousePosition(newPos)
      cursorX.set(e.clientX - 12)
      cursorY.set(e.clientY - 12)

      // Check for liquid-interactive elements
      const element = document.elementFromPoint(e.clientX, e.clientY)
      setIsAttracting(element && element.classList.contains('liquid-interactive'))
    }

    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          let { x, y, vx, vy } = particle

          // Gravity towards cursor when attracting
          if (isAttracting) {
            const dx = mousePosition.x - x
            const dy = mousePosition.y - y
            const distance = Math.sqrt(dx * dx + dy * dy)
            const force = Math.min(200 / (distance + 1), 2)

            vx += (dx / distance) * force * 0.1
            vy += (dy / distance) * force * 0.1
          }

          // Apply velocity with damping
          vx *= 0.98
          vy *= 0.98
          x += vx
          y += vy

          // Bounce off edges
          if (x < 0 || x > window.innerWidth) vx *= -0.8
          if (y < 0 || y > window.innerHeight) vy *= -0.8

          // Keep in bounds
          x = Math.max(0, Math.min(window.innerWidth, x))
          y = Math.max(0, Math.min(window.innerHeight, y))

          return { ...particle, x, y, vx, vy }
        })
      )
    }

    window.addEventListener('mousemove', handleMouseMove)
    const interval = setInterval(animateParticles, 16) // 60fps

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(interval)
    }
  }, [mousePosition, isAttracting, cursorX, cursorY])

  return (
    <>
      {/* Liquid Mercury Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="fixed pointer-events-none z-40 rounded-full"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            background: 'linear-gradient(135deg, #c0c0c0, #808080)',
            opacity: particle.opacity,
            filter: 'blur(1px)',
            boxShadow: '0 0 10px rgba(192, 192, 192, 0.5)',
          }}
        />
      ))}

      {/* Main Liquid Cursor */}
      <motion.div
        className="fixed pointer-events-none z-50 rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          width: 24,
          height: 24,
          background: 'radial-gradient(circle, #ffffff, #c0c0c0)',
          filter: 'blur(0.5px)',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
        }}
        animate={{
          scale: isAttracting ? 2 : 1,
          filter: isAttracting ? 'blur(2px)' : 'blur(0.5px)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />

      {/* Attraction Field */}
      {isAttracting && (
        <motion.div
          className="fixed pointer-events-none z-45 rounded-full border-2 border-white/30"
          style={{
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            width: 200,
            height: 200,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          exit={{ scale: 0, opacity: 0 }}
        />
      )}
    </>
  )
}

// Morphing Glass Navigation
const MorphingGlassNav = () => {
  const [activeItem, setActiveItem] = useState('home')
  const [navShape, setNavShape] = useState('rounded')

  const navItems = [
    { id: 'home', label: 'Home', icon: '◉' },
    { id: 'about', label: 'About', icon: '◎' },
    { id: 'work', label: 'Work', icon: '◈' },
    { id: 'contact', label: 'Contact', icon: '◇' },
  ]

  const morphShapes = {
    rounded: '50px',
    sharp: '8px',
    organic: '50% 20% / 10% 40%',
    liquid: '60% 40% 30% 70% / 60% 30% 70% 40%',
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const shapes = Object.keys(morphShapes)
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)]
      setNavShape(randomShape)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.nav className="liquid-interactive fixed top-8 left-1/2 transform -translate-x-1/2 z-40" initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
      <motion.div
        className="flex items-center space-x-2 px-4 py-3 backdrop-blur-xl border border-white/20"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        }}
        animate={{
          borderRadius: morphShapes[navShape],
        }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      >
        {navItems.map((item) => (
          <motion.button key={item.id} className={`liquid-interactive relative px-4 py-2 text-sm font-medium transition-colors ${activeItem === item.id ? 'text-black' : 'text-white hover:text-gray-300'}`} onClick={() => setActiveItem(item.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {activeItem === item.id && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                }}
                layoutId="activeNavGlass"
                animate={{
                  borderRadius: morphShapes[navShape],
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}
            <span className="relative flex items-center space-x-2">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </span>
          </motion.button>
        ))}
      </motion.div>
    </motion.nav>
  )
}

// Flowing Liquid Background
const FlowingLiquidBackground = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Flowing Gradient Layers */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [`radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`, `radial-gradient(circle at ${mousePos.x + 20}% ${mousePos.y + 20}%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`, `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.3) 0%, transparent 50%)`],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <motion.div
        className="absolute inset-0"
        animate={{
          background: [`radial-gradient(ellipse at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(16, 185, 129, 0.2) 0%, transparent 60%)`, `radial-gradient(ellipse at ${80 - mousePos.x}% ${80 - mousePos.y}%, rgba(6, 182, 212, 0.2) 0%, transparent 60%)`, `radial-gradient(ellipse at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(16, 185, 129, 0.2) 0%, transparent 60%)`],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      {/* Liquid Blob Shapes */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20"
          style={{
            width: 200 + i * 50,
            height: 200 + i * 50,
            background: `linear-gradient(135deg, 
              rgba(139, 92, 246, 0.3), 
              rgba(59, 130, 246, 0.2), 
              rgba(16, 185, 129, 0.1))`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [Math.sin(i * 0.5) * 200, Math.sin(i * 0.5 + Math.PI) * 200, Math.sin(i * 0.5) * 200],
            y: [Math.cos(i * 0.3) * 150, Math.cos(i * 0.3 + Math.PI) * 150, Math.cos(i * 0.3) * 150],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// Glass Morphing Hero
const GlassMorphingHero = () => {
  const [textMorph, setTextMorph] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTextMorph((prev) => (prev + 1) % 4)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const morphStates = [
    { scale: 1, skew: 0, rotate: 0 },
    { scale: 1.1, skew: 5, rotate: 2 },
    { scale: 0.9, skew: -3, rotate: -1 },
    { scale: 1.05, skew: 2, rotate: 1 },
  ]

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <FlowingLiquidBackground />

      <div className="text-center z-10 max-w-6xl mx-auto px-6">
        {/* Morphing Glass Title */}
        <motion.div className="liquid-interactive relative mb-8" animate={morphStates[textMorph]} transition={{ duration: 2, ease: 'easeInOut' }}>
          <motion.h1
            className="text-8xl md:text-9xl font-black text-white relative"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))',
              textShadow: '0 0 40px rgba(255, 255, 255, 0.3)',
            }}
          >
            LIQUID
          </motion.h1>

          {/* Glass Overlay Effect */}
          <motion.div
            className="absolute inset-0 text-8xl md:text-9xl font-black"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              backdropFilter: 'blur(2px)',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            LIQUID
          </motion.div>
        </motion.div>

        {/* Flowing Subtitle */}
        <motion.div
          className="text-2xl md:text-3xl font-light text-white/80 mb-12"
          animate={{
            y: [0, -5, 0],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <motion.span
            className="inline-block"
            animate={{
              color: ['rgba(255, 255, 255, 0.8)', 'rgba(139, 92, 246, 0.9)', 'rgba(59, 130, 246, 0.9)', 'rgba(16, 185, 129, 0.9)', 'rgba(255, 255, 255, 0.8)'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            Glass Morphism Experience
          </motion.span>
        </motion.div>

        {/* Liquid CTA Button */}
        <motion.button
          className="liquid-interactive group relative px-12 py-6 overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Liquid Fill Effect */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8), rgba(59, 130, 246, 0.8))',
              borderRadius: '50px',
            }}
            initial={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          />

          <span className="relative z-10 text-white font-medium text-lg group-hover:text-white">Dive Into Liquid</span>

          {/* Ripple Effect */}
          <motion.div
            className="absolute inset-0 border-2 border-white/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      </div>
    </section>
  )
}

// Liquid Glass Cards
const LiquidGlassCards = () => {
  const projects = [
    {
      title: 'Fluid Interface',
      description: 'Organic user interface that adapts like liquid',
      color: 'rgba(139, 92, 246, 0.3)',
      gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(168, 85, 247, 0.1))',
    },
    {
      title: 'Morphing Dashboard',
      description: 'Data visualization that flows and transforms',
      color: 'rgba(59, 130, 246, 0.3)',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.1))',
    },
    {
      title: 'Liquid Navigation',
      description: 'Menu system that behaves like mercury',
      color: 'rgba(16, 185, 129, 0.3)',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.1))',
    },
    {
      title: 'Glass Ecosystem',
      description: 'Interactive environment with glass physics',
      color: 'rgba(245, 158, 11, 0.3)',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))',
    },
  ]

  return (
    <section className="py-32 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <motion.h2 className="text-6xl md:text-8xl font-black text-white text-center mb-20" initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
          LIQUID PROJECTS
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="liquid-interactive group relative h-80 overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '30px',
              }}
              initial={{ opacity: 0, y: 100, rotateX: -15 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{
                scale: 1.02,
                rotateY: 5,
                rotateX: 5,
              }}
              viewport={{ once: true }}
            >
              {/* Liquid Background Flow */}
              <motion.div
                className="absolute inset-0"
                style={{ background: project.gradient }}
                animate={{
                  background: [project.gradient, project.gradient.replace('135deg', '225deg'), project.gradient.replace('135deg', '315deg'), project.gradient],
                }}
                transition={{ duration: 8, repeat: Infinity }}
              />

              {/* Morphing Blob Overlay */}
              <motion.div
                className="absolute inset-0 opacity-50"
                style={{
                  background: `radial-gradient(ellipse at 50% 50%, ${project.color}, transparent)`,
                }}
                animate={{
                  background: [`radial-gradient(ellipse at 30% 70%, ${project.color}, transparent)`, `radial-gradient(ellipse at 70% 30%, ${project.color}, transparent)`, `radial-gradient(ellipse at 30% 70%, ${project.color}, transparent)`],
                }}
                transition={{ duration: 6, repeat: Infinity }}
              />

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div>
                  <motion.h3 className="text-3xl font-bold text-white mb-4" whileHover={{ scale: 1.05 }}>
                    {project.title}
                  </motion.h3>

                  <motion.p className="text-white/90 leading-relaxed" whileHover={{ x: 5 }}>
                    {project.description}
                  </motion.p>
                </div>

                <motion.div className="flex items-center text-white group-hover:translate-x-2 transition-transform" whileHover={{ x: 10 }}>
                  <span className="mr-2">Experience Flow</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    →
                  </motion.span>
                </motion.div>
              </div>

              {/* Glass Reflection */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
                  borderRadius: '30px',
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

// Main Design-5 Component
export default function Design5() {
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
          Flowing into liquid...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen overflow-x-hidden">
      <LiquidGravityCursor />
      <MorphingGlassNav />
      <GlassMorphingHero />
      <LiquidGlassCards />
    </div>
  )
}
