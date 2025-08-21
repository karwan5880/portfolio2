'use client'

import { motion } from 'framer-motion'

import { useAnimations } from '@/hooks/useAnimations'
import { parallaxPresets, useComplexParallax, useParallax } from '@/utils/parallax'

/**
 * ParallaxElement component for easy parallax effects
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.preset - Preset name from parallaxPresets
 * @param {Object} props.config - Custom parallax configuration
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Additional inline styles
 * @param {boolean} props.disabled - Disable parallax effects
 * @returns {JSX.Element} - Parallax element
 */
export const ParallaxElement = ({ children, preset = 'contentMedium', config = null, className = '', style = {}, disabled = false, ...props }) => {
  const { animationsEnabled } = useAnimations()

  // Don't apply parallax if animations are disabled or explicitly disabled
  const shouldApplyParallax = animationsEnabled && !disabled

  // Use custom config or preset
  const parallaxConfig = config || parallaxPresets[preset] || parallaxPresets.contentMedium

  // Determine if we need complex parallax (multiple properties)
  const isComplexParallax = parallaxConfig.translateY || parallaxConfig.translateX || parallaxConfig.rotate || parallaxConfig.scale || parallaxConfig.opacity

  // Use appropriate parallax hook
  const parallaxData = shouldApplyParallax ? (isComplexParallax ? useComplexParallax(parallaxConfig) : useParallax(parallaxConfig)) : { ref: null }

  // Build motion style object
  const motionStyle = shouldApplyParallax
    ? {
        ...(parallaxData.transform && { y: parallaxData.transform }),
        ...(parallaxData.x && { x: parallaxData.x }),
        ...(parallaxData.y && { y: parallaxData.y }),
        ...(parallaxData.rotate && { rotate: parallaxData.rotate }),
        ...(parallaxData.scale && { scale: parallaxData.scale }),
        ...(parallaxData.opacity && { opacity: parallaxData.opacity }),
        ...style,
      }
    : style

  return (
    <motion.div ref={parallaxData.ref} className={className} style={motionStyle} {...props}>
      {children}
    </motion.div>
  )
}

/**
 * ParallaxBackground component for background parallax effects
 */
export const ParallaxBackground = ({ children, speed = 0.3, direction = 'vertical', className = '', style = {}, disabled = false, ...props }) => {
  const { animationsEnabled } = useAnimations()
  const shouldApplyParallax = animationsEnabled && !disabled

  const { backgroundY, backgroundX } = shouldApplyParallax ? useBackgroundParallax({ speed, direction }) : { backgroundY: '0%', backgroundX: '0%' }

  const motionStyle = {
    backgroundPositionY: backgroundY,
    backgroundPositionX: backgroundX,
    ...style,
  }

  return (
    <motion.div className={className} style={motionStyle} {...props}>
      {children}
    </motion.div>
  )
}

/**
 * ParallaxLayer component for layered parallax effects
 */
export const ParallaxLayer = ({ children, depth = 1, className = '', style = {}, disabled = false, ...props }) => {
  const { animationsEnabled } = useAnimations()
  const shouldApplyParallax = animationsEnabled && !disabled

  // Calculate speed based on depth (closer = faster)
  const speed = shouldApplyParallax ? 0.1 + depth * 0.2 : 0

  const { ref, transform } = shouldApplyParallax ? useParallax({ speed, direction: 'up' }) : { ref: null, transform: 0 }

  const motionStyle = shouldApplyParallax
    ? {
        y: transform,
        ...style,
      }
    : style

  return (
    <motion.div ref={ref} className={className} style={motionStyle} {...props}>
      {children}
    </motion.div>
  )
}
