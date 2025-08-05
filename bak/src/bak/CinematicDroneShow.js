'use client'

import { useEffect, useState } from 'react'

import { NewBeginningDemo } from './index.js'

export function CinematicDroneShow() {
  const [currentTextIndex, setCurrentTextIndex] = useState(-1) // Start with -1 for initial delay
  const [showText, setShowText] = useState(true)
  const [textOpacity, setTextOpacity] = useState(0)

  const introTexts = [
    'Thanks for viewing my portfolio', //
    'I came across this very cool particle effect in React Three.js',
    'So I wondered if I could make a drone show simulation using this library',
    'It is still not finished',
    'I spent too much time working on it',
    'I am not as good when it comes to learning new stuff',
    'But hey, it has been real fun',
    'I will finish it up soon by adding more formations',
    'Enjoy the short drone show simulation',
  ]

  useEffect(() => {
    if (!showText) return

    // Initial delay before first text
    if (currentTextIndex === -1) {
      const delayTimer = setTimeout(() => {
        setCurrentTextIndex(0) // Start first text after delay
      }, 2000) // 2 second delay before first text

      return () => {
        clearTimeout(delayTimer)
      }
    }

    // Handle text sequence
    if (currentTextIndex >= 0 && currentTextIndex < introTexts.length) {
      const fadeInTimer = setTimeout(() => {
        setTextOpacity(1)
      }, 500)

      const fadeOutTimer = setTimeout(() => {
        setTextOpacity(0)
      }, 3000) // Show text for 3 seconds

      const nextTimer = setTimeout(() => {
        if (currentTextIndex < introTexts.length - 1) {
          setCurrentTextIndex((prev) => prev + 1)
        } else {
          // All texts shown, hide overlay
          setShowText(false)
        }
      }, 4000) // 4 seconds total per text (including fade)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(nextTimer)
      }
    }
  }, [currentTextIndex, showText, introTexts.length])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Drone show canvas - always visible */}
      <NewBeginningDemo />

      {/* Cinematic text overlay */}
      {showText && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 10,
            background: 'transparent',
          }}
        >
          {/* Cinematic text overlay */}
          {currentTextIndex >= 0 && currentTextIndex < introTexts.length && (
            <div
              style={{
                maxWidth: '900px',
                textAlign: 'center',
                padding: '0 60px',
                opacity: textOpacity,
                transition: 'opacity 1.5s ease-in-out',
                pointerEvents: 'none',
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
          )}
        </div>
      )}

      {/* Skip button - always visible during intro */}
      {showText && (
        <button
          onClick={() => setShowText(false)}
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            zIndex: 20,
            fontFamily: 'system-ui, -apple-system, sans-serif',
            textShadow: '0 1px 2px rgba(0,0,0,0.8)',
            pointerEvents: 'auto',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)'
            e.target.style.borderColor = 'rgba(255,255,255,0.6)'
            e.target.style.transform = 'translateY(-2px)'
            e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(0,0,0,0.7)'
            e.target.style.borderColor = 'rgba(255,255,255,0.3)'
            e.target.style.transform = 'translateY(0)'
            e.target.style.boxShadow = 'none'
          }}
        >
          Skip Intro
        </button>
      )}

      {/* Subtle progress indicator */}
      {showText && currentTextIndex >= 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '50px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            zIndex: 15,
            pointerEvents: 'none',
          }}
        >
          {introTexts.map((_, index) => (
            <div
              key={index}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: index <= currentTextIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.5s ease',
                boxShadow: index <= currentTextIndex ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
