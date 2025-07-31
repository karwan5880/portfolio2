// Test component to verify countdown digits work correctly
'use client'

import { NewBeginningDemoRefactored } from './NewBeginningDemoRefactored'

// Test component to verify countdown digits work correctly

export function TestCountdown() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <NewBeginningDemoRefactored />
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '5px',
          fontFamily: 'monospace',
        }}
      >
        <h3>Countdown Test Instructions:</h3>
        <p>• Wait for 40 seconds to see countdown digits (10→1)</p>
        <p>• Before 40s: Animated patterns cycle every 30s</p>
        <p>• At 40s-50s: Bright white countdown digits</p>
        <p>• After 50s: Return to animated patterns</p>
      </div>
    </div>
  )
}
