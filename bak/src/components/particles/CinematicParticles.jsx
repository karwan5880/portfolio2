'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useAnimations } from '@/hooks/useAnimations'

/**
 * Rain particle effect
 */
export const RainParticles = ({ count = 200, color = '#87ceeb', size = { min: 1, max: 2 }, speed = { min: 8, max: 15 }, opacity = { min: 0.3, max: 0.7 }, angle = 15, className = '' }) => {
  const [particles, setParticles] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 110, // Slightly wider to account for angle
      y: -10,
      size: Math.random() * (size.max - size.min) + size.min,
      speed: Math.random() * (speed.max - speed.min) + speed.min,
      opacity: Math.random() * (opacity.max - opacity.min) + opacity.min,
      delay: Math.random() * 2,
    }))

    setParticles(newParticles)
  }, [count, size, speed, opacity, animationsEnabled])

  if (!animationsEnabled || particles.length === 0) {
    return null
  }

  return (
    <div
      className={`rain-particles ${className}`}
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
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size * 8}px`, // Long rain drops
            background: `linear-gradient(to bottom, transparent, ${color})`,
            opacity: particle.opacity,
            transform: `rotate(${angle}deg)`,
            borderRadius: '0 0 50% 50%',
          }}
          initial={{ y: -20 }}
          animate={{ y: window.innerHeight + 20 }}
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
 * Lightning flash effect
 */
export const LightningEffect = ({
  frequency = 'rare', // rare, medium, frequent
  color = '#ffffff',
  duration = 0.2,
  className = '',
}) => {
  const [isFlashing, setIsFlashing] = useState(false)
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const getInterval = () => {
      switch (frequency) {
        case 'frequent':
          return 3000 + Math.random() * 5000
        case 'medium':
          return 8000 + Math.random() * 10000
        case 'rare':
        default:
          return 15000 + Math.random() * 20000
      }
    }

    const triggerLightning = () => {
      setIsFlashing(true)
      setTimeout(() => setIsFlashing(false), duration * 1000)
    }

    const interval = setInterval(() => {
      triggerLightning()
    }, getInterval())

    return () => clearInterval(interval)
  }, [frequency, duration, animationsEnabled])

  if (!animationsEnabled) {
    return null
  }

  return (
    <motion.div
      className={`lightning-effect ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: color,
        pointerEvents: 'none',
        zIndex: 1001,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isFlashing ? 0.8 : 0 }}
      transition={{ duration: duration / 2 }}
    />
  )
}

/**
 * Spotlight beams for Hollywood theme
 */
