'use client'

/**
 * Accessibility utilities for the multiverse portfolio
 * Provides screen reader support, ARIA management, and keyboard navigation
 */

/**
 * Announces content to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  if (typeof window === 'undefined') return

  // Create or get existing live region
  let liveRegion = document.getElementById('sr-live-region')
  if (!liveRegion) {
    liveRegion = document.createElement('div')
    liveRegion.id = 'sr-live-region'
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.style.position = 'absolute'
    liveRegion.style.left = '-10000px'
    liveRegion.style.width = '1px'
    liveRegion.style.height = '1px'
    liveRegion.style.overflow = 'hidden'
    document.body.appendChild(liveRegion)
  }

  // Update the live region content
  liveRegion.textContent = message

  // Clear after announcement to avoid repetition
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = ''
    }
  }, 1000)
}

/**
 * Manages focus for section navigation
 * @param {string} sectionId - The ID of the section to focus
 * @param {boolean} announceChange - Whether to announce the section change
 */
export const focusSection = (sectionId, announceChange = true) => {
  if (typeof window === 'undefined') return

  const sectionElement = document.getElementById(sectionId)
  if (!sectionElement) return

  // Set tabindex to make focusable
  sectionElement.setAttribute('tabindex', '-1')

  // Focus the section
  sectionElement.focus({ preventScroll: true })

  // Announce section change to screen readers
  if (announceChange) {
    const sectionTitle = sectionElement.getAttribute('aria-label') || sectionElement.querySelector('h1, h2, h3')?.textContent || sectionId.replace('-', ' ')

    announceToScreenReader(`Navigated to ${sectionTitle} section`)
  }
}

/**
 * Gets the section title for screen reader announcements
 * @param {string} sectionId - The section ID
 * @param {Array} sections - Array of section objects
 * @returns {string} The section title
 */
export const getSectionTitle = (sectionId, sections = []) => {
  const section = sections.find((s) => s.id === sectionId)
  return section?.title || sectionId.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
}

/**
 * Creates proper ARIA attributes for sections
 * @param {string} sectionId - The section ID
 * @param {string} title - The section title
 * @param {boolean} isActive - Whether the section is currently active
 * @returns {Object} ARIA attributes object
 */
export const getSectionAriaAttributes = (sectionId, title, isActive = false) => {
  return {
    id: sectionId,
    role: 'region',
    'aria-label': `${title} section`,
    'aria-current': isActive ? 'page' : 'false',
    tabIndex: '-1',
  }
}

/**
 * Creates ARIA attributes for navigation elements
 * @param {string} sectionId - The target section ID
 * @param {string} title - The section title
 * @param {boolean} isActive - Whether this navigation item is active
 * @returns {Object} ARIA attributes for navigation
 */
export const getNavigationAriaAttributes = (sectionId, title, isActive = false) => {
  return {
    'aria-label': `Navigate to ${title} section`,
    'aria-current': isActive ? 'page' : 'false',
    role: 'button',
    tabIndex: '0',
  }
}

/**
 * Handles keyboard navigation for interactive elements
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Function} onActivate - Function to call when activated
 * @param {Object} options - Additional options
 */
export const handleKeyboardNavigation = (event, onActivate, options = {}) => {
  const { preventDefault = true, stopPropagation = false } = options

  if (event.key === 'Enter' || event.key === ' ') {
    if (preventDefault) event.preventDefault()
    if (stopPropagation) event.stopPropagation()
    onActivate(event)
  }
}

/**
 * Creates skip link attributes
 * @param {string} targetId - The ID of the target element
 * @param {string} label - The skip link label
 * @returns {Object} Skip link attributes
 */
export const getSkipLinkAttributes = (targetId, label) => {
  return {
    href: `#${targetId}`,
    'aria-label': label,
    role: 'link',
    tabIndex: '0',
  }
}

/**
 * Manages theme-aware focus styles
 * @param {string} theme - Current theme name
 * @returns {Object} Focus style properties
 */
export const getThemeAwareFocusStyles = (theme) => {
  const focusStyles = {
    light: {
      outline: '2px solid #0066cc',
      outlineOffset: '2px',
    },
    dark: {
      outline: '2px solid #66b3ff',
      outlineOffset: '2px',
    },
    christmas: {
      outline: '2px solid #ff6b6b',
      outlineOffset: '2px',
    },
    hollywood: {
      outline: '2px solid #ffd700',
      outlineOffset: '2px',
    },
    snow: {
      outline: '2px solid #87ceeb',
      outlineOffset: '2px',
    },
    rain: {
      outline: '2px solid #4682b4',
      outlineOffset: '2px',
    },
  }

  return focusStyles[theme] || focusStyles.light
}

/**
 * Checks if user prefers reduced motion
 * @returns {boolean} True if user prefers reduced motion
 */
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Gets accessible color contrast information
 * @param {string} theme - Current theme name
 * @returns {Object} Color contrast information
 */
export const getAccessibleColors = (theme) => {
  const colorSchemes = {
    light: {
      background: '#ffffff',
      text: '#000000',
      link: '#0066cc',
      focus: '#0066cc',
    },
    dark: {
      background: '#000000',
      text: '#ffffff',
      link: '#66b3ff',
      focus: '#66b3ff',
    },
    christmas: {
      background: '#0d1b2a',
      text: '#ffffff',
      link: '#ff6b6b',
      focus: '#ff6b6b',
    },
    hollywood: {
      background: '#1a1a1a',
      text: '#ffd700',
      link: '#ffd700',
      focus: '#ffd700',
    },
    snow: {
      background: '#f0f8ff',
      text: '#2f4f4f',
      link: '#4682b4',
      focus: '#4682b4',
    },
    rain: {
      background: '#2f4f4f',
      text: '#f0f8ff',
      link: '#87ceeb',
      focus: '#87ceeb',
    },
  }

  return colorSchemes[theme] || colorSchemes.light
}
