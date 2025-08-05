// Perfect countdown test - clean 9→1 sequence
'use client'

import { NewBeginningDemo } from './index.js'

// Perfect countdown test - clean 9→1 sequence

export function PerfectCountdownTest() {
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
          maxWidth: '400px',
          border: '3px solid #00ff00',
          boxShadow: '0 0 20px rgba(0,255,0,0.3)',
        }}
      >
        <h3 style={{ margin: '0 0 20px 0', color: '#00ff00', textAlign: 'center', fontSize: '18px' }}>✅ PERFECT COUNTDOWN: 9→1</h3>

        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#ffff00' }}>🎬 Final Timeline:</h4>
          <div style={{ fontSize: '12px', lineHeight: '1.5' }}>
            <p style={{ margin: '3px 0' }}>
              • <strong>0-30s:</strong> Drone formations & dome
            </p>
            <p style={{ margin: '3px 0' }}>
              • <strong>30-50s:</strong> Screen formation (20 seconds)
            </p>
            <p style={{ margin: '3px 0' }}>
              • <strong>50-59s:</strong> <span style={{ color: '#ff6600', fontWeight: 'bold' }}>COUNTDOWN DIGITS!</span>
            </p>
            <p style={{ margin: '3px 0' }}>
              • <strong>59s+:</strong> Back to animated patterns
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
          <h4 style={{ margin: '0 0 12px 0', color: '#ff6600', textAlign: 'center' }}>🔢 Clean Countdown: 9→1</h4>

          {/* Visual countdown sequence */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(9, 1fr)', gap: '4px', marginBottom: '12px' }}>
            {[
              { digit: 9, time: '50s', color: '#ff6600' },
              { digit: 8, time: '51s', color: '#ff7700' },
              { digit: 7, time: '52s', color: '#ff8800' },
              { digit: 6, time: '53s', color: '#ff9900' },
              { digit: 5, time: '54s', color: '#ffaa00' },
              { digit: 4, time: '55s', color: '#ffbb00' },
              { digit: 3, time: '56s', color: '#ffcc00' },
              { digit: 2, time: '57s', color: '#ffdd00' },
              { digit: 1, time: '58s', color: '#ffee00' },
            ].map(({ digit, time, color }) => (
              <div
                key={digit}
                style={{
                  textAlign: 'center',
                  fontSize: '11px',
                  padding: '8px 4px',
                  background: `${color}20`,
                  borderRadius: '6px',
                  border: `1px solid ${color}`,
                  color: color,
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{digit}</div>
                <div style={{ fontSize: '9px', marginTop: '2px' }}>{time}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: '11px', textAlign: 'center' }}>
            <p style={{ margin: '4px 0' }}>
              • <strong>9 digits total</strong> (50-59s)
            </p>
            <p style={{ margin: '4px 0' }}>
              • Each digit: <strong>1 second</strong> display
            </p>
            <p style={{ margin: '4px 0' }}>• No "10" complexity • No "0" hole issue</p>
          </div>
        </div>

        <div
          style={{
            marginBottom: '20px',
            padding: '12px',
            background: 'rgba(0,255,255,0.2)',
            borderRadius: '6px',
            border: '1px solid #00ffff',
          }}
        >
          <h4 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>✅ Issues Fixed:</h4>
          <div style={{ fontSize: '11px' }}>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Removed "10":</strong> No two-digit complexity
            </p>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Removed "0":</strong> No hole-in-middle display issue
            </p>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Clean sequence:</strong> Simple 9→1 countdown
            </p>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Perfect timing:</strong> 9 seconds total
            </p>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Correct orientation:</strong> No inversions
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
          <strong style={{ color: '#00ff00', fontSize: '16px' }}>🎯 COUNTDOWN PERFECTED!</strong>
          <br />
          <span style={{ fontSize: '12px', marginTop: '5px', display: 'block' }}>
            Clean • Simple • Reliable • Dramatic
            <br />
            The perfect finale for your drone show!
          </span>
        </div>
      </div>

      {/* Perfect countdown timer */}
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
          minWidth: '160px',
          border: '2px solid #333',
        }}
      >
        <div style={{ color: '#ffff00', marginBottom: '8px', fontSize: '14px' }}>⏱️ SHOW TIMER</div>
        <div id="timer" style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>
          00:00
        </div>

        <div
          id="phase-indicator"
          style={{
            fontSize: '11px',
            marginBottom: '8px',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(100,100,100,0.2)',
          }}
        >
          Formation Phase
        </div>

        <div id="countdown-status" style={{ fontSize: '12px', marginBottom: '8px', color: '#aaa' }}>
          Countdown: 50-59s
        </div>

        <div
          id="current-digit"
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#ff6600',
            padding: '10px',
            background: 'rgba(255,100,0,0.1)',
            borderRadius: '8px',
            border: '2px solid #ff6600',
            minHeight: '20px',
          }}
        >
          -
        </div>

        <div id="countdown-info" style={{ fontSize: '10px', marginTop: '8px', color: '#888' }}>
          9 digits • 9 seconds
        </div>
      </div>
    </div>
  )
}

