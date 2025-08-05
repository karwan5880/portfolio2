# Animation Infrastructure Documentation

## Overview

The Framer Motion animation infrastructure provides a comprehensive system for adding smooth, accessible animations throughout the portfolio application. The system includes entrance animations, staggered animations, scroll-triggered animations, and full accessibility support including `prefers-reduced-motion` compliance.

## Core Components

### 1. Animation Utilities (`src/utils/animations.js`)

Contains all animation presets, configurations, and utility functions:

- **Animation Presets**: Pre-configured animation variants (fade, slide, scale, zoom)
- **Stagger Configurations**: Container and child animation settings for staggered effects
- **Viewport Animations**: Scroll-triggered animation configurations
- **Accessibility Support**: Automatic reduced motion detection and fallbacks

#### Available Animation Presets:

- `fade` - Simple opacity transition
- `slide` - Slide with opacity (up, down, left, right variants)
- `scale` - Scale with opacity
- `scaleUp` - Scale from small with bounce effect
- `zoom` - Scale from large to normal

#### Stagger Speeds:

- `fast` - 0.1s stagger delay
- `normal` - 0.2s stagger delay
- `slow` - 0.3s stagger delay

### 2. Animation Hooks (`src/hooks/useAnimations.js`)

#### `useAnimations()`

Main hook providing animation utilities:

```javascript
const { animationsEnabled, reducedMotion, getSectionAnimation, getStaggerAnimation, getChildAnimation, getScrollAnimation, createStaggeredVariants, isAnimationEnabled, isReducedMotion, toggleAnimations } = useAnimations()
```

#### `useEntranceAnimation(options)`

Hook for intersection observer-based entrance animations:

```javascript
const { ref, isVisible, hasAnimated, resetAnimation } = useEntranceAnimation({
  threshold: 0.1,
  rootMargin: '0px',
  triggerOnce: true,
  delay: 0,
})
```

#### `useScrollAnimation(options)`

Hook for scroll-based animation effects:

```javascript
const { scrollY, isScrollingDown, getScrollProgress, getElementScrollProgress } = useScrollAnimation()
```

### 3. Animation Components

#### `AnimatedSection`

Main component for section-level animations:

```javascript
<AnimatedSection
  animation="fade" // Animation preset
  stagger={false} // Enable staggered children
  staggerSpeed="normal" // Stagger timing
  staggerType="slideUp" // Child animation type
  delay={0} // Animation delay
  duration={0.6} // Custom duration
  onAnimationStart={fn} // Callback
  onAnimationComplete={fn} // Callback
>
  {children}
</AnimatedSection>
```

#### `AnimatedChild`

For use within staggered containers:

```javascript
<AnimatedChild animation="slideUp" delay={0}>
  {children}
</AnimatedChild>
```

#### `ScrollAnimatedSection`

Scroll-triggered animations:

```javascript
<ScrollAnimatedSection animation="fadeInUp" threshold={0.1} margin="-100px" once={true}>
  {children}
</ScrollAnimatedSection>
```

#### `StaggerContainer`

Container for staggered child animations:

```javascript
<StaggerContainer speed="normal" delay={0}>
  <AnimatedChild>Item 1</AnimatedChild>
  <AnimatedChild>Item 2</AnimatedChild>
  <AnimatedChild>Item 3</AnimatedChild>
</StaggerContainer>
```

### 4. Animation Wrappers (`src/components/AnimationWrapper.jsx`)

Convenient wrapper components for common use cases:

#### `AnimationWrapper`

Flexible wrapper with multiple trigger types:

```javascript
<AnimationWrapper
  animation="fade"
  trigger="mount" // 'mount', 'scroll', 'hover'
  stagger={false}
  threshold={0.1} // For scroll trigger
  margin="-50px" // For scroll trigger
  once={true} // For scroll trigger
>
  {children}
</AnimationWrapper>
```

#### Convenience Components:

