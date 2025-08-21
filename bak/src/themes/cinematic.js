/**
 * Cinematic and atmospheric theme configurations
 * Hollywood, Rain, Sunset, Neon, and other atmospheric themes
 */

// Hollywood Theme
export const hollywoodTheme = {
  name: 'Hollywood',
  id: 'hollywood',
  category: 'cinematic',

  // Color palette
  colors: {
    // Primary colors
    '--background-color': '#1a1611',
    '--surface-color': '#2d2419',
    '--surface-color-dark': '#1f1b14',
    '--surface-color-alpha': 'rgba(45, 36, 25, 0.9)',
    '--surface-color-alpha-dark': 'rgba(31, 27, 20, 0.95)',

    // Hollywood golden colors
    '--primary-color': '#d4af37', // Classic gold
    '--primary-color-bright': '#f4d03f',
    '--primary-color-alpha': 'rgba(212, 175, 55, 0.2)',
    '--primary-color-alpha-border': 'rgba(212, 175, 55, 0.4)',
    '--primary-color-glow': 'rgba(212, 175, 55, 0.6)',

    '--secondary-color': '#8b4513', // Saddle brown
    '--secondary-color-bright': '#a0522d',
    '--secondary-color-alpha': 'rgba(139, 69, 19, 0.2)',
    '--secondary-color-alpha-border': 'rgba(139, 69, 19, 0.4)',
    '--secondary-color-glow': 'rgba(139, 69, 19, 0.5)',

    '--accent-color': '#cd853f', // Peru
    '--accent-color-bright': '#daa520',
    '--accent-color-alpha': 'rgba(205, 133, 63, 0.2)',
    '--accent-color-alpha-border': 'rgba(205, 133, 63, 0.4)',
    '--accent-color-glow': 'rgba(205, 133, 63, 0.5)',

    // Text colors
    '--text-color': '#f5f5dc', // Beige
    '--text-secondary': '#ddd8c7',
    '--text-muted': '#b8b5a7',

    // Status colors
    '--success-color': '#228b22',
    '--warning-color': '#ff8c00',
    '--error-color': '#dc143c',
    '--info-color': '#4682b4',

    // UI elements
    '--border-color': 'rgba(212, 175, 55, 0.2)',
    '--border-color-hover': 'rgba(212, 175, 55, 0.4)',
    '--shadow-dark': 'rgba(0, 0, 0, 0.7)',
    '--surface-highlight': 'rgba(212, 175, 55, 0.1)',
  },

  // Particle effects
  particles: {
    spotlight: {
      enabled: true,
      count: 3,
      color: '#d4af37',
      intensity: 0.8,
      movement: 'slow',
    },
    filmGrain: {
      enabled: true,
      intensity: 0.3,
      size: 1,
    },
    goldenDust: {
      enabled: true,
      count: 40,
      color: '#d4af37',
      size: { min: 1, max: 3 },
      speed: { min: 0.5, max: 1.5 },
      opacity: { min: 0.2, max: 0.6 },
    },
  },

  // Special effects
  effects: {
    spotlightBeams: true,
    filmGrain: true,
    goldenGlow: true,
    vintageFilter: true,
  },
}

