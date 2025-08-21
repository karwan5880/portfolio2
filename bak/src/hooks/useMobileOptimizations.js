'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Hook for mobile-specific optimizations
 * Handles touch gestures, mobile detection, and performance optimizations
 */
export const useMobileOptimizations = () => {
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [orientation, setOrientation] = useState('portrait')
  const [touchSupport, setTouchSupport] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const width = window.innerWidth
      const height = window.innerHeight

      // Mobile detection
      const mobileCheck = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) || width <= 768
      setIsMobile(mobileCheck)

      // Tablet detection
      const tabletCheck = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (width >= 768 && width <= 1024)
      setIsTablet(tabletCheck)

      // Touch support detection
      const touchCheck = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
      setTouchSupport(touchCheck)

      // Orientation detection
      const orientationCheck = width > height ? 'landscape' : 'portrait'
      setOrientation(orientationCheck)

      setIsLoading(false)
    }

    checkDevice()

    // Listen for resize and orientation changes
    const handleResize = () => {
      checkDevice()
    }

    const handleOrientationChange = () => {
      // Delay to allow for proper dimension updates
      setTimeout(checkDevice, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleOrientationChange)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  return {
    isMobile,
    isTablet,
    orientation,
    touchSupport,
    isLoading,
    isDesktop: !isMobile && !isTablet,
    isLandscape: orientation === 'landscape',
    isPortrait: orientation === 'portrait',
  }
}

/**
 * Hook for touch gesture handling
 * Provides swipe detection and touch event management
 */
export const useTouchGestures = (options = {}) => {
  const { onSwipeLeft = null, onSwipeRight = null, onSwipeUp = null, onSwipeDown = null, minSwipeDistance = 50, maxSwipeTime = 300, preventScroll = false } = options

  const touchStartRef = useRef(null)
  const touchEndRef = useRef(null)
  const touchTimeRef = useRef(null)

  const handleTouchStart = useCallback(
    (e) => {
      if (preventScroll) {
        e.preventDefault()
      }

      const touch = e.touches[0]
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      }
      touchTimeRef.current = Date.now()
      touchEndRef.current = null
    },
    [preventScroll]
  )

  const handleTouchMove = useCallback(
    (e) => {
      if (preventScroll) {
        e.preventDefault()
      }

      const touch = e.touches[0]
      touchEndRef.current = {
        x: touch.clientX,
        y: touch.clientY,
      }
    },
    [preventScroll]
  )

  const handleTouchEnd = useCallback(
    (e) => {
      if (preventScroll) {
        e.preventDefault()
      }

      if (!touchStartRef.current || !touchEndRef.current) return

      const deltaX = touchEndRef.current.x - touchStartRef.current.x
      const deltaY = touchEndRef.current.y - touchStartRef.current.y
      const deltaTime = Date.now() - touchTimeRef.current

      // Check if swipe was fast enough
      if (deltaTime > maxSwipeTime) return

      const absDeltaX = Math.abs(deltaX)
      const absDeltaY = Math.abs(deltaY)

      // Determine swipe direction
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (absDeltaX > minSwipeDistance) {
          if (deltaX > 0) {
            onSwipeRight?.(e, { deltaX, deltaY, deltaTime })
          } else {
            onSwipeLeft?.(e, { deltaX, deltaY, deltaTime })
          }
        }
      } else {
        // Vertical swipe
        if (absDeltaY > minSwipeDistance) {
          if (deltaY > 0) {
            onSwipeDown?.(e, { deltaX, deltaY, deltaTime })
          } else {
            onSwipeUp?.(e, { deltaX, deltaY, deltaTime })
          }
        }
      }

      // Reset touch data
      touchStartRef.current = null
      touchEndRef.current = null
      touchTimeRef.current = null
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance, maxSwipeTime, preventScroll]
  )

  return {
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  }
}

/**
 * Hook for mobile performance optimizations
 * Manages resource loading and performance settings
 */
