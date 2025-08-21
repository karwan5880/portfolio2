'use client'

import { AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { AccessibilityProvider, useAccessibilityContext } from './AccessibilityProvider'
import { AnimatedSection } from './AnimatedSection'
import { ParallaxElement } from './ParallaxElement'
import styles from './SectionWrapper.module.css'
import { useAnimations } from '@/hooks/useAnimations'
import { getSectionAriaAttributes } from '@/utils/accessibility'

export const SectionWrapper = ({ id, title, children, onVisibilityChange, onRegister, className = '', parallaxElements = [], isScrolling = false, animation = 'slide', animationDelay = 0, stagger = false, staggerSpeed = 'normal', staggerType = 'slideUp' }) => {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [intersectionRatio, setIntersectionRatio] = useState(0)
  const { animationsEnabled } = useAnimations()
  const { announce, reducedMotion, isScreenReaderActive } = useAccessibilityContext()

  // Register section with parent component
  useEffect(() => {
    if (onRegister && sectionRef.current) {
      onRegister(id, sectionRef.current)
    }

    return () => {
      if (onRegister) {
        onRegister(id, null)
      }
    }
  }, [id, onRegister])

  // Enhanced Intersection Observer for better visibility detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const ratio = entry.intersectionRatio
          setIntersectionRatio(ratio)

          // Consider section "current" when it's more than 40% visible
          // This provides better UX for section switching
          if (ratio > 0.4) {
            setIsVisible(true)
            if (!hasAnimated) {
              setHasAnimated(true)
            }
            onVisibilityChange?.(id)
          } else if (ratio < 0.2) {
            setIsVisible(false)
          }
        })
      },
      {
        threshold: Array.from({ length: 21 }, (_, i) => i * 0.05), // More granular thresholds
        rootMargin: '-5% 0px -5% 0px', // Smaller margin for better detection
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [id, onVisibilityChange, hasAnimated])

  // Enhanced focus management for accessibility
  useEffect(() => {
    if (isVisible && hasAnimated) {
      const sectionElement = sectionRef.current
      if (sectionElement) {
        // Set tabindex for keyboard navigation
        sectionElement.setAttribute('tabindex', '-1')

        // Focus management for screen readers
        if (isScreenReaderActive && document.activeElement === document.body) {
          sectionElement.focus({ preventScroll: true })
        }

        // Add landmark role if not already present
        if (!sectionElement.getAttribute('role')) {
          sectionElement.setAttribute('role', 'region')
        }

        // Ensure proper heading structure
        const heading = sectionElement.querySelector('h1, h2, h3, h4, h5, h6')
        if (heading && !heading.id) {
          heading.id = `${id}-heading`
          sectionElement.setAttribute('aria-labelledby', `${id}-heading`)
        }
      }
    }
  }, [isVisible, hasAnimated, isScreenReaderActive, id])

  // Handle animation completion
  const handleAnimationComplete = () => {
    if (!hasAnimated) {
      setHasAnimated(true)
    }
  }

  // Get enhanced ARIA attributes
  const ariaAttributes = getSectionAriaAttributes(id, title, isVisible)

  return (
    <section ref={sectionRef} {...ariaAttributes} className={`${styles.sectionWrapper} ${className} ${isVisible ? styles.visible : ''} ${hasAnimated ? styles.animated : ''} ${isScrolling ? styles.scrolling : ''} ${reducedMotion ? styles.reducedMotion : ''}`} data-section={id} data-intersection-ratio={intersectionRatio.toFixed(2)} data-screen-reader={isScreenReaderActive ? 'true' : 'false'}>
      {/* Parallax background elements */}
      {parallaxElements.length > 0 && (
        <div className={styles.parallaxContainer}>
          {parallaxElements.map((element, index) => (
            <ParallaxElement key={`parallax-${index}`} preset={element.preset || 'backgroundSlow'} config={element.config} className={`${styles.parallaxElement} ${element.className || ''}`} style={element.style}>
              {element.content}
            </ParallaxElement>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {isVisible && (
          <AnimatedSection key={`${id}-content`} animation={animation} delay={animationDelay} stagger={stagger} staggerSpeed={staggerSpeed} staggerType={staggerType} className={styles.sectionContent} onAnimationComplete={handleAnimationComplete}>
            {children}
          </AnimatedSection>
        )}
      </AnimatePresence>

      {/* Fallback content for when animations are disabled or section is not visible */}
      {(!animationsEnabled || !isVisible) && <div className={styles.sectionContent}>{children}</div>}
    </section>
  )
}