export const SpotlightBeams = ({ count = 3, color = '#d4af37', intensity = 0.8, className = '' }) => {
  const [beams, setBeams] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const newBeams = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: (100 / (count + 1)) * (i + 1), // Evenly distribute
      width: 15 + Math.random() * 10,
      rotation: -10 + Math.random() * 20,
      opacity: intensity * (0.6 + Math.random() * 0.4),
    }))

    setBeams(newBeams)
  }, [count, intensity, animationsEnabled])

  if (!animationsEnabled || beams.length === 0) {
    return null
  }

  return (
    <div
      className={`spotlight-beams ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 998,
      }}
    >
      {beams.map((beam) => (
        <motion.div
          key={beam.id}
          style={{
            position: 'absolute',
            left: `${beam.x}%`,
            top: 0,
            width: `${beam.width}%`,
            height: '100%',
            background: `linear-gradient(to bottom, ${color}${Math.floor(beam.opacity * 255)
              .toString(16)
              .padStart(2, '0')}, transparent 70%)`,
            transform: `translateX(-50%) rotate(${beam.rotation}deg)`,
            transformOrigin: 'top center',
          }}
          animate={{
            opacity: [beam.opacity * 0.5, beam.opacity, beam.opacity * 0.7],
            scaleX: [0.8, 1, 0.9],
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Neon glow particles
 */
export const NeonGlowParticles = ({ count = 30, colors = ['#00ffff', '#ff00ff', '#00ff00', '#ffff00'], size = { min: 2, max: 6 }, speed = { min: 1, max: 3 }, opacity = { min: 0.4, max: 0.8 }, className = '' }) => {
  const [particles, setParticles] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (size.max - size.min) + size.min,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * (speed.max - speed.min) + speed.min,
      opacity: Math.random() * (opacity.max - opacity.min) + opacity.min,
      direction: Math.random() * 360,
    }))

    setParticles(newParticles)
  }, [count, colors, size, speed, opacity, animationsEnabled])

  if (!animationsEnabled || particles.length === 0) {
    return null
  }

  return (
    <div
      className={`neon-glow-particles ${className}`}
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
            backgroundColor: particle.color,
            borderRadius: '50%',
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 4}px ${particle.color}, 0 0 ${particle.size * 8}px ${particle.color}`,
          }}
          animate={{
            x: [0, Math.cos((particle.direction * Math.PI) / 180) * 50, 0],
            y: [0, Math.sin((particle.direction * Math.PI) / 180) * 50, 0],
            scale: [1, 1.5, 1],
            opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
          }}
          transition={{
            duration: 3 / particle.speed,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/**
 * Data stream particles for cyberpunk theme
 */
export const DataStreamParticles = ({ count = 50, colors = ['#ff0080', '#00d4ff', '#8000ff'], size = { min: 1, max: 3 }, speed = { min: 2, max: 6 }, opacity = { min: 0.3, max: 0.7 }, className = '' }) => {
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
      speed: Math.random() * (speed.max - speed.min) + speed.min,
      opacity: Math.random() * (opacity.max - opacity.min) + opacity.min,
      character: String.fromCharCode(33 + Math.floor(Math.random() * 94)), // Random ASCII
      delay: Math.random() * 3,
    }))

    setParticles(newParticles)
  }, [count, colors, size, speed, opacity, animationsEnabled])

  if (!animationsEnabled || particles.length === 0) {
    return null
  }

  return (
    <div
      className={`data-stream-particles ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 999,
        fontFamily: 'monospace',
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          style={{
            position: 'absolute',
            left: `${particle.x}%`,
            fontSize: `${particle.size * 8}px`,
            color: particle.color,
            opacity: particle.opacity,
            textShadow: `0 0 ${particle.size * 4}px ${particle.color}`,
            fontWeight: 'bold',
          }}
          initial={{ y: -20 }}
          animate={{ y: window.innerHeight + 20 }}
          transition={{
            duration: 8 / particle.speed,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {particle.character}
        </motion.div>
      ))}
    </div>
  )
}

/**
 * Sun rays effect for sunset theme
 */
export const SunRaysEffect = ({ count = 8, color = '#ffc107', length = 200, opacity = { min: 0.1, max: 0.3 }, className = '' }) => {
  const [rays, setRays] = useState([])
  const { animationsEnabled } = useAnimations()

  useEffect(() => {
    if (!animationsEnabled) return

    const newRays = Array.from({ length: count }, (_, i) => ({
      id: i,
      angle: (360 / count) * i,
      opacity: Math.random() * (opacity.max - opacity.min) + opacity.min,
      width: 2 + Math.random() * 4,
    }))

    setRays(newRays)
  }, [count, opacity, animationsEnabled])

  if (!animationsEnabled || rays.length === 0) {
    return null
  }

  return (
    <div
      className={`sun-rays-effect ${className}`}
      style={{
        position: 'fixed',
        top: '20%',
        right: '10%',
        width: `${length}px`,
        height: `${length}px`,
        pointerEvents: 'none',
        zIndex: 998,
      }}
    >
      {rays.map((ray) => (
        <motion.div
          key={ray.id}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${ray.width}px`,
            height: `${length / 2}px`,
            background: `linear-gradient(to top, ${color}${Math.floor(ray.opacity * 255)
              .toString(16)
              .padStart(2, '0')}, transparent)`,
            transformOrigin: 'bottom center',
            transform: `translate(-50%, -100%) rotate(${ray.angle}deg)`,
          }}
          animate={{
            opacity: [ray.opacity * 0.5, ray.opacity, ray.opacity * 0.7],
            scaleY: [0.8, 1, 0.9],
          }}
          transition={{
            duration: 6 + Math.random() * 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
