'use client'

/**
 * Animation utilities and presets for Framer Motion
 * Provides consistent animation configurations across the application
 */

// Check if user prefers reduced motion
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Base animation durations and easing
export const ANIMATION_CONFIG = {
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
  },
  easing: {
    easeOut: [0.25, 0.46, 0.45, 0.94],
    easeInOut: [0.4, 0, 0.2, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
  },
  stagger: {
    fast: 0.1,
    normal: 0.2,
    slow: 0.3,
  },
}

// Animation presets for sections
export const SECTION_ANIMATIONS = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  slide: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  slideUp: {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -100 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  slideDown: {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  slideLeft: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  slideRight: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  scaleUp: {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.bounce,
    },
  },

  zoom: {
    initial: { opacity: 0, scale: 1.2 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },
}

// Staggered animation containers
export const STAGGER_CONTAINERS = {
  fast: {
    animate: {
      transition: {
        staggerChildren: ANIMATION_CONFIG.stagger.fast,
        delayChildren: 0.1,
      },
    },
  },

  normal: {
    animate: {
      transition: {
        staggerChildren: ANIMATION_CONFIG.stagger.normal,
        delayChildren: 0.2,
      },
    },
  },

  slow: {
    animate: {
      transition: {
        staggerChildren: ANIMATION_CONFIG.stagger.slow,
        delayChildren: 0.3,
      },
    },
  },
}

// Child animations for staggered containers
export const STAGGER_CHILDREN = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  slideUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: ANIMATION_CONFIG.duration.fast,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },
}

// Utility function to get animation preset with reduced motion support
export const getAnimationPreset = (presetName, options = {}) => {
  const preset = SECTION_ANIMATIONS[presetName] || SECTION_ANIMATIONS.fade

  // Return static animation if user prefers reduced motion
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.1 },
    }
  }

  // Apply custom options
  if (options.duration) {
    preset.transition.duration = options.duration
  }

  if (options.delay) {
    preset.transition.delay = options.delay
  }

  if (options.ease) {
    preset.transition.ease = options.ease
  }

  return preset
}

// Utility function to get stagger container with reduced motion support
export const getStaggerContainer = (speed = 'normal', options = {}) => {
  const container = STAGGER_CONTAINERS[speed] || STAGGER_CONTAINERS.normal

  // Return immediate animation if user prefers reduced motion
  if (prefersReducedMotion()) {
    return {
      animate: {
        transition: {
          staggerChildren: 0,
          delayChildren: 0,
        },
      },
    }
  }

  // Apply custom options
  if (options.staggerChildren) {
    container.animate.transition.staggerChildren = options.staggerChildren
  }

  if (options.delayChildren) {
    container.animate.transition.delayChildren = options.delayChildren
  }

  return container
}

// Utility function to get stagger child animation with reduced motion support
export const getStaggerChild = (animationType = 'fade', options = {}) => {
  const child = STAGGER_CHILDREN[animationType] || STAGGER_CHILDREN.fade

  // Return static animation if user prefers reduced motion
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.1 },
    }
  }

  // Apply custom options
  if (options.duration) {
    child.transition.duration = options.duration
  }

  if (options.delay) {
    child.transition.delay = options.delay
  }

  return child
}

// Viewport animation variants for scroll-triggered animations
export const VIEWPORT_ANIMATIONS = {
  fadeInUp: {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  fadeInDown: {
    initial: { opacity: 0, y: -50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  fadeInLeft: {
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  fadeInRight: {
    initial: { opacity: 0, x: 50 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, margin: '-100px' },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },

  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, margin: '-100px' },
    transition: {
      duration: ANIMATION_CONFIG.duration.normal,
      ease: ANIMATION_CONFIG.easing.easeOut,
    },
  },
}

// Utility function to get viewport animation with reduced motion support
export const getViewportAnimation = (animationType = 'fadeInUp', options = {}) => {
  const animation = VIEWPORT_ANIMATIONS[animationType] || VIEWPORT_ANIMATIONS.fadeInUp

  // Return static animation if user prefers reduced motion
  if (prefersReducedMotion()) {
    return {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true },
      transition: { duration: 0.1 },
    }
  }

  // Apply custom options
  const customAnimation = { ...animation }

  if (options.duration) {
    customAnimation.transition.duration = options.duration
  }

  if (options.delay) {
    customAnimation.transition.delay = options.delay
  }

  if (options.margin) {
    customAnimation.viewport.margin = options.margin
  }

  if (options.once !== undefined) {
    customAnimation.viewport.once = options.once
  }

  return customAnimation
}