export const useMobilePerformance = () => {
  const [performanceMode, setPerformanceMode] = useState('auto')
  const [reducedAnimations, setReducedAnimations] = useState(false)
  const [lowPowerMode, setLowPowerMode] = useState(false)
  const { isMobile } = useMobileOptimizations()

  useEffect(() => {
    // Detect performance constraints
    const detectPerformanceMode = () => {
      // Check for low-end device indicators
      const isLowEnd = navigator.hardwareConcurrency <= 2 || navigator.deviceMemory <= 2 || /Android.*[2-4]\./i.test(navigator.userAgent)

      // Check for battery API (if available)
      if ('getBattery' in navigator) {
        navigator.getBattery().then((battery) => {
          setLowPowerMode(battery.level < 0.2 || battery.charging === false)
        })
      }

      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      setReducedAnimations(prefersReducedMotion || isLowEnd)

      // Set performance mode
      if (isLowEnd || isMobile) {
        setPerformanceMode('optimized')
      } else {
        setPerformanceMode('full')
      }
    }

    detectPerformanceMode()

    // Listen for battery changes
    if ('getBattery' in navigator) {
      navigator.getBattery().then((battery) => {
        const updateBatteryStatus = () => {
          setLowPowerMode(battery.level < 0.2 || battery.charging === false)
        }

        battery.addEventListener('levelchange', updateBatteryStatus)
        battery.addEventListener('chargingchange', updateBatteryStatus)

        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus)
          battery.removeEventListener('chargingchange', updateBatteryStatus)
        }
      })
    }
  }, [isMobile])

  // Get optimized settings based on performance mode
  const getOptimizedSettings = useCallback(() => {
    switch (performanceMode) {
      case 'optimized':
        return {
          particleCount: 20,
          animationDuration: 0.3,
          blurRadius: 5,
          shadowIntensity: 0.3,
          enableParallax: false,
          enableComplexAnimations: false,
          maxConcurrentAnimations: 3,
        }
      case 'full':
      default:
        return {
          particleCount: 100,
          animationDuration: 0.6,
          blurRadius: 20,
          shadowIntensity: 0.6,
          enableParallax: true,
          enableComplexAnimations: true,
          maxConcurrentAnimations: 10,
        }
    }
  }, [performanceMode])

  return {
    performanceMode,
    reducedAnimations,
    lowPowerMode,
    optimizedSettings: getOptimizedSettings(),
    setPerformanceMode,
  }
}

/**
 * Hook for mobile viewport management
 * Handles viewport meta tag updates and safe area handling
 */
export const useMobileViewport = () => {
  const [safeAreaInsets, setSafeAreaInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)

  useEffect(() => {
    // Update viewport height and safe area insets
    const updateViewport = () => {
      // Get actual viewport height (excluding browser UI)
      const vh = window.innerHeight
      setViewportHeight(vh)

      // Detect keyboard on mobile
      const heightDiff = window.screen.height - vh
      setIsKeyboardOpen(heightDiff > 150) // Threshold for keyboard detection

      // Get safe area insets from CSS environment variables
      const computedStyle = getComputedStyle(document.documentElement)
      setSafeAreaInsets({
        top: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-top)')) || 0,
        right: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-right)')) || 0,
        bottom: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-bottom)')) || 0,
        left: parseInt(computedStyle.getPropertyValue('env(safe-area-inset-left)')) || 0,
      })

      // Update CSS custom property for viewport height
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`)
    }

    updateViewport()

    // Listen for viewport changes
    window.addEventListener('resize', updateViewport)
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewport, 100)
    })

    return () => {
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('orientationchange', updateViewport)
    }
  }, [])

  return {
    safeAreaInsets,
    viewportHeight,
    isKeyboardOpen,
    cssVh: `${viewportHeight * 0.01}px`,
  }
}

/**
 * Hook for mobile-specific theme optimizations
 * Provides mobile-optimized theme settings
 */
export const useMobileTheme = () => {
  const { isMobile, performanceMode } = useMobilePerformance()
  const [mobileThemeSettings, setMobileThemeSettings] = useState({})

  useEffect(() => {
    if (isMobile) {
      const optimizedSettings = {
        // Reduce particle counts
        particleMultiplier: performanceMode === 'optimized' ? 0.3 : 0.6,

        // Simplify animations
        animationComplexity: performanceMode === 'optimized' ? 'simple' : 'normal',

        // Reduce blur effects
        blurIntensity: performanceMode === 'optimized' ? 0.5 : 0.8,

        // Optimize shadows
        shadowComplexity: performanceMode === 'optimized' ? 'minimal' : 'normal',

        // Touch-friendly sizing
        minTouchTarget: 44, // iOS HIG recommendation
        touchPadding: 8,

        // Mobile-specific colors (higher contrast)
        contrastBoost: 1.1,

        // Simplified gradients
        gradientSteps: performanceMode === 'optimized' ? 2 : 4,
      }

      setMobileThemeSettings(optimizedSettings)
    }
  }, [isMobile, performanceMode])

  return {
    mobileThemeSettings,
    isMobileOptimized: isMobile,
  }
}
