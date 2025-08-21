'use client'

import { useState } from 'react'

/**
 * Simple test to verify hooks are working correctly
 */
export const HookTest = () => {
  const [testResult, setTestResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const testHooks = async () => {
    setIsLoading(true)
    const results = []

    // Test each hook individually
    const hookTests = [
      {
        name: 'useErrorHandler',
        test: async () => {
          const { useErrorHandler } = await import('@/utils/errorHandling')
          const result = useErrorHandler()
          return { success: true, data: typeof result }
        },
      },
      {
        name: 'useMobileOptimizations',
        test: async () => {
          const { useMobileOptimizations } = await import('@/hooks/useMobileOptimizations')
          const result = useMobileOptimizations()
          return { success: true, data: Object.keys(result) }
        },
      },
      {
        name: 'useScrollManager',
        test: async () => {
          const { useScrollManager } = await import('@/hooks/useScrollManager')
          const result = useScrollManager([], {})
          return { success: true, data: Object.keys(result) }
        },
      },
    ]

    for (const hookTest of hookTests) {
      try {
        const result = await hookTest.test()
        results.push({
          name: hookTest.name,
          status: 'success',
          data: result.data,
        })
      } catch (error) {
        results.push({
          name: hookTest.name,
          status: 'error',
          error: error.message,
        })
      }
    }

    setTestResult(results)
    setIsLoading(false)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Hook Test</h1>
      <p>Testing if hooks can be called without "Invalid hook call" errors</p>

      <button
        onClick={testHooks}
        disabled={isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          marginBottom: '20px',
        }}
      >
        {isLoading ? 'Testing Hooks...' : 'Test Hooks'}
      </button>

      {testResult && (
        <div>
          <h2>Hook Test Results</h2>
          {testResult.map((result, index) => (
            <div
              key={index}
              style={{
                padding: '10px',
                margin: '5px 0',
                backgroundColor: result.status === 'success' ? '#d4edda' : '#f8d7da',
                color: result.status === 'success' ? '#155724' : '#721c24',
                border: `1px solid ${result.status === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
                borderRadius: '4px',
                fontFamily: 'monospace',
              }}
            >
              <strong>{result.name}:</strong> {result.status}
              {result.data && <div style={{ fontSize: '12px', marginTop: '5px' }}>Data: {Array.isArray(result.data) ? result.data.join(', ') : result.data}</div>}
              {result.error && <div style={{ fontSize: '12px', marginTop: '5px' }}>Error: {result.error}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
