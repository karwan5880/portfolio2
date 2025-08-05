/**
 * URL routing utilities for multiverse portfolio
 * Handles section navigation, URL updates, and browser history
 */

/**
 * Valid section IDs for the multiverse portfolio
 */
export const VALID_SECTIONS = ['home', 'timeline', 'dev-history', 'skills', 'career', 'project']

/**
 * Legacy URL mappings for redirects
 */
export const LEGACY_ROUTES = {
  '/': 'home',
  '/timeline': 'timeline',
  '/dev-history': 'dev-history',
  '/skills': 'skills',
  '/career': 'career',
  '/project': 'project',
}

/**
 * Get section ID from URL pathname or search params
 * @param {string} pathname - Current pathname
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {string} - Valid section ID or 'home' as default
 */
export const getSectionFromURL = (pathname, searchParams) => {
  // Check search params first (multiverse?section=timeline)
  const sectionParam = searchParams?.get('section')
  if (sectionParam && VALID_SECTIONS.includes(sectionParam)) {
    return sectionParam
  }

  // Check legacy routes
  if (LEGACY_ROUTES[pathname]) {
    return LEGACY_ROUTES[pathname]
  }

  // Default to home
  return 'home'
}

/**
 * Generate URL for a section
 * @param {string} sectionId - Section ID
 * @param {boolean} useLegacyFormat - Whether to use legacy URL format
 * @returns {string} - Generated URL
 */
export const generateSectionURL = (sectionId, useLegacyFormat = false) => {
  if (!VALID_SECTIONS.includes(sectionId)) {
    return '/multiverse'
  }

  if (useLegacyFormat) {
    return sectionId === 'home' ? '/' : `/${sectionId}`
  }

  return sectionId === 'home' ? '/multiverse' : `/multiverse?section=${sectionId}`
}

/**
 * Update browser URL without page reload
 * @param {string} sectionId - Section ID to navigate to
 * @param {boolean} replace - Whether to replace current history entry
 */
export const updateURL = (sectionId, replace = true) => {
  if (typeof window === 'undefined') return

  const url = generateSectionURL(sectionId)
  const state = { section: sectionId, timestamp: Date.now() }

  if (replace) {
    window.history.replaceState(state, '', url)
  } else {
    window.history.pushState(state, '', url)
  }

  // Dispatch custom event for other components to listen to
  window.dispatchEvent(
    new CustomEvent('sectionchange', {
      detail: { sectionId, url },
    })
  )
}

/**
 * Handle browser back/forward navigation
 * @param {Function} onSectionChange - Callback when section changes
 * @returns {Function} - Cleanup function
 */
export const setupBrowserNavigation = (onSectionChange) => {
  if (typeof window === 'undefined') return () => {}

  const handlePopState = (event) => {
    const sectionId = event.state?.section || getSectionFromURL(window.location.pathname, new URLSearchParams(window.location.search))

    if (onSectionChange) {
      onSectionChange(sectionId)
    }
  }

  window.addEventListener('popstate', handlePopState)

  return () => {
    window.removeEventListener('popstate', handlePopState)
  }
}

/**
 * Get shareable URL for a section
 * @param {string} sectionId - Section ID
 * @param {Object} options - Additional options
 * @returns {string} - Full shareable URL
 */
export const getShareableURL = (sectionId, options = {}) => {
  if (typeof window === 'undefined') return ''

  const { includeTheme = false, includeTimestamp = false, useLegacyFormat = false } = options

  const baseURL = window.location.origin
  const sectionURL = generateSectionURL(sectionId, useLegacyFormat)

  const url = new URL(sectionURL, baseURL)

  // Add optional parameters
  if (includeTheme) {
    const currentTheme = getCurrentTheme()
    if (currentTheme) {
      url.searchParams.set('theme', currentTheme)
    }
  }

  if (includeTimestamp) {
    url.searchParams.set('t', Date.now().toString())
  }

  return url.toString()
}

/**
 * Parse URL parameters for theme and other settings
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} - Parsed parameters
 */
