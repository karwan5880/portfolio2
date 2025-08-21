'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import styles from './ThemeSelector.module.css'
import { useTheme } from '@/contexts/ThemeContext'
import { useLazyAnimations, useOptimizedAnimations } from '@/hooks/useOptimizedAnimations'
import { createDebouncedFunction } from '@/utils/performanceOptimizations'

// Memoized theme preview component
const ThemePreview = memo(({ theme, isActive, onClick, animationLevel }) => {
  const { isLoaded, animationComponents } = useLazyAnimations()

  const handleClick = useCallback(() => {
    onClick(theme.id)
  }, [theme.id, onClick])

  // Use CSS animations for better performance when Framer Motion isn't loaded
  if (!isLoaded || animationLevel === 'none') {
    return (
      <button
        className={`${styles.themePreview} ${isActive ? styles.active : ''}`}
        onClick={handleClick}
        style={{
          '--preview-primary': theme.colors.primary,
          '--preview-secondary': theme.colors.secondary,
          '--preview-accent': theme.colors.accent,
        }}
        aria-label={`Switch to ${theme.name} theme`}
      >
        <div className={styles.previewColors}>
          <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.primary }} />
          <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.secondary }} />
          <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.accent }} />
        </div>
        <span className={styles.themeName}>{theme.name}</span>
      </button>
    )
  }

  const { motion } = animationComponents

  return (
    <motion.button
      className={`${styles.themePreview} ${isActive ? styles.active : ''}`}
      onClick={handleClick}
      style={{
        '--preview-primary': theme.colors.primary,
        '--preview-secondary': theme.colors.secondary,
        '--preview-accent': theme.colors.accent,
      }}
      whileHover={animationLevel === 'full' ? { scale: 1.05 } : {}}
      whileTap={animationLevel !== 'minimal' ? { scale: 0.95 } : {}}
      transition={{
        duration: animationLevel === 'full' ? 0.2 : 0.1,
        ease: 'easeOut',
      }}
      aria-label={`Switch to ${theme.name} theme`}
    >
      <div className={styles.previewColors}>
        <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.primary }} />
        <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.secondary }} />
        <div className={styles.colorSwatch} style={{ backgroundColor: theme.colors.accent }} />
      </div>
      <span className={styles.themeName}>{theme.name}</span>
    </motion.button>
  )
})

ThemePreview.displayName = 'ThemePreview'

// Memoized theme category component
const ThemeCategory = memo(({ category, themes, activeTheme, onThemeSelect, animationLevel }) => {
  const { isLoaded, animationComponents } = useLazyAnimations()

  if (!isLoaded || animationLevel === 'none') {
    return (
      <div className={styles.themeCategory}>
        <h3 className={styles.categoryTitle}>{category}</h3>
        <div className={styles.themesGrid}>
          {themes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme} isActive={activeTheme === theme.id} onClick={onThemeSelect} animationLevel={animationLevel} />
          ))}
        </div>
      </div>
    )
  }

  const { motion } = animationComponents

  return (
    <motion.div
      className={styles.themeCategory}
      initial={animationLevel === 'full' ? { opacity: 0, y: 20 } : {}}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: animationLevel === 'full' ? 0.3 : 0.1,
        ease: 'easeOut',
      }}
    >
      <h3 className={styles.categoryTitle}>{category}</h3>
      <div className={styles.themesGrid}>
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            initial={animationLevel === 'full' ? { opacity: 0, scale: 0.8 } : {}}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: animationLevel === 'full' ? 0.2 : 0.1,
              delay: animationLevel === 'full' ? index * 0.05 : 0,
              ease: 'easeOut',
            }}
          >
            <ThemePreview theme={theme} isActive={activeTheme === theme.id} onClick={onThemeSelect} animationLevel={animationLevel} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
})

ThemeCategory.displayName = 'ThemeCategory'

