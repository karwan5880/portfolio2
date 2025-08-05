'use client'

import { NewBeginningDemo } from './index.js'

export function FinalCountdownTest() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <NewBeginningDemo />

      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.9)',
          padding: '20px',
          borderRadius: '10px',
          fontFamily: 'monospace',
          fontSize: '14px',
          maxWidth: '350px',
          border: '2px solid #00ff00',
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', color: '#00ff00', textAlign: 'center' }}>✅ COUNTDOWN DIGITS FIXED!</h3>

        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#ffff00' }}>🎬 Timeline:</h4>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • <strong>0-30s:</strong> Drone formations & dome
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • <strong>30-41s:</strong> Fast screen formation
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • <strong>40-50s:</strong> <span style={{ color: '#ff6600', fontWeight: 'bold' }}>COUNTDOWN DIGITS!</span>
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • <strong>50s+:</strong> Back to patterns
          </p>
        </div>

        <div
          style={{
            marginBottom: '15px',
            padding: '10px',
            background: 'rgba(255,100,0,0.2)',
            borderRadius: '5px',
            border: '1px solid #ff6600',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#ff6600' }}>🔢 Countdown Details:</h4>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • Shows digits <strong>10 → 1</strong> (1 second each)
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• Bright white digits on dark background</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• 32x32 high-resolution display</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• Professional 7-segment style</p>
        </div>

        <div
          style={{
            marginBottom: '15px',
            padding: '10px',
            background: 'rgba(0,255,255,0.2)',
            borderRadius: '5px',
            border: '1px solid #00ffff',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>⚡ Performance Fixes:</h4>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • Screen formation: <strong>10x faster</strong>
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• Row delay: 0.5s → 0.1s</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• Stage duration: 8s → 4s each</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• Formation completes by ~41s</p>
        </div>

        <div
          style={{
            padding: '10px',
            background: 'rgba(0,255,0,0.2)',
            borderRadius: '5px',
            border: '1px solid #00ff00',
            textAlign: 'center',
          }}
        >
          <strong style={{ color: '#00ff00' }}>🎯 Camera Tip:</strong>
          <br />
          <span style={{ fontSize: '12px' }}>
            Position camera to see the 32x32 screen
            <br />
            formation in the center for best view!
          </span>
        </div>
      </div>

      {/* Timer display */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.8)',
          padding: '15px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          fontSize: '18px',
          textAlign: 'center',
          minWidth: '120px',
        }}
      >
        <div style={{ color: '#ffff00', marginBottom: '5px' }}>⏱️ TIMER</div>
        <div id="timer" style={{ fontSize: '24px', fontWeight: 'bold' }}>
          00:00
        </div>
        <div style={{ fontSize: '12px', marginTop: '5px', color: '#aaa' }}>Countdown at 40s</div>
      </div>
    </div>
  )
}

// Add a simple timer script
if (typeof window !== 'undefined') {
  let startTime = Date.now()
  setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    const minutes = Math.floor(elapsed / 60)
    const seconds = Math.floor(elapsed % 60)
    const timerElement = document.getElementById('timer')
    if (timerElement) {
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

      // Highlight when countdown is active
      if (elapsed >= 40 && elapsed < 50) {
        timerElement.style.color = '#ff6600'
        timerElement.style.textShadow = '0 0 10px #ff6600'
      } else {
        timerElement.style.color = 'white'
        timerElement.style.textShadow = 'none'
      }
    }
  }, 100)
}
