'use client'

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

import { DogEar } from '@/components/DogEar'

import styles from './TimelineSection.module.css'
import { useAnimations } from '@/hooks/useAnimations'
import { useScrollManager } from '@/hooks/useScrollManager'

const timelineData = [
  { year: '1995', label: 'Born', icon: '🌱', status: 'complete' },
  { year: '2012', label: 'SPM', icon: '📚', status: 'complete' },
  { year: '2013', label: 'Foundation', icon: '🏗️', status: 'complete' },
  { year: '2014', label: 'Degree', icon: '🎓', status: 'complete' },
  { year: '2018', label: 'Internship', icon: '💼', status: 'complete' },
  { year: '2019', label: 'Graduated', icon: '🎉', status: 'complete' },
  { year: '2019', label: 'Masters', icon: '📖', status: 'complete' },
  { year: '2020', label: 'COVID', icon: '⏸️', status: 'pause' },
  { year: '2021', label: 'Pause', icon: '💤', status: 'pause' },
  { year: '2022', label: 'Resume', icon: '▶️', status: 'complete' },
  { year: '2024', label: 'Graduated', icon: '🎓', status: 'complete' },
  { year: '2024', label: 'Business', icon: '🚀', status: 'failed' },
  { year: '2024', label: 'Job Hunt', icon: '🌏', status: 'failed' },
  { year: '2025', label: 'Local Hunt', icon: '🎯', status: 'running' },
]

/**
 * Hook for smooth horizontal scrolling without bouncy physics
 * Enhanced for better integration with multiverse container
 */
function useHorizontalScroll() {
  const scrollRef = useRef(null)
  const targetScrollRef = useRef(0)
  const animationRef = useRef(null)
  const lastScrollTime = useRef(0)

  useEffect(() => {
    const element = scrollRef.current
    if (!element) return

    // Simple smooth scrolling animation
    const smoothScrollTo = (target) => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      const startScroll = element.scrollLeft
      const distance = target - startScroll
      const duration = 300 // ms
      const startTime = performance.now()

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Ease-out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3)

        element.scrollLeft = startScroll + distance * easeOut

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        } else {
          animationRef.current = null
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    // Initialize target position
    targetScrollRef.current = element.scrollLeft

    const handleWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault()

        // Use modern userAgentData API when available, fallback to deprecated platform
        const getUserAgent = () => {
          if (navigator.userAgentData) {
            return navigator.userAgentData.platform
          }
          // Fallback for older browsers
          return navigator.platform
        }

        const platform = getUserAgent()
        const isMac = platform.toUpperCase().indexOf('MAC') >= 0
        const isTrackpad = Math.abs(e.deltaY) < 50 // Trackpads typically send smaller values

        // Throttle rapid scroll events for smoother experience on Mac trackpads
        const now = Date.now()
        const timeSinceLastScroll = now - lastScrollTime.current
        const throttleTime = isMac && isTrackpad ? 16 : 8 // ~60fps for trackpads, ~120fps for mice

        if (timeSinceLastScroll < throttleTime) return
        lastScrollTime.current = now

        // Adjust scroll multiplier based on platform and input device
        let scrollMultiplier = 1.5
        if (isMac && isTrackpad) {
          scrollMultiplier = 3 // Increase sensitivity for Mac trackpads
        } else if (isMac) {
          scrollMultiplier = 2 // Moderate increase for Mac mice
        }

        const scrollDelta = e.deltaY * scrollMultiplier
        const maxScroll = element.scrollWidth - element.clientWidth
        const newTarget = Math.max(0, Math.min(maxScroll, targetScrollRef.current + scrollDelta))

        targetScrollRef.current = newTarget
        smoothScrollTo(newTarget)
      }
    }

    const handleKeyDown = (e) => {
      // Only handle keys when timeline container is focused or contains focus
      if (!element.contains(document.activeElement) && document.activeElement !== element) return

      let scrollAmount = 0
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          scrollAmount = -200
          break
        case 'ArrowRight':
          e.preventDefault()
          scrollAmount = 200
          break
        case 'Home':
          e.preventDefault()
          targetScrollRef.current = 0
          smoothScrollTo(0)
          return
        case 'End':
          e.preventDefault()
          const maxScroll = element.scrollWidth - element.clientWidth
          targetScrollRef.current = maxScroll
          smoothScrollTo(maxScroll)
          return
        default:
          return
      }

      if (scrollAmount !== 0) {
        const maxScroll = element.scrollWidth - element.clientWidth
        const newTarget = Math.max(0, Math.min(maxScroll, targetScrollRef.current + scrollAmount))
        targetScrollRef.current = newTarget
        smoothScrollTo(newTarget)
      }
    }

    element.addEventListener('wheel', handleWheel, { passive: false })
    element.addEventListener('keydown', handleKeyDown)

    return () => {
      element.removeEventListener('wheel', handleWheel)
      element.removeEventListener('keydown', handleKeyDown)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return scrollRef
}