export const OptimizedThemeSelector = memo(() => {
  const { currentTheme, availableThemes, setTheme, isLoadingAssets, preloadTheme } = useTheme()
  const { animationLevel, animationSettings } = useOptimizedAnimations()
  const { isLoaded, animationComponents } = useLazyAnimations()

  const [isOpen, setIsOpen] = useState(false)
  const [previewTheme, setPreviewTheme] = useState(null)
  const [isPreloading, setIsPreloading] = useState(false)

  // Debounced theme preview to avoid excessive API calls
  const debouncedPreview = useMemo(
    () =>
      createDebouncedFunction((themeId) => {
        setPreviewTheme(themeId)
      }, 300),
    []
  )

  // Optimized theme selection with preloading
  const handleThemeSelect = useCallback(
    async (themeId) => {
      if (themeId === currentTheme) return

      try {
        setIsPreloading(true)

        // Preload theme assets if needed
        if (animationSettings.level !== 'none') {
          await preloadTheme(themeId)
        }

        // Apply theme with performance-aware options
        await setTheme(themeId, {
          preloadAssets: animationSettings.level === 'full',
          immediate: animationSettings.level === 'minimal',
        })

        setIsOpen(false)
        setPreviewTheme(null)
      } catch (error) {
        console.warn('Theme selection failed:', error)
      } finally {
        setIsPreloading(false)
      }
    },
    [currentTheme, setTheme, preloadTheme, animationSettings]
  )

  // Organize themes by category for better UX
  const organizedThemes = useMemo(() => {
    const categories = {
      'Base Themes': [],
      Seasonal: [],
      Cinematic: [],
      Weather: [],
    }

    availableThemes.forEach((themeId) => {
      // This would be populated from theme configs
      const theme = {
        id: themeId,
        name: themeId.charAt(0).toUpperCase() + themeId.slice(1),
        colors: {
          primary: '#00ff9d',
          secondary: '#4a9eff',
          accent: '#ff6b35',
        },
      }

      if (['light', 'dark'].includes(themeId)) {
        categories['Base Themes'].push(theme)
      } else if (['christmas', 'newyear'].includes(themeId)) {
        categories['Seasonal'].push(theme)
      } else if (['hollywood', 'noir'].includes(themeId)) {
        categories['Cinematic'].push(theme)
      } else if (['rain', 'snow'].includes(themeId)) {
        categories['Weather'].push(theme)
      }
    })

    return categories
  }, [availableThemes])

  // Handle theme preview on hover (only for full performance mode)
  const handleThemeHover = useCallback(
    (themeId) => {
      if (animationSettings.level === 'full' && !isPreloading) {
        debouncedPreview(themeId)
      }
    },
    [animationSettings.level, isPreloading, debouncedPreview]
  )

  // Toggle selector visibility
  const toggleSelector = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  // Render optimized selector button
  const renderSelectorButton = () => {
    if (!isLoaded || animationLevel === 'none') {
      return (
        <button className={`${styles.selectorButton} ${isOpen ? styles.open : ''}`} onClick={toggleSelector} aria-label="Open theme selector" disabled={isLoadingAssets || isPreloading}>
          <div className={styles.currentThemeIndicator}>
            <div className={styles.themeIcon} />
            {(isLoadingAssets || isPreloading) && <div className={styles.loadingSpinner} />}
          </div>
        </button>
      )
    }

    const { motion } = animationComponents

    return (
      <motion.button
        className={`${styles.selectorButton} ${isOpen ? styles.open : ''}`}
        onClick={toggleSelector}
        whileHover={animationLevel === 'full' ? { scale: 1.1 } : {}}
        whileTap={animationLevel !== 'minimal' ? { scale: 0.9 } : {}}
        transition={{
          duration: animationLevel === 'full' ? 0.2 : 0.1,
          ease: 'easeOut',
        }}
        aria-label="Open theme selector"
        disabled={isLoadingAssets || isPreloading}
      >
        <motion.div
          className={styles.currentThemeIndicator}
          animate={isOpen ? { rotate: 180 } : { rotate: 0 }}
          transition={{
            duration: animationLevel === 'full' ? 0.3 : 0.1,
            ease: 'easeOut',
          }}
        >
          <div className={styles.themeIcon} />
          {(isLoadingAssets || isPreloading) && (
            <motion.div
              className={styles.loadingSpinner}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>
      </motion.button>
    )
  }

  // Render theme selector panel
  const renderSelectorPanel = () => {
    if (!isOpen) return null

    if (!isLoaded || animationLevel === 'none') {
      return (
        <div className={styles.selectorPanel}>
          <div className={styles.panelHeader}>
            <h2>Choose Theme</h2>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="Close theme selector">
              ×
            </button>
          </div>
          <div className={styles.panelContent}>{Object.entries(organizedThemes).map(([category, themes]) => themes.length > 0 && <ThemeCategory key={category} category={category} themes={themes} activeTheme={currentTheme} onThemeSelect={handleThemeSelect} animationLevel={animationLevel} />)}</div>
        </div>
      )
    }

    const { motion, AnimatePresence } = animationComponents

    return (
      <AnimatePresence>
        <motion.div
          className={styles.selectorPanel}
          initial={animationLevel === 'full' ? { opacity: 0, scale: 0.9, y: -20 } : { opacity: 0 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={animationLevel === 'full' ? { opacity: 0, scale: 0.9, y: -20 } : { opacity: 0 }}
          transition={{
            duration: animationLevel === 'full' ? 0.3 : 0.1,
            ease: 'easeOut',
          }}
        >
          <div className={styles.panelHeader}>
            <h2>Choose Theme</h2>
            <motion.button className={styles.closeButton} onClick={() => setIsOpen(false)} whileHover={animationLevel === 'full' ? { scale: 1.1 } : {}} whileTap={animationLevel !== 'minimal' ? { scale: 0.9 } : {}} aria-label="Close theme selector">
              ×
            </motion.button>
          </div>
          <div className={styles.panelContent}>{Object.entries(organizedThemes).map(([category, themes]) => themes.length > 0 && <ThemeCategory key={category} category={category} themes={themes} activeTheme={currentTheme} onThemeSelect={handleThemeSelect} animationLevel={animationLevel} />)}</div>
        </motion.div>
      </AnimatePresence>
    )
  }

  return (
    <div className={styles.optimizedThemeSelector}>
      {renderSelectorButton()}
      {renderSelectorPanel()}
    </div>
  )
})

OptimizedThemeSelector.displayName = 'OptimizedThemeSelector'
