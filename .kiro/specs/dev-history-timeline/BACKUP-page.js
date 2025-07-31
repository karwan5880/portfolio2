'use client'

import { Stars } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { animate, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { MathUtils } from 'three'

import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
import { devHistoryData } from '@/data/dev-history-data'
import { useGatekeeper } from '@/hooks/useGatekeeper'
import { useAudioStore } from '@/stores/audioStore'

/**
 * A simple R3F component to render a starfield background.
 */
function StarfieldBackground() {
  useFrame((state) => {
    state.camera.position.x = MathUtils.lerp(state.camera.position.x, state.pointer.x * 0.5, 0.02)
    state.camera.position.y = MathUtils.lerp(state.camera.position.y, state.pointer.y * 0.5, 0.02)
  })
  return <Stars count={5000} factor={4} saturation={0} fade speed={1} />
}

/**
 * Card-by-card snap scrolling with centering
 */
function useCardSnapScroll() {
  const scrollRef = useRef(null)
  const x = useMotionValue(0)
  const smoothX = useSpring(x, { damping: 60, stiffness: 400, mass: 0.8 })
  const [isDragging, setIsDragging] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Card dimensions
  const cardWidth = 380 // Updated card width
  const cardGap = 128 // 8rem = 128px (increased from 4rem for more separation)
  const cardStep = cardWidth + cardGap

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    // Update dimensions
    const updateDimensions = () => {
      const containerRect = element.getBoundingClientRect()
      setContainerWidth(containerRect.width)

      // Center first card initially
      const centerOffset = containerRect.width / 2 - cardWidth / 2
      const paddingOffset = 32 // 2rem padding from horizontalScroll
      x.set(centerOffset - paddingOffset)
      updateProgress()
    }

    const updateProgress = () => {
      const totalCards = devHistoryData.length
      const progress = totalCards > 1 ? (currentCardIndex / (totalCards - 1)) * 100 : 0
      setScrollProgress(Math.min(100, Math.max(0, progress)))
    }

    // Calculate position for a specific card index
    const getCardPosition = (index) => {
      const centerOffset = containerWidth / 2 - cardWidth / 2
      const paddingOffset = 32 // 2rem padding from horizontalScroll
      return centerOffset - paddingOffset - index * cardStep
    }

    // Snap to specific card
    const snapToCard = (index) => {
      const clampedIndex = Math.max(0, Math.min(devHistoryData.length - 1, index))
      const targetX = getCardPosition(clampedIndex)

      setCurrentCardIndex(clampedIndex)

      animate(x, targetX, {
        type: 'spring',
        damping: 50,
        stiffness: 300,
        mass: 0.6,
        duration: 0.8,
      })
    }

    // Handle wheel scrolling - snap to next/previous card
    const handleWheel = (e) => {
      if (isDragging) return

      e.preventDefault()

      // Determine scroll direction
      const scrollingDown = e.deltaY > 0
      const nextIndex = scrollingDown ? currentCardIndex + 1 : currentCardIndex - 1

      snapToCard(nextIndex)
    }

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
      if (!element.contains(document.activeElement)) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          snapToCard(currentCardIndex - 1)
          break
        case 'ArrowRight':
          e.preventDefault()
          snapToCard(currentCardIndex + 1)
          break
        case 'Home':
          e.preventDefault()
          snapToCard(0)
          break
        case 'End':
          e.preventDefault()
          snapToCard(devHistoryData.length - 1)
          break
        default:
          return
      }
    }

    // Handle drag end - snap to nearest card
    const handleDragEnd = () => {
      const currentX = x.get()
      const centerOffset = containerWidth / 2 - cardWidth / 2

      // Calculate which card is closest
      const relativeX = centerOffset - currentX
      const nearestIndex = Math.round(relativeX / cardStep)

      snapToCard(nearestIndex)
      setIsDragging(false)
    }

    // Listen to progress updates
    const unsubscribe = x.on('change', updateProgress)

    // Initial setup
    setTimeout(updateDimensions, 100)
    window.addEventListener('resize', updateDimensions)

    element.addEventListener('wheel', handleWheel, { passive: false })
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      element.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', updateDimensions)
      unsubscribe()
    }
  }, [x, isDragging, currentCardIndex, containerWidth, cardStep])

  const navigateToCard = (index) => {
    const clampedIndex = Math.max(0, Math.min(devHistoryData.length - 1, index))
    const centerOffset = containerWidth / 2 - cardWidth / 2
    const paddingOffset = 32 // 2rem padding from horizontalScroll
    const targetX = centerOffset - paddingOffset - clampedIndex * cardStep

    setCurrentCardIndex(clampedIndex)

    animate(x, targetX, {
      type: 'spring',
      damping: 50,
      stiffness: 300,
      mass: 0.6,
      duration: 0.8,
    })
  }

  return {
    scrollRef,
    smoothX,
    setIsDragging,
    isDragging,
    currentCardIndex,
    scrollProgress,
    navigateToCard,
    handleDragEnd: () => {
      const currentX = x.get()
      const centerOffset = containerWidth / 2 - cardWidth / 2
      const paddingOffset = 32 // 2rem padding from horizontalScroll
      const relativeX = centerOffset - paddingOffset - currentX
      const nearestIndex = Math.round(relativeX / cardStep)

      const clampedIndex = Math.max(0, Math.min(devHistoryData.length - 1, nearestIndex))
      const targetX = centerOffset - paddingOffset - clampedIndex * cardStep

      setCurrentCardIndex(clampedIndex)
      setIsDragging(false)

      animate(x, targetX, {
        type: 'spring',
        damping: 50,
        stiffness: 300,
        mass: 0.6,
        duration: 0.8,
      })
    },
  }
}

