/**
 * Parallax utilities using Framer Motion useScroll and useTransform
 * Provides configurable parallax effects for different elements
 */
import { useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

/**
 * Hook for creating parallax effects based on scroll position
 * @param {Object} options - Configuration options
 * @param {number} options.speed - Parallax speed multiplier (0.1 to 2.0)
 * @param {string} options.direction - Direction of parallax ('up', 'down', 'left', 'right')
 * @param {Array} options.range - Custom scroll range [start, end] (0-1)
 * @param {Array} options.outputRange - Custom output range for transform
 * @returns {Object} - Motion values for transform
 */
export const useParallax = (options = {}) => {
  const { speed = 0.5, direction = 'up', range = [0, 1], outputRange = null } = options

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Calculate default output range based on direction and speed
  const getDefaultOutputRange = () => {
    const distance = 100 * speed
    switch (direction) {
      case 'up':
        return [`${distance}px`, `-${distance}px`]
      case 'down':
        return [`-${distance}px`, `${distance}px`]
      case 'left':
        return [`${distance}px`, `-${distance}px`]
      case 'right':
        return [`-${distance}px`, `${distance}px`]
      default:
        return [`${distance}px`, `-${distance}px`]
    }
  }

  const finalOutputRange = outputRange || getDefaultOutputRange()

  // Create transform based on direction
  const transform = useTransform(scrollYProgress, range, finalOutputRange)

  return {
    ref,
    transform,
    scrollYProgress,
  }
}

/**
 * Hook for creating background parallax effects
 * @param {Object} options - Configuration options
 * @returns {Object} - Motion values for background positioning
 */
export const useBackgroundParallax = (options = {}) => {
  const { speed = 0.3, direction = 'vertical' } = options

  const { scrollY } = useScroll()

  const backgroundY = useTransform(scrollY, [0, 1000], direction === 'vertical' ? ['0%', `${speed * 100}%`] : ['0%', '0%'])

  const backgroundX = useTransform(scrollY, [0, 1000], direction === 'horizontal' ? ['0%', `${speed * 100}%`] : ['0%', '0%'])

  return {
    backgroundY: direction === 'vertical' ? backgroundY : '0%',
    backgroundX: direction === 'horizontal' ? backgroundX : '0%',
  }
}

/**
 * Hook for creating rotation parallax effects
 * @param {Object} options - Configuration options
 * @returns {Object} - Motion values for rotation
 */
export const useRotationParallax = (options = {}) => {
  const { speed = 0.2, maxRotation = 15 } = options

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const rotate = useTransform(scrollYProgress, [0, 1], [-maxRotation * speed, maxRotation * speed])

  return {
    ref,
    rotate,
  }
}

/**
 * Hook for creating scale parallax effects
 * @param {Object} options - Configuration options
 * @returns {Object} - Motion values for scaling
 */
export const useScaleParallax = (options = {}) => {
  const { minScale = 0.8, maxScale = 1.2, speed = 0.5 } = options

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [minScale, maxScale, minScale])

  return {
    ref,
    scale,
  }
}

/**
 * Hook for creating opacity parallax effects
 * @param {Object} options - Configuration options
 * @returns {Object} - Motion values for opacity
 */
export const useOpacityParallax = (options = {}) => {
  const { fadeInStart = 0, fadeInEnd = 0.3, fadeOutStart = 0.7, fadeOutEnd = 1 } = options

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd, 1], [0, 0, 1, 1, 0, 0])

  return {
    ref,
    opacity,
  }
}

/**
 * Hook for creating complex multi-property parallax effects
 * @param {Object} options - Configuration options
 * @returns {Object} - Motion values for multiple properties
 */
export const useComplexParallax = (options = {}) => {
  const { translateY = { speed: 0.5, range: [0, 1] }, translateX = null, rotate = null, scale = null, opacity = null } = options

  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const transforms = {}

  // Y translation
  if (translateY) {
    const distance = 100 * translateY.speed
    transforms.y = useTransform(scrollYProgress, translateY.range || [0, 1], [`${distance}px`, `-${distance}px`])
  }

  // X translation
  if (translateX) {
    const distance = 100 * translateX.speed
    transforms.x = useTransform(scrollYProgress, translateX.range || [0, 1], [`${distance}px`, `-${distance}px`])
  }

  // Rotation
  if (rotate) {
    transforms.rotate = useTransform(scrollYProgress, rotate.range || [0, 1], [-rotate.maxRotation || 15, rotate.maxRotation || 15])
  }

  // Scale
  if (scale) {
    transforms.scale = useTransform(scrollYProgress, scale.range || [0, 0.5, 1], [scale.minScale || 0.8, scale.maxScale || 1.2, scale.minScale || 0.8])
  }

  // Opacity
  if (opacity) {
    transforms.opacity = useTransform(scrollYProgress, opacity.range || [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  }

  return {
    ref,
    ...transforms,
    scrollYProgress,
  }
}

/**
 * Utility function to create parallax configuration presets
 */
export const parallaxPresets = {
  // Subtle background movement
  backgroundSlow: {
    speed: 0.2,
    direction: 'up',
  },

  // Medium parallax for content elements
  contentMedium: {
    speed: 0.5,
    direction: 'up',
  },

  // Fast parallax for decorative elements
  decorativeFast: {
    speed: 0.8,
    direction: 'up',
  },

  // Horizontal parallax
  horizontalSlow: {
    speed: 0.3,
    direction: 'right',
  },

  // Rotation effect
  rotateGentle: {
    speed: 0.3,
    maxRotation: 10,
  },

  // Scale effect
  scaleSubtle: {
    minScale: 0.95,
    maxScale: 1.05,
    speed: 0.4,
  },

  // Fade in/out effect
  fadeInOut: {
    fadeInStart: 0,
    fadeInEnd: 0.2,
    fadeOutStart: 0.8,
    fadeOutEnd: 1,
  },

  // Complex multi-effect
  floatingElement: {
    translateY: { speed: 0.4, range: [0, 1] },
    rotate: { maxRotation: 5, range: [0, 1] },
    scale: { minScale: 0.98, maxScale: 1.02, range: [0, 0.5, 1] },
  },
}
