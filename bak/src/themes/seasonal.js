/**
 * Seasonal theme configurations
 * Christmas, New Year, and Snow themes with particle effects
 */

// Christmas Theme
export const christmasTheme = {
  name: 'Christmas',
  id: 'christmas',
  category: 'seasonal',

  // Color palette
  colors: {
    // Primary colors
    '--background-color': '#0d1b0d',
    '--surface-color': '#1a2e1a',
    '--surface-color-dark': '#0f1f0f',
    '--surface-color-alpha': 'rgba(26, 46, 26, 0.9)',
    '--surface-color-alpha-dark': 'rgba(15, 31, 15, 0.95)',

    // Christmas colors
    '--primary-color': '#dc2626', // Christmas red
    '--primary-color-bright': '#ef4444',
    '--primary-color-alpha': 'rgba(220, 38, 38, 0.2)',
    '--primary-color-alpha-border': 'rgba(220, 38, 38, 0.4)',
    '--primary-color-glow': 'rgba(220, 38, 38, 0.5)',

    '--secondary-color': '#16a34a', // Christmas green
    '--secondary-color-bright': '#22c55e',
    '--secondary-color-alpha': 'rgba(22, 163, 74, 0.2)',
    '--secondary-color-alpha-border': 'rgba(22, 163, 74, 0.4)',
    '--secondary-color-glow': 'rgba(22, 163, 74, 0.5)',

    '--accent-color': '#fbbf24', // Gold
    '--accent-color-bright': '#fcd34d',
    '--accent-color-alpha': 'rgba(251, 191, 36, 0.2)',
    '--accent-color-alpha-border': 'rgba(251, 191, 36, 0.4)',
    '--accent-color-glow': 'rgba(251, 191, 36, 0.5)',

    // Text colors
    '--text-color': '#f8fafc',
    '--text-secondary': '#e2e8f0',
    '--text-muted': '#94a3b8',

    // Status colors
    '--success-color': '#16a34a',
    '--warning-color': '#f59e0b',
    '--error-color': '#dc2626',
    '--info-color': '#3b82f6',

    // UI elements
    '--border-color': 'rgba(220, 38, 38, 0.2)',
    '--border-color-hover': 'rgba(220, 38, 38, 0.4)',
    '--shadow-dark': 'rgba(0, 0, 0, 0.6)',
    '--surface-highlight': 'rgba(251, 191, 36, 0.1)',
  },

  // Particle effects
  particles: {
    snow: {
      enabled: true,
      count: 100,
      color: '#ffffff',
      size: { min: 2, max: 6 },
      speed: { min: 1, max: 3 },
      opacity: { min: 0.3, max: 0.8 },
    },
    sparkles: {
      enabled: true,
      count: 30,
      color: '#fbbf24',
      size: { min: 1, max: 3 },
      speed: { min: 0.5, max: 1.5 },
      opacity: { min: 0.4, max: 1 },
      twinkle: true,
    },
  },

  // Special effects
  effects: {
    christmasLights: true,
    hollyBorder: true,
    candleGlow: true,
  },
}

// New Year Theme
export const newYearTheme = {
  name: 'New Year',
  id: 'new-year',
  category: 'seasonal',

  // Color palette
  colors: {
    // Primary colors
    '--background-color': '#0f0f23',
    '--surface-color': '#1a1a3a',
    '--surface-color-dark': '#141428',
    '--surface-color-alpha': 'rgba(26, 26, 58, 0.9)',
    '--surface-color-alpha-dark': 'rgba(20, 20, 40, 0.95)',

    // New Year colors
    '--primary-color': '#fbbf24', // Gold
    '--primary-color-bright': '#fcd34d',
    '--primary-color-alpha': 'rgba(251, 191, 36, 0.2)',
    '--primary-color-alpha-border': 'rgba(251, 191, 36, 0.4)',
    '--primary-color-glow': 'rgba(251, 191, 36, 0.6)',

    '--secondary-color': '#8b5cf6', // Purple
    '--secondary-color-bright': '#a78bfa',
    '--secondary-color-alpha': 'rgba(139, 92, 246, 0.2)',
    '--secondary-color-alpha-border': 'rgba(139, 92, 246, 0.4)',
    '--secondary-color-glow': 'rgba(139, 92, 246, 0.5)',

    '--accent-color': '#ec4899', // Pink
    '--accent-color-bright': '#f472b6',
    '--accent-color-alpha': 'rgba(236, 72, 153, 0.2)',
    '--accent-color-alpha-border': 'rgba(236, 72, 153, 0.4)',
    '--accent-color-glow': 'rgba(236, 72, 153, 0.5)',

    // Text colors
    '--text-color': '#f8fafc',
    '--text-secondary': '#e2e8f0',
    '--text-muted': '#94a3b8',

    // Status colors
    '--success-color': '#10b981',
    '--warning-color': '#f59e0b',
    '--error-color': '#ef4444',
    '--info-color': '#3b82f6',

    // UI elements
    '--border-color': 'rgba(251, 191, 36, 0.2)',
    '--border-color-hover': 'rgba(251, 191, 36, 0.4)',
    '--shadow-dark': 'rgba(0, 0, 0, 0.6)',
    '--surface-highlight': 'rgba(251, 191, 36, 0.1)',
  },

  // Particle effects
  particles: {
    fireworks: {
      enabled: true,
      count: 20,
      colors: ['#fbbf24', '#8b5cf6', '#ec4899', '#10b981', '#3b82f6'],
      size: { min: 3, max: 8 },
      speed: { min: 2, max: 5 },
      opacity: { min: 0.6, max: 1 },
      burst: true,
      trail: true,
    },
    confetti: {
      enabled: true,
      count: 50,
      colors: ['#fbbf24', '#8b5cf6', '#ec4899', '#10b981'],
      size: { min: 2, max: 4 },
      speed: { min: 1, max: 4 },
      opacity: { min: 0.5, max: 0.9 },
      shapes: ['circle', 'square', 'triangle'],
    },
  },

  // Special effects
  effects: {
    fireworksDisplay: true,
    countdownTimer: true,
    champagneGlass: true,
    goldenShimmer: true,
  },
}

