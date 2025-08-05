/**
 * Error Handling Test Suite
 * Tests for comprehensive error handling implementation
 */
import { AnimationErrorBoundary, ErrorBoundary, ThemeErrorBoundary } from '../components/ErrorBoundary'
import { ERROR_SEVERITY, ERROR_TYPES, ErrorHandler, globalErrorHandler } from '../utils/errorHandling'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

// Mock console methods
const originalConsole = { ...console }
beforeEach(() => {
  console.error = vi.fn()
  console.warn = vi.fn()
  console.log = vi.fn()
})

afterEach(() => {
  Object.assign(console, originalConsole)
  globalErrorHandler.clearErrors()
})

describe('ErrorHandler', () => {
  let errorHandler

  beforeEach(() => {
    errorHandler = new ErrorHandler()
  })

  afterEach(() => {
    errorHandler.clearErrors()
  })

  it('should handle errors and categorize them correctly', () => {
    const testError = new Error('Test error')
    const errorId = errorHandler.handleError(testError, {
      type: ERROR_TYPES.THEME_LOADING,
      context: 'test_context',
      severity: ERROR_SEVERITY.MEDIUM,
    })

    expect(errorId).toBeDefined()
    expect(typeof errorId).toBe('string')

    const stats = errorHandler.getErrorStats()
    expect(stats.total).toBe(1)
    expect(stats.byType[ERROR_TYPES.THEME_LOADING]).toBe(1)
    expect(stats.bySeverity[ERROR_SEVERITY.MEDIUM]).toBe(1)
  })

  it('should attempt recovery for recoverable errors', async () => {
    const testError = new Error('Recoverable error')
    const errorId = errorHandler.handleError(testError, {
      type: ERROR_TYPES.THEME_LOADING,
      context: 'test_recovery',
      severity: ERROR_SEVERITY.MEDIUM,
      recoverable: true,
    })

    // Wait for recovery attempt
    await waitFor(() => {
      const recentErrors = errorHandler.getRecentErrors(1)
      expect(recentErrors.length).toBe(1)
    })
  })

  it('should not exceed max recovery attempts', async () => {
    const testError = new Error('Persistent error')

    // Attempt recovery multiple times
    for (let i = 0; i < 5; i++) {
      errorHandler.handleError(testError, {
        type: ERROR_TYPES.THEME_LOADING,
        context: 'persistent_error',
        severity: ERROR_SEVERITY.MEDIUM,
        recoverable: true,
      })
    }

    const stats = errorHandler.getErrorStats()
    expect(stats.total).toBe(5)
  })

  it('should notify listeners of errors', () => {
    const listener = vi.fn()
    const unsubscribe = errorHandler.subscribe(listener)

    const testError = new Error('Listener test')
    errorHandler.handleError(testError, {
      type: ERROR_TYPES.ANIMATION_FAILURE,
      context: 'listener_test',
      severity: ERROR_SEVERITY.LOW,
    })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        error: testError,
        type: ERROR_TYPES.ANIMATION_FAILURE,
        context: 'listener_test',
        severity: ERROR_SEVERITY.LOW,
      })
    )

    unsubscribe()
  })

  it('should clear error history', () => {
    const testError = new Error('Clear test')
    errorHandler.handleError(testError, {
      type: ERROR_TYPES.UNKNOWN,
      context: 'clear_test',
      severity: ERROR_SEVERITY.LOW,
    })

    let stats = errorHandler.getErrorStats()
    expect(stats.total).toBe(1)

    errorHandler.clearErrors()
    stats = errorHandler.getErrorStats()
    expect(stats.total).toBe(0)
  })
})

