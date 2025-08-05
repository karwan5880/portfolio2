'use client'

import { useEffect, useRef } from 'react'

import { useAccessibilityContext } from './AccessibilityProvider'
import { getSectionTitle } from '@/utils/accessibility'

/**
 * Navigation Announcer component
 * Provides screen reader announcements for section navigation
 */
export const NavigationAnnouncer = ({ sections = [], currentSection = '', isScrolling = false, scrollProgress = 0 }) => {
  const { announce, isScreenReaderActive } = useAccessibilityContext()
  const previousSectionRef = useRef(currentSection)
  const scrollTimeoutRef = useRef(null)
  const lastAnnouncementRef = useRef('')

  // Announce section changes
  useEffect(() => {
    if (currentSection !== previousSectionRef.current && currentSection) {
      const sectionTitle = getSectionTitle(currentSection, sections)
      const currentIndex = sections.findIndex((s) => s.id === currentSection)
      const totalSections = sections.length

      const message = `${sectionTitle} section, ${currentIndex + 1} of ${totalSections}`

      // Avoid duplicate announcements
      if (message !== lastAnnouncementRef.current) {
        announce(message, 'polite')
        lastAnnouncementRef.current = message
      }

      previousSectionRef.current = currentSection
    }
  }, [currentSection, sections, announce])

  // Announce scroll progress for screen readers (throttled)
  useEffect(() => {
    if (!isScreenReaderActive || !isScrolling) return

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    scrollTimeoutRef.current = setTimeout(() => {
      const progress = Math.round(scrollProgress)
      if (progress % 25 === 0 && progress > 0 && progress < 100) {
        announce(`${progress}% scrolled`, 'polite')
      }
    }, 1000) // Throttle announcements

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [scrollProgress, isScrolling, isScreenReaderActive, announce])

  // Provide navigation instructions on first load
  useEffect(() => {
    if (isScreenReaderActive) {
      const instructions = ['Portfolio navigation: Use arrow keys to move between sections', 'Press numbers 1-9 for direct section access', 'Press H to navigate by headings', 'Press R to navigate by regions'].join('. ')

      // Delay to avoid conflicts with page load announcements
      setTimeout(() => {
        announce(instructions, 'polite')
      }, 2000)
    }
  }, [isScreenReaderActive, announce])

  // This component doesn't render anything visible
  return null
}