// Rain Theme
export const rainTheme = {
  name: 'Rain',
  id: 'rain',
  category: 'atmospheric',

  // Color palette
  colors: {
    // Primary colors
    '--background-color': '#0f1419',
    '--surface-color': '#1e2328',
    '--surface-color-dark': '#141a1f',
    '--surface-color-alpha': 'rgba(30, 35, 40, 0.9)',
    '--surface-color-alpha-dark': 'rgba(20, 26, 31, 0.95)',

    // Rain/storm colors
    '--primary-color': '#4a90e2', // Storm blue
    '--primary-color-bright': '#5ba0f2',
    '--primary-color-alpha': 'rgba(74, 144, 226, 0.2)',
    '--primary-color-alpha-border': 'rgba(74, 144, 226, 0.4)',
    '--primary-color-glow': 'rgba(74, 144, 226, 0.5)',

    '--secondary-color': '#6c7b7f', // Storm gray
    '--secondary-color-bright': '#7d8c90',
    '--secondary-color-alpha': 'rgba(108, 123, 127, 0.2)',
    '--secondary-color-alpha-border': 'rgba(108, 123, 127, 0.4)',
    '--secondary-color-glow': 'rgba(108, 123, 127, 0.5)',

    '--accent-color': '#87ceeb', // Sky blue
    '--accent-color-bright': '#98d4f0',
    '--accent-color-alpha': 'rgba(135, 206, 235, 0.2)',
    '--accent-color-alpha-border': 'rgba(135, 206, 235, 0.4)',
    '--accent-color-glow': 'rgba(135, 206, 235, 0.5)',

    // Text colors
    '--text-color': '#e6f3ff',
    '--text-secondary': '#d1e7f5',
    '--text-muted': '#a8c5d9',

    // Status colors
    '--success-color': '#4caf50',
    '--warning-color': '#ff9800',
    '--error-color': '#f44336',
    '--info-color': '#2196f3',

    // UI elements
    '--border-color': 'rgba(74, 144, 226, 0.2)',
    '--border-color-hover': 'rgba(74, 144, 226, 0.4)',
    '--shadow-dark': 'rgba(0, 0, 0, 0.8)',
    '--surface-highlight': 'rgba(74, 144, 226, 0.1)',
  },

  // Particle effects
  particles: {
    rain: {
      enabled: true,
      count: 200,
      color: '#87ceeb',
      size: { min: 1, max: 2 },
      speed: { min: 8, max: 15 },
      opacity: { min: 0.3, max: 0.7 },
      angle: 15, // Slight angle for wind effect
    },
    lightning: {
      enabled: true,
      frequency: 'rare', // Every 10-20 seconds
      color: '#ffffff',
      duration: 0.2,
    },
    puddles: {
      enabled: true,
      count: 5,
      ripples: true,
    },
  },

  // Special effects
  effects: {
    rainOverlay: true,
    lightningFlash: true,
    puddleReflections: true,
    mistEffect: true,
  },
}

// Sunset Theme
export const sunsetTheme = {
  name: 'Sunset',
  id: 'sunset',
  category: 'atmospheric',

  // Color palette
  colors: {
    // Primary colors
    '--background-color': '#2d1b14',
    '--surface-color': '#3d2b1e',
    '--surface-color-dark': '#251a11',
    '--surface-color-alpha': 'rgba(61, 43, 30, 0.9)',
    '--surface-color-alpha-dark': 'rgba(37, 26, 17, 0.95)',

    // Sunset colors
    '--primary-color': '#ff6b35', // Sunset orange
    '--primary-color-bright': '#ff7f50',
    '--primary-color-alpha': 'rgba(255, 107, 53, 0.2)',
    '--primary-color-alpha-border': 'rgba(255, 107, 53, 0.4)',
    '--primary-color-glow': 'rgba(255, 107, 53, 0.6)',

    '--secondary-color': '#ff1744', // Deep red
    '--secondary-color-bright': '#ff4569',
    '--secondary-color-alpha': 'rgba(255, 23, 68, 0.2)',
    '--secondary-color-alpha-border': 'rgba(255, 23, 68, 0.4)',
    '--secondary-color-glow': 'rgba(255, 23, 68, 0.5)',

    '--accent-color': '#ffc107', // Amber
    '--accent-color-bright': '#ffcd38',
    '--accent-color-alpha': 'rgba(255, 193, 7, 0.2)',
    '--accent-color-alpha-border': 'rgba(255, 193, 7, 0.4)',
    '--accent-color-glow': 'rgba(255, 193, 7, 0.5)',

    // Text colors
    '--text-color': '#fff8e1',
    '--text-secondary': '#ffecb3',
    '--text-muted': '#ffcc80',

    // Status colors
    '--success-color': '#4caf50',
    '--warning-color': '#ff9800',
    '--error-color': '#f44336',
    '--info-color': '#2196f3',

    // UI elements
    '--border-color': 'rgba(255, 107, 53, 0.2)',
    '--border-color-hover': 'rgba(255, 107, 53, 0.4)',
    '--shadow-dark': 'rgba(0, 0, 0, 0.6)',
    '--surface-highlight': 'rgba(255, 193, 7, 0.1)',
  },

  // Particle effects
  particles: {
    sunRays: {
      enabled: true,
      count: 8,
      color: '#ffc107',
      length: 200,
      opacity: { min: 0.1, max: 0.3 },
      rotation: 'slow',
    },
    warmGlow: {
      enabled: true,
      intensity: 0.4,
      color: '#ff6b35',
    },
  },

  // Special effects
  effects: {
    sunRays: true,
    warmGradient: true,
    goldenHour: true,
  },
}