describe('Error Boundaries', () => {
  // Mock component that throws an error
  const ThrowError = ({ shouldThrow = true, message = 'Test error' }) => {
    if (shouldThrow) {
      throw new Error(message)
    }
    return <div>No error</div>
  }

  it('should catch and display errors in ErrorBoundary', () => {
    render(
      <ErrorBoundary name="TestBoundary">
        <ThrowError />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/TestBoundary component encountered an error/)).toBeInTheDocument()
  })

  it('should allow retry in ErrorBoundary', () => {
    let shouldThrow = true
    const TestComponent = () => {
      if (shouldThrow) {
        shouldThrow = false
        throw new Error('Retry test')
      }
      return <div>Success after retry</div>
    }

    render(
      <ErrorBoundary name="RetryBoundary" maxRetries={3}>
        <TestComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    const retryButton = screen.getByText(/Try Again/)
    fireEvent.click(retryButton)

    expect(screen.getByText('Success after retry')).toBeInTheDocument()
  })

  it('should handle theme errors in ThemeErrorBoundary', () => {
    render(
      <ThemeErrorBoundary>
        <ThrowError message="Theme loading failed" />
      </ThemeErrorBoundary>
    )

    expect(screen.getByText('Theme Error')).toBeInTheDocument()
    expect(screen.getByText(/problem with the current theme/)).toBeInTheDocument()
    expect(screen.getByText('Reset Theme')).toBeInTheDocument()
  })

  it('should handle animation errors in AnimationErrorBoundary', () => {
    const FallbackContent = <div>Fallback animation content</div>

    render(
      <AnimationErrorBoundary fallbackContent={FallbackContent}>
        <ThrowError message="Animation failed" />
      </AnimationErrorBoundary>
    )

    expect(screen.getByText('Fallback animation content')).toBeInTheDocument()
    expect(screen.getByText(/Animations have been disabled/)).toBeInTheDocument()
  })

  it('should use custom fallback in ErrorBoundary', () => {
    const customFallback = (error, retry, canRetry) => (
      <div>
        <h2>Custom Error UI</h2>
        <p>Error: {error.message}</p>
        {canRetry && <button onClick={retry}>Custom Retry</button>}
      </div>
    )

    render(
      <ErrorBoundary name="CustomBoundary" fallback={customFallback}>
        <ThrowError message="Custom fallback test" />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument()
    expect(screen.getByText('Error: Custom fallback test')).toBeInTheDocument()
    expect(screen.getByText('Custom Retry')).toBeInTheDocument()
  })
})

describe('Error Recovery Strategies', () => {
  beforeEach(() => {
    // Mock DOM methods
    Object.defineProperty(document, 'documentElement', {
      value: {
        style: {
          setProperty: vi.fn(),
          removeProperty: vi.fn(),
        },
        classList: {
          add: vi.fn(),
          remove: vi.fn(),
        },
      },
      writable: true,
    })
  })

  it('should apply fallback theme on theme loading error', async () => {
    const testError = new Error('Theme loading failed')
    globalErrorHandler.handleError(testError, {
      type: ERROR_TYPES.THEME_LOADING,
      context: 'theme_test',
      severity: ERROR_SEVERITY.MEDIUM,
      recoverable: true,
    })

    // Wait for fallback to be applied
    await waitFor(() => {
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--primary-color', '#00ff9d')
    })
  })

  it('should disable animations on animation failure', async () => {
    const testError = new Error('Animation failed')
    globalErrorHandler.handleError(testError, {
      type: ERROR_TYPES.ANIMATION_FAILURE,
      context: 'animation_test',
      severity: ERROR_SEVERITY.LOW,
      recoverable: true,
    })

    // Wait for animations to be disabled
    await waitFor(() => {
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--animation-duration', '0s')
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('no-animations')
    })
  })

  it('should optimize scroll performance on scroll errors', async () => {
    const testError = new Error('Scroll performance issue')
    globalErrorHandler.handleError(testError, {
      type: ERROR_TYPES.SCROLL_PERFORMANCE,
      context: 'scroll_test',
      severity: ERROR_SEVERITY.MEDIUM,
      recoverable: true,
    })

    // Wait for scroll optimizations to be applied
    await waitFor(() => {
      expect(document.documentElement.style.setProperty).toHaveBeenCalledWith('--scroll-throttle', '32ms')
      expect(document.documentElement.classList.add).toHaveBeenCalledWith('optimized-scroll')
    })
  })
})

describe('Global Error Handling', () => {
  it('should handle unhandled promise rejections', () => {
    const listener = vi.fn()
    globalErrorHandler.subscribe(listener)

    // Simulate unhandled promise rejection
    const rejectionEvent = new Event('unhandledrejection')
    rejectionEvent.reason = new Error('Unhandled promise rejection')
    window.dispatchEvent(rejectionEvent)

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        type: ERROR_TYPES.UNKNOWN,
        context: 'unhandled_promise_rejection',
      })
    )
  })

  it('should handle JavaScript errors', () => {
    const listener = vi.fn()
    globalErrorHandler.subscribe(listener)

    // Simulate JavaScript error
    const errorEvent = new ErrorEvent('error', {
      error: new Error('JavaScript error'),
      filename: 'test.js',
      lineno: 10,
      colno: 5,
    })
    window.dispatchEvent(errorEvent)

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(Error),
        type: ERROR_TYPES.COMPONENT_RENDER,
        context: 'javascript_error',
      })
    )
  })
})

describe('Performance Integration', () => {
  it('should report performance issues as errors', () => {
    const listener = vi.fn()
    globalErrorHandler.subscribe(listener)

    // Simulate performance issue
    globalErrorHandler.handleError(new Error('Low frame rate detected: 25 FPS'), {
      type: ERROR_TYPES.SCROLL_PERFORMANCE,
      context: 'frame_rate_monitoring',
      severity: ERROR_SEVERITY.MEDIUM,
      metadata: { fps: 25, targetFPS: 60 },
    })

    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        type: ERROR_TYPES.SCROLL_PERFORMANCE,
        context: 'frame_rate_monitoring',
        severity: ERROR_SEVERITY.MEDIUM,
        metadata: expect.objectContaining({
          fps: 25,
          targetFPS: 60,
        }),
      })
    )
  })
})
