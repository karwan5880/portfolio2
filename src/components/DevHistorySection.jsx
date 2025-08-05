'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'

import styles from './DevHistorySection.module.css'
import { devHistoryData } from '@/data/dev-history-data'
import { useAnimations } from '@/hooks/useAnimations'
import { useScrollManager } from '@/hooks/useScrollManager'
import { useAudioStore } from '@/stores/audioStore'

export const DevHistorySection = () => {
  const { scrollToSection } = useScrollManager()
  const { animationsEnabled } = useAnimations()
  const grantPermission = useAudioStore((state) => state.grantPermission)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0) // For immediate progress bar updates
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const cardRef = useRef(null)

  const nextCard = () => {
    if (currentIndex < devHistoryData.length - 1 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1)
        setIsTransitioning(false)
      }, 5)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => prev - 1)
        setIsTransitioning(false)
      }, 5)
    }
  }

  const jumpToCard = (index) => {
    if (index !== currentIndex && !isTransitioning) {
      setIsTransitioning(true)
      setDisplayIndex(index) // Update progress bar immediately
      setTimeout(() => {
        setCurrentIndex(index)
        setIsTransitioning(false)
      }, 5)
    }
  }

  const jumpToStart = () => jumpToCard(0)
  const jumpToEnd = () => jumpToCard(devHistoryData.length - 1)

  // Enhanced keyboard navigation with section awareness
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Only handle navigation when this section is focused or contains focus
      const sectionElement = cardRef.current?.closest('[data-section="dev-history"]')
      if (!sectionElement || !sectionElement.contains(document.activeElement)) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          prevCard()
          break
        case 'ArrowRight':
        case ' ':
          e.preventDefault()
          nextCard()
          break
        case 'Home':
          e.preventDefault()
          jumpToStart()
          break
        case 'End':
          e.preventDefault()
          jumpToEnd()
          break
        default:
          // Number keys 1-8 for direct navigation
          const num = parseInt(e.key)
          if (num >= 1 && num <= devHistoryData.length) {
            e.preventDefault()
            jumpToCard(num - 1)
          }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex, isTransitioning])

  // Touch/swipe gestures
  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      nextCard()
    } else if (isRightSwipe) {
      prevCard()
    }
  }

  // Enhanced wheel scrolling with better integration
  useEffect(() => {
    let lastScrollTime = 0

    const handleWheel = (e) => {
      // Only handle wheel events when this section is active
      const sectionElement = cardRef.current?.closest('[data-section="dev-history"]')
      if (!sectionElement || !sectionElement.contains(e.target)) return

      e.preventDefault()

      const now = Date.now()
      const timeSinceLastScroll = now - lastScrollTime

      // Throttle to prevent oversensitive scrolling
      if (timeSinceLastScroll < 200) return

      lastScrollTime = now

      const scrollDelta = Math.abs(e.deltaY)
      const scrollingDown = e.deltaY > 0

      // Simple speed detection based on scroll delta
      let cardsToMove = 1

      if (scrollDelta > 300) {
        // Very fast scroll: move 4 cards
        cardsToMove = 4
      } else if (scrollDelta > 150) {
        // Fast scroll: move 2 cards
        cardsToMove = 2
      }
      // Normal scroll: cardsToMove = 1

      // Navigate based on scroll direction
      if (scrollingDown && currentIndex < devHistoryData.length - 1) {
        const targetIndex = Math.min(currentIndex + cardsToMove, devHistoryData.length - 1)
        jumpToCard(targetIndex)
      } else if (!scrollingDown && currentIndex > 0) {
        const targetIndex = Math.max(currentIndex - cardsToMove, 0)
        jumpToCard(targetIndex)
      }
    }

    document.addEventListener('wheel', handleWheel, { passive: false })
    return () => document.removeEventListener('wheel', handleWheel)
  }, [currentIndex, isTransitioning])

  // Focus management
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.focus()
    }
  }, [currentIndex])

  const currentCard = devHistoryData[currentIndex]
  const progress = ((displayIndex + 1) / devHistoryData.length) * 100 // Use displayIndex for immediate updates

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const progressVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      rotateY: -15,
      z: -100,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      z: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 120,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      rotateY: 15,
      transition: {
        duration: 0.3,
        ease: 'easeIn',
      },
    },
  }

  const navigationVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.4,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div className={styles.page} variants={animationsEnabled ? containerVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false}>
      <div className={styles.container}>
        <motion.h1 className={styles.title} variants={animationsEnabled ? titleVariants : undefined}>
          My Development Journey
        </motion.h1>

        {/* Progress bar */}
        <motion.div className={styles.progressContainer} variants={animationsEnabled ? progressVariants : undefined}>
          <div className={styles.progressBar}>
            <motion.div className={styles.progressFill} style={{ width: `${progress}%` }} initial={animationsEnabled ? { width: 0 } : false} animate={animationsEnabled ? { width: `${progress}%` } : false} transition={{ duration: 0.5, ease: 'easeOut' }} />
          </div>
          <span className={styles.progressText}>
            {displayIndex + 1} of {devHistoryData.length}
          </span>
        </motion.div>

        <div className={styles.cardContainer} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              ref={cardRef}
              className={`${styles.card} ${isTransitioning ? styles.cardTransition : ''}`}
              variants={animationsEnabled ? cardVariants : undefined}
              initial={animationsEnabled ? 'hidden' : false}
              animate={animationsEnabled ? 'visible' : false}
              exit={animationsEnabled ? 'exit' : false}
              tabIndex={0}
              role="article"
              aria-label={`Timeline item ${currentIndex + 1} of ${devHistoryData.length}`}
              whileHover={
                animationsEnabled
                  ? {
                      scale: 1.02,
                      rotateY: 2,
                      transition: { type: 'spring', stiffness: 300, damping: 30 },
                    }
                  : undefined
              }
            >
              <div className={styles.cardHeader}>
                <motion.div className={styles.year} initial={animationsEnabled ? { opacity: 0, x: -20 } : false} animate={animationsEnabled ? { opacity: 1, x: 0 } : false} transition={{ delay: 0.2, duration: 0.5 }}>
                  {currentCard.year}
                </motion.div>
                <motion.div className={styles.cardNumber} initial={animationsEnabled ? { opacity: 0, x: 20 } : false} animate={animationsEnabled ? { opacity: 1, x: 0 } : false} transition={{ delay: 0.2, duration: 0.5 }}>
                  {currentIndex + 1}/{devHistoryData.length}
                </motion.div>
              </div>

              <motion.h2 className={styles.cardTitle} initial={animationsEnabled ? { opacity: 0, y: 20 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ delay: 0.3, duration: 0.6 }}>
                {currentCard.title}
              </motion.h2>

              <motion.p className={styles.description} initial={animationsEnabled ? { opacity: 0, y: 20 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ delay: 0.4, duration: 0.6 }}>
                {currentCard.description}
              </motion.p>

              {currentCard.technologies && (
                <motion.div className={styles.tech} initial={animationsEnabled ? { opacity: 0, y: 20 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ delay: 0.5, duration: 0.6 }}>
                  {currentCard.technologies.map((tech, i) => (
                    <motion.span
                      key={i}
                      className={styles.techTag}
                      title={`Technology: ${tech}`}
                      initial={animationsEnabled ? { opacity: 0, scale: 0.8 } : false}
                      animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.4 }}
                      whileHover={
                        animationsEnabled
                          ? {
                              scale: 1.1,
                              y: -2,
                              transition: { type: 'spring', stiffness: 400, damping: 25 },
                            }
                          : undefined
                      }
                    >
                      {tech}
                    </motion.span>
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        <motion.div className={styles.dotsContainer} variants={animationsEnabled ? navigationVariants : undefined}>
          {devHistoryData.map((_, index) => (
            <motion.button key={index} className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`} onClick={() => jumpToCard(index)} aria-label={`Go to timeline item ${index + 1}`} title={devHistoryData[index].title} whileHover={animationsEnabled ? { scale: 1.2 } : undefined} whileTap={animationsEnabled ? { scale: 0.9 } : undefined} />
          ))}
        </motion.div>

        <motion.div className={styles.navigation} variants={animationsEnabled ? navigationVariants : undefined}>
          <motion.button onClick={jumpToStart} className={`${styles.navButton} ${styles.jumpButton}`} disabled={currentIndex === 0} aria-label="Jump to first item" whileHover={animationsEnabled && currentIndex !== 0 ? { y: -3, scale: 1.05 } : undefined} whileTap={animationsEnabled && currentIndex !== 0 ? { y: -1, scale: 0.95 } : undefined}>
            ⏮ Start
          </motion.button>

          <motion.button onClick={prevCard} className={styles.navButton} disabled={currentIndex === 0} aria-label="Previous item" whileHover={animationsEnabled && currentIndex !== 0 ? { y: -3, scale: 1.05 } : undefined} whileTap={animationsEnabled && currentIndex !== 0 ? { y: -1, scale: 0.95 } : undefined}>
            ← Previous
          </motion.button>

          <span className={styles.counter}>
            {currentIndex + 1} / {devHistoryData.length}
          </span>

          <motion.button onClick={nextCard} className={styles.navButton} disabled={currentIndex === devHistoryData.length - 1} aria-label="Next item" whileHover={animationsEnabled && currentIndex !== devHistoryData.length - 1 ? { y: -3, scale: 1.05 } : undefined} whileTap={animationsEnabled && currentIndex !== devHistoryData.length - 1 ? { y: -1, scale: 0.95 } : undefined}>
            Next →
          </motion.button>

          <motion.button onClick={jumpToEnd} className={`${styles.navButton} ${styles.jumpButton}`} disabled={currentIndex === devHistoryData.length - 1} aria-label="Jump to last item" whileHover={animationsEnabled && currentIndex !== devHistoryData.length - 1 ? { y: -3, scale: 1.05 } : undefined} whileTap={animationsEnabled && currentIndex !== devHistoryData.length - 1 ? { y: -1, scale: 0.95 } : undefined}>
            End ⏭
          </motion.button>
        </motion.div>

        <motion.div className={styles.hints} initial={animationsEnabled ? { opacity: 0 } : false} animate={animationsEnabled ? { opacity: 1 } : false} transition={{ delay: 0.8, duration: 0.6 }}>
          <p>Scroll, use arrow keys, space bar, or swipe to navigate</p>
          <p>Press 1-{devHistoryData.length} to jump to specific items</p>
        </motion.div>
      </div>

      {/* Enhanced CornerLink components with section navigation */}
      <CornerLink
        href="#timeline"
        position="bottom-left"
        label="Timeline"
        onClick={(e) => {
          e.preventDefault()
          scrollToSection('timeline')
        }}
      />
      <CornerLink
        href="#skills"
        position="bottom-right"
        label="Skills"
        onNavigateStart={() => {
          grantPermission()
        }}
        onClick={(e) => {
          e.preventDefault()
          scrollToSection('skills')
        }}
      />
    </motion.div>
  )
}
