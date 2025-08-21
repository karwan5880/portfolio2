'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { performanceMonitor, usePerformanceMonitor } from '@/utils/performanceOptimizations'

/**
 * Hook for performance-optimized animations
 * Automatically adjusts animation complexity based on device performance
 */
export const useOptimizedAnimations = (options = {}) => {
  const { enablePerformanceMonitoring = true, fallbackToCSS = true, adaptiveComplexity = true, maxAnimations = 10 } = options

  const [animationLevel, setAnimationLevel] = useState('full') // 'full', 'reduced', 'minimal', 'none'
  const [activeAnimations, setActiveAnimations] = useState(new Set())
  const animationRefs = useRef(new Map())
  const performanceCheckInterval = useRef(null)

  // Monitor performance metrics
  const { metrics, isPerformancePoor } = usePerformanceMonitor({
    autoStart: enablePerformanceMonitoring,
    onMetricChange: (metric, value) => {
      if (adaptiveComplexity && (metric === 'frameRate' || metric === 'scrollPerformance')) {
        updateAnimationLevel()
      }
    },
  })

  // Update animation level based on performance
  const updateAnimationLevel = useCallback(() => {
    const { frameRate, scrollPerformance, memoryUsage } = metrics

    // Determine animation level based on performance metrics
    if (frameRate < 20 || scrollPerformance > 50 || memoryUsage > 150) {
      setAnimationLevel('none')
    } else if (frameRate < 30 || scrollPerformance > 30 || memoryUsage > 100) {
      setAnimationLevel('minimal')
    } else if (frameRate < 45 || scrollPerformance > 20 || memoryUsage > 75) {
      setAnimationLevel('reduced')
    } else {
      setAnimationLevel('full')
    }
  }, [metrics])

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = () => {
      if (mediaQuery.matches) {
        setAnimationLevel('minimal')
      } else if (!isPerformancePoor) {
        setAnimationLevel('full')
      }
    }

    handleChange()
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [isPerformancePoor])

  // Register animation
  const registerAnimation = useCallback(
    (id, animationConfig) => {
      if (activeAnimations.size >= maxAnimations) {
        console.warn(`Maximum animations (${maxAnimations}) reached. Skipping animation: ${id}`)
        return null
      }

      const optimizedConfig = getOptimizedAnimationConfig(animationConfig, animationLevel)
      animationRefs.current.set(id, optimizedConfig)
      setActiveAnimations((prev) => new Set(prev).add(id))

      return optimizedConfig
    },
    [animationLevel, maxAnimations, activeAnimations.size]
  )

  // Unregister animation
  const unregisterAnimation = useCallback((id) => {
    animationRefs.current.delete(id)
    setActiveAnimations((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }, [])

  // Get optimized animation config based on performance level
  const getOptimizedAnimationConfig = (config, level) => {
    const baseConfig = { ...config }

    switch (level) {
      case 'none':
        return {
          ...baseConfig,
          animate: baseConfig.initial || {},
          transition: { duration: 0 },
          disabled: true,
        }

      case 'minimal':
        return {
          ...baseConfig,
          transition: {
            ...baseConfig.transition,
            duration: Math.min(baseConfig.transition?.duration || 0.3, 0.2),
            ease: 'linear',
          },
          // Remove complex transforms
          animate: simplifyAnimationProps(baseConfig.animate),
        }

      case 'reduced':
        return {
          ...baseConfig,
          transition: {
            ...baseConfig.transition,
            duration: Math.min(baseConfig.transition?.duration || 0.5, 0.3),
            ease: baseConfig.transition?.ease || 'easeOut',
          },
          // Reduce animation complexity
          animate: reduceAnimationComplexity(baseConfig.animate),
        }

      case 'full':
      default:
        return baseConfig
    }
  }

  // Simplify animation properties for minimal performance
  const simplifyAnimationProps = (animate) => {
    if (!animate || typeof animate !== 'object') return animate

    const simplified = {}

    // Only keep opacity and simple transforms
    if ('opacity' in animate) simplified.opacity = animate.opacity
    if ('x' in animate) simplified.x = animate.x
    if ('y' in animate) simplified.y = animate.y

    return simplified
  }

  // Reduce animation complexity for reduced performance
  const reduceAnimationComplexity = (animate) => {
    if (!animate || typeof animate !== 'object') return animate

    const reduced = { ...animate }

    // Remove expensive properties
    delete reduced.filter
    delete reduced.backdropFilter
    delete reduced.boxShadow

    // Simplify transforms
    if ('scale' in reduced && Array.isArray(reduced.scale)) {
      reduced.scale = reduced.scale[reduced.scale.length - 1] // Use final value only
    }

    return reduced
  }

  // Create optimized animation variants
  const createOptimizedVariants = useCallback(
    (variants) => {
      const optimized = {}

      Object.entries(variants).forEach(([key, variant]) => {
        optimized[key] = getOptimizedAnimationConfig(variant, animationLevel)
      })

      return optimized
    },
    [animationLevel]
  )

  // Performance-aware animation trigger
  const triggerAnimation = useCallback(
    (id, animationFn) => {
      if (animationLevel === 'none') {
        return Promise.resolve()
      }

      const startTime = performance.now()

      return new Promise((resolve) => {
        const wrappedAnimation = performanceMonitor.measureAnimationPerformance(id, () => {
          return animationFn()
        })

        const result = wrappedAnimation()

        // Handle both sync and async animations
        if (result && typeof result.then === 'function') {
          result.then(() => {
            const endTime = performance.now()
            console.debug(`Animation ${id} completed in ${endTime - startTime}ms`)
            resolve()
          })
        } else {
          const endTime = performance.now()
          console.debug(`Animation ${id} completed in ${endTime - startTime}ms`)
          resolve()
        }
      })
    },
    [animationLevel]
  )

  // Batch animation updates for better performance
  const batchAnimationUpdates = useCallback((updates) => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        updates.forEach((update) => update())
        resolve()
      })
    })
  }, [])

  // Get current animation settings
  const getAnimationSettings = useCallback(() => {
    return {
      level: animationLevel,
      enabled: animationLevel !== 'none',
      reducedMotion: animationLevel === 'minimal',
      activeCount: activeAnimations.size,
      maxAnimations,
      canAddMore: activeAnimations.size < maxAnimations,
    }
  }, [animationLevel, activeAnimations.size, maxAnimations])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (performanceCheckInterval.current) {
        clearInterval(performanceCheckInterval.current)
      }
      animationRefs.current.clear()
    }
  }, [])

  return {
    // Animation level and settings
    animationLevel,
    animationSettings: getAnimationSettings(),

    // Animation management
    registerAnimation,
    unregisterAnimation,
    triggerAnimation,

    // Optimization utilities
    createOptimizedVariants,
    batchAnimationUpdates,

    // Performance metrics
    performanceMetrics: metrics,
    isPerformancePoor,
  }
}

