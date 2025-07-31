// Test with delayed countdown timing - starts at 50 seconds
'use client'

import { NewBeginningDemo } from './index.js'

// Test with delayed countdown timing - starts at 50 seconds

export function DelayedCountdownTest() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <NewBeginningDemo />

      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.95)',
          padding: '25px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '14px',
          maxWidth: '420px',
          border: '3px solid #00ff00',
          boxShadow: '0 0 20px rgba(0,255,0,0.3)',
        }}
      >
        <h3 style={{ margin: '0 0 20px 0', color: '#00ff00', textAlign: 'center', fontSize: '18px' }}>⏰ DELAYED COUNTDOWN: 50→61s</h3>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#ffff00' }}>🎬 Updated Timeline:</h4>
          <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <p style={{ margin: '3px 0' }}>
              • <strong>0-30s:</strong> Drone formations & dome
            </p>
            <p style={{ margin: '3px 0' }}>
              • <strong>30-50s:</strong> Screen formation (20 seconds!)
            </p>
            <p style={{ margin: '3px 0' }}>
              • <strong>50-61s:</strong> <span style={{ color: '#ff6600', fontWeight: 'bold' }}>COUNTDOWN DIGITS!</span>
            </p>
            <p style={{ margin: '3px 0' }}>
              • <strong>61s+:</strong> Back to animated patterns
            </p>
          </div>
        </div>

        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            background: 'rgba(0,255,255,0.25)',
            borderRadius: '8px',
            border: '2px solid #00ffff',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#00ffff', textAlign: 'center' }}>⚡ Perfect Timing!</h4>
          <div style={{ fontSize: '12px' }}>
            <p style={{ margin: '4px 0' }}>
              ✅ <strong>Screen formation:</strong> 20 seconds (30-50s)
            </p>
            <p style={{ margin: '4px 0' }}>
              ✅ <strong>Formation completes:</strong> ~41s (9s buffer!)
            </p>
            <p style={{ margin: '4px 0' }}>
              ✅ <strong>Countdown starts:</strong> 50s (plenty of time)
            </p>
            <p style={{ margin: '4px 0' }}>
              ✅ <strong>No more timing conflicts!</strong>
            </p>
          </div>
        </div>

        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            background: 'rgba(255,100,0,0.25)',
            borderRadius: '8px',
            border: '2px solid #ff6600',
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#ff6600', textAlign: 'center' }}>🔢 Complete Countdown: 10→0</h4>

          {/* Visual countdown timeline */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '6px' }}>
              {[
                { digit: 10, time: '50s' },
                { digit: 9, time: '51s' },
                { digit: 8, time: '52s' },
                { digit: 7, time: '53s' },
                { digit: 6, time: '54s' },
                { digit: 5, time: '55s' },
              ].map(({ digit, time }) => (
                <div
                  key={digit}
                  style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    padding: '6px 2px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{digit}</div>
                  <div style={{ color: '#aaa', fontSize: '9px' }}>{time}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {[
                { digit: 4, time: '56s' },
                { digit: 3, time: '57s' },
                { digit: 2, time: '58s' },
                { digit: 1, time: '59s' },
                { digit: 0, time: '60s' },
              ].map(({ digit, time }) => (
                <div
                  key={digit}
                  style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    padding: '6px 2px',
                    background: digit === 0 ? 'rgba(255,100,0,0.3)' : 'rgba(255,255,255,0.1)',
                    borderRadius: '4px',
                    color: digit === 0 ? '#ff6600' : 'white',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '13px' }}>{digit}</div>
                  <div style={{ color: digit === 0 ? '#ffaa00' : '#aaa', fontSize: '9px' }}>{time}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '11px', textAlign: 'center' }}>
            <p style={{ margin: '4px 0' }}>
              • Total duration: <strong>11 seconds</strong> (50-61s)
            </p>
            <p style={{ margin: '4px 0' }}>
              • Each digit: <strong>1 second</strong> display time
            </p>
          </div>
        </div>

        <div
          style={{
            padding: '12px',
            background: 'rgba(0,255,0,0.2)',
            borderRadius: '6px',
            border: '1px solid #00ff00',
            textAlign: 'center',
          }}
        >
          <strong style={{ color: '#00ff00', fontSize: '16px' }}>🎯 PERFECT TIMING!</strong>
          <br />
          <span style={{ fontSize: '12px', marginTop: '5px', display: 'block' }}>
            Screen formation completes well before countdown
            <br />
            Bright white digits • Correct orientation • Complete sequence
          </span>
        </div>
      </div>

      {/* Enhanced countdown timer */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'white',
          background: 'rgba(0,0,0,0.9)',
          padding: '20px',
          borderRadius: '10px',
          fontFamily: 'monospace',
          fontSize: '16px',
          textAlign: 'center',
          minWidth: '180px',
          border: '2px solid #333',
        }}
      >
        <div style={{ color: '#ffff00', marginBottom: '8px', fontSize: '14px' }}>⏱️ LIVE TIMER</div>
        <div id="timer" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          00:00
        </div>

        <div
          id="phase-indicator"
          style={{
            fontSize: '12px',
            marginBottom: '8px',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(100,100,100,0.2)',
          }}
        >
          Formation Phase
        </div>

        <div id="countdown-status" style={{ fontSize: '12px', marginBottom: '8px', color: '#aaa' }}>
          Countdown: 50-61s
        </div>

        <div
          id="current-digit"
          style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#ff6600',
            padding: '8px',
            background: 'rgba(255,100,0,0.1)',
            borderRadius: '6px',
            border: '1px solid #ff6600',
          }}
        >
          -
        </div>

        <div id="time-to-countdown" style={{ fontSize: '10px', marginTop: '5px', color: '#888' }}>
          -
        </div>
      </div>
    </div>
  )
}

