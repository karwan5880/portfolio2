// Complete countdown test - now includes digit "0"
'use client'

import { NewBeginningDemo } from './index.js'

// Complete countdown test - now includes digit "0"

export function CompleteCountdownTest() {
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
          maxWidth: '380px',
          border: '2px solid #00ff00',
        }}
      >
        <h3 style={{ margin: '0 0 15px 0', color: '#00ff00', textAlign: 'center' }}>✅ COMPLETE COUNTDOWN: 10→0</h3>

        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ margin: '0 0 8px 0', color: '#ffff00' }}>🎬 Timeline:</h4>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • <strong>0-30s:</strong> Drone formations & dome
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • <strong>30-41s:</strong> Fast screen formation
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • <strong>40-51s:</strong> <span style={{ color: '#ff6600', fontWeight: 'bold' }}>COUNTDOWN DIGITS!</span>
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • <strong>51s+:</strong> Back to patterns
          </p>
        </div>

        <div
          style={{
            marginBottom: '15px',
            padding: '12px',
            background: 'rgba(255,100,0,0.2)',
            borderRadius: '5px',
            border: '1px solid #ff6600',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#ff6600' }}>🔢 Complete Countdown:</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '8px' }}>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>10</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>9</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>8</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>7</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>6</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>5</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '8px' }}>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>4</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>3</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>2</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>1</div>
            <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#ff6600' }}>0</div>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: '11px' }}>
            • Each digit displays for <strong>1 second</strong>
          </p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>• Bright white on dark background</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>• Professional 7-segment style</p>
          <p style={{ margin: '3px 0', fontSize: '11px' }}>
            • <strong>Total duration: 11 seconds</strong>
          </p>
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
          <h4 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>⚡ Timing Fixes:</h4>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>
            • Countdown: <strong>40-51s</strong> (was 40-50s)
          </p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• Added digit "0" at the end</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• Fixed coordinate inversions</p>
          <p style={{ margin: '3px 0', fontSize: '12px' }}>• Screen formation completes by ~41s</p>
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
          <strong style={{ color: '#00ff00' }}>🎯 Perfect Countdown!</strong>
          <br />
          <span style={{ fontSize: '12px' }}>
            The countdown now goes all the way to "0"
            <br />
            with correct orientation and timing!
          </span>
        </div>
      </div>

      {/* Enhanced timer display */}
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
          minWidth: '140px',
        }}
      >
        <div style={{ color: '#ffff00', marginBottom: '5px' }}>⏱️ TIMER</div>
        <div id="timer" style={{ fontSize: '24px', fontWeight: 'bold' }}>
          00:00
        </div>
        <div id="countdown-status" style={{ fontSize: '12px', marginTop: '5px', color: '#aaa' }}>
          Countdown: 40-51s
        </div>
        <div id="current-digit" style={{ fontSize: '16px', marginTop: '8px', fontWeight: 'bold', color: '#ff6600' }}>
          -
        </div>
      </div>
    </div>
  )
}

// Enhanced timer script with countdown digit display
if (typeof window !== 'undefined') {
  let startTime = Date.now()
  setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    const minutes = Math.floor(elapsed / 60)
    const seconds = Math.floor(elapsed % 60)
    const timerElement = document.getElementById('timer')
    const statusElement = document.getElementById('countdown-status')
    const digitElement = document.getElementById('current-digit')

    if (timerElement) {
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

      // Highlight when countdown is active
      if (elapsed >= 40 && elapsed < 51) {
        timerElement.style.color = '#ff6600'
        timerElement.style.textShadow = '0 0 10px #ff6600'

        // Show current countdown digit
        const countdownProgress = elapsed - 40
        const currentDigit = Math.max(0, Math.ceil(10 - countdownProgress))
        if (digitElement) {
          digitElement.textContent = `Digit: ${currentDigit}`
          digitElement.style.color = '#ff6600'
        }
        if (statusElement) {
          statusElement.textContent = 'COUNTDOWN ACTIVE!'
          statusElement.style.color = '#ff6600'
        }
      } else {
        timerElement.style.color = 'white'
        timerElement.style.textShadow = 'none'
        if (digitElement) {
          digitElement.textContent = '-'
          digitElement.style.color = '#aaa'
        }
        if (statusElement) {
          statusElement.textContent = 'Countdown: 40-51s'
          statusElement.style.color = '#aaa'
        }
      }
    }
  }, 100)
}