// Neon Theme
export const neonTheme = {
  name: 'Neon',
  id: 'neon',
  category: 'cinematic',

  // Color palette
  colors: {
    // Primary colors
    '--background-color': '#0a0a0f',
    '--surface-color': '#1a1a2e',
    '--surface-color-dark': '#0f0f1a',
    '--surface-color-alpha': 'rgba(26, 26, 46, 0.9)',
    '--surface-color-alpha-dark': 'rgba(15, 15, 26, 0.95)',

    // Neon colors
    '--primary-color': '#00ffff', // Cyan neon
    '--primary-color-bright': '#40ffff',
    '--primary-color-alpha': 'rgba(0, 255, 255, 0.2)',
    '--primary-color-alpha-border': 'rgba(0, 255, 255, 0.4)',
    '--primary-color-glow': 'rgba(0, 255, 255, 0.8)',

    '--secondary-color': '#ff00ff', // Magenta neon
    '--secondary-color-bright': '#ff40ff',
    '--secondary-color-alpha': 'rgba(255, 0, 255, 0.2)',
    '--secondary-color-alpha-border': 'rgba(255, 0, 255, 0.4)',
    '--secondary-color-glow': 'rgba(255, 0, 255, 0.8)',

    '--accent-color': '#00ff00', // Green neon
    '--accent-color-bright': '#40ff40',
    '--accent-color-alpha': 'rgba(0, 255, 0, 0.2)',
    '--accent-color-alpha-border': 'rgba(0, 255, 0, 0.4)',
    '--accent-color-glow': 'rgba(0, 255, 0, 0.8)',

    // Text colors
    '--text-color': '#ffffff',
    '--text-secondary': '#e0e0e0',
    '--text-muted': '#b0b0b0',

    // Status colors
    '--success-color': '#00ff00',
    '--warning-color': '#ffff00',
    '--error-color': '#ff0040',
    '--info-color': '#0080ff',

    // UI elements
    '--border-color': 'rgba(0, 255, 255, 0.3)',
    '--border-color-hover': 'rgba(0, 255, 255, 0.6)',
    '--shadow-dark': 'rgba(0, 0, 0, 0.9)',
    '--surface-highlight': 'rgba(0, 255, 255, 0.1)',
  },

  // Particle effects
  particles: {
    neonGlow: {
      enabled: true,
      count: 30,
      colors: ['#00ffff', '#ff00ff', '#00ff00', '#ffff00'],
      size: { min: 2, max: 6 },
      speed: { min: 1, max: 3 },
      opacity: { min: 0.4, max: 0.8 },
      glow: true,
    },
    electricArcs: {
      enabled: true,
      count: 5,
      color: '#00ffff',
      frequency: 'medium',
    },
  },

  // Special effects
  effects: {
    neonGlow: true,
    electricArcs: true,
    cyberpunkGrid: true,
    scanlines: true,
  },
}

