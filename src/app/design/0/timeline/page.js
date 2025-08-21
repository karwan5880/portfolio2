'use client'

import { useEffect, useRef } from 'react'

import { DogEar } from '@/components/shared/DogEar'

import styles from './timeline.module.css'
import { useGatekeeper } from '@/hooks/useGatekeeper'

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

        // Detect platform and adjust scroll sensitivity
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
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
      if (!element.contains(document.activeElement)) return

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
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      element.removeEventListener('wheel', handleWheel)
      document.removeEventListener('keydown', handleKeyDown)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return scrollRef
}

export default function Timeline() {
  useGatekeeper('/timeline')
  const timelineScrollRef = useHorizontalScroll()

  return (
    <div className={styles.timelineWrapper}>
      <div className={styles.timelineContainer}>
        <h1 className={styles.header}>Timeline</h1>

        <div className={styles.scrollHint}>
          <span>← Scroll, mouse wheel, or arrow keys to navigate →</span>
        </div>

        <div className={styles.timelineScrollContainer} ref={timelineScrollRef}>
          <div className={styles.timelineLine}></div>

          {timelineData.map((item, index) => (
            <div key={index} className={`${styles.timelineItem} ${styles[item.status]}`}>
              <div className={styles.timelineYear}>{item.year}</div>
              <div className={styles.timelineIcon}>{item.icon}</div>
              <div className={styles.timelineLabel}>{item.label}</div>
            </div>
          ))}
        </div>

        <div className={styles.statusIndicator}>
          <span className={styles.runningDot}></span>
          Currently: Job hunting locally
        </div>

        <DogEar href="/design/0" position="bottom-left" aria-label="Return to main page" />
        <DogEar href="/design/0/dev-history" position="bottom-right" aria-label="View dev-history" />
      </div>
    </div>
  )
}
