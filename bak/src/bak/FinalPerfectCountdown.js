// Final perfect countdown test - 9→0 with proper timing and "0" hole
'use client'

import { NewBeginningDemo } from './index.js'

// Final perfect countdown test - 9→0 with proper timing and "0" hole

export function FinalPerfectCountdown() {
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
        <h3 style={{ margin: '0 0 20px 0', color: '#00ff00', textAlign: 'center', fontSize: '18px' }}>🎯 PERFECT COUNTDOWN: 9→0</h3>

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
              • <strong>50-51s:</strong> <span style={{ color: '#888' }}>Delay (no stutter)</span>
            </p>
            <p style={{ margin: '3px 0' }}>
              • <strong>51-61s:</strong> <span style={{ color: '#ff6600', fontWeight: 'bold' }}>COUNTDOWN 9→0!</span>
            </p>
            <p style={{ margin: '3px 0' }}>
              • <strong>61s+:</strong> Back to patterns
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
          <h4 style={{ margin: '0 0 12px 0', color: '#ff6600', textAlign: 'center' }}>🔢 Perfect Countdown: 9→0</h4>

          {/* Visual countdown timeline */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '6px' }}>
              {[
                { digit: 9, time: '51s', color: '#ff3300' },
                { digit: 8, time: '52s', color: '#ff4400' },
                { digit: 7, time: '53s', color: '#ff5500' },
                { digit: 6, time: '54s', color: '#ff6600' },
                { digit: 5, time: '55s', color: '#ff7700' },
              ].map(({ digit, time, color }) => (
                <div
                  key={digit}
                  style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    padding: '8px 4px',
                    background: `${color}25`,
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
              {[
                { digit: 4, time: '56s', color: '#ff8800' },
                { digit: 3, time: '57s', color: '#ff9900' },
                { digit: 2, time: '58s', color: '#ffaa00' },
                { digit: 1, time: '59s', color: '#ffbb00' },
                { digit: 0, time: '60s', color: '#ffcc00', special: true },
              ].map(({ digit, time, color, special }) => (
                <div
                  key={digit}
                  style={{
                    textAlign: 'center',
                    fontSize: '11px',
                    padding: '8px 4px',
                    background: special ? `${color}40` : `${color}25`,
                    borderRadius: '6px',
                    border: special ? `2px solid ${color}` : `1px solid ${color}`,
                    color: color,
                    transform: special ? 'scale(1.05)' : 'scale(1.0)',
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: special ? '18px' : '16px' }}>{digit === 0 ? '⭕' : digit}</div>
                  <div style={{ fontSize: '9px', marginTop: '2px' }}>{time}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '11px', textAlign: 'center' }}>
            <p style={{ margin: '4px 0' }}>
              • <strong>10 digits total</strong> (51-61s)
            </p>
            <p style={{ margin: '4px 0' }}>
              • Each digit: <strong>1 second</strong> display
            </p>
            <p style={{ margin: '4px 0' }}>• "0" has proper hole • No stutter on "9"</p>
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
          <h4 style={{ margin: '0 0 8px 0', color: '#00ffff' }}>✅ All Issues Fixed:</h4>
          <div style={{ fontSize: '11px' }}>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Added "0" back:</strong> Complete 9→0 countdown
            </p>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Fixed "0" hole:</strong> Proper oval shape with center hole
            </p>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Fixed "9" stutter:</strong> 1-second delay for proper timing
            </p>
            <p style={{ margin: '2px 0' }}>
              ✅ <strong>Perfect timing:</strong> 10 seconds total (51-61s)
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
            Complete sequence • Perfect timing • Proper "0"
            <br />
            The ultimate finale for your drone show!
          </span>
        </div>
      </div>

      {/* Ultimate countdown timer */}
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
          Countdown: 51-61s
        </div>

        <div
          id="current-digit"
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#ff6600',
            padding: '12px',
            background: 'rgba(255,100,0,0.1)',
            borderRadius: '8px',
            border: '2px solid #ff6600',
            minHeight: '24px',
          }}
        >
          -
        </div>

        <div id="countdown-info" style={{ fontSize: '10px', marginTop: '8px', color: '#888' }}>
          10 digits • 10 seconds
        </div>
      </div>
    </div>
  )
}

