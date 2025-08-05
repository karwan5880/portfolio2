'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ERROR_SEVERITY, ERROR_TYPES, globalErrorHandler, safeAsync, withErrorHandling } from '@/utils/errorHandling'
import { createThrottledFunction, performanceMonitor, useOptimizedScroll } from '@/utils/performanceOptimizations'

/**
 * Custom hook for managing scroll behavior, section navigation, and scroll progress
 * Provides utilities for smooth scrolling, section tracking, and keyboard navigation
 * Includes mobile-specific optimizations
 */
export const useScrollManager = (sections = [], options = {}) => {
  const { isMobile = false, touchSupport = false, performanceMode = 'full' } = options
  const [currentSection, setCurrentSection] = useState(sections[0]?.id || 'home')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef(null)
  const sectionsRef = useRef(new Map())
  const observerRef = useRef(null)

  // Register section refs for better scroll management
  const registerSection = useCallback((sectionId, element) => {
    if (element) {
      sectionsRef.current.set(sectionId, element)
    } else {
      sectionsRef.current.delete(sectionId)
    }
  }, [])

  // Smooth scroll to specific section with mobile optimizations and error handling
  const scrollToSection = useCallback(
    withErrorHandling(
      (sectionId) => {
        if (!sectionId) {
          throw new Error('Section ID is required for scrolling')
        }

        const sectionElement = sectionsRef.current.get(sectionId) || document.getElementById(sectionId)
        if (!sectionElement) {
          throw new Error(`Section element not found: ${sectionId}`)
        }

        try {
          // Mobile-optimized scrolling behavior
          const scrollOptions = {
            behavior: performanceMode === 'optimized' || isMobile ? 'auto' : 'smooth',
            block: isMobile ? 'center' : 'start',
            inline: 'nearest',
          }

          sectionElement.scrollIntoView(scrollOptions)

          // Update current section immediately for better UX
          setCurrentSection(sectionId)
        } catch (scrollError) {
          // Fallback to basic scroll if smooth scroll fails
          console.warn('Smooth scroll failed, using fallback method')
          const elementTop = sectionElement.offsetTop
          window.scrollTo({
            top: elementTop,
            behavior: 'auto',
          })
          setCurrentSection(sectionId)
        }
      },
      {
        type: ERROR_TYPES.SCROLL_PERFORMANCE,
        context: 'scroll_to_section',
        severity: ERROR_SEVERITY.MEDIUM,
      }
    ),
    [performanceMode, isMobile]
  )

  // Navigate to next section
  const scrollToNext = useCallback(() => {
    const currentIndex = sections.findIndex((s) => s.id === currentSection)
    if (currentIndex < sections.length - 1) {
      scrollToSection(sections[currentIndex + 1].id)
    }
  }, [currentSection, sections, scrollToSection])

  // Navigate to previous section
  const scrollToPrevious = useCallback(() => {
    const currentIndex = sections.findIndex((s) => s.id === currentSection)
    if (currentIndex > 0) {
      scrollToSection(sections[currentIndex - 1].id)
    }
  }, [currentSection, sections, scrollToSection])

  // Navigate to first section
  const scrollToFirst = useCallback(() => {
    if (sections.length > 0) {
      scrollToSection(sections[0].id)
    }
  }, [sections, scrollToSection])

  // Navigate to last section
  const scrollToLast = useCallback(() => {
    if (sections.length > 0) {
      scrollToSection(sections[sections.length - 1].id)
    }
  }, [sections, scrollToSection])

  // Handle scroll progress tracking with advanced performance optimizations and error handling
  useEffect(() => {
    const throttleDelay = performanceMode === 'optimized' || isMobile ? 32 : 16 // Reduce frequency on mobile

    const handleScrollCore = withErrorHandling(
      () => {
        try {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight

          if (docHeight <= 0) {
            // Handle edge case where document height calculation fails
            setScrollProgress(0)
            return
          }

          const progress = (scrollTop / docHeight) * 100
          const clampedProgress = Math.min(100, Math.max(0, progress))

          if (isNaN(clampedProgress)) {
            throw new Error('Invalid scroll progress calculation')
          }

          setScrollProgress(clampedProgress)

          // Track scrolling state with debouncing (longer delay on mobile)
          setIsScrolling(true)
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
          scrollTimeoutRef.current = setTimeout(
            () => {
              setIsScrolling(false)
            },
            isMobile ? 300 : 150
          )
        } catch (scrollError) {
          // Fallback to basic scroll tracking
          console.warn('Advanced scroll tracking failed, using basic fallback')
          const basicProgress = Math.min(100, Math.max(0, (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100))
          if (!isNaN(basicProgress)) {
            setScrollProgress(basicProgress)
          }
        }
      },
      {
        type: ERROR_TYPES.SCROLL_PERFORMANCE,
        context: 'scroll_progress_tracking',
        severity: ERROR_SEVERITY.LOW,
      }
    )

    // Use performance-aware throttling with error handling
    const handleScroll = createThrottledFunction(performanceMonitor.measureScrollPerformance(handleScrollCore), throttleDelay, {
      leading: true,
      trailing: true,
      performanceAware: true,
    })

    // Use passive listeners for better mobile performance
    const scrollOptions = { passive: true }

    try {
      window.addEventListener('scroll', handleScroll, scrollOptions)
    } catch (listenerError) {
      globalErrorHandler.handleError(listenerError, {
        type: ERROR_TYPES.SCROLL_PERFORMANCE,
        context: 'scroll_listener_setup',
        severity: ERROR_SEVERITY.HIGH,
      })
    }

    return () => {
      try {
        window.removeEventListener('scroll', handleScroll, scrollOptions)
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
      } catch (cleanupError) {
        console.warn('Error during scroll listener cleanup:', cleanupError)
      }
    }
  }, [performanceMode, isMobile])

  // Set up Intersection Observer for section detection with mobile optimizations and error handling
  useEffect(() => {
    if (typeof window === 'undefined' || sections.length === 0) return

    try {
      // Mobile-optimized observer options
      const observerOptions = {
        root: null,
        rootMargin: isMobile ? '-10% 0px -10% 0px' : '-20% 0px -20% 0px', // Less strict on mobile
        threshold: performanceMode === 'optimized' ? [0, 0.5, 1.0] : [0, 0.25, 0.5, 0.75, 1.0], // Fewer thresholds for performance
      }

      const handleIntersection = withErrorHandling(
        (entries) => {
          if (!entries || entries.length === 0) {
            return
          }

          // Find the section with the highest intersection ratio
          let mostVisibleSection = null
          let highestRatio = 0

          entries.forEach((entry) => {
            if (!entry.target || !entry.target.id) {
              console.warn('Intersection entry missing target or ID')
              return
            }

            if (entry.intersectionRatio > highestRatio) {
              highestRatio = entry.intersectionRatio
              mostVisibleSection = entry.target.id
            }
          })

          // Only update if we have a significantly visible section (lower threshold on mobile)
          const visibilityThreshold = isMobile ? 0.1 : 0.25
          if (mostVisibleSection && highestRatio > visibilityThreshold) {
            setCurrentSection(mostVisibleSection)
          }
        },
        {
          type: ERROR_TYPES.SCROLL_PERFORMANCE,
          context: 'intersection_observer_callback',
          severity: ERROR_SEVERITY.LOW,
        }
      )

      // Check if IntersectionObserver is supported
      if (!window.IntersectionObserver) {
        throw new Error('IntersectionObserver not supported')
      }

      observerRef.current = new IntersectionObserver(handleIntersection, observerOptions)

      // Observe all registered sections
      let observedCount = 0
      sectionsRef.current.forEach((element, sectionId) => {
        if (element && observerRef.current) {
          try {
            observerRef.current.observe(element)
            observedCount++
          } catch (observeError) {
            globalErrorHandler.handleError(observeError, {
              type: ERROR_TYPES.SCROLL_PERFORMANCE,
              context: 'intersection_observer_observe',
              severity: ERROR_SEVERITY.MEDIUM,
              metadata: { sectionId },
            })
          }
        }
      })

      console.log(`Intersection Observer set up for ${observedCount} sections`)
    } catch (observerError) {
      globalErrorHandler.handleError(observerError, {
        type: ERROR_TYPES.SCROLL_PERFORMANCE,
        context: 'intersection_observer_setup',
        severity: ERROR_SEVERITY.HIGH,
      })

      // Fallback to scroll-based section detection
      console.warn('Falling back to scroll-based section detection')
      // Implementation would go here for fallback detection
    }

    return () => {
      try {
        if (observerRef.current) {
          observerRef.current.disconnect()
        }
      } catch (disconnectError) {
        console.warn('Error disconnecting intersection observer:', disconnectError)
      }
    }
  }, [sections, isMobile, performanceMode])

  // Re-observe sections when they change
  useEffect(() => {
    if (!observerRef.current) return

    // Disconnect and reconnect observer when sections change
    observerRef.current.disconnect()

    sectionsRef.current.forEach((element, sectionId) => {
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })
  }, [sectionsRef.current.size])

  // Handle keyboard navigation (disabled on mobile for better touch experience)
  useEffect(() => {
    if (isMobile || touchSupport) return // Skip keyboard navigation on mobile

    const handleKeyDown = (event) => {
      // Only handle navigation keys when not focused on input elements
      const activeElement = document.activeElement
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA' || activeElement?.contentEditable === 'true' || activeElement?.getAttribute('role') === 'textbox') {
        return
      }

      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          event.preventDefault()
          scrollToNext()
          break
        case 'ArrowUp':
        case 'PageUp':
          event.preventDefault()
          scrollToPrevious()
          break
        case 'Home':
          event.preventDefault()
          scrollToFirst()
          break
        case 'End':
          event.preventDefault()
          scrollToLast()
          break
        case ' ': // Spacebar
          event.preventDefault()
          if (event.shiftKey) {
            scrollToPrevious()
          } else {
            scrollToNext()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [scrollToNext, scrollToPrevious, scrollToFirst, scrollToLast, isMobile, touchSupport])

  // Get current section index
  const getCurrentSectionIndex = useCallback(() => {
    return sections.findIndex((s) => s.id === currentSection)
  }, [currentSection, sections])

  // Check if can navigate to next/previous
  const canNavigateNext = useCallback(() => {
    const currentIndex = getCurrentSectionIndex()
    return currentIndex < sections.length - 1
  }, [getCurrentSectionIndex, sections.length])

  const canNavigatePrevious = useCallback(() => {
    const currentIndex = getCurrentSectionIndex()
    return currentIndex > 0
  }, [getCurrentSectionIndex])

  return {
    // State
    currentSection,
    scrollProgress,
    isScrolling,

    // Navigation functions
    scrollToSection,
    scrollToNext,
    scrollToPrevious,
    scrollToFirst,
    scrollToLast,

    // Utility functions
    registerSection,
    getCurrentSectionIndex,
    canNavigateNext,
    canNavigatePrevious,

    // Section management
    setCurrentSection,
  }
}