/**
 * Enhanced timeline item with Framer Motion animations and click navigation
 */
function TimelineItem({ node, index, isActive, onClick }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`${styles.timelineItem} ${isActive ? styles.active : ''}`}
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        type: 'spring',
        damping: 20,
        stiffness: 100,
      }}
      whileHover={{
        scale: isActive ? 1.02 : 1.05,
        y: isActive ? -5 : -10,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(index)}
      style={{ cursor: isActive ? 'default' : 'pointer' }}
    >
      <motion.div className={styles.timelineDot} animate={isHovered ? { scale: 1.3 } : { scale: 1 }} transition={{ duration: 0.2 }}>
        <div className={styles.dotPulse}></div>
        <motion.div className={styles.dotGlow} animate={isHovered ? { opacity: 1, scale: 1.5 } : { opacity: 0, scale: 1 }} transition={{ duration: 0.3 }} />
      </motion.div>

      <motion.div
        className={styles.timelineContent}
        whileHover={{
          boxShadow: '0 20px 50px rgba(138, 43, 226, 0.3)',
          borderColor: 'rgba(138, 43, 226, 0.6)',
        }}
        transition={{ duration: 0.2 }}
      >
        <div className={styles.contentHeader}>
          <motion.span className={styles.year} animate={isHovered ? { scale: 1.1, color: '#ff6b6b' } : { scale: 1, color: '#8a2be2' }} transition={{ duration: 0.2 }}>
            {node.year}
          </motion.span>
          {node.featured && (
            <motion.span className={styles.featuredBadge} animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
              ✨
            </motion.span>
          )}
        </div>

        <motion.h3 animate={isHovered ? { color: '#fff' } : { color: '#e0e0e0' }} transition={{ duration: 0.2 }}>
          {node.title}
        </motion.h3>

        <motion.p animate={isHovered ? { color: '#ddd' } : { color: '#ccc' }} transition={{ duration: 0.2 }}>
          {node.description}
        </motion.p>

        <div className={styles.contentFooter}>
          <motion.div className={styles.techIndicator} animate={isHovered ? { width: 50, opacity: 1 } : { width: 30, opacity: 0.6 }} transition={{ duration: 0.3 }} />
          {node.technologies && (
            <div className={styles.techTags}>
              {node.technologies.slice(0, 2).map((tech, i) => (
                <motion.span key={i} className={styles.techTag} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 0.8, scale: 1 }} whileHover={{ opacity: 1, scale: 1.1 }} transition={{ delay: index * 0.1 + i * 0.1 }}>
                  {tech}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function DevHistoryPage() {
  useGatekeeper('/dev-history')
  const grantPermission = useAudioStore((state) => state.grantPermission)
  const { scrollRef, smoothX, setIsDragging, isDragging, currentCardIndex, scrollProgress, navigateToCard, handleDragEnd } = useCardSnapScroll()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  // Calculate drag constraints for card snapping
  const cardWidth = 380
  const cardGap = 128 // Updated to match the new gap
  const cardStep = cardWidth + cardGap
  const totalCards = devHistoryData.length

  const dragConstraints = {
    left: -(totalCards - 1) * cardStep, // Last card position
    right: cardStep, // Beyond first card for elastic feel
  }

  return (
    <div className={styles.pageContainer}>
      {/* 3D background canvas */}
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 0, 1], fov: 75 }}>
          <StarfieldBackground />
        </Canvas>
      </div>

      {/* 2D timeline content */}
      <motion.main className={styles.scrollWrapper} initial={{ opacity: 0 }} animate={{ opacity: isLoaded ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.content}>
          <motion.div className={styles.intro} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
            <motion.h1 initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.4 }}>
              My Development Journey
            </motion.h1>
          </motion.div>

          <motion.div className={styles.timelineContainer} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.8 }}>
            {/* Timeline progress and navigation */}
            <div className={styles.scrollProgressContainer}>
              <div className={styles.timelineInfo}>
                <span className={styles.currentYear}>{devHistoryData[currentCardIndex]?.year}</span>
                <span className={styles.yearLabel}>Current Milestone</span>
              </div>
              <div className={styles.scrollProgressBar}>
                <motion.div className={styles.scrollProgressFill} style={{ width: `${scrollProgress}%` }} transition={{ type: 'spring', damping: 20, stiffness: 300 }} />
              </div>
              <div className={styles.navigationHint}>
                <span>Scroll or use arrow keys to navigate</span>
              </div>
            </div>

            <div className={styles.horizontalScrollContainer} ref={scrollRef}>
              {/* Navigation arrows */}
              {currentCardIndex > 0 && (
                <motion.button className={`${styles.navArrow} ${styles.navArrowLeft}`} onClick={() => navigateToCard(currentCardIndex - 1)} whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  ←
                </motion.button>
              )}

              {currentCardIndex < devHistoryData.length - 1 && (
                <motion.button className={`${styles.navArrow} ${styles.navArrowRight}`} onClick={() => navigateToCard(currentCardIndex + 1)} whileHover={{ scale: 1.1, x: 5 }} whileTap={{ scale: 0.9 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  →
                </motion.button>
              )}

              <motion.div className={styles.horizontalScroll} style={{ x: smoothX }} drag="x" dragConstraints={dragConstraints} dragElastic={0.2} dragMomentum={false} onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd} whileDrag={{ cursor: 'grabbing' }}>
                {devHistoryData.map((node, index) => (
                  <div key={node.id} className={styles.horizontalSlide}>
                    <TimelineItem node={node} index={index} isActive={index === currentCardIndex} onClick={navigateToCard} />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Corner navigation links */}
      <CornerLink href="/dossier" position="bottom-left" label="Timeline" aria-label="Return to dossier" />
      <CornerLink href="/job-hunt" position="bottom-right" label="Job Hunt" aria-label="Go to job hunt" onNavigateStart={grantPermission} />
    </div>
  )
}
