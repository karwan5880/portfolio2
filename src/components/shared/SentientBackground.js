import { motion, useScroll, useTransform } from 'framer-motion'
import React, { useEffect, useRef } from 'react'

import styles from './SentientBackground.module.css'
import { useAnimations } from '@/hooks/useAnimations'

const SentientBackground = () => {
  const canvasRef = useRef(null)
  const { animationsEnabled } = useAnimations()

  // Parallax effects for the matrix background
  const { scrollY } = useScroll()

  // Create multiple parallax layers with different speeds
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '30%'])
  const matrixOpacity = useTransform(scrollY, [0, 500, 1000], [0.8, 0.4, 0.2])
  const matrixScale = useTransform(scrollY, [0, 1000], [1, 1.1])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン'
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const nums = '0123456789'
    const alphabet = katakana + latin + nums

    const fontSize = 16
    let columns = Math.floor(canvas.width / fontSize)

    let rainDrops = []
    const initializeRainDrops = () => {
      columns = Math.floor(canvas.width / fontSize)
      rainDrops = []
      for (let x = 0; x < columns; x++) {
        rainDrops[x] = Math.floor((Math.random() * canvas.height) / fontSize)
      }
    }

    initializeRainDrops()

    // Enhanced matrix effect with parallax-aware rendering
    const draw = () => {
      // Create fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dynamic color based on scroll position
      const scrollProgress = Math.min(window.scrollY / 1000, 1)
      const greenIntensity = Math.floor(255 * (0.8 - scrollProgress * 0.3))
      ctx.fillStyle = `rgb(0, ${greenIntensity}, 0)`
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length))

        // Add slight parallax offset to individual characters
        const parallaxOffset = animationsEnabled ? Math.sin(Date.now() * 0.001 + i) * 2 : 0
        const xPos = i * fontSize + parallaxOffset
        const yPos = rainDrops[i] * fontSize

        // Vary opacity based on position for depth effect
        const depthOpacity = 0.3 + Math.sin(i * 0.1) * 0.4
        ctx.globalAlpha = depthOpacity

        ctx.fillText(text, xPos, yPos)

        // Reset drops that have fallen off screen
        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0
        }
        rainDrops[i]++
      }

      ctx.globalAlpha = 1 // Reset alpha
    }

    const intervalId = setInterval(draw, 33)

    return () => {
      clearInterval(intervalId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [animationsEnabled])

  return (
    <motion.div
      className={styles.sentientContainer}
      style={
        animationsEnabled
          ? {
              y: backgroundY,
              opacity: matrixOpacity,
              scale: matrixScale,
            }
          : {}
      }
    >
      <canvas ref={canvasRef} className={styles.sentientCanvas} />

      {/* Additional parallax layers for enhanced depth */}
      {animationsEnabled && (
        <>
          <motion.div
            className={styles.parallaxLayer1}
            style={{
              y: useTransform(scrollY, [0, 1000], ['0%', '20%']),
              opacity: useTransform(scrollY, [0, 800], [0.1, 0]),
            }}
          />
          <motion.div
            className={styles.parallaxLayer2}
            style={{
              y: useTransform(scrollY, [0, 1000], ['0%', '40%']),
              opacity: useTransform(scrollY, [0, 600], [0.05, 0]),
            }}
          />
        </>
      )}
    </motion.div>
  )
}

export default SentientBackground
