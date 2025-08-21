'use client'

import { Component } from 'react'

import styles from './ErrorBoundary.module.css'

/**
 * Generic Error Boundary component for catching JavaScript errors
 * Provides fallback UI and error reporting
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Report error to monitoring service if available
    if (typeof window !== 'undefined' && window.reportError) {
      window.reportError(error, {
        component: this.props.name || 'Unknown',
        errorInfo,
        retryCount: this.state.retryCount,
      })
    }
  }

  handleRetry = () => {
    this.setState((prevState) => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }))
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  render() {
    const { hasError, error, retryCount } = this.state
    const { children, fallback, name = 'Component', showDetails = false, maxRetries = 3, onError } = this.props

    if (hasError) {
      // Call onError callback if provided
      if (onError && typeof onError === 'function') {
        onError(error, this.state.errorInfo)
      }

      // Use custom fallback if provided
      if (fallback) {
        return typeof fallback === 'function' ? fallback(error, this.handleRetry, retryCount < maxRetries) : fallback
      }

      // Default error UI
      return (
        <div className={styles.errorBoundary} role="alert">
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>⚠️</div>
            <h2 className={styles.errorTitle}>Something went wrong</h2>
            <p className={styles.errorMessage}>The {name} component encountered an error and couldn't render properly.</p>

            {showDetails && error && (
              <details className={styles.errorDetails}>
                <summary>Error Details</summary>
                <pre className={styles.errorStack}>
                  {error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className={styles.errorActions}>
              {retryCount < maxRetries && (
                <button className={styles.retryButton} onClick={this.handleRetry} type="button">
                  Try Again ({maxRetries - retryCount} attempts left)
                </button>
              )}
              <button className={styles.reloadButton} onClick={this.handleReload} type="button">
                Reload Page
              </button>
            </div>

            {retryCount >= maxRetries && <p className={styles.maxRetriesMessage}>Maximum retry attempts reached. Please reload the page or contact support.</p>}
          </div>
        </div>
      )
    }

    return children
  }
}

/**
 * Higher-order component for wrapping components with error boundaries
 */
export const withErrorBoundary = (WrappedComponent, errorBoundaryProps = {}) => {
  const WithErrorBoundaryComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`

  return WithErrorBoundaryComponent
}

/**
 * Specialized error boundary for theme-dependent components
 */
export class ThemeErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      fallbackTheme: 'light',
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ThemeErrorBoundary caught an error:', error, errorInfo)

    this.setState({ error })

    // Try to reset to a safe theme
    if (typeof window !== 'undefined') {
      try {
        const root = document.documentElement
        root.style.setProperty('--primary-color', '#00ff9d')
        root.style.setProperty('--secondary-color', '#4a9eff')
        root.style.setProperty('--background-color', '#ffffff')
        root.style.setProperty('--text-color', '#1a1a1a')
        root.style.setProperty('color-scheme', 'light')
      } catch (themeError) {
        console.error('Failed to apply fallback theme:', themeError)
      }
    }
  }

  handleThemeReset = () => {
    // Reset theme to default and clear error
    if (this.props.onThemeReset) {
      this.props.onThemeReset()
    }

    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    const { hasError, error } = this.state
    const { children, fallbackTheme = 'light' } = this.props

    if (hasError) {
      return (
        <div className={styles.themeErrorBoundary} role="alert">
          <div className={styles.errorContent}>
            <div className={styles.errorIcon}>🎨</div>
            <h3 className={styles.errorTitle}>Theme Error</h3>
            <p className={styles.errorMessage}>There was a problem with the current theme. We've switched to a safe fallback.</p>
            <button className={styles.resetButton} onClick={this.handleThemeReset} type="button">
              Reset Theme
            </button>
          </div>
        </div>
      )
    }

    return children
  }
}

/**
 * Specialized error boundary for animation failures
 */
export class AnimationErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('AnimationErrorBoundary caught an error:', error, errorInfo)

    this.setState({ error })

    // Disable animations globally as a fallback
    if (typeof window !== 'undefined') {
      try {
        document.documentElement.style.setProperty('--animation-duration', '0s')
        document.documentElement.classList.add('no-animations')
      } catch (animError) {
        console.error('Failed to disable animations:', animError)
      }
    }
  }

  handleAnimationReset = () => {
    // Re-enable animations and clear error
    if (typeof window !== 'undefined') {
      document.documentElement.style.removeProperty('--animation-duration')
      document.documentElement.classList.remove('no-animations')
    }

    if (this.props.onAnimationReset) {
      this.props.onAnimationReset()
    }

    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    const { hasError } = this.state
    const { children, fallbackContent } = this.props

    if (hasError) {
      if (fallbackContent) {
        return fallbackContent
      }

      return (
        <div className={styles.animationErrorBoundary}>
          <div className={styles.errorContent}>
            <p className={styles.errorMessage}>Animations have been disabled due to an error.</p>
            <button className={styles.resetButton} onClick={this.handleAnimationReset} type="button">
              Re-enable Animations
            </button>
          </div>
          <div className={styles.fallbackContent}>{children}</div>
        </div>
      )
    }

    return children
  }
}
