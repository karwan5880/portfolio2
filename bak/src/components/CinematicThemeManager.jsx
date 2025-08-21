'use client'

import { useEffect, useState } from 'react'

import { DataStreamParticles, LightningEffect, NeonGlowParticles, RainParticles, SpotlightBeams, SunRaysEffect } from './particles/CinematicParticles'
import { useAnimations } from '@/hooks/useAnimations'
import { applyCinematicTheme, cinematicThemes } from '@/themes/cinematic'

/**
 * Cinematic Theme Manager Component
 * Handles cinematic theme application and particle effects
 */
export const CinematicThemeManager = ({ currentTheme = null, onThemeChange = null }) => {
  const [activeTheme, setActiveTheme] = useState(null)
  const [particleEffects, setParticleEffects] = useState([])
  const { animationsEnabled } = useAnimations()

  // Apply theme when it changes
  useEffect(() => {
    if (currentTheme) {
      applyCinematicTheme(currentTheme)
      setActiveTheme(currentTheme)
      updateParticleEffects(currentTheme)

      if (onThemeChange) {
        onThemeChange(currentTheme)
      }
    }
  }, [currentTheme, onThemeChange])

  // Update particle effects based on theme
  const updateParticleEffects = (theme) => {
    if (!theme || !animationsEnabled) {
      setParticleEffects([])
      return
    }

    const effects = []

    switch (theme.id) {
      case 'hollywood':
        if (theme.particles.spotlight?.enabled) {
          effects.push({
            type: 'spotlight',
            props: theme.particles.spotlight,
          })
        }
        if (theme.particles.goldenDust?.enabled) {
          effects.push({
            type: 'goldenDust',
            props: theme.particles.goldenDust,
          })
        }
        break

      case 'rain':
        if (theme.particles.rain?.enabled) {
          effects.push({
            type: 'rain',
            props: theme.particles.rain,
          })
        }
        if (theme.particles.lightning?.enabled) {
          effects.push({
            type: 'lightning',
            props: theme.particles.lightning,
          })
        }
        break

      case 'sunset':
        if (theme.particles.sunRays?.enabled) {
          effects.push({
            type: 'sunRays',
            props: theme.particles.sunRays,
          })
        }
        break

      case 'neon':
        if (theme.particles.neonGlow?.enabled) {
          effects.push({
            type: 'neonGlow',
            props: theme.particles.neonGlow,
          })
        }
        break

      case 'cyberpunk':
        if (theme.particles.dataStream?.enabled) {
          effects.push({
            type: 'dataStream',
            props: theme.particles.dataStream,
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
      case 'rain':
        return <RainParticles key={key} {...effect.props} />

      case 'lightning':
        return <LightningEffect key={key} {...effect.props} />

      case 'spotlight':
        return <SpotlightBeams key={key} {...effect.props} />

      case 'neonGlow':
        return <NeonGlowParticles key={key} {...effect.props} />

      case 'dataStream':
        return <DataStreamParticles key={key} {...effect.props} />

      case 'sunRays':
        return <SunRaysEffect key={key} {...effect.props} />

      case 'goldenDust':
        // Use NeonGlowParticles with golden color for dust effect
        return <NeonGlowParticles key={key} colors={[effect.props.color]} count={effect.props.count} size={effect.props.size} speed={effect.props.speed} opacity={effect.props.opacity} />

      default:
        return null
    }
  }

  return (
    <>
      {/* Render particle effects */}
      {animationsEnabled && particleEffects.map(renderParticleEffect)}

      {/* Theme-specific CSS classes are applied via applyCinematicTheme */}
    </>
  )
}

/**
 * Hook for using cinematic themes
 */
export const useCinematicTheme = () => {
  const [currentTheme, setCurrentTheme] = useState(null)
  const [availableThemes, setAvailableThemes] = useState([])

  useEffect(() => {
    setAvailableThemes(Object.values(cinematicThemes))
  }, [])

  const applyTheme = (themeId) => {
    const theme = cinematicThemes[themeId]
    if (theme) {
      applyCinematicTheme(theme)
      setCurrentTheme(theme)
    }
  }

  const removeTheme = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.remove('theme-hollywood', 'theme-rain', 'theme-sunset', 'theme-neon', 'theme-cyberpunk')
    }
    setCurrentTheme(null)
  }

  return {
    currentTheme,
    availableThemes,
    applyTheme,
    removeTheme,
    isThemeActive: !!currentTheme,
  }
}
