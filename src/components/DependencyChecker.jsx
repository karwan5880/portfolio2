'use client'

import { useState } from 'react'

/**
 * Component to systematically check all dependencies
 */
export const DependencyChecker = () => {
  const [results, setResults] = useState({})
  const [isChecking, setIsChecking] = useState(false)
  const [currentCheck, setCurrentCheck] = useState('')

  const dependencies = [
    // Core React
    { name: 'React', path: 'react', exports: ['useCallback', 'useEffect', 'useState'] },

    // Components
    { name: 'ErrorBoundary', path: './ErrorBoundary', exports: ['ErrorBoundary', 'AnimationErrorBoundary', 'ThemeErrorBoundary'] },
    { name: 'HomeSection', path: './HomeSection', exports: ['HomeSection'] },
    { name: 'TimelineSection', path: './TimelineSection', exports: ['TimelineSection'] },
    { name: 'SkillsSection', path: './SkillsSection', exports: ['SkillsSection'] },
    { name: 'ProjectSection', path: './ProjectSection', exports: ['ProjectSection'] },
    { name: 'CareerSection', path: './CareerSection', exports: ['CareerSection'] },
    { name: 'DevHistorySection', path: './DevHistorySection', exports: ['DevHistorySection'] },
    { name: 'NavigationDots', path: './NavigationDots', exports: ['NavigationDots'] },
    { name: 'MobileNavigation', path: './MobileNavigation', exports: ['MobileNavigation'] },
    { name: 'ScrollProgress', path: './ScrollProgress', exports: ['ScrollProgress'] },
    { name: 'SectionWrapper', path: './SectionWrapper', exports: ['SectionWrapper'] },
    { name: 'ShareButton', path: './ShareButton', exports: ['ShareButton'] },
    { name: 'SkipLinks', path: './SkipLinks', exports: ['SkipLinks'] },
    { name: 'OptimizedThemeSelector', path: './OptimizedThemeSelector', exports: ['OptimizedThemeSelector'] },
    { name: 'AccessibilityProvider', path: './AccessibilityProvider', exports: ['AccessibilityProvider'] },
    { name: 'CinematicThemeManager', path: './CinematicThemeManager', exports: ['CinematicThemeManager'] },
    { name: 'SeasonalThemeManager', path: './SeasonalThemeManager', exports: ['SeasonalThemeManager'] },
    { name: 'MobileThemeOptimizer', path: './MobileThemeOptimizer', exports: ['MobileThemeOptimizer'] },
    { name: 'NavigationAnnouncer', path: './NavigationAnnouncer', exports: ['NavigationAnnouncer'] },
    { name: 'ErrorRecoveryManager', path: './ErrorRecoveryManager', exports: ['ErrorRecoveryManager'] },
    { name: 'PerformanceMonitor', path: './PerformanceMonitor', exports: ['DevPerformanceOverlay'] },

    // Hooks
    { name: 'useScrollManager', path: '@/hooks/useScrollManager', exports: ['useScrollManager'] },
    { name: 'useAccessibility', path: '@/hooks/useAccessibility', exports: ['useAccessibility'] },
    { name: 'useMobileOptimizations', path: '@/hooks/useMobileOptimizations', exports: ['useMobileOptimizations', 'useMobilePerformance', 'useMobileViewport', 'useTouchGestures'] },
    { name: 'useOptimizedAnimations', path: '@/hooks/useOptimizedAnimations', exports: ['useOptimizedAnimations'] },
    { name: 'useURLRouting', path: '@/hooks/useURLRouting', exports: ['useURLRouting'] },

    // Utils
    { name: 'errorHandling', path: '@/utils/errorHandling', exports: ['useErrorHandler'] },
    { name: 'performanceOptimizations', path: '@/utils/performanceOptimizations', exports: ['performanceMonitor'] },

    // CSS
    { name: 'MultiversePortfolio.module.css', path: './MultiversePortfolio.module.css', exports: ['default'] },

    // Context
    { name: 'ThemeContext', path: '@/contexts/ThemeContext', exports: ['ThemeProvider', 'useTheme'] },
  ]

  const checkDependencies = async () => {
    setIsChecking(true)
    const newResults = {}

    for (const dep of dependencies) {
      setCurrentCheck(`Checking ${dep.name}...`)

      try {
        const module = await import(dep.path)
        const missingExports = []
        const availableExports = Object.keys(module)

        for (const exportName of dep.exports) {
          if (exportName === 'default') {
            if (!module.default) {
              missingExports.push(exportName)
            }
          } else if (!module[exportName]) {
            missingExports.push(exportName)
          }
        }

        newResults[dep.name] = {
          status: missingExports.length === 0 ? 'success' : 'partial',
          availableExports,
          missingExports,
          path: dep.path,
        }
      } catch (error) {
        newResults[dep.name] = {
          status: 'error',
          error: error.message,
          path: dep.path,
        }
      }
    }

    setResults(newResults)
    setCurrentCheck('')
    setIsChecking(false)
  }

  const renderResult = (name, result) => {
    let bgColor, textColor, icon

    switch (result.status) {
      case 'success':
        bgColor = '#d4edda'
        textColor = '#155724'
        icon = '✅'
        break
      case 'partial':
        bgColor = '#fff3cd'
        textColor = '#856404'
        icon = '⚠️'
        break
      case 'error':
        bgColor = '#f8d7da'
        textColor = '#721c24'
        icon = '❌'
        break
      default:
        bgColor = '#f8f9fa'
        textColor = '#6c757d'
        icon = '❓'
    }

    return (
      <div
        key={name}
        style={{
          padding: '10px',
          margin: '5px 0',
          backgroundColor: bgColor,
          color: textColor,
          border: `1px solid ${bgColor}`,
          borderRadius: '4px',
          fontFamily: 'monospace',
          fontSize: '14px',
        }}
      >
        <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
          {icon} {name}
        </div>

        <div style={{ fontSize: '12px', marginBottom: '5px' }}>Path: {result.path}</div>

        {result.status === 'success' && <div style={{ fontSize: '12px' }}>Exports: {result.availableExports.join(', ')}</div>}

        {result.status === 'partial' && (
          <div>
            <div style={{ fontSize: '12px', color: '#28a745' }}>Available: {result.availableExports.join(', ')}</div>
            <div style={{ fontSize: '12px', color: '#dc3545' }}>Missing: {result.missingExports.join(', ')}</div>
          </div>
        )}

        {result.status === 'error' && <div style={{ fontSize: '12px', color: '#dc3545' }}>Error: {result.error}</div>}
      </div>
    )
  }

  const successCount = Object.values(results).filter((r) => r.status === 'success').length
  const partialCount = Object.values(results).filter((r) => r.status === 'partial').length
  const errorCount = Object.values(results).filter((r) => r.status === 'error').length
  const totalCount = Object.keys(results).length

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>MultiversePortfolio Dependency Checker</h1>
      <p>This tool checks all dependencies required by MultiversePortfolio.</p>

      <button
        onClick={checkDependencies}
        disabled={isChecking}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isChecking ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {isChecking ? 'Checking...' : 'Check All Dependencies'}
      </button>

      {currentCheck && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#e3f2fd',
            border: '1px solid #2196f3',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          {currentCheck}
        </div>
      )}

      {totalCount > 0 && (
        <div
          style={{
            padding: '15px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <h3>Summary</h3>
          <p>
            <strong>Total:</strong> {totalCount} | <strong>✅ Success:</strong> {successCount} | <strong>⚠️ Partial:</strong> {partialCount} | <strong>❌ Error:</strong> {errorCount}
          </p>
          <div style={{ marginTop: '10px' }}>
            <div
              style={{
                width: '100%',
                height: '20px',
                backgroundColor: '#e9ecef',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${totalCount > 0 ? (successCount / totalCount) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: '#28a745',
                  float: 'left',
                }}
              />
              <div
                style={{
                  width: `${totalCount > 0 ? (partialCount / totalCount) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: '#ffc107',
                  float: 'left',
                }}
              />
              <div
                style={{
                  width: `${totalCount > 0 ? (errorCount / totalCount) * 100 : 0}%`,
                  height: '100%',
                  backgroundColor: '#dc3545',
                  float: 'left',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {Object.keys(results).length > 0 && (
        <div>
          <h2>Dependency Results</h2>
          {Object.entries(results).map(([name, result]) => renderResult(name, result))}
        </div>
      )}
    </div>
  )
}
