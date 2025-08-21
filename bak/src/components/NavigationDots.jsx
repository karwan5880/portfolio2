'use client'

import { useCallback, useEffect, useState } from 'react'

import { useAccessibilityContext } from './AccessibilityProvider'
import styles from './NavigationDots.module.css'
import { getNavigationAriaAttributes, handleKeyboardNavigation } from '@/utils/accessibility'

/**
 * Floating navigation dots component for section navigation
 * Provides visual indication of current section and click-to-navigate functionality
 */
export const NavigationDots = ({
  sections = [],
  currentSection,
  onSectionClick,
  className = '',
  showLabels = false,
  position = 'right', // 'left' | 'right'
}) => {
  const [hoveredSection, setHoveredSection] = useState(null)
  const [isVisible, setIsVisible] = useState(true)
  const { announce, isScreenReaderActive } = useAccessibilityContext()

  // Handle dot click with smooth scrolling feedback
  const handleDotClick = useCallback(
    (sectionId, event) => {
      event.preventDefault()
      event.stopPropagation()

      if (onSectionClick) {
        onSectionClick(sectionId)

        // Announce navigation to screen readers
        const section = sections.find((s) => s.id === sectionId)
        if (section && isScreenReaderActive) {
          announce(`Navigating to ${section.title} section`, 'assertive')
        }
      }
    },
    [onSectionClick, sections, isScreenReaderActive, announce]
  )

  // Enhanced keyboard navigation within dots
  const handleKeyDown = useCallback(
    (event, sectionId) => {
      const currentIndex = sections.findIndex((s) => s.id === sectionId)

      switch (event.key) {
        case 'Enter':
        case ' ':
          handleKeyboardNavigation(event, () => handleDotClick(sectionId, event))
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault()
          const prevIndex = currentIndex - 1
          if (prevIndex >= 0) {
            const prevDot = event.target.parentElement.children[prevIndex]?.querySelector('button')
            prevDot?.focus()
          }
          break
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault()
          const nextIndex = currentIndex + 1
          if (nextIndex < sections.length) {
            const nextDot = event.target.parentElement.children[nextIndex]?.querySelector('button')
            nextDot?.focus()
          }
          break
        case 'Home':
          event.preventDefault()
          const firstDot = event.target.parentElement.children[0]?.querySelector('button')
          firstDot?.focus()
          break
        case 'End':
          event.preventDefault()
          const lastDot = event.target.parentElement.children[sections.length - 1]?.querySelector('button')
          lastDot?.focus()
          break
      }
    },
    [sections, handleDotClick]
  )

  // Auto-hide navigation on scroll (optional behavior)
  useEffect(() => {
    let hideTimeout

    const handleScroll = () => {
      setIsVisible(false)
      clearTimeout(hideTimeout)
      hideTimeout = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
    }

    // Uncomment to enable auto-hide behavior
    // window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      // window.removeEventListener('scroll', handleScroll)
      clearTimeout(hideTimeout)
    }
  }, [])

  if (sections.length === 0) {
    return null
  }

  const containerClasses = [styles.navigationDots, styles[`position-${position}`], className, !isVisible && styles.hidden].filter(Boolean).join(' ')

  return (
    <nav className={containerClasses} aria-label="Section navigation" role="navigation" id="navigation">
      <div className={styles.dotsContainer} role="list" aria-label={`Navigate between ${sections.length} sections`}>
        {sections.map((section, index) => {
          const isActive = currentSection === section.id
          const isHovered = hoveredSection === section.id
          const ariaAttributes = getNavigationAriaAttributes(section.id, section.title, isActive)

          return (
            <div key={section.id} className={styles.dotWrapper} role="listitem">
              <button className={`${styles.navDot} ${isActive ? styles.active : ''} ${isHovered ? styles.hovered : ''}`} onClick={(e) => handleDotClick(section.id, e)} onKeyDown={(e) => handleKeyDown(e, section.id)} onMouseEnter={() => setHoveredSection(section.id)} onMouseLeave={() => setHoveredSection(null)} onFocus={() => setHoveredSection(section.id)} onBlur={() => setHoveredSection(null)} {...ariaAttributes} title={section.title} data-section={section.id} aria-describedby={`${section.id}-description`}>
                <span className={styles.dotInner} />
                {isActive && <span className={styles.activeIndicator} aria-hidden="true" />}
              </button>

              {/* Optional label tooltip */}
              {(showLabels || isHovered) && (
                <div className={`${styles.dotLabel} ${styles[`label-${position}`]}`} aria-hidden="true">
                  {section.title}
                </div>
              )}

              {/* Hidden description for screen readers */}
              <div id={`${section.id}-description`} className={styles.srOnly}>
                Section {index + 1} of {sections.length}: {section.title}
                {isActive ? ' (current section)' : ''}
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress indicator between dots */}
      <div className={styles.progressTrack} aria-hidden="true">
        <div
          className={styles.progressIndicator}
          style={{
            transform: `translateY(${(sections.findIndex((s) => s.id === currentSection) / Math.max(1, sections.length - 1)) * 100}%)`,
          }}
        />
      </div>
    </nav>
  )
}