// Ultimate countdown timer
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
      } else if (elapsed >= 50 && elapsed < 51) {
        currentPhase = 'Pre-Countdown'
        phaseColor = '#ff9900'
      } else if (elapsed >= 51 && elapsed < 61) {
        currentPhase = 'COUNTDOWN!'
        phaseColor = '#ff6600'
      } else {
        currentPhase = 'Pattern Display'
        phaseColor = '#00ff00'
      }

      if (phaseElement) {
        phaseElement.textContent = currentPhase
        phaseElement.style.background = `rgba(${phaseColor === '#ff6600' ? '255,100,0' : phaseColor === '#ff9900' ? '255,150,0' : phaseColor === '#00aaff' ? '0,170,255' : phaseColor === '#ffaa00' ? '255,170,0' : '0,255,0'},0.3)`
        phaseElement.style.color = phaseColor
        phaseElement.style.fontWeight = elapsed >= 51 && elapsed < 61 ? 'bold' : 'normal'
      }

      // Perfect countdown tracking (51-61s)
      if (elapsed >= 51 && elapsed < 61) {
        timerElement.style.color = '#ff6600'
        timerElement.style.textShadow = '0 0 15px #ff6600'

        // Calculate current digit (9→0)
        const countdownProgress = elapsed - 51
        const currentDigit = Math.max(0, Math.floor(9 - countdownProgress + 0.5))

        if (digitElement) {
          // Special display for "0"
          const displayDigit = currentDigit === 0 ? '⭕' : currentDigit.toString()
          digitElement.textContent = displayDigit
          digitElement.style.color = '#ff6600'
          digitElement.style.background = 'rgba(255,100,0,0.3)'
          digitElement.style.transform = currentDigit === 0 ? 'scale(1.2)' : 'scale(1.1)'
          digitElement.style.textShadow = '0 0 10px #ff6600'
        }
        if (statusElement) {
          statusElement.textContent = 'COUNTDOWN ACTIVE!'
          statusElement.style.color = '#ff6600'
          statusElement.style.fontWeight = 'bold'
        }
        if (infoElement) {
          const remaining = 61 - elapsed
          infoElement.textContent = `${Math.ceil(remaining)}s remaining`
          infoElement.style.color = '#ffaa00'
        }
      } else if (elapsed >= 50 && elapsed < 51) {
        // Pre-countdown phase
        timerElement.style.color = '#ff9900'
        timerElement.style.textShadow = '0 0 10px #ff9900'

        if (digitElement) {
          digitElement.textContent = '⏳'
          digitElement.style.color = '#ff9900'
          digitElement.style.background = 'rgba(255,150,0,0.2)'
          digitElement.style.transform = 'scale(1.0)'
          digitElement.style.textShadow = 'none'
        }
        if (statusElement) {
          statusElement.textContent = 'Starting countdown...'
          statusElement.style.color = '#ff9900'
          statusElement.style.fontWeight = 'bold'
        }
        if (infoElement) {
          const timeToCountdown = 51 - elapsed
          infoElement.textContent = `Starts in ${Math.ceil(timeToCountdown)}s`
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
          statusElement.textContent = elapsed < 51 ? 'Countdown: 51-61s' : 'Countdown complete'
          statusElement.style.color = '#aaa'
          statusElement.style.fontWeight = 'normal'
        }
        if (infoElement) {
          if (elapsed < 51) {
            const timeToCountdown = 51 - elapsed
            infoElement.textContent = `Starts in ${Math.ceil(timeToCountdown)}s`
            infoElement.style.color = '#888'
          } else {
            infoElement.textContent = '10 digits • 10 seconds'
            infoElement.style.color = '#666'
          }
        }
      }
    }
  }, 100)
}
