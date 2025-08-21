'use client'

import { useCallback, useEffect, useState } from 'react'

/**
 * Safe wrapper that handles hook calls with proper error boundaries
 */
export const SafeHookWrapper = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Reset error state when children change
    setHasError(false)
    setError(null)
  }, [children])

  const handleError = useCallback((error, errorInfo) => {
    console.error('Hook error caught:', error, errorInfo)
    setHasError(true)
    setError(error)
  }, [])

  if (hasError) {
    return (
      fallback || (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb',
            borderRadius: '4px',
            margin: '10px',
          }}
        >
          <h3>Component Error</h3>
          <p>A hook error occurred: {error?.message}</p>
          <button
            onClick={() => {
              setHasError(false)
              setError(null)
            }}
            style={{
              padding: '5px 10px',
              backgroundColor: '#721c24',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      )
    )
  }

  try {
    return children
  } catch (error) {
    handleError(error)
    return fallback || <div>Component failed to render</div>
  }
}
