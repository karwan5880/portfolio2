import { useAnimations, useEntranceAnimation, useScrollAnimation } from '../useAnimations'
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

describe('useAnimations', () => {
  it('returns animation utilities', () => {
    const { result } = renderHook(() => useAnimations())

    expect(result.current).toHaveProperty('animationsEnabled')
    expect(result.current).toHaveProperty('reducedMotion')
    expect(result.current).toHaveProperty('getSectionAnimation')
    expect(result.current).toHaveProperty('getStaggerAnimation')
    expect(result.current).toHaveProperty('getChildAnimation')
    expect(result.current).toHaveProperty('getScrollAnimation')
    expect(result.current).toHaveProperty('createStaggeredVariants')
  })

  it('returns section animation preset', () => {
    const { result } = renderHook(() => useAnimations())
    const animation = result.current.getSectionAnimation('fade')

    expect(animation).toHaveProperty('initial')
    expect(animation).toHaveProperty('animate')
    expect(animation).toHaveProperty('exit')
    expect(animation).toHaveProperty('transition')
  })

  it('creates staggered variants', () => {
    const { result } = renderHook(() => useAnimations())
    const variants = result.current.createStaggeredVariants('slideUp', 'normal')

    expect(variants).toHaveProperty('container')
    expect(variants).toHaveProperty('child')
  })

  it('respects animation enabled state', () => {
    const { result } = renderHook(() => useAnimations())

    expect(typeof result.current.isAnimationEnabled()).toBe('boolean')
    expect(typeof result.current.isReducedMotion()).toBe('boolean')
  })
})

describe('useEntranceAnimation', () => {
  it('returns entrance animation utilities', () => {
    const { result } = renderHook(() => useEntranceAnimation())

    expect(result.current).toHaveProperty('ref')
    expect(result.current).toHaveProperty('isVisible')
    expect(result.current).toHaveProperty('hasAnimated')
    expect(result.current).toHaveProperty('resetAnimation')
    expect(result.current).toHaveProperty('animationsEnabled')
  })

  it('provides reset functionality', () => {
    const { result } = renderHook(() => useEntranceAnimation())

    expect(typeof result.current.resetAnimation).toBe('function')
  })
})

describe('useScrollAnimation', () => {
  it('returns scroll animation utilities', () => {
    const { result } = renderHook(() => useScrollAnimation())

    expect(result.current).toHaveProperty('scrollY')
    expect(result.current).toHaveProperty('isScrollingDown')
    expect(result.current).toHaveProperty('getScrollProgress')
    expect(result.current).toHaveProperty('getElementScrollProgress')
    expect(result.current).toHaveProperty('animationsEnabled')
  })

  it('provides scroll progress calculation', () => {
    const { result } = renderHook(() => useScrollAnimation())

    expect(typeof result.current.getScrollProgress).toBe('function')
    expect(typeof result.current.getElementScrollProgress).toBe('function')
  })
})