export const TimelineSection = () => {
  const timelineScrollRef = useHorizontalScroll()
  const { scrollToSection } = useScrollManager()
  const { animationsEnabled } = useAnimations()

  // Enhanced animation variants for timeline items with better entrance effects
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08, // Slightly faster stagger for better flow
        delayChildren: 0.3, // Allow header to animate first
        duration: 0.6,
      },
    },
  }

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.7,
      rotateY: -15, // Add subtle 3D effect
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 15,
        duration: 0.8,
      },
    },
  }

  const lineVariants = {
    hidden: {
      scaleX: 0,
      opacity: 0,
    },
    visible: {
      scaleX: 1,
      opacity: 1,
      transition: {
        duration: 2.0, // Longer duration for more dramatic effect
        ease: 'easeInOut',
        delay: 0.6, // Start after header animation
      },
    },
  }

  // Enhanced hover animation for timeline items
  const itemHoverVariants = {
    hover: {
      scale: 1.15,
      y: -5,
      rotateY: 5,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  }

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineContainer}>
        <motion.h1
          className={styles.header}
          initial={animationsEnabled ? { opacity: 0, y: -30, scale: 0.9 } : false}
          animate={animationsEnabled ? { opacity: 1, y: 0, scale: 1 } : false}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
        >
          Timeline
        </motion.h1>

        <motion.div className={styles.scrollHint} initial={animationsEnabled ? { opacity: 0, y: 10 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}>
          <span>← Scroll, mouse wheel, or arrow keys to navigate →</span>
        </motion.div>

        <motion.div
          className={styles.timelineScrollContainer}
          ref={timelineScrollRef}
          variants={animationsEnabled ? containerVariants : undefined}
          initial={animationsEnabled ? 'hidden' : false}
          animate={animationsEnabled ? 'visible' : false}
          tabIndex={0} // Make focusable for keyboard navigation
          role="region"
          aria-label="Timeline navigation"
        >
          <motion.div className={styles.timelineLine} variants={animationsEnabled ? lineVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false} />

          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className={`${styles.timelineItem} ${styles[item.status]}`}
              variants={animationsEnabled ? itemVariants : undefined}
              whileHover={animationsEnabled ? 'hover' : undefined}
              whileTap={animationsEnabled ? 'tap' : undefined}
              {...(animationsEnabled ? itemHoverVariants : {})}
              role="button"
              tabIndex={0}
              aria-label={`${item.year}: ${item.label} - ${item.status}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  // Could add click handler here for timeline item interaction
                }
              }}
            >
              <div className={styles.timelineYear}>{item.year}</div>
              <div className={styles.timelineIcon} role="img" aria-label={item.label}>
                {item.icon}
              </div>
              <div className={styles.timelineLabel}>{item.label}</div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className={styles.statusIndicator}
          initial={animationsEnabled ? { opacity: 0, y: 20, scale: 0.9 } : false}
          animate={animationsEnabled ? { opacity: 1, y: 0, scale: 1 } : false}
          transition={{
            duration: 0.6,
            delay: 1.2, // Animate after timeline items
            ease: 'easeOut',
            type: 'spring',
            stiffness: 100,
            damping: 15,
          }}
        >
          <span className={styles.runningDot}></span>
          Currently: Job hunting locally
        </motion.div>

        {/* Enhanced DogEar components with better section navigation */}
        <DogEar
          href="#home"
          position="bottom-left"
          aria-label="Navigate to home section"
          onNavigateStart={(e) => {
            e.preventDefault()
            scrollToSection('home')
          }}
        />
        <DogEar
          href="#dev-history"
          position="bottom-right"
          aria-label="Navigate to dev-history section"
          onNavigateStart={(e) => {
            e.preventDefault()
            scrollToSection('dev-history')
          }}
        />
      </div>
    </div>
  )
}
