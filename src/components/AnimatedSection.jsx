'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

import { useAnimations } from '@/hooks/useAnimations'

/**
 * AnimatedSection component that wraps content with Framer Motion animations
 * Provides entrance animations, staggered animations, and accessibility support
 */
export const AnimatedSection = forwardRef(({ children, animation = 'fade', stagger = false, staggerSpeed = 'normal', staggerType = 'slideUp', delay = 0, duration, className = '', style = {}, onAnimationStart, onAnimationComplete, ...props }, ref) => {
  const { getSectionAnimation, createStaggeredVariants, animationsEnabled } = useAnimations()

  // Get animation configuration
  const animationConfig = getSectionAnimation(animation, {
    delay,
    duration,
  })

  // Get staggered animation variants if needed
  const staggerVariants = stagger ? createStaggeredVariants(staggerType, staggerSpeed) : null

  // If animations are disabled, render without motion
  if (!animationsEnabled) {
    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    )
  }

  // Render with staggered animations
  if (stagger && staggerVariants) {
    return (
      <motion.div ref={ref} className={className} style={style} variants={staggerVariants.container} initial="initial" animate="animate" exit="exit" onAnimationStart={onAnimationStart} onAnimationComplete={onAnimationComplete} {...props}>
        {children}
      </motion.div>
    )
  }

  // Render with single animation
  return (
    <motion.div ref={ref} className={className} style={style} initial={animationConfig.initial} animate={animationConfig.animate} exit={animationConfig.exit} transition={animationConfig.transition} onAnimationStart={onAnimationStart} onAnimationComplete={onAnimationComplete} {...props}>
      {children}
    </motion.div>
  )
})

AnimatedSection.displayName = 'AnimatedSection'

/**
 * AnimatedChild component for use within staggered containers
 * Automatically applies child animation variants
 */
export const AnimatedChild = forwardRef(({ children, animation = 'slideUp', delay = 0, duration, className = '', style = {}, onAnimationStart, onAnimationComplete, ...props }, ref) => {
  const { getChildAnimation, animationsEnabled } = useAnimations()

  // Get child animation configuration
  const animationConfig = getChildAnimation(animation, {
    delay,
    duration,
  })

  // If animations are disabled, render without motion
  if (!animationsEnabled) {
    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} className={className} style={style} variants={animationConfig} onAnimationStart={onAnimationStart} onAnimationComplete={onAnimationComplete} {...props}>
      {children}
    </motion.div>
  )
})

AnimatedChild.displayName = 'AnimatedChild'

/**
 * ScrollAnimatedSection component for scroll-triggered animations
 * Uses whileInView for better performance and control
 */
export const ScrollAnimatedSection = forwardRef(({ children, animation = 'fadeInUp', threshold = 0.1, margin = '-100px', once = true, delay = 0, duration, className = '', style = {}, onAnimationStart, onAnimationComplete, ...props }, ref) => {
  const { getScrollAnimation, animationsEnabled } = useAnimations()

  // Get scroll animation configuration
  const animationConfig = getScrollAnimation(animation, {
    delay,
    duration,
    margin,
    once,
  })

  // If animations are disabled, render without motion
  if (!animationsEnabled) {
    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={animationConfig.initial}
      whileInView={animationConfig.whileInView}
      viewport={{
        ...animationConfig.viewport,
        threshold,
      }}
      transition={animationConfig.transition}
      onAnimationStart={onAnimationStart}
      onAnimationComplete={onAnimationComplete}
      {...props}
    >
      {children}
    </motion.div>
  )
})

ScrollAnimatedSection.displayName = 'ScrollAnimatedSection'

/**
 * StaggerContainer component for creating staggered animations
 * Provides container for multiple AnimatedChild components
 */
export const StaggerContainer = forwardRef(({ children, speed = 'normal', delay = 0, className = '', style = {}, onAnimationStart, onAnimationComplete, ...props }, ref) => {
  const { getStaggerAnimation, animationsEnabled } = useAnimations()

  // Get stagger container configuration
  const containerConfig = getStaggerAnimation(speed, {
    delayChildren: delay,
  })

  // If animations are disabled, render without motion
  if (!animationsEnabled) {
    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    )
  }

  return (
    <motion.div ref={ref} className={className} style={style} variants={containerConfig} initial="initial" animate="animate" exit="exit" onAnimationStart={onAnimationStart} onAnimationComplete={onAnimationComplete} {...props}>
      {children}
    </motion.div>
  )
})

StaggerContainer.displayName = 'StaggerContainer'