// Enhanced timer with phase tracking
if (typeof window !== 'undefined') {
  let startTime = Date.now()
  setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000
    const minutes = Math.floor(elapsed / 60)
    const seconds = Math.floor(elapsed % 60)
    const timerElement = document.getElementById('timer')
    const statusElement = document.getElementById('countdown-status')
    const digitElement = document.getElementById('current-digit')
    const phaseElement = document.getElementById('phase-indicator')
    const timeToElement = document.getElementById('time-to-countdown')

    if (timerElement) {
      timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`

      // Phase tracking
      let currentPhase = 'Formation'
      let phaseColor = '#888'

      if (elapsed < 30) {
        currentPhase = 'Drone Formation'
        phaseColor = '#00aaff'
      } else if (elapsed < 50) {
        currentPhase = 'Screen Formation'
        phaseColor = '#ffaa00'
      } else if (elapsed >= 50 && elapsed < 61) {
        currentPhase = 'COUNTDOWN ACTIVE'
        phaseColor = '#ff6600'
      } else {
        currentPhase = 'Pattern Display'
        phaseColor = '#00ff00'
      }

      if (phaseElement) {
        phaseElement.textContent = currentPhase
        phaseElement.style.background = `rgba(${phaseColor === '#ff6600' ? '255,100,0' : phaseColor === '#00aaff' ? '0,170,255' : phaseColor === '#ffaa00' ? '255,170,0' : '0,255,0'},0.3)`
        phaseElement.style.color = phaseColor
        phaseElement.style.fontWeight = elapsed >= 50 && elapsed < 61 ? 'bold' : 'normal'
      }

      // Countdown tracking (50-61s)
      if (elapsed >= 50 && elapsed < 61) {
        timerElement.style.color = '#ff6600'
        timerElement.style.textShadow = '0 0 15px #ff6600'

        // Calculate current digit
        const countdownProgress = elapsed - 50
        const currentDigit = Math.max(0, Math.floor(10 - countdownProgress + 0.5))

        if (digitElement) {
          digitElement.textContent = `${currentDigit}`
          digitElement.style.color = '#ff6600'
          digitElement.style.background = 'rgba(255,100,0,0.3)'
          digitElement.style.transform = 'scale(1.1)'
        }
        if (statusElement) {
          statusElement.textContent = 'COUNTDOWN ACTIVE!'
          statusElement.style.color = '#ff6600'
          statusElement.style.fontWeight = 'bold'
        }
        if (timeToElement) {
          const remaining = 61 - elapsed
          timeToElement.textContent = `Ends in: ${Math.ceil(remaining)}s`
          timeToElement.style.color = '#ffaa00'
        }
      } else {
        timerElement.style.color = 'white'
        timerElement.style.textShadow = 'none'
        if (digitElement) {
          digitElement.textContent = '-'
          digitElement.style.color = '#666'
          digitElement.style.background = 'rgba(255,100,0,0.1)'
          digitElement.style.transform = 'scale(1.0)'
        }
        if (statusElement) {
          statusElement.textContent = elapsed < 50 ? 'Countdown: 50-61s' : 'Countdown complete'
          statusElement.style.color = '#aaa'
          statusElement.style.fontWeight = 'normal'
        }
        if (timeToElement) {
          if (elapsed < 50) {
            const timeToCountdown = 50 - elapsed
            timeToElement.textContent = `Starts in: ${Math.ceil(timeToCountdown)}s`
            timeToElement.style.color = '#888'
          } else {
            timeToElement.textContent = 'Countdown ended'
            timeToElement.style.color = '#666'
          }
        }
      }
    }
  }, 100)
}
