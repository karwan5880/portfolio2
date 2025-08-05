'use client'

import { useEffect } from 'react'

import { useMobileOptimizations, useMobilePerformance, useMobileTheme } from '@/hooks/useMobileOptimizations'

/**
 * Mobile theme optimizer component
 * Applies mobile-specific theme optimizations and performance settings
 */
export const MobileThemeOptimizer = ({ children }) => {
  const { isMobile, isTablet, touchSupport } = useMobileOptimizations()
  const { performanceMode, optimizedSettings } = useMobilePerformance()
  const { mobileThemeSettings } = useMobileTheme()

  useEffect(() => {
    if (!isMobile && !isTablet) return

    const root = document.documentElement

    // Apply mobile-specific CSS custom properties
    Object.entries(mobileThemeSettings).forEach(([key, value]) => {
      root.style.setProperty(`--mobile-${key}`, value)
    })

    // Apply performance optimizations
    root.style.setProperty('--mobile-particle-count', optimizedSettings.particleCount)
    root.style.setProperty('--mobile-animation-duration', `${optimizedSettings.animationDuration}s`)
    root.style.setProperty('--mobile-blur-radius', `${optimizedSettings.blurRadius}px`)
    root.style.setProperty('--mobile-shadow-intensity', optimizedSettings.shadowIntensity)
    root.style.setProperty('--mobile-parallax-enabled', optimizedSettings.enableParallax ? '1' : '0')
    root.style.setProperty('--mobile-complex-animations', optimizedSettings.enableComplexAnimations ? '1' : '0')

    // Apply touch-specific optimizations
    if (touchSupport) {
      root.style.setProperty('--touch-target-size', '44px')
      root.style.setProperty('--touch-padding', '8px')
      root.classList.add('touch-device')
    }

    // Apply performance mode class
    root.classList.add(`performance-${performanceMode}`)

    return () => {
      // Cleanup on unmount
      root.classList.remove('touch-device', `performance-${performanceMode}`)

      // Remove mobile-specific properties
      Object.keys(mobileThemeSettings).forEach((key) => {
        root.style.removeProperty(`--mobile-${key}`)
      })

      root.style.removeProperty('--mobile-particle-count')
      root.style.removeProperty('--mobile-animation-duration')
      root.style.removeProperty('--mobile-blur-radius')
      root.style.removeProperty('--mobile-shadow-intensity')
      root.style.removeProperty('--mobile-parallax-enabled')
      root.style.removeProperty('--mobile-complex-animations')
      root.style.removeProperty('--touch-target-size')
      root.style.removeProperty('--touch-padding')
    }
  }, [isMobile, isTablet, touchSupport, performanceMode, optimizedSettings, mobileThemeSettings])

  return children
}
