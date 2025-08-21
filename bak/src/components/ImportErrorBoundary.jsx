'use client'

import { Component } from 'react'

/**
 * Specialized error boundary for catching import-related errors
 * Helps identify missing components and broken dependencies
 */
export class ImportErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      missingComponent: null,
    }
  }

  static getDerivedStateFromError(error) {
    // Check if this is an import-related error
    const isImportError = error.message.includes('Cannot resolve module') || error.message.includes('Module not found') || error.message.includes('Failed to resolve import') || error.message.includes('is not exported')

    return {
      hasError: true,
      error,
      missingComponent: isImportError ? error.message : null,
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      errorInfo,
    })

    // Log detailed error information
    console.error('Import Error Boundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      missingComponent: this.state.missingComponent,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            margin: '10px',
            border: '2px solid #ff6b6b',
            borderRadius: '8px',
            backgroundColor: '#ffe0e0',
            color: '#d63031',
            fontFamily: 'monospace',
          }}
        >
          <h3>Import Error Detected</h3>
          <p>
            <strong>Component:</strong> {this.props.componentName || 'Unknown'}
          </p>
          <p>
            <strong>Error:</strong> {this.state.error?.message}
          </p>
          {this.state.missingComponent && (
            <p>
              <strong>Missing Component:</strong> {this.state.missingComponent}
            </p>
          )}
          <details>
            <summary>Error Details</summary>
            <pre style={{ fontSize: '12px', overflow: 'auto' }}>{this.state.error?.stack}</pre>
          </details>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '10px',
              padding: '5px 10px',
              backgroundColor: '#d63031',
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
    }

    return this.props.children
  }
}
