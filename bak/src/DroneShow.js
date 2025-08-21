'use client'

import { useEffect, useState } from 'react'

import { DroneScene } from './Scene.js'

export function DroneShow() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showText, setShowText] = useState(true)
  const [textOpacity, setTextOpacity] = useState(0)

  // GLOBAL SPEED CONTROL - Easy to adjust entire show timing
  const SHOW_SPEED_MULTIPLIER = 1.0 // 1.0 = normal speed, 2.0 = 2x faster, 0.5 = half speed

  const introTexts = [
    // // 'Thanks for viewing my portfolio', //
    // // 'I came across this very cool particle effect in React Three.js',
    // // 'So I wondered if I could make a drone show simulation using this library',
    // // 'It is still not finished',
    // // 'I spent too much time on it making it work',
    // // 'I am not as good when it comes to learning new stuff',
    // // 'But hey, this has been real fun',
    // // 'I will finish it up soon by adding more formations',
    // // 'Enjoy the short drone show simulation',
    // 'Thank you for viewing my portfolio', //
    // 'Made this drone show using React Three Fiber', //
    // 'Hope you like it', //
    // // 'enjoy', //
    'Thank You', //
  ]

  useEffect(() => {
    if (!showText) return

    // Links removed

    // Handle text sequence - each text shows for longer duration with proper fade timing
    if (currentTextIndex >= 0 && currentTextIndex < introTexts.length) {
      // Add extra delay for the first text only
      const initialDelay = currentTextIndex === 0 ? 3000 : 1500

      const fadeInTimer = setTimeout(() => {
        setTextOpacity(1)
      }, initialDelay) // Start first text after 3 seconds, others after 1.5 seconds

      const fadeOutTimer = setTimeout(() => {
        setTextOpacity(0)
      }, initialDelay + 5000) // Show text for 5 seconds after fade-in (increased from 2.5s)

      const nextTimer = setTimeout(() => {
        if (currentTextIndex < introTexts.length - 1) {
          setCurrentTextIndex((prev) => prev + 1)
        } else {
          // All texts shown, hide overlay
          setShowText(false)
        }
      }, initialDelay + 7000) // Wait 2s after fade out before next text (increased total duration)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(nextTimer)
      }
    }

    // Links timer removed
  }, [currentTextIndex, showText, introTexts.length])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Drone show canvas - always visible */}
      <DroneScene speedMultiplier={SHOW_SPEED_MULTIPLIER} />

      {/* Cinematic text overlay - centered */}
      {showText && currentTextIndex >= 0 && currentTextIndex < introTexts.length && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            style={{
              maxWidth: '900px',
              textAlign: 'center',
              padding: '0 60px',
              opacity: textOpacity,
              transition: 'opacity 1.5s ease-in-out',
            }}
          >
            <p
              style={{
                fontSize: '36px',
                lineHeight: '1.4',
                margin: 0,
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: '300',
                textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)',
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              }}
            >
              {introTexts[currentTextIndex]}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