// Cyberpunk Theme
export const cyberpunkTheme = {
  name: 'Cyberpunk',
  id: 'cyberpunk',
  category: 'cinematic',

  // Color palette
  colors: {
    // Primary colors
    '--background-color': '#0d0208',
    '--surface-color': '#1a0e13',
    '--surface-color-dark': '#0f070a',
    '--surface-color-alpha': 'rgba(26, 14, 19, 0.9)',
    '--surface-color-alpha-dark': 'rgba(15, 7, 10, 0.95)',

    // Cyberpunk colors
    '--primary-color': '#ff0080', // Hot pink
    '--primary-color-bright': '#ff40a0',
    '--primary-color-alpha': 'rgba(255, 0, 128, 0.2)',
    '--primary-color-alpha-border': 'rgba(255, 0, 128, 0.4)',
    '--primary-color-glow': 'rgba(255, 0, 128, 0.8)',

    '--secondary-color': '#00d4ff', // Electric blue
    '--secondary-color-bright': '#40dcff',
    '--secondary-color-alpha': 'rgba(0, 212, 255, 0.2)',
    '--secondary-color-alpha-border': 'rgba(0, 212, 255, 0.4)',
    '--secondary-color-glow': 'rgba(0, 212, 255, 0.8)',

    '--accent-color': '#8000ff', // Electric purple
    '--accent-color-bright': '#a040ff',
    '--accent-color-alpha': 'rgba(128, 0, 255, 0.2)',
    '--accent-color-alpha-border': 'rgba(128, 0, 255, 0.4)',
    '--accent-color-glow': 'rgba(128, 0, 255, 0.8)',

    // Text colors
    '--text-color': '#ffffff',
    '--text-secondary': '#e0e0e0',
    '--text-muted': '#b0b0b0',

    // Status colors
    '--success-color': '#00ff80',
    '--warning-color': '#ff8000',
    '--error-color': '#ff0040',
    '--info-color': '#0080ff',

    // UI elements
    '--border-color': 'rgba(255, 0, 128, 0.3)',
    '--border-color-hover': 'rgba(255, 0, 128, 0.6)',
    '--shadow-dark': 'rgba(0, 0, 0, 0.9)',
    '--surface-highlight': 'rgba(255, 0, 128, 0.1)',
  },

  // Particle effects
  particles: {
    dataStream: {
      enabled: true,
      count: 50,
      colors: ['#ff0080', '#00d4ff', '#8000ff'],
      size: { min: 1, max: 3 },
      speed: { min: 2, max: 6 },
      opacity: { min: 0.3, max: 0.7 },
      digital: true,
    },
    glitch: {
      enabled: true,
      frequency: 'medium',
      intensity: 0.3,
    },
  },

  // Special effects
  effects: {
    dataStreams: true,
    glitchEffect: true,
    holographicUI: true,
    digitalNoise: true,
  },
}

// Theme utilities
export const cinematicThemes = {
  hollywood: hollywoodTheme,
  rain: rainTheme,
  sunset: sunsetTheme,
  neon: neonTheme,
  cyberpunk: cyberpunkTheme,
}

/**
 * Get all available cinematic themes
 * @returns {Array} - Array of cinematic theme objects
 */
export const getAllCinematicThemes = () => {
  return Object.values(cinematicThemes)
}

/**
 * Apply cinematic theme CSS custom properties
 * @param {Object} theme - Theme object
 */
export const applyCinematicTheme = (theme) => {
  if (!theme || typeof document === 'undefined') return

  const root = document.documentElement

  // Apply color variables
  Object.entries(theme.colors).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })

  // Add theme class for additional styling
  document.body.classList.remove('theme-hollywood', 'theme-rain', 'theme-sunset', 'theme-neon', 'theme-cyberpunk')
  document.body.classList.add(`theme-${theme.id}`)
}

/**
 * Remove cinematic theme and restore default
 */
export const removeCinematicTheme = () => {
  if (typeof document === 'undefined') return

  document.body.classList.remove('theme-hollywood', 'theme-rain', 'theme-sunset', 'theme-neon', 'theme-cyberpunk')
}
