'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useTheme } from '@/contexts/ThemeContext'
import { announceToScreenReader, focusSection, getSectionTitle, getThemeAwareFocusStyles, prefersReducedMotion } from '@/utils/accessibility'

/**
 * Custom hook for managing accessibility features
 * Provides screen reader support, keyboard navigation, and focus management
 */
export const useAccessibility = (sections = [], currentSection = '', onSectionChange) => {
  const { currentTheme } = useTheme()
  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const previousSectionRef = useRef(currentSection)
  const announcementTimeoutRef = useRef(null)

  // Detect screen reader usage
  useEffect(() => {
    const detectScreenReader = () => {
      // Check for common screen reader indicators
      const hasScreenReader = navigator.userAgent.includes('NVDA') || navigator.userAgent.includes('JAWS') || navigator.userAgent.includes('VoiceOver') || window.speechSynthesis || document.querySelector('[aria-live]') !== null

      setIsScreenReaderActive(hasScreenReader)
    }

    detectScreenReader()

    // Listen for screen reader specific events
    const handleFocusIn = (event) => {
      if (event.target.getAttribute('role') === 'region') {
        setIsScreenReaderActive(true)
      }
    }

    document.addEventListener('focusin', handleFocusIn)
    return () => document.removeEventListener('focusin', handleFocusIn)
  }, [])

  // Monitor reduced motion preference
  useEffect(() => {
    const updateReducedMotion = () => {
      setReducedMotion(prefersReducedMotion())
    }

    updateReducedMotion()

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addEventListener('change', updateReducedMotion)

    return () => mediaQuery.removeEventListener('change', updateReducedMotion)
  }, [])

  // Announce section changes to screen readers
  useEffect(() => {
    if (currentSection !== previousSectionRef.current) {
      const sectionTitle = getSectionTitle(currentSection, sections)

      // Clear any pending announcements
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current)
      }

      // Delay announcement to avoid conflicts with navigation
      announcementTimeoutRef.current = setTimeout(() => {
        announceToScreenReader(`Now viewing ${sectionTitle} section`, 'polite')
      }, 500)

      previousSectionRef.current = currentSection
    }

    return () => {
      if (announcementTimeoutRef.current) {
        clearTimeout(announcementTimeoutRef.current)
      }
    }
  }, [currentSection, sections])

  // Enhanced keyboard navigation with theme awareness
  const handleGlobalKeyDown = useCallback(
    (event) => {
      // Skip if user is typing in an input
      const activeElement = document.activeElement
      if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA' || activeElement?.contentEditable === 'true' || activeElement?.getAttribute('role') === 'textbox') {
        return
      }

      const currentIndex = sections.findIndex((s) => s.id === currentSection)
      let targetSection = null

      switch (event.key) {
        case 'ArrowDown':
        case 'j': // Vim-style navigation
          event.preventDefault()
          if (currentIndex < sections.length - 1) {
            targetSection = sections[currentIndex + 1].id
          }
          break

        case 'ArrowUp':
        case 'k': // Vim-style navigation
          event.preventDefault()
          if (currentIndex > 0) {
            targetSection = sections[currentIndex - 1].id
          }
          break

        case 'Home':
        case 'g': // Vim-style go to top
          event.preventDefault()
          targetSection = sections[0]?.id
          break

        case 'End':
        case 'G': // Vim-style go to bottom
          event.preventDefault()
          targetSection = sections[sections.length - 1]?.id
          break

        case ' ': // Spacebar
          event.preventDefault()
          if (event.shiftKey) {
            // Shift + Space = previous section
            if (currentIndex > 0) {
              targetSection = sections[currentIndex - 1].id
            }
          } else {
            // Space = next section
            if (currentIndex < sections.length - 1) {
              targetSection = sections[currentIndex + 1].id
            }
          }
          break

        case 'PageDown':
          event.preventDefault()
          if (currentIndex < sections.length - 1) {
            targetSection = sections[currentIndex + 1].id
          }
          break

        case 'PageUp':
          event.preventDefault()
          if (currentIndex > 0) {
            targetSection = sections[currentIndex - 1].id
          }
          break

        // Number keys for direct section navigation
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          event.preventDefault()
          const sectionIndex = parseInt(event.key) - 1
          if (sectionIndex < sections.length) {
            targetSection = sections[sectionIndex].id
          }
          break

        // Escape key to focus current section
        case 'Escape':
          event.preventDefault()
          focusSection(currentSection, false)
          break
      }

      if (targetSection && onSectionChange) {
        onSectionChange(targetSection)
        focusSection(targetSection, true)
      }
    },
    [sections, currentSection, onSectionChange]
  )

  // Set up global keyboard navigation
  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [handleGlobalKeyDown])

  // Apply theme-aware focus styles
  const applyFocusStyles = useCallback(
    (element) => {
      if (!element) return

      const focusStyles = getThemeAwareFocusStyles(currentTheme)
      Object.assign(element.style, focusStyles)
    },
    [currentTheme]
  )

  // Focus management for section changes
  const focusCurrentSection = useCallback(
    (announceChange = true) => {
      focusSection(currentSection, announceChange)
    },
    [currentSection]
  )

  // Announce arbitrary messages to screen readers
  const announce = useCallback((message, priority = 'polite') => {
    announceToScreenReader(message, priority)
  }, [])

  // Get section navigation instructions for screen readers
  const getNavigationInstructions = useCallback(() => {
    const instructions = ['Use arrow keys or J/K to navigate between sections', 'Press Home or G to go to first section', 'Press End or Shift+G to go to last section', 'Press number keys 1-9 for direct section navigation', 'Press Space for next section, Shift+Space for previous', 'Press Escape to focus current section']
    return instructions.join('. ')
  }, [])

  return {
    // State
    isScreenReaderActive,
    reducedMotion,
    currentTheme,

    // Functions
    announce,
    focusCurrentSection,
    applyFocusStyles,
    getNavigationInstructions,

    // Utilities
    getSectionTitle: (sectionId) => getSectionTitle(sectionId, sections),
    getThemeAwareFocusStyles: () => getThemeAwareFocusStyles(currentTheme),
  }
}
