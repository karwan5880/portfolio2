'use client'

import { useEffect, useState } from 'react'

import styles from './ScrollProgress.module.css'

/**
 * Scroll progress indicator component
 * Shows visual progress of page scroll with smooth animations
 */
export const ScrollProgress = ({
  progress = 0,
  className = '',
  position = 'top', // 'top' | 'bottom'
  showPercentage = false,
  color = 'primary',
  isMobile = false,
}) => {
  const [displayProgress, setDisplayProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // Smooth progress animation
  useEffect(() => {
    const targetProgress = Math.min(100, Math.max(0, progress))

    // Show progress bar when scrolling starts
    if (targetProgress > 0 && !isVisible) {
      setIsVisible(true)
    }

    // Animate progress with easing
    const animationDuration = 100 // ms
    const startProgress = displayProgress
    const progressDiff = targetProgress - startProgress
    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progressRatio = Math.min(elapsed / animationDuration, 1)

      // Easing function for smooth animation
      const easeOut = 1 - Math.pow(1 - progressRatio, 3)
      const currentProgress = startProgress + progressDiff * easeOut

      setDisplayProgress(currentProgress)

      if (progressRatio < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [progress, displayProgress, isVisible])

  // Hide progress bar when at top
  useEffect(() => {
    if (progress <= 0 && isVisible) {
      const hideTimeout = setTimeout(() => {
        setIsVisible(false)
      }, 500)

      return () => clearTimeout(hideTimeout)
    }
  }, [progress, isVisible])

  const containerClasses = [styles.scrollProgress, styles[`position-${position}`], styles[`color-${color}`], className, isVisible && styles.visible].filter(Boolean).join(' ')

  return (
    <div className={containerClasses} role="progressbar" aria-label="Page scroll progress" aria-valuenow={Math.round(displayProgress)} aria-valuemin="0" aria-valuemax="100" aria-valuetext={`${Math.round(displayProgress)}% scrolled`}>
      <div
        className={styles.progressBar}
        style={{
          [position === 'top' ? 'width' : 'height']: `${displayProgress}%`,
        }}
      >
        {/* Animated glow effect */}
        <div className={styles.progressGlow} />

        {/* Optional percentage display */}
        {showPercentage && <div className={styles.percentageDisplay}>{Math.round(displayProgress)}%</div>}
      </div>

      {/* Pulse effect at the end of progress bar */}
      <div
        className={styles.progressPulse}
        style={{
          [position === 'top' ? 'left' : 'bottom']: `${displayProgress}%`,
        }}
      />
    </div>
  )
}
