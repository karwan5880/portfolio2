'use client'

/**
 * Comprehensive error handling utilities for the multiverse portfolio
 * Includes theme fallbacks, animation graceful degradation, and scroll performance monitoring
 */

// Error types for categorization
export const ERROR_TYPES = {
  THEME_LOADING: 'theme_loading',
  ANIMATION_FAILURE: 'animation_failure',
  SCROLL_PERFORMANCE: 'scroll_performance',
  ASSET_LOADING: 'asset_loading',
  COMPONENT_RENDER: 'component_render',
  NETWORK: 'network',
  UNKNOWN: 'unknown',
}

// Error severity levels
export const ERROR_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
}

/**
 * Global error handler class
 */
export class ErrorHandler {
  constructor() {
    this.errors = []
    this.listeners = new Set()
    this.fallbackStrategies = new Map()
    this.recoveryAttempts = new Map()
    this.maxRecoveryAttempts = 3

    // Initialize fallback strategies
    this.initializeFallbackStrategies()

    // Set up global error listeners
    this.setupGlobalErrorHandling()
  }

  /**
   * Initialize fallback strategies for different error types
   */
  initializeFallbackStrategies() {
    // Theme loading fallback
    this.fallbackStrategies.set(ERROR_TYPES.THEME_LOADING, {
      fallback: this.applyFallbackTheme.bind(this),
      recovery: this.retryThemeLoading.bind(this),
      severity: ERROR_SEVERITY.MEDIUM,
    })

    // Animation failure fallback
    this.fallbackStrategies.set(ERROR_TYPES.ANIMATION_FAILURE, {
      fallback: this.disableAnimations.bind(this),
      recovery: this.enableReducedAnimations.bind(this),
      severity: ERROR_SEVERITY.LOW,
    })

    // Scroll performance fallback
    this.fallbackStrategies.set(ERROR_TYPES.SCROLL_PERFORMANCE, {
      fallback: this.optimizeScrollPerformance.bind(this),
      recovery: this.resetScrollOptimizations.bind(this),
      severity: ERROR_SEVERITY.MEDIUM,
    })

    // Asset loading fallback
    this.fallbackStrategies.set(ERROR_TYPES.ASSET_LOADING, {
      fallback: this.useAssetFallbacks.bind(this),
      recovery: this.retryAssetLoading.bind(this),
      severity: ERROR_SEVERITY.LOW,
    })

    // Component render fallback
    this.fallbackStrategies.set(ERROR_TYPES.COMPONENT_RENDER, {
      fallback: this.renderFallbackComponent.bind(this),
      recovery: this.retryComponentRender.bind(this),
      severity: ERROR_SEVERITY.HIGH,
    })
  }

