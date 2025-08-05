// Clean, production-ready drone show with intro text
'use client'

import { useEffect, useState } from 'react'

import { NewBeginningDemo } from './index.js'

// Clean, production-ready drone show with intro text

export function CleanDroneShow() {
  const [showIntro, setShowIntro] = useState(true)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showText, setShowText] = useState(false)

  const introTexts = ['Thanks for viewing my portfolio', 'I came across this very cool particle effect in React Three.js', 'So I wondered if I could make a drone show simulation using this library', 'It is still not finished', 'I spent too much time on it making it work', 'I am not as good when it comes to learning new stuff', 'But hey, this has been real fun', 'I will finish it up soon by adding more formations', 'Enjoy the short drone show simulation']

  useEffect(() => {
    if (!showIntro) return

    const timer = setTimeout(() => {
      setShowText(true)
    }, 1000) // Show GitHub/LinkedIn first

    return () => clearTimeout(timer)
  }, [showIntro])

  useEffect(() => {
    if (!showText || currentTextIndex >= introTexts.length) {
      if (currentTextIndex >= introTexts.length) {
        // All texts shown, start the drone show
        setTimeout(() => {
          setShowIntro(false)
        }, 2000)
      }
      return
    }

    const timer = setTimeout(() => {
      setCurrentTextIndex((prev) => prev + 1)
    }, 2500) // Each text shows for 2.5 seconds

    return () => clearTimeout(timer)
  }, [showText, currentTextIndex, introTexts.length])

  if (showIntro) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background particles effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%)
          `,
            animation: 'pulse 4s ease-in-out infinite alternate',
          }}
        />

        {/* GitHub and LinkedIn links */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            marginBottom: '60px',
            opacity: 1,
            animation: 'fadeInUp 1s ease-out',
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
              fontWeight: '600',
              padding: '12px 24px',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.6)'
              e.target.style.background = 'rgba(255,255,255,0.1)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.2)'
              e.target.style.background = 'rgba(255,255,255,0.05)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
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
              fontWeight: '600',
              padding: '12px 24px',
              border: '2px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(10px)',
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.6)'
              e.target.style.background = 'rgba(255,255,255,0.1)'
              e.target.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = 'rgba(255,255,255,0.2)'
              e.target.style.background = 'rgba(255,255,255,0.05)'
              e.target.style.transform = 'translateY(0)'
            }}
          >
            LinkedIn
          </a>
        </div>

        {/* Intro text */}
        {showText && currentTextIndex < introTexts.length && (
          <div
            style={{
              maxWidth: '800px',
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            <p
              style={{
                fontSize: '28px',
                lineHeight: '1.6',
                margin: 0,
                opacity: 1,
                animation: 'fadeInUp 0.8s ease-out',
                background: 'linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontWeight: '400',
              }}
            >
              {introTexts[currentTextIndex]}
            </p>
          </div>
        )}

        {/* Progress indicator */}
        {showText && (
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
            }}
          >
            {introTexts.map((_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index <= currentTextIndex ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* Skip button */}
        <button
          onClick={() => setShowIntro(false)}
          style={{
            position: 'absolute',
            top: '30px',
            right: '30px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)'
            e.target.style.borderColor = 'rgba(255,255,255,0.4)'
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)'
            e.target.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
        >
          Skip Intro
        </button>

        <style jsx>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes pulse {
            from {
              opacity: 0.4;
            }
            to {
              opacity: 0.8;
            }
          }
        `}</style>
      </div>
    )
  }

  return <NewBeginningDemo />
}
