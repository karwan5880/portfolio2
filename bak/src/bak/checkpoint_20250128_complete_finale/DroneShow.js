'use client'

import { useAudioStore } from '../../../stores/audioStore.js'
import { useEffect, useState } from 'react'

import { DroneScene } from './Scene.js'

export function DroneShow() {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [showText, setShowText] = useState(true)
  const [textOpacity, setTextOpacity] = useState(0)
  const [showFinaleText, setShowFinaleText] = useState(false)
  const [finaleTextOpacity, setFinaleTextOpacity] = useState(0)
  const [finaleLineIndex, setFinaleLineIndex] = useState(0)

  // Audio system integration
  const { startExperience, isInitialized, grantPermission } = useAudioStore()

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

  // Initialize audio system when component mounts
  useEffect(() => {
    // Grant permission and start audio experience
    grantPermission()

    // Small delay to ensure everything is ready
    const audioTimer = setTimeout(() => {
      if (!isInitialized) {
        startExperience()
      }
    }, 1000)

    return () => clearTimeout(audioTimer)
  }, [grantPermission, startExperience, isInitialized])

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

  // Handle finale text sequential reveal
  useEffect(() => {
    // Show first line after 130 seconds (10 seconds into finale - after drones fly out)
    const firstLineTimer = setTimeout(
      () => {
        setShowFinaleText(true)
        setFinaleLineIndex(0)

        // Fade in first line
        const fadeInTimer = setTimeout(() => {
          setFinaleTextOpacity(1)
        }, 500)

        // Show second line after 5 seconds (slower pacing)
        const secondLineTimer = setTimeout(() => {
          setFinaleLineIndex(1)
        }, 5000)

        // Show third line after 10 seconds (even slower)
        const thirdLineTimer = setTimeout(() => {
          setFinaleLineIndex(2)
        }, 10000)

        return () => {
          clearTimeout(fadeInTimer)
          clearTimeout(secondLineTimer)
          clearTimeout(thirdLineTimer)
        }
      },
      (130 * 1000) / SHOW_SPEED_MULTIPLIER
    ) // 130 seconds adjusted for speed (10 seconds into finale)

    return () => clearTimeout(firstLineTimer)
  }, [SHOW_SPEED_MULTIPLIER])

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Drone show canvas - always visible */}
      <DroneScene speedMultiplier={SHOW_SPEED_MULTIPLIER} />

      {/* Music control overlay - subtle and unobtrusive */}
      <MusicControl />

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

      {/* Finale "THANK YOU" text overlay - appears after drone finale */}
      {showFinaleText && (
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
            zIndex: 20,
          }}
        >
          <div
            style={{
              maxWidth: '1200px', // Increased from 900px to prevent wrapping
              textAlign: 'center',
              padding: '0 60px',
              opacity: finaleTextOpacity,
              transition: 'opacity 2s ease-in-out',
            }}
          >
            {/* Line 1: Wonderful Day - Always reserve space */}
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
                opacity: finaleLineIndex >= 0 ? 1 : 0,
                transform: finaleLineIndex >= 0 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
                minHeight: '50px', // Reserve space to prevent layout shift
              }}
            >
              {finaleLineIndex >= 0 ? '☆(ゝω・)vキャピ   Hope You Have A Wonderful Day   (◕‿◕)♡' : ''}
            </p>

            {/* Line 2: Be Happy - Always reserve space */}
            <p
              style={{
                fontSize: '36px',
                lineHeight: '1.4',
                margin: '20px 0 0 0',
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: '300',
                textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)',
                letterSpacing: '0.5px',
                opacity: finaleLineIndex >= 1 ? 1 : 0,
                transform: finaleLineIndex >= 1 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
                minHeight: '50px', // Reserve space to prevent layout shift
              }}
            >
              {finaleLineIndex >= 1 ? 'ヽ(´▽`)/   Be Happy   (＾◡＾)っ' : ''}
            </p>

            {/* Line 3: Traffic - Always reserve space */}
            <p
              style={{
                fontSize: '36px',
                lineHeight: '1.4',
                margin: '20px 0 0 0',
                color: '#ffffff',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontWeight: '300',
                textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)',
                letterSpacing: '0.5px',
                opacity: finaleLineIndex >= 2 ? 1 : 0,
                transform: finaleLineIndex >= 2 ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 1.5s ease-out, transform 1.5s ease-out',
                minHeight: '50px', // Reserve space to prevent layout shift
              }}
            >
              {finaleLineIndex >= 2 ? "(╯°□°）╯   Don't Get Stuck In Traffic   ＼(^o^)／" : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// Simple music control component
function MusicControl() {
  const { isPlaying, togglePlayback, isInitialized } = useAudioStore()

  if (!isInitialized) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30px',
        right: '30px',
        zIndex: 30,
        opacity: 0.7,
        transition: 'opacity 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.opacity = '1')}
      onMouseLeave={(e) => (e.target.style.opacity = '0.7')}
    >
      <button
        onClick={togglePlayback}
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          color: 'white',
          fontSize: '18px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)'
          e.target.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(0, 0, 0, 0.6)'
          e.target.style.transform = 'scale(1)'
        }}
        title={isPlaying ? 'Pause Music' : 'Play Music'}
      >
        {isPlaying ? '⏸️' : '▶️'}
      </button>
    </div>
  )
}
