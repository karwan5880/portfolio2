'use client'

import { useEffect, useState } from 'react'

import styles from './ErrorRecoveryManager.module.css'
import { useErrorHandler } from '@/utils/errorHandling'

/**
 * Error Recovery Manager component
 * Monitors errors and provides recovery mechanisms
 */
export const ErrorRecoveryManager = ({ children, showErrorStats = false }) => {
  const { subscribe, getStats, getRecentErrors, clearErrors } = useErrorHandler()
  const [errorStats, setErrorStats] = useState(null)
  const [recentErrors, setRecentErrors] = useState([])
  const [showRecoveryPanel, setShowRecoveryPanel] = useState(false)

  // Subscribe to error events
  useEffect(() => {
    const unsubscribe = subscribe((errorEntry) => {
      // Update stats when new errors occur
      setErrorStats(getStats())
      setRecentErrors(getRecentErrors(5))

      // Show recovery panel for high severity errors
      if (errorEntry.severity === 'high' || errorEntry.severity === 'critical') {
        setShowRecoveryPanel(true)
      }
    })

    // Initial stats load
    setErrorStats(getStats())
    setRecentErrors(getRecentErrors(5))

    return unsubscribe
  }, [subscribe, getStats, getRecentErrors])

  const handleClearErrors = () => {
    clearErrors()
    setErrorStats(getStats())
    setRecentErrors([])
    setShowRecoveryPanel(false)
  }

  const handleDismissPanel = () => {
    setShowRecoveryPanel(false)
  }

  const handleRefreshPage = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  const handleResetTheme = () => {
    if (typeof window !== 'undefined') {
      // Reset to default theme
      const root = document.documentElement
      root.style.setProperty('--primary-color', '#00ff9d')
      root.style.setProperty('--secondary-color', '#4a9eff')
      root.style.setProperty('--background-color', '#0a0a0a')
      root.style.setProperty('--text-color', '#e0e0e0')
      root.style.setProperty('color-scheme', 'dark')

      // Dispatch theme reset event
      window.dispatchEvent(new CustomEvent('theme-reset'))
    }
  }

  const handleDisableAnimations = () => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      root.style.setProperty('--animation-duration', '0s')
      root.classList.add('no-animations')
    }
  }

  return (
    <>
      {children}

      {/* Error Stats Display (Development/Debug) */}
      {showErrorStats && errorStats && (
        <div className={styles.errorStats}>
          <h4>Error Statistics</h4>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Errors:</span>
              <span className={styles.statValue}>{errorStats.total}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Recovered:</span>
              <span className={styles.statValue}>{errorStats.recovered}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Unrecovered:</span>
              <span className={styles.statValue}>{errorStats.unrecovered}</span>
            </div>
          </div>

          {Object.keys(errorStats.byType).length > 0 && (
            <div className={styles.errorTypes}>
              <h5>By Type:</h5>
              {Object.entries(errorStats.byType).map(([type, count]) => (
                <div key={type} className={styles.typeItem}>
                  <span>{type}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          )}

          <button className={styles.clearButton} onClick={handleClearErrors} type="button">
            Clear Error History
          </button>
        </div>
      )}

      {/* Error Recovery Panel */}
      {showRecoveryPanel && (
        <div className={styles.recoveryPanel} role="alert">
          <div className={styles.panelContent}>
            <div className={styles.panelHeader}>
              <h3>Error Recovery</h3>
              <button className={styles.dismissButton} onClick={handleDismissPanel} aria-label="Dismiss recovery panel" type="button">
                ×
              </button>
            </div>

            <div className={styles.panelBody}>
              <p>Some errors have been detected that may affect your experience. Try one of these recovery options:</p>

              <div className={styles.recoveryActions}>
                <button className={styles.recoveryButton} onClick={handleResetTheme} type="button">
                  Reset Theme
                </button>

                <button className={styles.recoveryButton} onClick={handleDisableAnimations} type="button">
                  Disable Animations
                </button>

                <button className={styles.recoveryButton} onClick={handleRefreshPage} type="button">
                  Refresh Page
                </button>
              </div>

              {recentErrors.length > 0 && (
                <details className={styles.errorDetails}>
                  <summary>Recent Errors ({recentErrors.length})</summary>
                  <div className={styles.errorList}>
                    {recentErrors.map((error, index) => (
                      <div key={error.id || index} className={styles.errorItem}>
                        <div className={styles.errorType}>{error.type}</div>
                        <div className={styles.errorMessage}>{error.error?.message || 'Unknown error'}</div>
                        <div className={styles.errorTime}>{new Date(error.timestamp).toLocaleTimeString()}</div>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Error Recovery Hook
 * Provides error recovery utilities for components
 */
export const useErrorRecovery = () => {
  const { handleError } = useErrorHandler()

  const recoverFromThemeError = () => {
    try {
      if (typeof window !== 'undefined') {
        const root = document.documentElement
        root.style.setProperty('--primary-color', '#00ff9d')
        root.style.setProperty('--secondary-color', '#4a9eff')
        root.style.setProperty('--background-color', '#0a0a0a')
        root.style.setProperty('--text-color', '#e0e0e0')
        root.style.setProperty('color-scheme', 'dark')

        window.dispatchEvent(new CustomEvent('theme-recovery'))
      }
    } catch (error) {
      handleError(error, {
        type: 'theme_loading',
        context: 'theme_recovery',
        severity: 'high',
      })
    }
  }

  const recoverFromAnimationError = () => {
    try {
      if (typeof window !== 'undefined') {
        const root = document.documentElement
        root.style.setProperty('--animation-duration', '0.2s')
        root.classList.remove('no-animations')
        root.classList.add('reduced-animations')

        window.dispatchEvent(new CustomEvent('animation-recovery'))
      }
    } catch (error) {
      handleError(error, {
        type: 'animation_failure',
        context: 'animation_recovery',
        severity: 'medium',
      })
    }
  }

  const recoverFromScrollError = () => {
    try {
      if (typeof window !== 'undefined') {
        // Reset scroll optimizations
        const root = document.documentElement
        root.style.removeProperty('--scroll-throttle')
        root.classList.remove('optimized-scroll')

        // Re-enable smooth scrolling
        root.style.setProperty('scroll-behavior', 'smooth')

        window.dispatchEvent(new CustomEvent('scroll-recovery'))
      }
    } catch (error) {
      handleError(error, {
        type: 'scroll_performance',
        context: 'scroll_recovery',
        severity: 'medium',
      })
    }
  }

  return {
    recoverFromThemeError,
    recoverFromAnimationError,
    recoverFromScrollError,
  }
}
