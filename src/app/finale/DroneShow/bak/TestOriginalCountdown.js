// Test the original system with countdown digits now implemented
'use client'

import { NewBeginningDemo } from './index.js'

// Test the original system with countdown digits now implemented

export function TestOriginalCountdown() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <NewBeginningDemo />

      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '14px',
          maxWidth: '300px',
        }}
      >
        <h3 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>✅ Original System + Countdown</h3>
        <p style={{ margin: '5px 0' }}>
          • <strong>0-30s:</strong> Drone formations
        </p>
        <p style={{ margin: '5px 0' }}>
          • <strong>30-40s:</strong> Animated patterns (6 types)
        </p>
        <p style={{ margin: '5px 0' }}>
          • <strong>40-50s:</strong> <span style={{ color: '#ffff00' }}>COUNTDOWN DIGITS!</span>
        </p>
        <p style={{ margin: '5px 0' }}>
          • <strong>50s+:</strong> Back to patterns
        </p>

        <div
          style={{
            marginTop: '15px',
            padding: '8px',
            background: 'rgba(255,255,0,0.2)',
            borderRadius: '4px',
          }}
        >
          <strong>🎯 Countdown Details:</strong>
          <br />
          • Digits 10→1 (1 second each)
          <br />
          • Bright white on dark background
          <br />
          • 32x32 high-resolution display
          <br />• Professional 7-segment style
        </div>

        <div
          style={{
            marginTop: '10px',
            padding: '8px',
            background: 'rgba(0,255,0,0.2)',
            borderRadius: '4px',
          }}
        >
          <strong>📍 Camera Tip:</strong>
          <br />
          Use mouse to position camera to see the 32x32 screen formation clearly!
        </div>
      </div>
    </div>
  )
}
