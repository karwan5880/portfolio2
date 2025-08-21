'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useAnimations } from '@/hooks/useAnimations'

/**
 * Snow particle effect component
 */
export const SnowParticles = ({ count = 100, color = '#ffffff', size = { min: 2, max: 6 }, speed = { min: 1, max: 3 }, opacity = { min: 0.3, max: 0.8 }, wind = false, className = '' }) => {
  const [particles, setParticles] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    // Generate snow particles
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // Percentage
      y: -10, // Start above viewport
      size: Math.random() * (size.max - size.min) + size.min,
      speed: Math.random() * (speed.max - speed.min) + speed.min,
      opacity: Math.random() * (opacity.max - opacity.min) + opacity.min,
      windOffset: wind ? Math.random() * 20 - 10 : 0,
      delay: Math.random() * 5, // Stagger animation start
    }))

    setParticles(newParticles)
  }, [count, size, speed, opacity, wind, animationsEnabled])

  if (!animationsEnabled || particles.length === 0) {
    return null
  }

  return (
    <div
      className={`snow-particles ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="snow-particle"
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            borderRadius: '50%',
            opacity: particle.opacity,
            filter: 'blur(0.5px)',
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          }}
          initial={{
            y: -20,
            x: 0,
          }}
          animate={{
            y: window.innerHeight + 20,
            x: wind ? particle.windOffset : 0,
          }}
          transition={{
            duration: 10 / particle.speed,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Frost crystal particles for winter effect
 */
export const FrostParticles = ({ count = 20, color = '#e0f2fe', size = { min: 4, max: 10 }, opacity = { min: 0.1, max: 0.3 }, className = '' }) => {
  const [particles, setParticles] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (size.max - size.min) + size.min,
      opacity: Math.random() * (opacity.max - opacity.min) + opacity.min,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
    }))

    setParticles(newParticles)
  }, [count, size, opacity, animationsEnabled])

  if (!animationsEnabled || particles.length === 0) {
    return null
  }

  return (
    <div
      className={`frost-particles ${className}`}
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
          className="frost-particle"
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
          }}
          initial={{
            scale: 0,
            rotate: 0,
          }}
          animate={{
            scale: [particle.scale, particle.scale * 1.2, particle.scale],
            rotate: [particle.rotation, particle.rotation + 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Frost crystal SVG */}
          <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L12 22M2 12L22 12M6.34 6.34L17.66 17.66M17.66 6.34L6.34 17.66" stroke={color} strokeWidth="1" strokeLinecap="round" />
            <circle cx="12" cy="12" r="2" fill={color} opacity="0.5" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
