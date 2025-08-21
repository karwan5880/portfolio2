'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { getSectionFromURL, getSectionMetadata, getShareableURL, parseURLParameters, setupBrowserNavigation, updateURL, validateSectionId } from '@/utils/routing'

/**
 * Hook for managing URL routing and browser history
 * Integrates with the multiverse portfolio navigation system
 */
export const useURLRouting = (sections = [], onSectionChange = null) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [currentSection, setCurrentSection] = useState('home')
  const [urlParams, setUrlParams] = useState({})

  // Initialize section from URL
  useEffect(() => {
    const sectionFromURL = getSectionFromURL(pathname, searchParams)
    const validSection = validateSectionId(sectionFromURL)

    setCurrentSection(validSection)

    // Parse additional URL parameters
    const params = parseURLParameters(searchParams)
    setUrlParams(params)

    // Notify parent component
    if (onSectionChange && validSection !== currentSection) {
      onSectionChange(validSection)
    }
  }, [pathname, searchParams, onSectionChange, currentSection])

  // Set up browser navigation handling
  useEffect(() => {
    const cleanup = setupBrowserNavigation((sectionId) => {
      const validSection = validateSectionId(sectionId)
      setCurrentSection(validSection)

      if (onSectionChange) {
        onSectionChange(validSection)
      }
    })

    return cleanup
  }, [onSectionChange])

  // Navigate to a section
  const navigateToSection = useCallback(
    (sectionId, options = {}) => {
      const { addToHistory = false, updateURL: shouldUpdateURL = true, scrollToSection = null } = options

      const validSection = validateSectionId(sectionId)

      // Update current section state
      setCurrentSection(validSection)

      // Update URL if requested
      if (shouldUpdateURL) {
        updateURL(validSection, !addToHistory)
      }

      // Scroll to section if function provided
      if (scrollToSection && typeof scrollToSection === 'function') {
        scrollToSection(validSection)
      }

      // Notify parent component
      if (onSectionChange) {
        onSectionChange(validSection)
      }
    },
    [onSectionChange]
  )

  // Get shareable URL for current or specific section
  const getShareURL = useCallback(
    (sectionId = null, options = {}) => {
      const targetSection = sectionId || currentSection
      return getShareableURL(targetSection, options)
    },
    [currentSection]
  )

  // Get metadata for current or specific section
  const getMetadata = useCallback(
    (sectionId = null) => {
      const targetSection = sectionId || currentSection
      return getSectionMetadata(targetSection)
    },
    [currentSection]
  )

  // Check if a section is currently active
  const isActiveSection = useCallback(
    (sectionId) => {
      return validateSectionId(sectionId) === currentSection
    },
    [currentSection]
  )

  // Get next/previous section for navigation
  const getAdjacentSection = useCallback(
    (direction = 'next') => {
      if (!sections.length) return null

      const currentIndex = sections.findIndex((s) => s.id === currentSection)
      if (currentIndex === -1) return null

      let targetIndex
      if (direction === 'next') {
        targetIndex = currentIndex + 1 >= sections.length ? 0 : currentIndex + 1
      } else {
        targetIndex = currentIndex - 1 < 0 ? sections.length - 1 : currentIndex - 1
      }

      return sections[targetIndex]?.id || null
    },
    [sections, currentSection]
  )

  // Navigate to next section
  const navigateNext = useCallback(
    (options = {}) => {
      const nextSection = getAdjacentSection('next')
      if (nextSection) {
        navigateToSection(nextSection, options)
      }
    },
    [getAdjacentSection, navigateToSection]
  )

  // Navigate to previous section
  const navigatePrevious = useCallback(
    (options = {}) => {
      const prevSection = getAdjacentSection('previous')
      if (prevSection) {
        navigateToSection(prevSection, options)
      }
    },
    [getAdjacentSection, navigateToSection]
  )

  // Handle legacy redirects
  const handleLegacyRedirect = useCallback(
    (legacyPath) => {
      // This would be called from legacy pages
      const sectionId = legacyPath.replace('/', '') || 'home'
      const validSection = validateSectionId(sectionId)

      // Use Next.js router for the redirect
      router.replace(`/multiverse${validSection === 'home' ? '' : `?section=${validSection}`}`)
    },
    [router]
  )

  // Update document title based on current section
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const metadata = getMetadata()
      document.title = metadata.title

      // Update meta description if meta tag exists
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', metadata.description)
      }
    }
  }, [currentSection, getMetadata])

  // Apply URL parameters (theme, animations, etc.)
  useEffect(() => {
    if (urlParams.theme) {
      // Dispatch event for theme managers to pick up
      window.dispatchEvent(
        new CustomEvent('urlthemechange', {
          detail: { theme: urlParams.theme },
        })
      )
    }

    if (typeof urlParams.animations === 'boolean') {
      // Dispatch event for animation preferences
      window.dispatchEvent(
        new CustomEvent('urlanimationchange', {
          detail: { enabled: urlParams.animations },
        })
      )
    }
  }, [urlParams])

  return {
    // Current state
    currentSection,
    urlParams,

    // Navigation functions
    navigateToSection,
    navigateNext,
    navigatePrevious,

    // Utility functions
    getShareURL,
    getMetadata,
    isActiveSection,
    getAdjacentSection,
    handleLegacyRedirect,

    // Section management
    validateSectionId,

    // Browser integration
    router,
    pathname,
    searchParams,
  }
}
