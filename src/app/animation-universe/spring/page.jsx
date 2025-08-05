'use client'

import { animated, config, useChain, useSpring, useSpringRef, useTrail } from '@react-spring/web'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRef, useState } from 'react'

// Liquid Morphing Card
const LiquidCard = ({ title, description, color, delay = 0 }) => {
  const [hovered, setHovered] = useState(false)

  const cardSpring = useSpring({
    transform: hovered ? 'perspective(1000px) rotateY(15deg) rotateX(5deg) scale(1.1)' : 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)',
    background: hovered ? `linear-gradient(135deg, ${color}60, ${color}30, ${color}60)` : `linear-gradient(135deg, ${color}30, ${color}15, ${color}30)`,
    borderRadius: hovered ? '30px' : '20px',
    boxShadow: hovered ? `0 30px 80px ${color}40, 0 0 50px ${color}30` : `0 10px 30px ${color}20`,
    config: config.wobbly,
    delay: delay * 100,
  })

  const contentSpring = useSpring({
    transform: hovered ? 'translateY(-10px)' : 'translateY(0px)',
    opacity: hovered ? 1 : 0.9,
    config: config.gentle,
  })

  return (
    <animated.div style={cardSpring} className="p-8 border border-white/20 backdrop-blur-sm cursor-pointer relative overflow-hidden" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {/* Liquid background effect */}
      <animated.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${hovered ? '60%' : '40%'} ${hovered ? '40%' : '60%'}, ${color}, transparent)`,
          transform: hovered ? 'scale(1.5)' : 'scale(1)',
          transition: 'all 0.6s ease-out',
        }}
      />

      <animated.div style={contentSpring} className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-300 leading-relaxed">{description}</p>
      </animated.div>
    </animated.div>
  )
}

// Physics-based Draggable Elements
const PhysicsBox = ({ color, children }) => {
  const [{ x, y, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    scale: 1,
    config: config.wobbly,
  }))

  const [isDragging, setIsDragging] = useState(false)

  const bind = {
    onMouseDown: () => {
      setIsDragging(true)
      api.start({ scale: 1.1 })
    },
    onMouseUp: () => {
      setIsDragging(false)
      api.start({ scale: 1, x: 0, y: 0 })
    },
    onMouseMove: (e) => {
      if (isDragging) {
        const rect = e.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        api.start({
          x: (e.clientX - centerX) * 0.5,
          y: (e.clientY - centerY) * 0.5,
        })
      }
    },
  }

  return (
    <animated.div
      {...bind}
      style={{
        x,
        y,
        scale,
        background: `linear-gradient(135deg, ${color}, ${color}80)`,
      }}
      className="w-24 h-24 rounded-2xl cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-bold text-lg shadow-lg"
    >
      {children}
    </animated.div>
  )
}

// Staggered Animation Grid
const StaggerGrid = () => {
  const [toggle, setToggle] = useState(false)

  const items = Array.from({ length: 12 }, (_, i) => `Item ${i + 1}`)

  const trail = useTrail(items.length, {
    from: {
      opacity: 0,
      transform: toggle ? 'scale(0) rotate(180deg)' : 'scale(1) rotate(0deg)',
      background: toggle ? '#ef4444' : '#8b5cf6',
    },
    to: {
      opacity: 1,
      transform: toggle ? 'scale(1) rotate(0deg)' : 'scale(0) rotate(180deg)',
      background: toggle ? '#8b5cf6' : '#ef4444',
    },
    config: config.gentle,
  })

  return (
    <div className="text-center">
      <button onClick={() => setToggle(!toggle)} className="mb-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:scale-105 transition-transform">
        Toggle Animation
      </button>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {trail.map((style, index) => (
          <animated.div key={index} style={style} className="h-20 rounded-xl flex items-center justify-center text-white font-bold">
            {items[index]}
          </animated.div>
        ))}
      </div>
    </div>
  )
}

// Chained Animations
const ChainedAnimations = () => {
  const [open, setOpen] = useState(false)

  // Create refs for chaining
  const springRef = useSpringRef()
  const trailRef = useSpringRef()

  // Main container animation
  const containerSpring = useSpring({
    ref: springRef,
    from: { scale: 0, rotate: 0 },
    to: {
      scale: open ? 1 : 0,
      rotate: open ? 360 : 0,
    },
    config: config.wobbly,
  })

  // Items trail animation
  const items = ['🚀', '✨', '🎨', '🔥', '💫', '🌟']
  const trail = useTrail(items.length, {
    ref: trailRef,
    from: { opacity: 0, transform: 'scale(0)' },
    to: {
      opacity: open ? 1 : 0,
      transform: open ? 'scale(1)' : 'scale(0)',
    },
    config: config.gentle,
  })

  // Chain the animations
  useChain(open ? [springRef, trailRef] : [trailRef, springRef], [0, 0.2])

  return (
    <div className="text-center">
      <button onClick={() => setOpen(!open)} className="mb-8 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white font-bold hover:scale-105 transition-transform">
        {open ? 'Close' : 'Open'} Chain
      </button>

      <animated.div style={containerSpring} className="relative w-64 h-64 mx-auto bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-full border border-white/20 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-4">
          {trail.map((style, index) => (
            <animated.div key={index} style={style} className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-2xl">
              {items[index]}
            </animated.div>
          ))}
        </div>
      </animated.div>
    </div>
  )
}

export default function SpringShowcase() {
  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <Link href="/animation-universe" className="text-blue-400 hover:text-blue-300">
          ← Back to Animation Universe
        </Link>
      </div>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <motion.h1 className="text-6xl md:text-8xl font-black mb-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">React Spring</span>
        </motion.h1>

        <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          Physics-based animations that feel natural and fluid. Experience spring mechanics, wobbly effects, and smooth transitions that respond to user interactions.
        </motion.p>
      </section>

      {/* Liquid Morphing Cards */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Liquid Morphing Cards</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <LiquidCard title="Wobbly Physics" description="Cards that bounce and wobble with spring physics, creating natural feeling interactions." color="#10b981" delay={0} />
          <LiquidCard title="Smooth Transforms" description="3D rotations and scaling that respond to hover with fluid motion." color="#8b5cf6" delay={1} />
          <LiquidCard title="Dynamic Colors" description="Background gradients that shift and morph based on interaction state." color="#06b6d4" delay={2} />
        </div>
      </section>

      {/* Physics Playground */}
      <section className="py-20 px-6 bg-gray-900/30">
        <h2 className="text-4xl font-bold text-center mb-16">Physics Playground</h2>
        <p className="text-center text-gray-300 mb-12">Click and drag these elements to feel the spring physics!</p>

        <div className="flex flex-wrap justify-center items-center gap-8 max-w-4xl mx-auto">
          <PhysicsBox color="#ef4444">🚀</PhysicsBox>
          <PhysicsBox color="#f59e0b">⚡</PhysicsBox>
          <PhysicsBox color="#10b981">🌟</PhysicsBox>
          <PhysicsBox color="#8b5cf6">🎨</PhysicsBox>
          <PhysicsBox color="#06b6d4">💫</PhysicsBox>
        </div>
      </section>

      {/* Staggered Animations */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Staggered Trail Animations</h2>
        <StaggerGrid />
      </section>

      {/* Chained Animations */}
      <section className="py-20 px-6 bg-gray-900/30">
        <h2 className="text-4xl font-bold text-center mb-16">Chained Animations</h2>
        <p className="text-center text-gray-300 mb-12">Orchestrated sequences with perfect timing</p>
        <ChainedAnimations />
      </section>

      {/* Footer */}
      <section className="py-20 px-6 text-center">
        <h3 className="text-3xl font-bold mb-8">Ready for More?</h3>
        <Link href="/animation-universe/three" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-bold hover:scale-105 transition-transform">
          Explore 3D Animations →
        </Link>
      </section>
    </div>
  )
}
