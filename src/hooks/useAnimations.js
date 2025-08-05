'use client'

import { useEffect, useState } from 'react'

import { getAnimationPreset, getStaggerChild, getStaggerContainer, getViewportAnimation, prefersReducedMotion } from '@/utils/animations'

/**
 * Custom hook for managing Framer Motion animations
 * Provides utilities for section animations, staggered animations, and accessibility
 */
export const useAnimations = () => {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  // Monitor reduced motion preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (e) => {
      setReducedMotion(e.matches)
      setAnimationsEnabled(!e.matches)
    }

    // Set initial state
    setReducedMotion(mediaQuery.matches)
    setAnimationsEnabled(!mediaQuery.matches)

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  // Get section animation preset
  const getSectionAnimation = (preset = 'fade', options = {}) => {
    return getAnimationPreset(preset, {
      ...options,
      disabled: !animationsEnabled,
    })
  }

  // Get staggered container animation
  const getStaggerAnimation = (speed = 'normal', options = {}) => {
    return getStaggerContainer(speed, {
      ...options,
      disabled: !animationsEnabled,
    })
  }

  // Get staggered child animation
  const getChildAnimation = (type = 'fade', options = {}) => {
    return getStaggerChild(type, {
      ...options,
      disabled: !animationsEnabled,
    })
  }

  // Get viewport-triggered animation
  const getScrollAnimation = (type = 'fadeInUp', options = {}) => {
    return getViewportAnimation(type, {
      ...options,
      disabled: !animationsEnabled,
    })
  }

  // Create animation variants for multiple elements
  const createStaggeredVariants = (childType = 'slideUp', containerSpeed = 'normal') => {
    return {
      container: getStaggerAnimation(containerSpeed),
      child: getChildAnimation(childType),
    }
  }

  // Animation state utilities
  const isAnimationEnabled = () => animationsEnabled
  const isReducedMotion = () => reducedMotion

  // Toggle animations (for debugging or user preference)
  const toggleAnimations = () => {
    setAnimationsEnabled(!animationsEnabled)
  }

  return {
    // State
    animationsEnabled,
    reducedMotion,

    // Animation getters
    getSectionAnimation,
    getStaggerAnimation,
    getChildAnimation,
    getScrollAnimation,
    createStaggeredVariants,

    // Utilities
    isAnimationEnabled,
    isReducedMotion,
    toggleAnimations,
  }
}

/**
 * Hook for managing entrance animations with intersection observer
 * Provides better control over when animations trigger
 */
export const useEntranceAnimation = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const { animationsEnabled } = useAnimations()

  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true, delay = 0 } = options

  // Create ref for the element to observe
  const ref = (element) => {
    if (!element || !animationsEnabled) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
            if (triggerOnce) {
              setHasAnimated(true)
            }
          }, delay)

          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce && !hasAnimated) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }

  // Reset animation state
  const resetAnimation = () => {
    setIsVisible(false)
    setHasAnimated(false)
  }

  return {
    ref,
    isVisible,
    hasAnimated,
    resetAnimation,
    animationsEnabled,
  }
}

/**
 * Hook for managing scroll-triggered animations
 * Provides utilities for animations that trigger based on scroll position
 */
export const useScrollAnimation = (options = {}) => {
  const [scrollY, setScrollY] = useState(0)
  const [isScrollingDown, setIsScrollingDown] = useState(false)
  const { animationsEnabled } = useAnimations()

  const {
    throttle = 16, // ~60fps
  } = options

  useEffect(() => {
    if (!animationsEnabled) return

    let lastScrollY = window.scrollY
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY
          setScrollY(currentScrollY)
          setIsScrollingDown(currentScrollY > lastScrollY)
          lastScrollY = currentScrollY
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [animationsEnabled, throttle])

  // Get scroll progress (0-1)
  const getScrollProgress = () => {
    if (typeof window === 'undefined') return 0
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    return docHeight > 0 ? scrollY / docHeight : 0
  }

  // Get scroll progress for specific element
  const getElementScrollProgress = (element) => {
    if (!element || typeof window === 'undefined') return 0

    const rect = element.getBoundingClientRect()
    const elementTop = rect.top + scrollY
    const elementHeight = rect.height
    const windowHeight = window.innerHeight

    const startOffset = elementTop - windowHeight
    const endOffset = elementTop + elementHeight
    const totalDistance = endOffset - startOffset

    if (scrollY < startOffset) return 0
    if (scrollY > endOffset) return 1

    return (scrollY - startOffset) / totalDistance
  }

  return {
    scrollY,
    isScrollingDown,
    getScrollProgress,
    getElementScrollProgress,
    animationsEnabled,
  }
}