export const parseURLParameters = (searchParams) => {
  const params = {}

  // Theme parameter
  const theme = searchParams?.get('theme')
  if (theme) {
    params.theme = theme
  }

  // Timestamp parameter (for cache busting)
  const timestamp = searchParams?.get('t')
  if (timestamp) {
    params.timestamp = parseInt(timestamp, 10)
  }

  // Animation preference
  const animations = searchParams?.get('animations')
  if (animations) {
    params.animations = animations === 'true'
  }

  return params
}

/**
 * Get current theme from document body classes
 * @returns {string|null} - Current theme ID or null
 */
const getCurrentTheme = () => {
  if (typeof document === 'undefined') return null

  const classList = document.body.classList

  // Check for seasonal themes
  if (classList.contains('theme-christmas')) return 'christmas'
  if (classList.contains('theme-new-year')) return 'new-year'
  if (classList.contains('theme-snow')) return 'snow'

  // Check for cinematic themes
  if (classList.contains('theme-hollywood')) return 'hollywood'
  if (classList.contains('theme-rain')) return 'rain'
  if (classList.contains('theme-sunset')) return 'sunset'
  if (classList.contains('theme-neon')) return 'neon'
  if (classList.contains('theme-cyberpunk')) return 'cyberpunk'

  return null
}

/**
 * Validate and sanitize section ID
 * @param {string} sectionId - Section ID to validate
 * @returns {string} - Valid section ID
 */
export const validateSectionId = (sectionId) => {
  if (typeof sectionId !== 'string') return 'home'

  const cleanId = sectionId.toLowerCase().trim()
  return VALID_SECTIONS.includes(cleanId) ? cleanId : 'home'
}

/**
 * Check if current URL is a legacy route
 * @param {string} pathname - Current pathname
 * @returns {boolean} - Whether it's a legacy route
 */
export const isLegacyRoute = (pathname) => {
  return Object.keys(LEGACY_ROUTES).includes(pathname)
}

/**
 * Get section metadata for SEO and sharing
 * @param {string} sectionId - Section ID
 * @returns {Object} - Section metadata
 */
export const getSectionMetadata = (sectionId) => {
  const metadata = {
    home: {
      title: 'Portfolio - Home',
      description: 'Welcome to my interactive portfolio showcasing my development journey and projects.',
      keywords: 'portfolio, developer, web development, software engineer',
    },
    timeline: {
      title: 'Portfolio - Timeline',
      description: 'My personal and professional timeline from birth to present day.',
      keywords: 'timeline, career, personal history, milestones',
    },
    'dev-history': {
      title: 'Portfolio - Development History',
      description: 'My journey through different programming languages and technologies.',
      keywords: 'development, programming, coding journey, tech stack',
    },
    skills: {
      title: 'Portfolio - Technical Skills',
      description: 'My technical competencies and emerging interests in software development.',
      keywords: 'skills, programming languages, technologies, expertise',
    },
    career: {
      title: 'Portfolio - Career Roadmap',
      description: 'My career path and future aspirations in technology and AI.',
      keywords: 'career, roadmap, goals, AI, robotics, engineering',
    },
    project: {
      title: 'Portfolio - Projects',
      description: 'Showcase of my software projects across different domains.',
      keywords: 'projects, software, applications, portfolio, development',
    },
  }

  return metadata[sectionId] || metadata.home
}

/**
 * Hook for managing URL routing in React components
 * @param {Array} sections - Available sections
 * @param {Function} onSectionChange - Section change callback
 * @returns {Object} - Routing utilities
 */
export const useURLRouting = (sections = VALID_SECTIONS, onSectionChange) => {
  const updateSection = (sectionId, addToHistory = false) => {
    const validId = validateSectionId(sectionId)
    updateURL(validId, !addToHistory)

    if (onSectionChange) {
      onSectionChange(validId)
    }
  }

  const getShareURL = (sectionId, options) => {
    return getShareableURL(validateSectionId(sectionId), options)
  }

  return {
    updateSection,
    getShareURL,
    validateSectionId,
    generateSectionURL,
    getSectionMetadata,
    isLegacyRoute,
    VALID_SECTIONS: sections,
  }
}
