'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Since we don't have actual Lottie files, I'll create CSS-based animations that mimic Lottie effects
// In a real project, you'd use: import Lottie from 'lottie-react'

// Loading Animation Component (mimics Lottie)
const LoadingAnimation = ({ isPlaying = true, size = 80 }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 border-4 border-purple-500 rounded-full"
        animate={
          isPlaying
            ? {
                rotate: [0, 360],
                scale: [1, 1.2, 1],
                borderColor: ['#8b5cf6', '#06b6d4', '#10b981', '#8b5cf6'],
              }
            : {}
        }
        transition={{
          duration: 2,
          repeat: isPlaying ? Infinity : 0,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute inset-2 border-2 border-blue-400 rounded-full"
        animate={
          isPlaying
            ? {
                rotate: [360, 0],
                scale: [1, 0.8, 1],
              }
            : {}
        }
        transition={{
          duration: 1.5,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
        animate={
          isPlaying
            ? {
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 1, 0.3],
              }
            : {}
        }
        transition={{
          duration: 1,
          repeat: isPlaying ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

// Success Animation (mimics Lottie checkmark)
const SuccessAnimation = ({ isPlaying = false, size = 100 }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 bg-green-500 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isPlaying
            ? {
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1],
              }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" initial={{ opacity: 0 }} animate={isPlaying ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
        <motion.path d="M25 50 L45 65 L75 35" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={isPlaying ? { pathLength: 1 } : { pathLength: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }} />
      </motion.svg>
    </div>
  )
}

// Error Animation (mimics Lottie error)
const ErrorAnimation = ({ isPlaying = false, size = 100 }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 bg-red-500 rounded-full"
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isPlaying
            ? {
                scale: [0, 1.2, 1],
                opacity: [0, 1, 1],
              }
            : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
      <motion.svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" initial={{ opacity: 0 }} animate={isPlaying ? { opacity: 1 } : { opacity: 0 }} transition={{ delay: 0.3, duration: 0.3 }}>
        <motion.path d="M30 30 L70 70 M70 30 L30 70" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" initial={{ pathLength: 0 }} animate={isPlaying ? { pathLength: 1 } : { pathLength: 0 }} transition={{ delay: 0.4, duration: 0.6, ease: 'easeOut' }} />
      </motion.svg>
    </div>
  )
}

// Heart Animation (mimics Lottie like button)
const HeartAnimation = ({ isLiked = false, size = 60 }) => {
  return (
    <motion.div className="relative cursor-pointer" style={{ width: size, height: size }} whileTap={{ scale: 0.8 }}>
      <motion.svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        animate={
          isLiked
            ? {
                scale: [1, 1.3, 1],
                rotate: [0, 10, -10, 0],
              }
            : {}
        }
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <motion.path
          d="M50 85 C50 85, 20 60, 20 40 C20 25, 35 25, 50 40 C65 25, 80 25, 80 40 C80 60, 50 85, 50 85 Z"
          fill={isLiked ? '#ef4444' : '#6b7280'}
          stroke={isLiked ? '#dc2626' : '#4b5563'}
          strokeWidth="2"
          animate={
            isLiked
              ? {
                  fill: ['#ef4444', '#f87171', '#ef4444'],
                }
              : {}
          }
          transition={{ duration: 0.8, repeat: isLiked ? 2 : 0 }}
        />
      </motion.svg>

      {/* Particle burst effect */}
      <AnimatePresence>
        {isLiked && (
          <>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-red-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i / 8) * Math.PI * 2) * 40,
                  y: Math.sin((i / 8) * Math.PI * 2) * 40,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Morphing Icon Animation
const MorphingIcon = ({ currentIcon = 'play', size = 80 }) => {
  const icons = {
    play: 'M30 25 L30 75 L70 50 Z',
    pause: 'M35 25 L45 25 L45 75 L35 75 Z M55 25 L65 25 L65 75 L55 75 Z',
    stop: 'M25 25 L75 25 L75 75 L25 75 Z',
  }

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} />
      <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 100 100">
        <motion.path d={icons[currentIcon]} fill="white" animate={{ d: icons[currentIcon] }} transition={{ duration: 0.5, ease: 'easeInOut' }} />
      </svg>
    </div>
  )
}

// Interactive Button with Lottie-style Animation
const AnimatedButton = ({ children, variant = 'primary', onClick, disabled = false }) => {
  const [isPressed, setIsPressed] = useState(false)
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    if (disabled) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newRipple = {
      id: Date.now(),
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])
    setIsPressed(true)

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
      setIsPressed(false)
    }, 600)

    onClick && onClick(e)
  }

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-blue-600',
    success: 'bg-gradient-to-r from-green-600 to-emerald-600',
    error: 'bg-gradient-to-r from-red-600 to-pink-600',
  }

  return (
    <motion.button
      className={`relative px-8 py-4 rounded-xl font-bold text-white overflow-hidden ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      animate={
        isPressed
          ? {
              boxShadow: ['0 0 0 0 rgba(139, 92, 246, 0.7)', '0 0 0 20px rgba(139, 92, 246, 0)'],
            }
          : {}
      }
      transition={{ duration: 0.6 }}
      onClick={handleClick}
      disabled={disabled}
    >
      {/* Ripple effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            className="absolute bg-white/30 rounded-full"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>

      {children}
    </motion.button>
  )
}

// Interactive Demo Section
const InteractiveDemo = () => {
  const [currentState, setCurrentState] = useState('idle') // idle, loading, success, error
  const [isLiked, setIsLiked] = useState(false)
  const [currentIcon, setCurrentIcon] = useState('play')

  const handleButtonClick = (newState) => {
    setCurrentState('loading')

    setTimeout(() => {
      setCurrentState(newState)
      setTimeout(() => {
        setCurrentState('idle')
      }, 3000)
    }, 2000)
  }

  const cycleIcon = () => {
    const icons = ['play', 'pause', 'stop']
    const currentIndex = icons.indexOf(currentIcon)
    const nextIndex = (currentIndex + 1) % icons.length
    setCurrentIcon(icons[nextIndex])
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
      {/* Loading States */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Loading States</h3>
        <div className="flex justify-center mb-6">
          <LoadingAnimation isPlaying={currentState === 'loading'} size={120} />
        </div>
        <div className="space-y-3">
          <AnimatedButton onClick={() => handleButtonClick('success')} disabled={currentState === 'loading'}>
            Test Success
          </AnimatedButton>
          <AnimatedButton variant="error" onClick={() => handleButtonClick('error')} disabled={currentState === 'loading'}>
            Test Error
          </AnimatedButton>
        </div>
      </div>

      {/* Success/Error States */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Feedback Animations</h3>
        <div className="flex justify-center space-x-6 mb-6">
          <SuccessAnimation isPlaying={currentState === 'success'} />
          <ErrorAnimation isPlaying={currentState === 'error'} />
        </div>
        <p className="text-gray-300 text-sm">
          {currentState === 'loading' && 'Processing...'}
          {currentState === 'success' && 'Success! ✨'}
          {currentState === 'error' && 'Something went wrong 😞'}
          {currentState === 'idle' && 'Click buttons above to test'}
        </p>
      </div>

      {/* Interactive Elements */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-6">Interactive Icons</h3>
        <div className="flex justify-center space-x-8 mb-6">
          <div onClick={() => setIsLiked(!isLiked)}>
            <HeartAnimation isLiked={isLiked} />
          </div>
          <div onClick={cycleIcon}>
            <MorphingIcon currentIcon={currentIcon} />
          </div>
        </div>
        <p className="text-gray-300 text-sm">Click the heart to like • Click the button to cycle icons</p>
      </div>
    </div>
  )
}

// Micro-interaction Showcase
const MicroInteractions = () => {
  const [hoveredCard, setHoveredCard] = useState(null)

  const cards = [
    { id: 1, title: 'Hover Effects', description: 'Smooth transitions on interaction' },
    { id: 2, title: 'Click Feedback', description: 'Immediate visual response' },
    { id: 3, title: 'Loading States', description: 'Keep users informed' },
    { id: 4, title: 'Success Feedback', description: 'Celebrate completed actions' },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <motion.div key={card.id} className="relative p-8 bg-white/5 rounded-2xl border border-white/10 cursor-pointer overflow-hidden" onHoverStart={() => setHoveredCard(card.id)} onHoverEnd={() => setHoveredCard(null)} whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: hoveredCard === card.id ? 1 : 0,
              scale: hoveredCard === card.id ? 1 : 0.8,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Content */}
          <div className="relative z-10">
            <motion.h4
              className="text-xl font-bold text-white mb-3"
              animate={{
                x: hoveredCard === card.id ? 10 : 0,
                color: hoveredCard === card.id ? '#ffffff' : '#e5e7eb',
              }}
              transition={{ duration: 0.3 }}
            >
              {card.title}
            </motion.h4>
            <motion.p
              className="text-gray-300"
              animate={{
                x: hoveredCard === card.id ? 10 : 0,
                opacity: hoveredCard === card.id ? 1 : 0.8,
              }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {card.description}
            </motion.p>
          </div>

          {/* Hover indicator */}
          <motion.div
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            animate={{
              x: hoveredCard === card.id ? 0 : 20,
              opacity: hoveredCard === card.id ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-white text-2xl">→</span>
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}

export default function LottieShowcase() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <LoadingAnimation isPlaying={true} size={100} />
      </div>
    )
  }

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
          <span className="bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Lottie React</span>
        </motion.h1>

        <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          Bring After Effects animations to React with smooth vector graphics, interactive micro-animations, and delightful user feedback systems.
        </motion.p>
      </section>

      {/* Interactive Demo */}
      <section className="py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Interactive Animations</h2>
        <div className="max-w-6xl mx-auto">
          <InteractiveDemo />
        </div>
      </section>

      {/* Micro-interactions */}
      <section className="py-20 px-6 bg-gray-900/30">
        <h2 className="text-4xl font-bold text-center mb-16">Micro-Interactions</h2>
        <div className="max-w-4xl mx-auto">
          <MicroInteractions />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why Lottie?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Vector Perfect</h3>
              <p className="text-gray-300">Scalable vector animations that look crisp on any screen size. No pixelation, just smooth graphics.</p>
            </motion.div>

            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-pink-400">Interactive</h3>
              <p className="text-gray-300">Control playback, respond to user interactions, and create dynamic animations that engage users.</p>
            </motion.div>

            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Lightweight</h3>
              <p className="text-gray-300">Small file sizes compared to video or GIFs. Perfect for web performance and mobile experiences.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-20 px-6 text-center bg-gray-900/50">
        <h3 className="text-3xl font-bold mb-8">Explore More Libraries</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/animation-universe/three" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors">
            ← React Three Fiber
          </Link>
          <Link href="/animation-universe/gestures" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-medium transition-colors">
            Gesture Controls →
          </Link>
        </div>
      </section>
    </div>
  )
}