/**
 * Hook for lazy-loaded animation components
 * Only loads animation libraries when needed and performance allows
 */
export const useLazyAnimations = (animationLibrary = 'framer-motion') => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [animationComponents, setAnimationComponents] = useState(null)
  const [error, setError] = useState(null)
  const { animationLevel } = useOptimizedAnimations()

  useEffect(() => {
    // Don't load animations if performance is too poor
    if (animationLevel === 'none') {
      return
    }

    const loadAnimationLibrary = async () => {
      try {
        let components

        switch (animationLibrary) {
          case 'framer-motion':
            const framerMotion = await import('framer-motion')
            components = {
              motion: framerMotion.motion,
              AnimatePresence: framerMotion.AnimatePresence,
              useAnimation: framerMotion.useAnimation,
              useScroll: framerMotion.useScroll,
              useTransform: framerMotion.useTransform,
            }
            break

          default:
            throw new Error(`Unsupported animation library: ${animationLibrary}`)
        }

        setAnimationComponents(components)
        setIsLoaded(true)
      } catch (err) {
        setError(err)
        console.warn(`Failed to load animation library ${animationLibrary}:`, err)
      }
    }

    loadAnimationLibrary()
  }, [animationLibrary, animationLevel])

  return {
    isLoaded,
    animationComponents,
    error,
    shouldUseAnimations: animationLevel !== 'none',
  }
}

/**
 * Hook for performance-aware intersection observer animations
 * Optimizes animation triggers based on viewport and performance
 */
export const useIntersectionAnimations = (options = {}) => {
  const { threshold = 0.1, rootMargin = '0px', triggerOnce = true, animationDelay = 0 } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const elementRef = useRef(null)
  const observerRef = useRef(null)
  const { animationLevel } = useOptimizedAnimations()

  useEffect(() => {
    const element = elementRef.current
    if (!element || animationLevel === 'none') return

    // Adjust threshold based on performance
    const adjustedThreshold = animationLevel === 'minimal' ? 0.5 : threshold

    const observerOptions = {
      threshold: adjustedThreshold,
      rootMargin,
    }

    const handleIntersection = (entries) => {
      const [entry] = entries
      const isVisible = entry.isIntersecting

      if (isVisible && (!triggerOnce || !hasTriggered)) {
        setTimeout(() => {
          setIsIntersecting(true)
          setHasTriggered(true)
        }, animationDelay)
      } else if (!triggerOnce) {
        setIsIntersecting(isVisible)
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersection, observerOptions)
    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [threshold, rootMargin, triggerOnce, animationDelay, animationLevel, hasTriggered])

  return {
    ref: elementRef,
    isIntersecting,
    hasTriggered,
    shouldAnimate: isIntersecting && animationLevel !== 'none',
  }
}
