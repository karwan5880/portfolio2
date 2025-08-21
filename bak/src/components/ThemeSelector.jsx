'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { useCinematicTheme } from './CinematicThemeManager'
import { useSeasonalTheme } from './SeasonalThemeManager'
import styles from './ThemeSelector.module.css'
import { useAnimations } from '@/hooks/useAnimations'

// Base themes (existing system themes)
const baseThemes = [
  {
    id: 'default',
    name: 'Default',
    category: 'base',
    colors: {
      primary: '#00ff9d',
      secondary: '#ff6b35',
      accent: '#4a9eff',
    },
    preview: 'Modern tech aesthetic with green accents',
  },
  {
    id: 'dark',
    name: 'Dark',
    category: 'base',
    colors: {
      primary: '#ffffff',
      secondary: '#888888',
      accent: '#444444',
    },
    preview: 'Clean dark mode interface',
  },
  {
    id: 'light',
    name: 'Light',
    category: 'base',
    colors: {
      primary: '#333333',
      secondary: '#666666',
      accent: '#999999',
    },
    preview: 'Bright and clean light mode',
  },
]

/**
 * Theme preview component
 */
const ThemePreview = ({ theme, isActive, onClick, disabled = false }) => {
  const { animationsEnabled } = useAnimations()

  const previewVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
    hover: {
      scale: 1.05,
      y: -5,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  }

  return (
    <motion.div
      className={`${styles.themePreview} ${isActive ? styles.active : ''} ${disabled ? styles.disabled : ''}`}
      variants={animationsEnabled ? previewVariants : undefined}
      initial={animationsEnabled ? 'hidden' : false}
      animate={animationsEnabled ? 'visible' : false}
      whileHover={animationsEnabled && !disabled ? 'hover' : undefined}
      whileTap={animationsEnabled && !disabled ? 'tap' : undefined}
      onClick={disabled ? undefined : onClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={`Select ${theme.name} theme`}
      aria-pressed={isActive}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {/* Theme color preview */}
      <div className={styles.colorPreview}>
        <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.primary }} />
        <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.secondary }} />
        <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.accent }} />
      </div>

      {/* Theme info */}
      <div className={styles.themeInfo}>
        <h4 className={styles.themeName}>{theme.name}</h4>
        <p className={styles.themeDescription}>{theme.preview}</p>
        {theme.category && <span className={`${styles.categoryBadge} ${styles[theme.category]}`}>{theme.category}</span>}
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div className={styles.activeIndicator} initial={animationsEnabled ? { scale: 0 } : false} animate={animationsEnabled ? { scale: 1 } : false} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          ✓
        </motion.div>
      )}

      {/* Seasonal indicator */}
      {theme.category === 'seasonal' && theme.isSeasonallyActive && (
        <motion.div className={styles.seasonalIndicator} initial={animationsEnabled ? { opacity: 0, rotate: -180 } : false} animate={animationsEnabled ? { opacity: 1, rotate: 0 } : false} transition={{ duration: 0.5 }}>
          🎄
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * Theme category section
 */
const ThemeCategory = ({ title, themes, activeTheme, onThemeSelect, disabled = false }) => {
  const { animationsEnabled } = useAnimations()

  const categoryVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.div className={styles.themeCategory} variants={animationsEnabled ? categoryVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false}>
      <h3 className={styles.categoryTitle}>{title}</h3>
      <div className={styles.themesGrid}>
        {themes.map((theme) => (
          <ThemePreview key={theme.id} theme={theme} isActive={activeTheme?.id === theme.id} onClick={() => onThemeSelect(theme)} disabled={disabled} />
        ))}
      </div>
    </motion.div>
  )
}

/**
 * Main theme selector component
 */
export const ThemeSelector = ({ className = '', position = 'top-right', isMobile = false, performanceMode = 'full' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTheme, setActiveTheme] = useState(null)
  const [allThemes, setAllThemes] = useState([])
  const { animationsEnabled } = useAnimations()

  // Hooks for different theme types
  const { currentSeasonal, availableSeasonals, applyTheme: applySeasonalTheme, removeTheme: removeSeasonalTheme } = useSeasonalTheme()

  const { currentTheme: currentCinematic, availableThemes: availableCinematics, applyTheme: applyCinematicTheme, removeTheme: removeCinematicTheme } = useCinematicTheme()

  // Combine all themes
  useEffect(() => {
    const combinedThemes = [
      ...baseThemes,
      ...availableSeasonals.map((theme) => ({
        ...theme,
        colors: {
          primary: theme.colors['--primary-color'],
          secondary: theme.colors['--secondary-color'],
          accent: theme.colors['--accent-color'],
        },
        preview: `${theme.name} seasonal theme with special effects`,
        isSeasonallyActive: currentSeasonal?.id === theme.id,
      })),
      ...availableCinematics.map((theme) => ({
        ...theme,
        colors: {
          primary: theme.colors['--primary-color'],
          secondary: theme.colors['--secondary-color'],
          accent: theme.colors['--accent-color'],
        },
        preview: `${theme.name} cinematic theme with atmospheric effects`,
      })),
    ]

    setAllThemes(combinedThemes)
  }, [availableSeasonals, availableCinematics, currentSeasonal])

  // Track current active theme
  useEffect(() => {
    if (currentSeasonal) {
      setActiveTheme(currentSeasonal)
    } else if (currentCinematic) {
      setActiveTheme(currentCinematic)
    } else {
      setActiveTheme(baseThemes[0]) // Default theme
    }
  }, [currentSeasonal, currentCinematic])

  // Handle theme selection
  const handleThemeSelect = (theme) => {
    // Clear all themes first
    removeSeasonalTheme()
    removeCinematicTheme()

    // Apply selected theme
    switch (theme.category) {
      case 'seasonal':
        applySeasonalTheme(theme.id)
        break
      case 'cinematic':
        applyCinematicTheme(theme.id)
        break
      case 'base':
      default:
        // Handle base theme application (would integrate with existing theme system)
        break
    }

    setActiveTheme(theme)
    setIsOpen(false)
  }

  // Group themes by category
  const themesByCategory = {
    base: allThemes.filter((t) => t.category === 'base'),
    seasonal: allThemes.filter((t) => t.category === 'seasonal'),
    cinematic: allThemes.filter((t) => t.category === 'cinematic'),
  }

  // Animation variants
  const selectorVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    },
  }

  const panelVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: position.includes('top') ? -20 : 20,
      x: position.includes('right') ? 20 : position.includes('left') ? -20 : 0,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: position.includes('top') ? -20 : 20,
      x: position.includes('right') ? 20 : position.includes('left') ? -20 : 0,
      transition: {
        duration: 0.2,
      },
    },
  }

  return (
    <div className={`${styles.themeSelector} ${styles[position]} ${isMobile ? styles.mobile : ''} ${className}`}>
      {/* Theme selector button */}
      <motion.button className={`${styles.selectorButton} ${isMobile ? styles.mobileButton : ''}`} variants={animationsEnabled && performanceMode !== 'optimized' ? selectorVariants : undefined} initial={animationsEnabled && performanceMode !== 'optimized' ? 'hidden' : false} animate={animationsEnabled && performanceMode !== 'optimized' ? 'visible' : false} whileHover={animationsEnabled && !isMobile && performanceMode !== 'optimized' ? { scale: 1.1 } : undefined} whileTap={animationsEnabled ? { scale: 0.95 } : undefined} onClick={() => setIsOpen(!isOpen)} aria-label="Open theme selector" aria-expanded={isOpen}>
        <div className={styles.buttonIcon}>🎨</div>
        {!isMobile && <span className={styles.buttonText}>Themes</span>}
        {activeTheme && (
          <div className={styles.currentThemeIndicator}>
            <div className={styles.currentThemeColor} style={{ backgroundColor: activeTheme.colors?.primary }} />
          </div>
        )}
      </motion.button>

      {/* Theme selection panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div className={styles.backdrop} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} />

            {/* Theme panel */}
            <motion.div className={`${styles.themePanel} ${isMobile ? styles.mobilePanelFullscreen : ''}`} variants={animationsEnabled && performanceMode !== 'optimized' ? panelVariants : undefined} initial={animationsEnabled && performanceMode !== 'optimized' ? 'hidden' : false} animate={animationsEnabled && performanceMode !== 'optimized' ? 'visible' : false} exit={animationsEnabled && performanceMode !== 'optimized' ? 'exit' : false}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Choose Theme</h2>
                <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="Close theme selector">
                  ×
                </button>
              </div>

              <div className={`${styles.panelContent} ${isMobile ? styles.mobileContent : ''}`}>
                {/* Base themes */}
                <ThemeCategory title="Base Themes" themes={themesByCategory.base} activeTheme={activeTheme} onThemeSelect={handleThemeSelect} />

                {/* Seasonal themes */}
                {themesByCategory.seasonal.length > 0 && <ThemeCategory title="Seasonal Themes" themes={themesByCategory.seasonal} activeTheme={activeTheme} onThemeSelect={handleThemeSelect} />}

                {/* Cinematic themes */}
                {themesByCategory.cinematic.length > 0 && <ThemeCategory title="Cinematic Themes" themes={themesByCategory.cinematic} activeTheme={activeTheme} onThemeSelect={handleThemeSelect} />}
              </div>

              {/* Theme preview area - simplified for mobile */}
              {activeTheme && !isMobile && (
                <motion.div className={styles.previewArea} initial={animationsEnabled ? { opacity: 0, y: 20 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ delay: 0.3 }}>
                  <h4>Current Theme: {activeTheme.name}</h4>
                  <p>{activeTheme.preview}</p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
