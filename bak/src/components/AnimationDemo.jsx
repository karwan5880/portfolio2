'use client'

import { AnimatedChild, AnimatedSection, ScrollAnimatedSection, StaggerContainer } from './AnimatedSection'
import { AnimationWrapper, FadeIn, ScaleIn, ScrollReveal, SlideIn, StaggeredList } from './AnimationWrapper'

/**
 * AnimationDemo component to showcase the animation infrastructure
 * This component demonstrates various animation types and patterns
 */
export const AnimationDemo = () => {
  return (
    <div style={{ padding: '2rem', minHeight: '200vh' }}>
      <h1>Animation Infrastructure Demo</h1>

      {/* Basic Section Animations */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Section Animations</h2>

        <AnimatedSection animation="fade" delay={0.2}>
          <div style={{ padding: '2rem', background: '#f0f0f0', margin: '1rem 0' }}>Fade Animation</div>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.4}>
          <div style={{ padding: '2rem', background: '#e0e0e0', margin: '1rem 0' }}>Slide Up Animation</div>
        </AnimatedSection>

        <AnimatedSection animation="scale" delay={0.6}>
          <div style={{ padding: '2rem', background: '#d0d0d0', margin: '1rem 0' }}>Scale Animation</div>
        </AnimatedSection>
      </section>

      {/* Staggered Animations */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Staggered Animations</h2>

        <StaggerContainer speed="normal">
          <AnimatedChild>
            <div style={{ padding: '1rem', background: '#c0c0c0', margin: '0.5rem 0' }}>Staggered Item 1</div>
          </AnimatedChild>
          <AnimatedChild>
            <div style={{ padding: '1rem', background: '#b0b0b0', margin: '0.5rem 0' }}>Staggered Item 2</div>
          </AnimatedChild>
          <AnimatedChild>
            <div style={{ padding: '1rem', background: '#a0a0a0', margin: '0.5rem 0' }}>Staggered Item 3</div>
          </AnimatedChild>
        </StaggerContainer>
      </section>

      {/* Animation Wrappers */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Animation Wrappers</h2>

        <FadeIn delay={0.2}>
          <div style={{ padding: '2rem', background: '#90c0ff', margin: '1rem 0' }}>FadeIn Wrapper</div>
        </FadeIn>

        <SlideIn direction="left" delay={0.4}>
          <div style={{ padding: '2rem', background: '#80b0ff', margin: '1rem 0' }}>SlideIn from Left</div>
        </SlideIn>

        <ScaleIn delay={0.6}>
          <div style={{ padding: '2rem', background: '#70a0ff', margin: '1rem 0' }}>ScaleIn Wrapper</div>
        </ScaleIn>
      </section>

      {/* Staggered List */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Staggered List</h2>

        <StaggeredList speed="fast" type="scale">
          <div style={{ padding: '1rem', background: '#ff9090', margin: '0.5rem 0' }}>List Item 1</div>
          <div style={{ padding: '1rem', background: '#ff8080', margin: '0.5rem 0' }}>List Item 2</div>
          <div style={{ padding: '1rem', background: '#ff7070', margin: '0.5rem 0' }}>List Item 3</div>
          <div style={{ padding: '1rem', background: '#ff6060', margin: '0.5rem 0' }}>List Item 4</div>
        </StaggeredList>
      </section>

      {/* Scroll-triggered Animations */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Scroll-triggered Animations</h2>

        <ScrollAnimatedSection animation="fadeInUp" margin="-200px">
          <div style={{ padding: '2rem', background: '#90ff90', margin: '1rem 0' }}>Scroll Animated Section - Fade In Up</div>
        </ScrollAnimatedSection>

        <ScrollReveal animation="fadeInLeft" threshold={0.3}>
          <div style={{ padding: '2rem', background: '#80ff80', margin: '1rem 0' }}>Scroll Reveal - Fade In Left</div>
        </ScrollReveal>

        <ScrollReveal animation="scaleIn" once={false}>
          <div style={{ padding: '2rem', background: '#70ff70', margin: '1rem 0' }}>Scroll Reveal - Scale In (repeats)</div>
        </ScrollReveal>
      </section>

      {/* Animation with Custom Trigger */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Hover Animations</h2>

        <AnimationWrapper trigger="hover" animation="scale">
          <div
            style={{
              padding: '2rem',
              background: '#ffff90',
              margin: '1rem 0',
              cursor: 'pointer',
              textAlign: 'center',
            }}
          >
            Hover me for scale animation
          </div>
        </AnimationWrapper>
      </section>

      <div style={{ height: '50vh' }}>{/* Spacer for scroll testing */}</div>
    </div>
  )
}