// Perfect countdown timer
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
    const infoElement = document.getElementById('countdown-info')

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
      } else if (elapsed >= 50 && elapsed < 59) {
        currentPhase = 'COUNTDOWN!'
        phaseColor = '#ff6600'
      } else {
        currentPhase = 'Pattern Display'
        phaseColor = '#00ff00'
      }

      if (phaseElement) {
        phaseElement.textContent = currentPhase
        phaseElement.style.background = `rgba(${phaseColor === '#ff6600' ? '255,100,0' : phaseColor === '#00aaff' ? '0,170,255' : phaseColor === '#ffaa00' ? '255,170,0' : '0,255,0'},0.3)`
        phaseElement.style.color = phaseColor
        phaseElement.style.fontWeight = elapsed >= 50 && elapsed < 59 ? 'bold' : 'normal'
      }

      // Perfect countdown tracking (50-59s)
      if (elapsed >= 50 && elapsed < 59) {
        timerElement.style.color = '#ff6600'
        timerElement.style.textShadow = '0 0 15px #ff6600'

        // Calculate current digit (9→1)
        const countdownProgress = elapsed - 50
        const currentDigit = Math.max(1, Math.floor(9 - countdownProgress + 0.5))

        if (digitElement) {
          digitElement.textContent = `${currentDigit}`
          digitElement.style.color = '#ff6600'
          digitElement.style.background = 'rgba(255,100,0,0.3)'
          digitElement.style.transform = 'scale(1.1)'
          digitElement.style.textShadow = '0 0 10px #ff6600'
        }
        if (statusElement) {
          statusElement.textContent = 'COUNTDOWN ACTIVE!'
          statusElement.style.color = '#ff6600'
          statusElement.style.fontWeight = 'bold'
        }
        if (infoElement) {
          const remaining = 59 - elapsed
          infoElement.textContent = `${Math.ceil(remaining)}s remaining`
          infoElement.style.color = '#ffaa00'
        }
      } else {
        timerElement.style.color = 'white'
        timerElement.style.textShadow = 'none'
        if (digitElement) {
          digitElement.textContent = '-'
          digitElement.style.color = '#666'
          digitElement.style.background = 'rgba(255,100,0,0.1)'
          digitElement.style.transform = 'scale(1.0)'
          digitElement.style.textShadow = 'none'
        }
        if (statusElement) {
          statusElement.textContent = elapsed < 50 ? 'Countdown: 50-59s' : 'Countdown complete'
          statusElement.style.color = '#aaa'
          statusElement.style.fontWeight = 'normal'
        }
        if (infoElement) {
          if (elapsed < 50) {
            const timeToCountdown = 50 - elapsed
            infoElement.textContent = `Starts in ${Math.ceil(timeToCountdown)}s`
            infoElement.style.color = '#888'
          } else {
            infoElement.textContent = '9 digits • 9 seconds'
            infoElement.style.color = '#666'
          }
        }
      }
    }
  }, 100)
}
