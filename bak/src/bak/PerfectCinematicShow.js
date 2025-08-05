'use client'

import { useEffect, useState } from 'react'

import { NewBeginningDemo } from './index.js'

export function PerfectCinematicShow() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showText, setShowText] = useState(true)
  const [textOpacity, setTextOpacity] = useState(0)
  const [linksOpacity, setLinksOpacity] = useState(0)

  const introTexts = ['Thanks for viewing my portfolio', 'I came across this very cool particle effect in React Three.js', 'So I wondered if I could make a drone show simulation using this library', 'It is still not finished', 'I spent too much time on it making it work', 'I am not as good when it comes to learning new stuff', 'But hey, this has been real fun', 'I will finish it up soon by adding more formations', 'Enjoy the short drone show simulation']

  useEffect(() => {
    if (!showText) return

    // Show GitHub/LinkedIn links immediately
    const linksTimer = setTimeout(() => {
      setLinksOpacity(1)
    }, 1000)

    // Handle text sequence - each text shows for 5 seconds
    if (currentTextIndex >= 0 && currentTextIndex < introTexts.length) {
      const fadeInTimer = setTimeout(() => {
        setTextOpacity(1)
      }, 2000) // Start text after links appear

      const fadeOutTimer = setTimeout(() => {
        setTextOpacity(0)
      }, 6000) // Show text for 5 seconds (2s + 4s)

      const nextTimer = setTimeout(() => {
        if (currentTextIndex < introTexts.length - 1) {
          setCurrentTextIndex((prev) => prev + 1)
        } else {
          // All texts shown, hide overlay
          setShowText(false)
        }
      }, 7500) // Wait 1.5s after fade out before next text (fixes overlap bug)

      return () => {
        clearTimeout(fadeInTimer)
        clearTimeout(fadeOutTimer)
        clearTimeout(nextTimer)
      }
    }

    return () => clearTimeout(linksTimer)
  }, [currentTextIndex, showText, introTexts.length])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Drone show canvas - always visible */}
      <NewBeginningDemo />

      {/* GitHub and LinkedIn links - always visible during intro, positioned at top */}
      {showText && (
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '80px',
            opacity: linksOpacity,
            transition: 'opacity 1.5s ease-in-out',
            zIndex: 15,
            pointerEvents: 'auto',
          }}
        >
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '500',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              opacity: 0.85,
              position: 'relative',
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '1'
              e.target.style.transform = 'translateY(-3px) scale(1.05)'
              e.target.style.textShadow = '0 6px 25px rgba(100,200,255,0.4), 0 2px 10px rgba(0,0,0,0.8)'
              e.target.style.background = 'linear-gradient(135deg, rgba(100,200,255,0.15) 0%, rgba(255,255,255,0.08) 100%)'
              e.target.style.borderColor = 'rgba(100,200,255,0.3)'
              e.target.style.boxShadow = '0 8px 32px rgba(100,200,255,0.2), 0 0 0 1px rgba(100,200,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '0.85'
              e.target.style.transform = 'translateY(0) scale(1.0)'
              e.target.style.textShadow = '0 2px 10px rgba(0,0,0,0.8)'
              e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
              e.target.style.borderColor = 'rgba(255,255,255,0.1)'
              e.target.style.boxShadow = 'none'
            }}
          >
            <span style={{ marginRight: '8px' }}>⚡</span>
            GitHub
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: '#ffffff',
              textDecoration: 'none',
              fontSize: '24px',
              fontWeight: '500',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
              opacity: 0.85,
              position: 'relative',
              padding: '8px 16px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '1'
              e.target.style.transform = 'translateY(-3px) scale(1.05)'
              e.target.style.textShadow = '0 6px 25px rgba(0,150,255,0.4), 0 2px 10px rgba(0,0,0,0.8)'
              e.target.style.background = 'linear-gradient(135deg, rgba(0,150,255,0.15) 0%, rgba(255,255,255,0.08) 100%)'
              e.target.style.borderColor = 'rgba(0,150,255,0.3)'
              e.target.style.boxShadow = '0 8px 32px rgba(0,150,255,0.2), 0 0 0 1px rgba(0,150,255,0.1)'
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '0.85'
              e.target.style.transform = 'translateY(0) scale(1.0)'
              e.target.style.textShadow = '0 2px 10px rgba(0,0,0,0.8)'
              e.target.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
              e.target.style.borderColor = 'rgba(255,255,255,0.1)'
              e.target.style.boxShadow = 'none'
            }}
          >
            <span style={{ marginRight: '8px' }}>💼</span>
            LinkedIn
          </a>
        </div>
      )}

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
