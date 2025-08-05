'use client'

import { motion } from 'framer-motion'
import { forwardRef } from 'react'

import { useAnimations } from '@/hooks/useAnimations'

/**
 * AnimationWrapper component for adding animations to existing components
 * Provides a simple way to wrap any component with Framer Motion animations
 */
export const AnimationWrapper = forwardRef(
  (
    {
      children,
      animation = 'fade',
      delay = 0,
      duration,
      stagger = false,
      staggerSpeed = 'normal',
      staggerType = 'slideUp',
      trigger = 'mount', // 'mount', 'scroll', 'hover'
      threshold = 0.1,
      margin = '-50px',
      once = true,
      className = '',
      style = {},
      onAnimationStart,
      onAnimationComplete,
      ...props
    },
    ref
  ) => {
    const { getSectionAnimation, createStaggeredVariants, getScrollAnimation, animationsEnabled } = useAnimations()

    // If animations are disabled, render without motion
    if (!animationsEnabled) {
      return (
        <div ref={ref} className={className} style={style} {...props}>
          {children}
        </div>
      )
    }

    // Mount-triggered animations
    if (trigger === 'mount') {
      if (stagger) {
        const staggerVariants = createStaggeredVariants(staggerType, staggerSpeed)
        return (
          <motion.div ref={ref} className={className} style={style} variants={staggerVariants.container} initial="initial" animate="animate" exit="exit" onAnimationStart={onAnimationStart} onAnimationComplete={onAnimationComplete} {...props}>
            {children}
          </motion.div>
        )
      }

      const animationConfig = getSectionAnimation(animation, { delay, duration })
      return (
        <motion.div ref={ref} className={className} style={style} initial={animationConfig.initial} animate={animationConfig.animate} exit={animationConfig.exit} transition={animationConfig.transition} onAnimationStart={onAnimationStart} onAnimationComplete={onAnimationComplete} {...props}>
          {children}
        </motion.div>
      )
    }

    // Scroll-triggered animations
    if (trigger === 'scroll') {
      const scrollConfig = getScrollAnimation(animation, {
        delay,
        duration,
        margin,
        once,
      })

      return (
        <motion.div
          ref={ref}
          className={className}
          style={style}
          initial={scrollConfig.initial}
          whileInView={scrollConfig.whileInView}
          viewport={{
            ...scrollConfig.viewport,
            threshold,
          }}
          transition={scrollConfig.transition}
          onAnimationStart={onAnimationStart}
          onAnimationComplete={onAnimationComplete}
          {...props}
        >
          {children}
        </motion.div>
      )
    }

    // Hover-triggered animations
    if (trigger === 'hover') {
      const animationConfig = getSectionAnimation(animation, { delay, duration })
      return (
        <motion.div ref={ref} className={className} style={style} initial={animationConfig.initial} whileHover={animationConfig.animate} transition={animationConfig.transition} onAnimationStart={onAnimationStart} onAnimationComplete={onAnimationComplete} {...props}>
          {children}
        </motion.div>
      )
    }

    // Default fallback
    return (
      <div ref={ref} className={className} style={style} {...props}>
        {children}
      </div>
    )
  }
)

AnimationWrapper.displayName = 'AnimationWrapper'

/**
 * FadeIn component - Simple fade-in animation wrapper
 */
export const FadeIn = forwardRef((props, ref) => <AnimationWrapper ref={ref} animation="fade" {...props} />)

FadeIn.displayName = 'FadeIn'

/**
 * SlideIn component - Slide-in animation wrapper
 */
export const SlideIn = forwardRef(({ direction = 'up', ...props }, ref) => {
  const animationMap = {
    up: 'slideUp',
    down: 'slideDown',
    left: 'slideLeft',
    right: 'slideRight',
  }

  return <AnimationWrapper ref={ref} animation={animationMap[direction] || 'slideUp'} {...props} />
})

SlideIn.displayName = 'SlideIn'

/**
 * ScaleIn component - Scale-in animation wrapper
 */
export const ScaleIn = forwardRef((props, ref) => <AnimationWrapper ref={ref} animation="scale" {...props} />)

ScaleIn.displayName = 'ScaleIn'

/**
 * StaggeredList component - For animating lists with staggered children
 */
export const StaggeredList = forwardRef(({ children, speed = 'normal', type = 'slideUp', className = '', ...props }, ref) => (
  <AnimationWrapper ref={ref} stagger={true} staggerSpeed={speed} staggerType={type} className={className} {...props}>
    {children}
  </AnimationWrapper>
))

StaggeredList.displayName = 'StaggeredList'

/**
 * ScrollReveal component - For scroll-triggered animations
 */
export const ScrollReveal = forwardRef(({ animation = 'fadeInUp', threshold = 0.1, margin = '-50px', once = true, ...props }, ref) => <AnimationWrapper ref={ref} trigger="scroll" animation={animation} threshold={threshold} margin={margin} once={once} {...props} />)

ScrollReveal.displayName = 'ScrollReveal'