- `<FadeIn>` - Simple fade-in animation
- `<SlideIn direction="up">` - Slide animations with direction
- `<ScaleIn>` - Scale-in animation
- `<StaggeredList>` - Staggered list animations
- `<ScrollReveal>` - Scroll-triggered reveal animations

## Integration with SectionWrapper

The `SectionWrapper` component has been enhanced to support Framer Motion animations:

```javascript
<SectionWrapper
  id="section-id"
  title="Section Title"
  animation="slide" // Animation preset
  animationDelay={0.1} // Delay before animation
  stagger={true} // Enable staggered children
  staggerSpeed="normal" // Stagger timing
  staggerType="slideUp" // Child animation type
  onVisibilityChange={fn}
  onRegister={fn}
>
  {children}
</SectionWrapper>
```

## MultiversePortfolio Integration

Each section in the multiverse portfolio has been configured with specific animations:

```javascript
const SECTIONS = [
  {
    id: 'home',
    animation: 'fade',
    animationDelay: 0,
  },
  {
    id: 'timeline',
    animation: 'slideLeft',
    animationDelay: 0.1,
    stagger: true,
    staggerSpeed: 'normal',
    staggerType: 'slideUp',
  },
  // ... more sections
]
```

## Accessibility Features

### Reduced Motion Support

The system automatically detects and respects the `prefers-reduced-motion` CSS media query:

- Animations are disabled when user prefers reduced motion
- Fallback to simple opacity transitions
- All animation utilities check motion preferences
- No performance impact when animations are disabled

### Keyboard Navigation

- Focus management during animations
- Proper ARIA attributes maintained
- Screen reader compatibility

### Performance Optimization

- Throttled scroll event handlers
- RequestAnimationFrame for smooth animations
- Intersection Observer for efficient visibility detection
- Lazy loading of animation assets

## Usage Examples

### Basic Section Animation

```javascript
import { AnimatedSection } from '@/components/AnimatedSection'

;<AnimatedSection animation="slideUp" delay={0.2}>
  <div>Your content here</div>
</AnimatedSection>
```

### Staggered List

```javascript
import { AnimatedChild, StaggerContainer } from '@/components/AnimatedSection'

;<StaggerContainer speed="fast">
  {items.map((item, index) => (
    <AnimatedChild key={index} animation="scale">
      <div>{item.content}</div>
    </AnimatedChild>
  ))}
</StaggerContainer>
```

### Scroll-triggered Animation

```javascript
import { ScrollReveal } from '@/components/AnimationWrapper'

;<ScrollReveal animation="fadeInUp" threshold={0.3}>
  <div>Content that animates when scrolled into view</div>
</ScrollReveal>
```

### Custom Animation with Hook

```javascript
import { motion } from 'framer-motion'

import { useAnimations } from '@/hooks/useAnimations'

function CustomComponent() {
  const { getSectionAnimation } = useAnimations()
  const animation = getSectionAnimation('scale', { delay: 0.5 })

  return <motion.div {...animation}>Custom animated content</motion.div>
}
```

## Testing

The animation infrastructure includes comprehensive tests:

- Unit tests for animation utilities
- Component tests for animation components
- Hook tests for animation hooks
- Accessibility compliance tests
- Performance tests

Run tests with:

```bash
npm test src/components/__tests__/AnimatedSection.test.jsx
npm test src/hooks/__tests__/useAnimations.test.js
```

## Demo Page

Visit `/animation-demo` to see all animation types in action and test the infrastructure.

## Best Practices

1. **Use Semantic Animation Names**: Choose animation presets that match the content purpose
2. **Respect User Preferences**: Always use the provided hooks that check for reduced motion
3. **Optimize Performance**: Use staggered animations sparingly on large lists
4. **Test Accessibility**: Verify animations work with screen readers and keyboard navigation
5. **Progressive Enhancement**: Ensure content is accessible even if animations fail to load

## Future Enhancements

- Theme-specific animation variants
- Advanced parallax effects integration
- Custom easing curve editor
- Animation performance monitoring
- More complex stagger patterns
