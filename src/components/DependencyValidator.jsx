'use client'

import { useEffect, useState } from 'react'

import { ImportErrorBoundary } from './ImportErrorBoundary'

/**
 * Component that validates all dependencies for MultiversePortfolio
 * Systematically checks each import and reports missing components
 */
export const DependencyValidator = ({ onValidationComplete }) => {
  const [validationResults, setValidationResults] = useState({})
  const [isValidating, setIsValidating] = useState(true)
  const [currentTest, setCurrentTest] = useState('')

  // List of all components that need to be validated
  const componentsToValidate = [
    { name: 'AccessibilityProvider', path: './AccessibilityProvider' },
    { name: 'CareerSection', path: './CareerSection' },
    { name: 'CinematicThemeManager', path: './CinematicThemeManager' },
    { name: 'DevHistorySection', path: './DevHistorySection' },
    { name: 'ErrorBoundary', path: './ErrorBoundary' },
    { name: 'AnimationErrorBoundary', path: './ErrorBoundary' },
    { name: 'ThemeErrorBoundary', path: './ErrorBoundary' },
    { name: 'ErrorRecoveryManager', path: './ErrorRecoveryManager' },
    { name: 'HomeSection', path: './HomeSection' },
    { name: 'MobileNavigation', path: './MobileNavigation' },
    { name: 'MobileThemeOptimizer', path: './MobileThemeOptimizer' },
    { name: 'NavigationAnnouncer', path: './NavigationAnnouncer' },
    { name: 'NavigationDots', path: './NavigationDots' },
    { name: 'OptimizedThemeSelector', path: './OptimizedThemeSelector' },
    { name: 'DevPerformanceOverlay', path: './PerformanceMonitor' },
    { name: 'ProjectSection', path: './ProjectSection' },
    { name: 'ScrollProgress', path: './ScrollProgress' },
    { name: 'SeasonalThemeManager', path: './SeasonalThemeManager' },
    { name: 'SectionWrapper', path: './SectionWrapper' },
    { name: 'ShareButton', path: './ShareButton' },
    { name: 'SkillsSection', path: './SkillsSection' },
    { name: 'SkipLinks', path: './SkipLinks' },
    { name: 'TimelineSection', path: './TimelineSection' },
  ]

  const hooksToValidate = [
    { name: 'useAccessibility', path: '@/hooks/useAccessibility' },
    { name: 'useMobileOptimizations', path: '@/hooks/useMobileOptimizations' },
    { name: 'useMobilePerformance', path: '@/hooks/useMobileOptimizations' },
    { name: 'useMobileViewport', path: '@/hooks/useMobileOptimizations' },
    { name: 'useTouchGestures', path: '@/hooks/useMobileOptimizations' },
    { name: 'useOptimizedAnimations', path: '@/hooks/useOptimizedAnimations' },
    { name: 'useScrollManager', path: '@/hooks/useScrollManager' },
    { name: 'useURLRouting', path: '@/hooks/useURLRouting' },
  ]

  const utilsToValidate = [
    { name: 'useErrorHandler', path: '@/utils/errorHandling' },
    { name: 'performanceMonitor', path: '@/utils/performanceOptimizations' },
  ]

  useEffect(() => {
    const validateDependencies = async () => {
      const results = {}

      // Validate components
      for (const component of componentsToValidate) {
        setCurrentTest(`Testing component: ${component.name}`)
        try {
          // Try to dynamically import the component
          const module = await import(component.path)
          if (module[component.name]) {
            results[component.name] = { status: 'success', type: 'component' }
          } else {
            results[component.name] = {
              status: 'error',
              type: 'component',
              error: `Export '${component.name}' not found in ${component.path}`,
            }
          }
        } catch (error) {
          results[component.name] = {
            status: 'error',
            type: 'component',
            error: error.message,
          }
        }
      }

      // Validate hooks
      for (const hook of hooksToValidate) {
        setCurrentTest(`Testing hook: ${hook.name}`)
        try {
          const module = await import(hook.path)
          if (module[hook.name]) {
            results[hook.name] = { status: 'success', type: 'hook' }
          } else {
            results[hook.name] = {
              status: 'error',
              type: 'hook',
              error: `Export '${hook.name}' not found in ${hook.path}`,
            }
          }
        } catch (error) {
          results[hook.name] = {
            status: 'error',
            type: 'hook',
            error: error.message,
          }
        }
      }

      // Validate utils
      for (const util of utilsToValidate) {
        setCurrentTest(`Testing util: ${util.name}`)
        try {
          const module = await import(util.path)
          if (module[util.name]) {
            results[util.name] = { status: 'success', type: 'util' }
          } else {
            results[util.name] = {
              status: 'error',
              type: 'util',
              error: `Export '${util.name}' not found in ${util.path}`,
            }
          }
        } catch (error) {
          results[util.name] = {
            status: 'error',
            type: 'util',
            error: error.message,
          }
        }
      }

      setValidationResults(results)
      setIsValidating(false)
      setCurrentTest('')

      if (onValidationComplete) {
        onValidationComplete(results)
      }
    }

    validateDependencies()
  }, [onValidationComplete])

  const successCount = Object.values(validationResults).filter((r) => r.status === 'success').length
  const errorCount = Object.values(validationResults).filter((r) => r.status === 'error').length
  const totalCount = componentsToValidate.length + hooksToValidate.length + utilsToValidate.length

  if (isValidating) {
    return (
      <div
        style={{
          padding: '20px',
          margin: '10px',
          border: '2px solid #0984e3',
          borderRadius: '8px',
          backgroundColor: '#e3f2fd',
          color: '#0984e3',
          fontFamily: 'monospace',
        }}
      >
        <h3>Validating Dependencies...</h3>
        <p>{currentTest}</p>
        <div
          style={{
            width: '100%',
            height: '10px',
            backgroundColor: '#ddd',
            borderRadius: '5px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${((totalCount - Object.keys(validationResults).length) / totalCount) * 100}%`,
              height: '100%',
              backgroundColor: '#0984e3',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: '20px',
        margin: '10px',
        border: `2px solid ${errorCount > 0 ? '#ff6b6b' : '#00b894'}`,
        borderRadius: '8px',
        backgroundColor: errorCount > 0 ? '#ffe0e0' : '#e0f7e0',
        color: errorCount > 0 ? '#d63031' : '#00b894',
        fontFamily: 'monospace',
      }}
    >
      <h3>Dependency Validation Results</h3>
      <p>
        <strong>Total:</strong> {totalCount} |<strong>Success:</strong> {successCount} |<strong>Errors:</strong> {errorCount}
      </p>

      {errorCount > 0 && (
        <div>
          <h4>Missing or Broken Dependencies:</h4>
          <ul>
            {Object.entries(validationResults)
              .filter(([_, result]) => result.status === 'error')
              .map(([name, result]) => (
                <li key={name}>
                  <strong>{name}</strong> ({result.type}): {result.error}
                </li>
              ))}
          </ul>
        </div>
      )}

      {successCount > 0 && (
        <details>
          <summary>Working Dependencies ({successCount})</summary>
          <ul>
            {Object.entries(validationResults)
              .filter(([_, result]) => result.status === 'success')
              .map(([name, result]) => (
                <li key={name}>
                  <strong>{name}</strong> ({result.type}) ✅
                </li>
              ))}
          </ul>
        </details>
      )}
    </div>
  )
}

// Test component that wraps the validator with error boundary
export const DependencyValidatorTest = () => {
  const [results, setResults] = useState(null)

  return (
    <ImportErrorBoundary componentName="DependencyValidator">
      <DependencyValidator onValidationComplete={setResults} />
      {results && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f8f9fa' }}>
          <h4>Validation Complete</h4>
          <p>Check the results above for any missing dependencies that need to be created.</p>
        </div>
      )}
    </ImportErrorBoundary>
  )
}
