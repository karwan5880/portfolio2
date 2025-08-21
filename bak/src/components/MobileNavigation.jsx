'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useAccessibilityContext } from './AccessibilityProvider'
import styles from './MobileNavigation.module.css'
import { useAnimations } from '@/hooks/useAnimations'
import { getNavigationAriaAttributes, handleKeyboardNavigation } from '@/utils/accessibility'

/**
 * Mobile-specific navigation component
 * Provides touch-friendly navigation controls for mobile devices
 */
export const MobileNavigation = ({ sections = [], currentSection = '', onSectionClick = () => {}, onNext = () => {}, onPrevious = () => {}, canNavigateNext = true, canNavigatePrevious = true, className = '', performanceMode = 'full' }) => {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { animationsEnabled } = useAnimations()
  const { announce, isScreenReaderActive } = useAccessibilityContext()

  // Auto-hide navigation on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false)
      } else {
        // Scrolling up
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    const throttledScroll = () => {
      requestAnimationFrame(handleScroll)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [lastScrollY])

  const currentIndex = sections.findIndex((s) => s.id === currentSection)

  const navigationVariants = {
    hidden: {
      y: 100,
      opacity: 0,
      transition: { duration: 0.3 },
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  const buttonVariants = {
    tap: { scale: 0.9 },
    disabled: { opacity: 0.3 },
  }

  // Handle section click with accessibility announcement
  const handleSectionClick = (sectionId) => {
    onSectionClick(sectionId)
    const section = sections.find((s) => s.id === sectionId)
    if (section && isScreenReaderActive) {
      announce(`Navigating to ${section.title} section`, 'assertive')
    }
  }

  // Handle navigation with announcements
  const handleNext = () => {
    onNext()
    if (isScreenReaderActive) {
      announce('Moving to next section', 'polite')
    }
  }

  const handlePrevious = () => {
    onPrevious()
    if (isScreenReaderActive) {
      announce('Moving to previous section', 'polite')
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav className={`${styles.mobileNavigation} ${className}`} variants={animationsEnabled && performanceMode !== 'optimized' ? navigationVariants : undefined} initial={animationsEnabled && performanceMode !== 'optimized' ? 'hidden' : false} animate={animationsEnabled && performanceMode !== 'optimized' ? 'visible' : false} exit={animationsEnabled && performanceMode !== 'optimized' ? 'hidden' : false} role="navigation" aria-label="Mobile section navigation" id="mobile-navigation">
          {/* Section Progress */}
          <div className={styles.sectionProgress}>
            <div className={styles.progressTrack}>
              <motion.div
                className={styles.progressFill}
                style={{
                  width: `${((currentIndex + 1) / sections.length) * 100}%`,
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <span className={styles.progressText}>
              {currentIndex + 1} / {sections.length}
            </span>
          </div>

          {/* Navigation Controls */}
          <div className={styles.navigationControls}>
            {/* Previous Button */}
            <motion.button className={`${styles.navButton} ${styles.prevButton} ${!canNavigatePrevious ? styles.disabled : ''}`} variants={buttonVariants} whileTap={animationsEnabled && canNavigatePrevious ? 'tap' : undefined} animate={!canNavigatePrevious ? 'disabled' : undefined} onClick={canNavigatePrevious ? handlePrevious : undefined} onKeyDown={(e) => canNavigatePrevious && handleKeyboardNavigation(e, handlePrevious)} disabled={!canNavigatePrevious} aria-label="Go to previous section" aria-describedby="prev-button-desc">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            {/* Section Dots */}
            <div className={styles.sectionDots} role="list" aria-label={`Section navigation: ${sections.length} sections available`}>
              {sections.map((section, index) => {
                const isActive = section.id === currentSection
                const ariaAttributes = getNavigationAriaAttributes(section.id, section.title, isActive)

                return (
                  <motion.button key={section.id} className={`${styles.sectionDot} ${isActive ? styles.active : ''}`} whileTap={animationsEnabled ? { scale: 0.8 } : undefined} onClick={() => handleSectionClick(section.id)} onKeyDown={(e) => handleKeyboardNavigation(e, () => handleSectionClick(section.id))} {...ariaAttributes} aria-describedby={`section-${section.id}-desc`} role="listitem">
                    <span className={styles.dotLabel}>{section.title}</span>
                    <span id={`section-${section.id}-desc`} className={styles.srOnly}>
                      Section {index + 1} of {sections.length}
                      {isActive ? ' (current)' : ''}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* Next Button */}
            <motion.button className={`${styles.navButton} ${styles.nextButton} ${!canNavigateNext ? styles.disabled : ''}`} variants={buttonVariants} whileTap={animationsEnabled && canNavigateNext ? 'tap' : undefined} animate={!canNavigateNext ? 'disabled' : undefined} onClick={canNavigateNext ? handleNext : undefined} onKeyDown={(e) => canNavigateNext && handleKeyboardNavigation(e, handleNext)} disabled={!canNavigateNext} aria-label="Go to next section" aria-describedby="next-button-desc">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </div>

          {/* Current Section Title */}
          <div className={styles.currentSectionTitle} role="status" aria-live="polite" aria-label="Current section">
            <motion.span key={currentSection} initial={animationsEnabled ? { opacity: 0, y: 10 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ duration: 0.2 }}>
              {sections.find((s) => s.id === currentSection)?.title || ''}
            </motion.span>
          </div>

          {/* Hidden descriptions for screen readers */}
          <div className={styles.srOnly}>
            <div id="prev-button-desc">Navigate to the previous section in the portfolio</div>
            <div id="next-button-desc">Navigate to the next section in the portfolio</div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}
