'use client'

import { useEffect, useState } from 'react'

import { ConfettiParticles, FireworksParticles, SparkleParticles } from './particles/FireworksParticles'
import { FrostParticles, SnowParticles } from './particles/SnowParticles'
import { useAnimations } from '@/hooks/useAnimations'
import { applySeasonalTheme, getSeasonalTheme, seasonalThemes } from '@/themes/seasonal'

/**
 * Seasonal Theme Manager Component
 * Handles automatic seasonal theme detection and particle effects
 */
export const SeasonalThemeManager = ({ enableAutoSeasonal = true, currentTheme = null, onThemeChange = null }) => {
  const [activeSeasonalTheme, setActiveSeasonalTheme] = useState(null)
  const [particleEffects, setParticleEffects] = useState([])
  const { animationsEnabled } = useAnimations()

  // Check for seasonal themes
  useEffect(() => {
    if (!enableAutoSeasonal) return

    const checkSeasonalTheme = () => {
      const seasonal = getSeasonalTheme()
      if (seasonal && seasonal.id !== activeSeasonalTheme?.id) {
        setActiveSeasonalTheme(seasonal)
        if (onThemeChange) {
          onThemeChange(seasonal)
        }
      }
    }

    checkSeasonalTheme()

    // Check daily for seasonal changes
    const interval = setInterval(checkSeasonalTheme, 24 * 60 * 60 * 1000)

    return () => clearInterval(interval)
  }, [enableAutoSeasonal, activeSeasonalTheme, onThemeChange])

  // Apply theme when it changes
  useEffect(() => {
    const themeToApply = currentTheme || activeSeasonalTheme
    if (themeToApply) {
      applySeasonalTheme(themeToApply)
      updateParticleEffects(themeToApply)
    }
  }, [currentTheme, activeSeasonalTheme])

  // Update particle effects based on theme
  const updateParticleEffects = (theme) => {
    if (!theme || !animationsEnabled) {
      setParticleEffects([])
      return
    }

    const effects = []

    switch (theme.id) {
      case 'christmas':
        if (theme.particles.snow?.enabled) {
          effects.push({
            type: 'snow',
            props: theme.particles.snow,
          })
        }
        if (theme.particles.sparkles?.enabled) {
          effects.push({
            type: 'sparkles',
            props: theme.particles.sparkles,
          })
        }
        break

      case 'new-year':
        if (theme.particles.fireworks?.enabled) {
          effects.push({
            type: 'fireworks',
            props: theme.particles.fireworks,
          })
        }
        if (theme.particles.confetti?.enabled) {
          effects.push({
            type: 'confetti',
            props: theme.particles.confetti,
          })
        }
        break

      case 'snow':
        if (theme.particles.snow?.enabled) {
          effects.push({
            type: 'snow',
            props: theme.particles.snow,
          })
        }
        if (theme.particles.frost?.enabled) {
          effects.push({
            type: 'frost',
            props: theme.particles.frost,
          })
        }
        break

      default:
        break
    }

    setParticleEffects(effects)
  }

  // Render particle effects
  const renderParticleEffect = (effect, index) => {
    const key = `${effect.type}-${index}`

    switch (effect.type) {
      case 'snow':
        return <SnowParticles key={key} {...effect.props} />

      case 'frost':
        return <FrostParticles key={key} {...effect.props} />

      case 'fireworks':
        return <FireworksParticles key={key} {...effect.props} />

      case 'confetti':
        return <ConfettiParticles key={key} {...effect.props} />

      case 'sparkles':
        return <SparkleParticles key={key} {...effect.props} />

      default:
        return null
    }
  }

  return (
    <>
      {/* Render particle effects */}
      {animationsEnabled && particleEffects.map(renderParticleEffect)}

      {/* Theme-specific CSS classes are applied via applySeasonalTheme */}
    </>
  )
}

/**
 * Hook for using seasonal themes
 */
export const useSeasonalTheme = () => {
  const [currentSeasonal, setCurrentSeasonal] = useState(null)
  const [availableSeasonals, setAvailableSeasonals] = useState([])

  useEffect(() => {
    setCurrentSeasonal(getSeasonalTheme())
    setAvailableSeasonals(Object.values(seasonalThemes))
  }, [])

  const applyTheme = (themeId) => {
    const theme = seasonalThemes[themeId]
    if (theme) {
      applySeasonalTheme(theme)
      setCurrentSeasonal(theme)
    }
  }

  const removeTheme = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('theme-christmas', 'theme-new-year', 'theme-snow')
    }
    setCurrentSeasonal(null)
  }

  return {
    currentSeasonal,
    availableSeasonals,
    applyTheme,
    removeTheme,
    isSeasonalActive: !!currentSeasonal,
  }
}
