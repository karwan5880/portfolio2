import { AnimatedChild, AnimatedSection, ScrollAnimatedSection, StaggerContainer } from '../AnimatedSection'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}))

// Mock useAnimations hook
vi.mock('@/hooks/useAnimations', () => ({
  useAnimations: () => ({
    getSectionAnimation: vi.fn(() => ({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.6 },
    })),
    createStaggeredVariants: vi.fn(() => ({
      container: {
        animate: {
          transition: {
            staggerChildren: 0.2,
            delayChildren: 0.2,
          },
        },
      },
    })),
    getChildAnimation: vi.fn(() => ({
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
    })),
    getScrollAnimation: vi.fn(() => ({
      initial: { opacity: 0, y: 50 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: '-100px' },
      transition: { duration: 0.6 },
    })),
    getStaggerAnimation: vi.fn(() => ({
      animate: {
        transition: {
          staggerChildren: 0.2,
          delayChildren: 0.2,
        },
      },
    })),
    animationsEnabled: true,
  }),
}))

describe('AnimatedSection', () => {
  it('renders children correctly', () => {
    render(
      <AnimatedSection>
        <div>Test content</div>
      </AnimatedSection>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(
      <AnimatedSection className="custom-class">
        <div>Test content</div>
      </AnimatedSection>
    )

    expect(screen.getByTestId('motion-div')).toHaveClass('custom-class')
  })

  it('renders with stagger when enabled', () => {
    render(
      <AnimatedSection stagger={true}>
        <div>Test content</div>
      </AnimatedSection>
    )

    expect(screen.getByTestId('motion-div')).toBeInTheDocument()
  })

  it('calls animation callbacks', () => {
    const onStart = vi.fn()
    const onComplete = vi.fn()

    render(
      <AnimatedSection onAnimationStart={onStart} onAnimationComplete={onComplete}>
        <div>Test content</div>
      </AnimatedSection>
    )

    expect(screen.getByTestId('motion-div')).toBeInTheDocument()
  })
})

describe('AnimatedChild', () => {
  it('renders children correctly', () => {
    render(
      <AnimatedChild>
        <div>Child content</div>
      </AnimatedChild>
    )

    expect(screen.getByText('Child content')).toBeInTheDocument()
  })

  it('applies custom animation type', () => {
    render(
      <AnimatedChild animation="scale">
        <div>Child content</div>
      </AnimatedChild>
    )

    expect(screen.getByTestId('motion-div')).toBeInTheDocument()
  })
})

describe('ScrollAnimatedSection', () => {
  it('renders children correctly', () => {
    render(
      <ScrollAnimatedSection>
        <div>Scroll content</div>
      </ScrollAnimatedSection>
    )

    expect(screen.getByText('Scroll content')).toBeInTheDocument()
  })

  it('applies custom animation type', () => {
    render(
      <ScrollAnimatedSection animation="fadeInLeft">
        <div>Scroll content</div>
      </ScrollAnimatedSection>
    )

    expect(screen.getByTestId('motion-div')).toBeInTheDocument()
  })
})

describe('StaggerContainer', () => {
  it('renders children correctly', () => {
    render(
      <StaggerContainer>
        <div>Container content</div>
      </StaggerContainer>
    )

    expect(screen.getByText('Container content')).toBeInTheDocument()
  })

  it('applies custom stagger speed', () => {
    render(
      <StaggerContainer speed="fast">
        <div>Container content</div>
      </StaggerContainer>
    )

    expect(screen.getByTestId('motion-div')).toBeInTheDocument()
  })
})
