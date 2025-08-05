'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useAnimations } from '@/hooks/useAnimations'

/**
 * Fireworks particle effect for New Year theme
 */
export const FireworksParticles = ({ count = 20, colors = ['#fbbf24', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6'], size = { min: 3, max: 8 }, className = '' }) => {
  const [fireworks, setFireworks] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const createFirework = () => {
      const id = Date.now() + Math.random()
      const x = 20 + Math.random() * 60 // Keep fireworks in center area
      const y = 20 + Math.random() * 40 // Upper portion of screen
      const color = colors[Math.floor(Math.random() * colors.length)]
      const particleCount = 8 + Math.random() * 12

      const particles = Array.from({ length: particleCount }, (_, i) => ({
        id: `${id}-${i}`,
        angle: (360 / particleCount) * i,
        distance: 50 + Math.random() * 100,
        size: Math.random() * (size.max - size.min) + size.min,
        color,
        duration: 1 + Math.random() * 2,
      }))

      return {
        id,
        x,
        y,
        particles,
        color,
        createdAt: Date.now(),
      }
    }

    const interval = setInterval(
      () => {
        setFireworks((prev) => {
          // Remove old fireworks
          const now = Date.now()
          const filtered = prev.filter((fw) => now - fw.createdAt < 5000)

          // Add new firework
          return [...filtered, createFirework()]
        })
      },
      1500 + Math.random() * 2000
    ) // Random interval

    return () => clearInterval(interval)
  }, [colors, size, animationsEnabled])

  if (!animationsEnabled) {
    return null
  }

  return (
    <div
      className={`fireworks-particles ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          style={{
            position: 'absolute',
            left: `${firework.x}%`,
            top: `${firework.y}%`,
          }}
        >
          {/* Central burst */}
          <motion.div
            style={{
              position: 'absolute',
              width: '4px',
              height: '4px',
              backgroundColor: firework.color,
              borderRadius: '50%',
              boxShadow: `0 0 20px ${firework.color}`,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 3, 0], opacity: [1, 0.8, 0] }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Radiating particles */}
          {firework.particles.map((particle) => (
            <motion.div
              key={particle.id}
              style={{
                position: 'absolute',
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                borderRadius: '50%',
                boxShadow: `0 0 10px ${particle.color}`,
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 1,
                opacity: 1,
              }}
              animate={{
                x: Math.cos((particle.angle * Math.PI) / 180) * particle.distance,
                y: Math.sin((particle.angle * Math.PI) / 180) * particle.distance,
                scale: [1, 0.5, 0],
                opacity: [1, 0.8, 0],
              }}
              transition={{
                duration: particle.duration,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * Confetti particles for celebration
 */
export const ConfettiParticles = ({ count = 50, colors = ['#fbbf24', '#8b5cf6', '#ec4899', '#10b981'], size = { min: 2, max: 4 }, shapes = ['circle', 'square', 'triangle'], className = '' }) => {
  const [particles, setParticles] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * (size.max - size.min) + size.min,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * 360,
      speed: 2 + Math.random() * 3,
      drift: (Math.random() - 0.5) * 40,
      delay: Math.random() * 3,
    }))

    setParticles(newParticles)
  }, [count, colors, size, shapes, animationsEnabled])

  if (!animationsEnabled || particles.length === 0) {
    return null
  }

  const getShapeElement = (particle) => {
    const style = {
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
    }

    switch (particle.shape) {
      case 'square':
        return <div style={style} />
      case 'triangle':
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: `${particle.size / 2}px solid transparent`,
              borderRight: `${particle.size / 2}px solid transparent`,
              borderBottom: `${particle.size}px solid ${particle.color}`,
            }}
          />
        )
      default: // circle
        return <div style={{ ...style, borderRadius: '50%' }} />
    }
  }

  return (
    <div
      className={`confetti-particles ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
          }}
          initial={{
            y: -20,
            x: 0,
            rotate: particle.rotation,
          }}
          animate={{
            y: window.innerHeight + 20,
            x: particle.drift,
            rotate: particle.rotation + 720, // Two full rotations
          }}
          transition={{
            duration: 8 / particle.speed,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeIn',
          }}
        >
          {getShapeElement(particle)}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Sparkle particles for Christmas theme
 */
export const SparkleParticles = ({ count = 30, color = '#fbbf24', size = { min: 1, max: 3 }, className = '' }) => {
  const [particles, setParticles] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (size.max - size.min) + size.min,
      delay: Math.random() * 3,
      duration: 1 + Math.random() * 2,
    }))

    setParticles(newParticles)
  }, [count, size, animationsEnabled])

  if (!animationsEnabled || particles.length === 0) {
    return null
  }

  return (
    <div
      className={`sparkle-particles ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999,
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Sparkle star shape */}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.09 8.26L22 9L16 14.74L17.18 22.02L12 18.77L6.82 22.02L8 14.74L2 9L9.91 8.26L12 2Z" fill={color} opacity="0.8" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
