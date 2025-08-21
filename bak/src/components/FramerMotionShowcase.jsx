'use client'

import { AnimatePresence, motion, useAnimation, useDragControls, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Seeded random function for consistent server/client rendering
const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Advanced scroll-triggered parallax hero
const ParallaxHero = () => {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Multiple parallax layers with different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -600])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-black">
      {/* Background layers with different parallax speeds */}
      <motion.div style={{ y: y3 }} className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20" />

      <motion.div style={{ y: y2 }} className="absolute inset-0">
        {/* Floating geometric shapes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${seededRandom(i * 123) * 100}%`,
              top: `${seededRandom(i * 456) * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + seededRandom(i * 789) * 2,
              repeat: Infinity,
              delay: seededRandom(i * 987) * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* Main content */}
      <motion.div style={{ y: y1, opacity, scale }} className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <motion.h1
            className="text-8xl md:text-9xl font-black mb-8"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ backgroundSize: '200% 200%' }}
            >
              MOTION
            </motion.span>
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            Exploring the boundaries of web animation and interaction design
          </motion.p>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 transform -translate-x-1/2" style={{ opacity }} animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div className="w-1 h-3 bg-white/60 rounded-full mt-2" animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  )
}

// Magnetic button with advanced hover effects
const MagneticButton = ({ children, className = '' }) => {
  const ref = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * 0.3
    const deltaY = (e.clientY - centerY) * 0.3
    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <motion.button ref={ref} className={`relative overflow-hidden ${className}`} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave} animate={{ x: position.x, y: position.y }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} whileTap={{ scale: 0.95 }}>
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 0.8 : 0,
          scale: isHovered ? 1.1 : 0.8,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Button content */}
      <motion.div
        className="relative z-10 px-8 py-4 bg-black border border-white/20 rounded-lg text-white font-medium"
        animate={{
          borderColor: isHovered ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
          backgroundColor: isHovered ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,1)',
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </motion.button>
  )
}

// Fluid morphing cards
const MorphingCard = ({ title, description, index }) => {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={ref}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 100, rotateX: -15 }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
              rotateX: 0,
            }
          : {
              opacity: 0,
              y: 100,
              rotateX: -15,
            }
      }
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      style={{ perspective: '1000px' }}
    >
      {/* Card container with morphing effect */}
      <motion.div
        className="relative h-80 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-2xl overflow-hidden"
        animate={{
          rotateY: isHovered ? 5 : 0,
          rotateX: isHovered ? 5 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10"
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1.2 : 1,
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Floating particles inside card */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${20 + seededRandom(i * 321) * 60}%`,
              top: `${20 + seededRandom(i * 654) * 60}%`,
            }}
            animate={{
              y: isHovered ? [0, -20, 0] : [0, -10, 0],
              opacity: isHovered ? [0.2, 0.8, 0.2] : [0.1, 0.3, 0.1],
              scale: isHovered ? [1, 1.5, 1] : [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + seededRandom(i * 111),
              repeat: Infinity,
              delay: seededRandom(i * 222) * 2,
            }}
          />
        ))}

        {/* Card content */}
        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
          <div>
            <motion.h3
              className="text-2xl font-bold text-white mb-4"
              animate={{
                y: isHovered ? -5 : 0,
                color: isHovered ? '#ffffff' : '#e5e7eb',
              }}
              transition={{ duration: 0.3 }}
            >
              {title}
            </motion.h3>

            <motion.p
              className="text-gray-300 leading-relaxed"
              animate={{
                y: isHovered ? -5 : 0,
                opacity: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {description}
            </motion.p>
          </div>

          {/* Animated arrow */}
          <motion.div
            className="flex items-center text-white/60"
            animate={{
              x: isHovered ? 10 : 0,
              opacity: isHovered ? 1 : 0.6,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="mr-2">Explore</span>
            <motion.span animate={{ x: isHovered ? [0, 5, 0] : 0 }} transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}>
              →
            </motion.span>
          </motion.div>
        </div>

        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8,
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>
    </motion.div>
  )
}

// Velocity-based scroll animations
const VelocitySection = () => {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  })

  // Transform velocity to rotation and scale
  const rotate = useTransform(smoothVelocity, [-1000, 1000], [-50, 50])
  const scale = useTransform(smoothVelocity, [-1000, 0, 1000], [0.8, 1, 0.8])

  return (
    <section className="py-32 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2 className="text-6xl font-black mb-16 text-white" style={{ rotate, scale }}>
          VELOCITY DRIVEN
        </motion.h2>

        <motion.p
          className="text-xl text-gray-300 max-w-3xl mx-auto"
          style={{
            y: useTransform(smoothVelocity, [-1000, 1000], [50, -50]),
            opacity: useTransform(smoothVelocity, [-1000, 0, 1000], [0.5, 1, 0.5]),
          }}
        >
          This text responds to your scroll velocity. Scroll fast to see the magic happen! The faster you scroll, the more dramatic the animation becomes.
        </motion.p>
      </div>
    </section>
  )
}

// Advanced stagger animations
const StaggerShowcase = () => {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true })

  const items = ['Advanced', 'Stagger', 'Animations', 'Create', 'Stunning', 'Visual', 'Flow']

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: {
      opacity: 0,
      y: 100,
      rotateX: -90,
      scale: 0.5,
    },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div ref={containerRef} variants={container} initial="hidden" animate={isInView ? 'show' : 'hidden'} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((text, index) => (
            <motion.div
              key={index}
              variants={item}
              className="h-40 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-white/10 rounded-2xl flex items-center justify-center"
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
              }}
              style={{ perspective: '1000px' }}
            >
              <span className="text-2xl font-bold text-white">{text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Main showcase component
export const FramerMotionShowcase = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const cards = [
    {
      title: 'Parallax Mastery',
      description: 'Multi-layered parallax effects that create depth and immersion. Each layer moves at different speeds creating a stunning 3D effect.',
    },
    {
      title: 'Magnetic Interactions',
      description: 'Buttons and elements that respond to mouse movement with magnetic attraction, creating intuitive and delightful user experiences.',
    },
    {
      title: 'Morphing Animations',
      description: 'Fluid transformations that seamlessly blend between states, creating organic and natural feeling animations.',
    },
    {
      title: 'Velocity Physics',
      description: 'Animations that respond to user scroll velocity, creating dynamic and responsive motion that feels alive.',
    },
    {
      title: 'Advanced Staggers',
      description: "Choreographed sequences that create visual rhythm and flow, guiding the user's attention through the interface.",
    },
    {
      title: '3D Transforms',
      description: 'Perspective-based animations that add depth and dimension to flat interfaces, creating immersive experiences.',
    },
  ]

  if (!isMounted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen">
      <ParallaxHero />

      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center mb-20">
          <motion.h2 className="text-6xl font-black mb-8 text-white" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            FRAMER MOTION MASTERY
          </motion.h2>

          <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
            Pushing the boundaries of web animation with advanced Framer Motion techniques
          </motion.p>

          <MagneticButton className="mb-16">Experience the Magic</MagneticButton>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {cards.map((card, index) => (
            <MorphingCard key={index} title={card.title} description={card.description} index={index} />
          ))}
        </div>
      </section>

      <VelocitySection />
      <StaggerShowcase />

      <section className="py-32 px-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }} viewport={{ once: true }}>
          <h3 className="text-4xl font-bold text-white mb-8">Ready to Create Something Amazing?</h3>
          <MagneticButton>Let's Build Together</MagneticButton>
        </motion.div>
      </section>
    </div>
  )
}