// Snow Theme
export const snowTheme = {
  name: 'Snow',
  id: 'snow',
  category: 'seasonal',

  // Color palette
  colors: {
    // Primary colors
    '--background-color': '#0f172a',
    '--surface-color': '#1e293b',
    '--surface-color-dark': '#0f1629',
    '--surface-color-alpha': 'rgba(30, 41, 59, 0.9)',
    '--surface-color-alpha-dark': 'rgba(15, 22, 41, 0.95)',

    // Snow/winter colors
    '--primary-color': '#e0f2fe', // Ice blue
    '--primary-color-bright': '#f0f9ff',
    '--primary-color-alpha': 'rgba(224, 242, 254, 0.2)',
    '--primary-color-alpha-border': 'rgba(224, 242, 254, 0.4)',
    '--primary-color-glow': 'rgba(224, 242, 254, 0.5)',

    '--secondary-color': '#0ea5e9', // Sky blue
    '--secondary-color-bright': '#38bdf8',
    '--secondary-color-alpha': 'rgba(14, 165, 233, 0.2)',
    '--secondary-color-alpha-border': 'rgba(14, 165, 233, 0.4)',
    '--secondary-color-glow': 'rgba(14, 165, 233, 0.5)',

    '--accent-color': '#6366f1', // Indigo
    '--accent-color-bright': '#818cf8',
    '--accent-color-alpha': 'rgba(99, 102, 241, 0.2)',
    '--accent-color-alpha-border': 'rgba(99, 102, 241, 0.4)',
    '--accent-color-glow': 'rgba(99, 102, 241, 0.5)',

    // Text colors
    '--text-color': '#f8fafc',
    '--text-secondary': '#e2e8f0',
    '--text-muted': '#94a3b8',

    // Status colors
    '--success-color': '#10b981',
    '--warning-color': '#f59e0b',
    '--error-color': '#ef4444',
    '--info-color': '#0ea5e9',

    // UI elements
    '--border-color': 'rgba(224, 242, 254, 0.2)',
    '--border-color-hover': 'rgba(224, 242, 254, 0.4)',
    '--shadow-dark': 'rgba(0, 0, 0, 0.6)',
    '--surface-highlight': 'rgba(224, 242, 254, 0.1)',
  },

  // Particle effects
  particles: {
    snow: {
      enabled: true,
      count: 150,
      color: '#ffffff',
      size: { min: 1, max: 5 },
      speed: { min: 0.5, max: 2.5 },
      opacity: { min: 0.2, max: 0.8 },
      wind: true,
      accumulate: true,
    },
    frost: {
      enabled: true,
      count: 20,
      color: '#e0f2fe',
      size: { min: 4, max: 10 },
      speed: { min: 0.1, max: 0.5 },
      opacity: { min: 0.1, max: 0.3 },
      crystalline: true,
    },
  },

  // Special effects
  effects: {
    frostOverlay: true,
    icicles: true,
    breathEffect: true,
    snowAccumulation: true,
  },
}

// Theme utilities
export const seasonalThemes = {
  christmas: christmasTheme,
  'new-year': newYearTheme,
  snow: snowTheme,
}

/**
 * Get seasonal theme by date
 * @returns {Object|null} - Seasonal theme or null if no seasonal theme applies
 */
export const getSeasonalTheme = () => {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  const day = now.getDate()

  // Christmas season (December 15 - January 2)
  if ((month === 12 && day >= 15) || (month === 1 && day <= 2)) {
    return christmasTheme
  }

  // New Year (December 28 - January 7)
  if ((month === 12 && day >= 28) || (month === 1 && day <= 7)) {
    return newYearTheme
  }

  // Winter/Snow season (December 1 - February 28)
  if (month === 12 || month === 1 || month === 2) {
    return snowTheme
  }

  return null
}

/**
 * Check if a seasonal theme is currently active
 * @param {string} themeId - Theme ID to check
 * @returns {boolean} - Whether the theme is seasonally active
 */
export const isSeasonallyActive = (themeId) => {
  const currentSeasonal = getSeasonalTheme()
  return currentSeasonal?.id === themeId
}

/**
 * Get all available seasonal themes
 * @returns {Array} - Array of seasonal theme objects
 */
export const getAllSeasonalThemes = () => {
  return Object.values(seasonalThemes)
}

/**
 * Apply seasonal theme CSS custom properties
 * @param {Object} theme - Theme object
 */
export const applySeasonalTheme = (theme) => {
  if (!theme || typeof document === 'undefined') return

  const root = document.documentElement

  // Apply color variables
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })

  // Add theme class for additional styling
  document.body.classList.remove('theme-christmas', 'theme-new-year', 'theme-snow')
  document.body.classList.add(`theme-${theme.id}`)
}

/**
 * Remove seasonal theme and restore default
 */
export const removeSeasonalTheme = () => {
  if (typeof document === 'undefined') return

  document.body.classList.remove('theme-christmas', 'theme-new-year', 'theme-snow')

  // Reset to default theme variables would be handled by the main theme system
}
