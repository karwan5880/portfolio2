'use client'

import { useEffect, useRef, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'

import styles from './page.module.css'
import { devHistoryData } from '@/data/dev-history-data'
import { useGatekeeper } from '@/hooks/useGatekeeper'
import { useAudioStore } from '@/stores/audioStore'

export default function DevHistoryPage() {
  useGatekeeper('/dev-history')
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
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

  // Simple wheel scrolling
  useEffect(() => {
    let lastScrollTime = 0

    const handleWheel = (e) => {
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

      // Simple debug
      console.log(`Scroll: delta=${scrollDelta}, cards=${cardsToMove}, ${currentIndex} → ${scrollingDown ? Math.min(currentIndex + cardsToMove, devHistoryData.length - 1) : Math.max(currentIndex - cardsToMove, 0)}`)
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

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>My Development Journey</h1>

        {/* Progress bar */}
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressText}>
            {displayIndex + 1} of {devHistoryData.length}
          </span>
        </div>

        <div className={styles.cardContainer} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
          <div ref={cardRef} className={`${styles.card} ${isTransitioning ? styles.cardTransition : ''}`} tabIndex={0} role="article" aria-label={`Timeline item ${currentIndex + 1} of ${devHistoryData.length}`}>
            <div className={styles.cardHeader}>
              <div className={styles.year}>{currentCard.year}</div>
              <div className={styles.cardNumber}>
                {currentIndex + 1}/{devHistoryData.length}
              </div>
            </div>
            <h2 className={styles.cardTitle}>{currentCard.title}</h2>
            <p className={styles.description}>{currentCard.description}</p>
            {currentCard.technologies && (
              <div className={styles.tech}>
                {currentCard.technologies.map((tech, i) => (
                  <span key={i} className={styles.techTag} title={`Technology: ${tech}`}>
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Progress dots */}
        <div className={styles.dotsContainer}>
          {devHistoryData.map((_, index) => (
            <button key={index} className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`} onClick={() => jumpToCard(index)} aria-label={`Go to timeline item ${index + 1}`} title={devHistoryData[index].title} />
          ))}
        </div>

        <div className={styles.navigation}>
          <button onClick={jumpToStart} className={`${styles.navButton} ${styles.jumpButton}`} disabled={currentIndex === 0} aria-label="Jump to first item">
            ⏮ Start
          </button>
          <button onClick={prevCard} className={styles.navButton} disabled={currentIndex === 0} aria-label="Previous item">
            ← Previous
          </button>
          <span className={styles.counter}>
            {currentIndex + 1} / {devHistoryData.length}
          </span>
          <button onClick={nextCard} className={styles.navButton} disabled={currentIndex === devHistoryData.length - 1} aria-label="Next item">
            Next →
          </button>
          <button onClick={jumpToEnd} className={`${styles.navButton} ${styles.jumpButton}`} disabled={currentIndex === devHistoryData.length - 1} aria-label="Jump to last item">
            End ⏭
          </button>
        </div>

        <div className={styles.hints}>
          <p>Scroll, use arrow keys, space bar, or swipe to navigate</p>
          <p>Press 1-{devHistoryData.length} to jump to specific items</p>
        </div>
      </div>

      <CornerLink href="/timeline" position="bottom-left" label="Timeline" />
      <CornerLink href="/skills" position="bottom-right" label="Skills" onNavigateStart={grantPermission} />
    </div>
  )
}
