import { useScrollManager } from '../useScrollManager'
import { act, renderHook } from '@testing-library/react'
import { beforeAll, beforeEach, describe, expect, test, vi } from 'vitest'

// Mock window methods
const mockScrollIntoView = vi.fn()
const mockAddEventListener = vi.fn()
const mockRemoveEventListener = vi.fn()

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.prototype.observe = vi.fn()
mockIntersectionObserver.prototype.disconnect = vi.fn()

beforeAll(() => {
  // Setup DOM environment
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockIntersectionObserver,
  })

  Object.defineProperty(window, 'addEventListener', {
    writable: true,
    configurable: true,
    value: mockAddEventListener,
  })

  Object.defineProperty(window, 'removeEventListener', {
    writable: true,
    configurable: true,
    value: mockRemoveEventListener,
  })

  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value: 0,
  })

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: 1000,
  })

  Object.defineProperty(document, 'documentElement', {
    writable: true,
    configurable: true,
    value: {
      scrollHeight: 2000,
    },
  })

  Object.defineProperty(document, 'getElementById', {
    writable: true,
    configurable: true,
    value: vi.fn(),
  })

  Object.defineProperty(document, 'activeElement', {
    writable: true,
    configurable: true,
    value: { tagName: 'BODY' },
  })

  // Mock scrollIntoView
  Element.prototype.scrollIntoView = mockScrollIntoView
})

beforeEach(() => {
  vi.clearAllMocks()
})

describe('useScrollManager', () => {
  const mockSections = [
    { id: 'home', title: 'Home' },
    { id: 'about', title: 'About' },
    { id: 'contact', title: 'Contact' },
  ]

  test('initializes with correct default values', () => {
    const { result } = renderHook(() => useScrollManager(mockSections))

    expect(result.current.currentSection).toBe('home')
    expect(result.current.scrollProgress).toBe(0)
    expect(result.current.isScrolling).toBe(false)
    expect(typeof result.current.scrollToSection).toBe('function')
    expect(typeof result.current.registerSection).toBe('function')
  })

  test('scrollToSection calls scrollIntoView on registered element', () => {
    const { result } = renderHook(() => useScrollManager(mockSections))
    const mockElement = { scrollIntoView: mockScrollIntoView }

    // Register a section
    act(() => {
      result.current.registerSection('home', mockElement)
    })

    // Scroll to section
    act(() => {
      result.current.scrollToSection('home')
    })

    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  })

  test('scrollToNext navigates to next section', () => {
    const { result } = renderHook(() => useScrollManager(mockSections))
    const mockElement = { scrollIntoView: mockScrollIntoView }

    // Register sections
    act(() => {
      result.current.registerSection('home', mockElement)
      result.current.registerSection('about', mockElement)
    })

    // Navigate to next
    act(() => {
      result.current.scrollToNext()
    })

    expect(result.current.currentSection).toBe('about')
  })

  test('canNavigateNext returns correct boolean', () => {
    const { result } = renderHook(() => useScrollManager(mockSections))

    // At first section, should be able to navigate next
    expect(result.current.canNavigateNext()).toBe(true)

    // At last section, should not be able to navigate next
    act(() => {
      result.current.setCurrentSection('contact')
    })
    expect(result.current.canNavigateNext()).toBe(false)
  })
})
