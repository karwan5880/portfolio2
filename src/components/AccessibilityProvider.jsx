'use client'

import { createContext, useContext, useEffect, useState } from 'react'

import { prefersReducedMotion } from '@/utils/accessibility'

const AccessibilityContext = createContext({
  isScreenReaderActive: false,
  reducedMotion: false,
  highContrast: false,
  focusVisible: false,
  announcements: [],
  announce: () => {},
  setFocusVisible: () => {},
})

/**
 * Accessibility Provider component
 * Manages global accessibility state and preferences
 */
export const AccessibilityProvider = ({ children }) => {
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)
  const [focusVisible, setFocusVisible] = useState(false)
  const [announcements, setAnnouncements] = useState([])

  // Detect accessibility preferences
  useEffect(() => {
    // Check for reduced motion
    const updateReducedMotion = () => {
      setReducedMotion(prefersReducedMotion())
    }
    updateReducedMotion()

    // Check for high contrast
    const updateHighContrast = () => {
      const hasHighContrast = window.matchMedia('(prefers-contrast: high)').matches || window.matchMedia('(-ms-high-contrast: active)').matches
      setHighContrast(hasHighContrast)
    }
    updateHighContrast()

    // Set up media query listeners
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)')

    reducedMotionQuery.addEventListener('change', updateReducedMotion)
    highContrastQuery.addEventListener('change', updateHighContrast)

    return () => {
      reducedMotionQuery.removeEventListener('change', updateReducedMotion)
      highContrastQuery.removeEventListener('change', updateHighContrast)
    }
  }, [])

  // Detect screen reader usage
  useEffect(() => {
    const detectScreenReader = () => {
      // Multiple detection methods
      const indicators = [
        // User agent detection
        navigator.userAgent.includes('NVDA'),
        navigator.userAgent.includes('JAWS'),
        navigator.userAgent.includes('VoiceOver'),
        navigator.userAgent.includes('Orca'),

        // API availability
        !!window.speechSynthesis,

        // DOM indicators
        document.querySelector('[aria-live]') !== null,
        document.querySelector('[role="alert"]') !== null,

        // Screen reader specific CSS
        window.getComputedStyle(document.body).getPropertyValue('-ms-high-contrast') !== '',
      ]

      const hasScreenReader = indicators.some((indicator) => indicator)
      setIsScreenReaderActive(hasScreenReader)
    }

    detectScreenReader()

    // Listen for screen reader interactions
    const handleFocusIn = (event) => {
      if (event.target.getAttribute('role') === 'region' || event.target.hasAttribute('aria-label') || event.target.hasAttribute('aria-labelledby')) {
        setIsScreenReaderActive(true)
      }
    }

    const handleKeyDown = (event) => {
      // Screen reader navigation keys
      if (event.key === 'Tab' || event.key === 'ArrowDown' || event.key === 'ArrowUp' || (event.key === 'h' && !event.ctrlKey && !event.metaKey)) {
        setFocusVisible(true)
      }
    }

    const handleMouseDown = () => {
      setFocusVisible(false)
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [])

  // Announcement system
  const announce = (message, priority = 'polite') => {
    const announcement = {
      id: Date.now(),
      message,
      priority,
      timestamp: new Date().toISOString(),
    }

    setAnnouncements((prev) => [...prev, announcement])

    // Create live region if it doesn't exist
    let liveRegion = document.getElementById(`sr-live-${priority}`)
    if (!liveRegion) {
      liveRegion = document.createElement('div')
      liveRegion.id = `sr-live-${priority}`
      liveRegion.setAttribute('aria-live', priority)
      liveRegion.setAttribute('aria-atomic', 'true')
      liveRegion.style.position = 'absolute'
      liveRegion.style.left = '-10000px'
      liveRegion.style.width = '1px'
      liveRegion.style.height = '1px'
      liveRegion.style.overflow = 'hidden'
      document.body.appendChild(liveRegion)
    }

    // Announce the message
    liveRegion.textContent = message

    // Clean up after announcement
    setTimeout(() => {
      if (liveRegion) {
        liveRegion.textContent = ''
      }
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcement.id))
    }, 3000)
  }

  // Apply accessibility classes to body
  useEffect(() => {
    const body = document.body

    body.classList.toggle('screen-reader-active', isScreenReaderActive)
    body.classList.toggle('reduced-motion', reducedMotion)
    body.classList.toggle('high-contrast', highContrast)
    body.classList.toggle('focus-visible', focusVisible)

    // Set CSS custom properties
    body.style.setProperty('--reduced-motion', reducedMotion ? '1' : '0')
    body.style.setProperty('--high-contrast', highContrast ? '1' : '0')
    body.style.setProperty('--screen-reader', isScreenReaderActive ? '1' : '0')

    return () => {
      body.classList.remove('screen-reader-active', 'reduced-motion', 'high-contrast', 'focus-visible')
    }
  }, [isScreenReaderActive, reducedMotion, highContrast, focusVisible])

  const value = {
    isScreenReaderActive,
    reducedMotion,
    highContrast,
    focusVisible,
    announcements,
    announce,
    setFocusVisible,
  }

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>
}

/**
 * Hook to use accessibility context
 */
export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error('useAccessibilityContext must be used within AccessibilityProvider')
  }
  return context
}