  /**
   * Set up global error handling
   */
  setupGlobalErrorHandling() {
    if (typeof window === 'undefined') return

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError(event.reason, {
        type: ERROR_TYPES.UNKNOWN,
        context: 'unhandled_promise_rejection',
        severity: ERROR_SEVERITY.MEDIUM,
      })
    })

    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.handleError(event.error, {
        type: ERROR_TYPES.COMPONENT_RENDER,
        context: 'javascript_error',
        severity: ERROR_SEVERITY.HIGH,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    // Handle resource loading errors
    window.addEventListener(
      'error',
      (event) => {
        if (event.target !== window) {
          this.handleError(new Error(`Failed to load resource: ${event.target.src || event.target.href}`), {
            type: ERROR_TYPES.ASSET_LOADING,
            context: 'resource_loading',
            severity: ERROR_SEVERITY.LOW,
            resource: event.target.src || event.target.href,
          })
        }
      },
      true
    )
  }

  /**
   * Main error handling method
   */
  handleError(error, options = {}) {
    const { type = ERROR_TYPES.UNKNOWN, context = 'unknown', severity = ERROR_SEVERITY.MEDIUM, recoverable = true, ...metadata } = options

    const errorEntry = {
      id: this.generateErrorId(),
      error,
      type,
      context,
      severity,
      recoverable,
      metadata,
      timestamp: new Date().toISOString(),
      recovered: false,
    }

    // Add to error log
    this.errors.push(errorEntry)

    // Log to console
    this.logError(errorEntry)

    // Notify listeners
    this.notifyListeners(errorEntry)

    // Attempt recovery if possible
    if (recoverable) {
      this.attemptRecovery(errorEntry)
    }

    return errorEntry.id
  }

  /**
   * Attempt error recovery
   */
  async attemptRecovery(errorEntry) {
    const { type, id } = errorEntry
    const strategy = this.fallbackStrategies.get(type)

    if (!strategy) {
      console.warn(`No recovery strategy found for error type: ${type}`)
      return false
    }

    const attemptCount = this.recoveryAttempts.get(id) || 0

    if (attemptCount >= this.maxRecoveryAttempts) {
      console.warn(`Max recovery attempts reached for error ${id}`)
      return false
    }

    try {
      // Apply fallback first
      if (strategy.fallback) {
        await strategy.fallback(errorEntry)
      }

      // Attempt recovery
      if (strategy.recovery) {
        await strategy.recovery(errorEntry)
      }

      // Mark as recovered
      errorEntry.recovered = true
      this.recoveryAttempts.set(id, attemptCount + 1)

      console.log(`Successfully recovered from error ${id}`)
      return true
    } catch (recoveryError) {
      console.error(`Recovery failed for error ${id}:`, recoveryError)
      this.recoveryAttempts.set(id, attemptCount + 1)
      return false
    }
  }

  /**
   * Theme loading fallback strategy
   */
  async applyFallbackTheme(errorEntry) {
    if (typeof window === 'undefined') return

    try {
      const root = document.documentElement

      // Apply safe default theme
      const fallbackTheme = {
        '--primary-color': '#00ff9d',
        '--secondary-color': '#4a9eff',
        '--background-color': '#0a0a0a',
        '--surface-color': '#111111',
        '--card-color': '#1a1a1a',
        '--text-color': '#e0e0e0',
        '--text-muted-color': '#888888',
        '--border-color': 'rgba(255, 255, 255, 0.1)',
        '--accent-color': '#ff6b35',
      }

      Object.entries(fallbackTheme).forEach(([property, value]) => {
        root.style.setProperty(property, value)
      })

      root.style.setProperty('color-scheme', 'dark')

      console.log('Applied fallback theme due to loading error')
    } catch (fallbackError) {
      console.error('Failed to apply fallback theme:', fallbackError)
    }
  }

  /**
   * Retry theme loading
   */
  async retryThemeLoading(errorEntry) {
    // This would integrate with the theme system to retry loading
    console.log('Attempting to retry theme loading...')

    // Emit event for theme system to retry
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('theme-retry', {
          detail: { errorEntry },
        })
      )
    }
  }

  /**
   * Animation failure fallback strategy
   */
  async disableAnimations(errorEntry) {
    if (typeof window === 'undefined') return

    try {
      const root = document.documentElement

      // Disable all animations
      root.style.setProperty('--animation-duration', '0s')
      root.style.setProperty('--transition-duration', '0s')
      root.classList.add('no-animations')

      // Add CSS to disable Framer Motion animations
      const style = document.createElement('style')
      style.textContent = `
        .no-animations * {
          animation-duration: 0s !important;
          animation-delay: 0s !important;
          transition-duration: 0s !important;
          transition-delay: 0s !important;
        }
      `
      document.head.appendChild(style)

      console.log('Disabled animations due to error')
    } catch (fallbackError) {
      console.error('Failed to disable animations:', fallbackError)
    }
  }

  /**
   * Enable reduced animations as recovery
   */
  async enableReducedAnimations(errorEntry) {
    if (typeof window === 'undefined') return

    try {
      const root = document.documentElement

      // Enable minimal animations
      root.style.setProperty('--animation-duration', '0.2s')
      root.style.setProperty('--transition-duration', '0.2s')
      root.classList.remove('no-animations')
      root.classList.add('reduced-animations')

      console.log('Enabled reduced animations for recovery')
    } catch (recoveryError) {
      console.error('Failed to enable reduced animations:', recoveryError)
    }
  }

  /**
   * Scroll performance optimization fallback
   */
  async optimizeScrollPerformance(errorEntry) {
    if (typeof window === 'undefined') return

    try {
      const root = document.documentElement

      // Reduce scroll event frequency
      root.style.setProperty('--scroll-throttle', '32ms')

      // Disable complex scroll effects
      root.classList.add('optimized-scroll')

      // Disable parallax effects
      const parallaxElements = document.querySelectorAll('[data-parallax]')
      parallaxElements.forEach((el) => {
        el.style.transform = 'none'
        el.style.willChange = 'auto'
      })

      console.log('Applied scroll performance optimizations')
    } catch (fallbackError) {
      console.error('Failed to optimize scroll performance:', fallbackError)
    }
  }

  /**
   * Reset scroll optimizations for recovery
   */
  async resetScrollOptimizations(errorEntry) {
    if (typeof window === 'undefined') return

    try {
      const root = document.documentElement

      // Reset scroll settings
      root.style.removeProperty('--scroll-throttle')
      root.classList.remove('optimized-scroll')

      console.log('Reset scroll optimizations for recovery')
    } catch (recoveryError) {
      console.error('Failed to reset scroll optimizations:', recoveryError)
    }
  }

  /**
   * Asset loading fallback strategy
   */
  async useAssetFallbacks(errorEntry) {
    const { metadata } = errorEntry
    const { resource } = metadata

    if (!resource) return

    try {
      // Use placeholder or fallback assets
      const fallbackAssets = {
        '.jpg': '/images/placeholder.jpg',
        '.png': '/images/placeholder.png',
        '.webp': '/images/placeholder.webp',
        '.mp3': '/sounds/silence.mp3',
        '.css': null, // Skip CSS fallbacks
      }

      const extension = resource.substring(resource.lastIndexOf('.'))
      const fallback = fallbackAssets[extension]

      if (fallback) {
        // Replace failed asset with fallback
        const elements = document.querySelectorAll(`[src="${resource}"], [href="${resource}"]`)
        elements.forEach((el) => {
          if (el.tagName === 'IMG') {
            el.src = fallback
          } else if (el.tagName === 'LINK') {
            el.href = fallback
          }
        })

        console.log(`Applied fallback asset for ${resource}`)
      }
    } catch (fallbackError) {
      console.error('Failed to apply asset fallback:', fallbackError)
    }
  }

  /**
   * Retry asset loading
   */
  async retryAssetLoading(errorEntry) {
    const { metadata } = errorEntry
    const { resource } = metadata

    if (!resource) return

    try {
      // Retry loading the asset
      const elements = document.querySelectorAll(`[src="${resource}"], [href="${resource}"]`)
      elements.forEach((el) => {
        if (el.tagName === 'IMG') {
          el.src = resource + '?retry=' + Date.now()
        } else if (el.tagName === 'LINK') {
          el.href = resource + '?retry=' + Date.now()
        }
      })

      console.log(`Retrying asset loading for ${resource}`)
    } catch (retryError) {
      console.error('Failed to retry asset loading:', retryError)
    }
  }

  /**
   * Component render fallback
   */
  async renderFallbackComponent(errorEntry) {
    // This would be handled by React Error Boundaries
    console.log('Component render fallback handled by Error Boundary')
  }

  /**
   * Retry component render
   */
  async retryComponentRender(errorEntry) {
    // This would trigger a re-render through React mechanisms
    console.log('Component render retry handled by Error Boundary')
  }

  /**
   * Generate unique error ID
   */
  generateErrorId() {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Log error with appropriate level
   */
  logError(errorEntry) {
    const { error, type, context, severity, metadata } = errorEntry

    const logMessage = `[${severity.toUpperCase()}] ${type} error in ${context}`

    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
        console.error(logMessage, error, metadata)
        break
      case ERROR_SEVERITY.HIGH:
        console.error(logMessage, error, metadata)
        break
      case ERROR_SEVERITY.MEDIUM:
        console.warn(logMessage, error, metadata)
        break
      case ERROR_SEVERITY.LOW:
        console.log(logMessage, error, metadata)
        break
      default:
        console.log(logMessage, error, metadata)
    }
  }

  /**
   * Notify error listeners
   */
  notifyListeners(errorEntry) {
    this.listeners.forEach((listener) => {
      try {
        listener(errorEntry)
      } catch (listenerError) {
        console.error('Error in error listener:', listenerError)
      }
    })
  }

  /**
   * Subscribe to error events
   */
  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Get error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byType: {},
      bySeverity: {},
      recovered: 0,
      unrecovered: 0,
    }

    this.errors.forEach((error) => {
      // Count by type
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1

      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1

      // Count recovery status
      if (error.recovered) {
        stats.recovered++
      } else {
        stats.unrecovered++
      }
    })

    return stats
  }

  /**
   * Clear error history
   */
  clearErrors() {
    this.errors = []
    this.recoveryAttempts.clear()
  }

  /**
   * Get recent errors
   */
  getRecentErrors(limit = 10) {
    return this.errors.slice(-limit)
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler()

/**
 * React hook for error handling
 */
export const useErrorHandler = () => {
  const handleError = (error, options = {}) => {
    return globalErrorHandler.handleError(error, options)
  }

  const subscribe = (listener) => {
    return globalErrorHandler.subscribe(listener)
  }

  const getStats = () => {
    return globalErrorHandler.getErrorStats()
  }

  return {
    handleError,
    subscribe,
    getStats,
    clearErrors: globalErrorHandler.clearErrors.bind(globalErrorHandler),
    getRecentErrors: globalErrorHandler.getRecentErrors.bind(globalErrorHandler),
  }
}

/**
 * Utility function to wrap async operations with error handling
 */
export const withErrorHandling = (asyncFn, errorOptions = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      globalErrorHandler.handleError(error, errorOptions)
      throw error // Re-throw to allow caller to handle if needed
    }
  }
}

/**
 * Utility function to create safe async operations that don't throw
 */
export const safeAsync = (asyncFn, fallbackValue = null, errorOptions = {}) => {
  return async (...args) => {
    try {
      return await asyncFn(...args)
    } catch (error) {
      globalErrorHandler.handleError(error, {
        ...errorOptions,
        recoverable: false, // Don't attempt recovery for safe operations
      })
      return fallbackValue
    }
  }
}
