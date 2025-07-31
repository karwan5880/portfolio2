'use client'

import { useAudioStore } from '../../../stores/audioStore.js'
import React, { useEffect, useState } from 'react'

import { DroneScene } from './Scene.js'

export function DroneShow() {
  // State management
  const [showEntryOverlay, setShowEntryOverlay] = useState(true)
  const [experienceStarted, setExperienceStarted] = useState(false)
  const [isExploding, setIsExploding] = useState(false)
  const [showExplosionParticles, setShowExplosionParticles] = useState(false)
  const [showTextParticles, setShowTextParticles] = useState(false)

  // Audio integration
  const { startExperience, grantPermission, startPlayback } = useAudioStore()

  // Configuration
  const SHOW_SPEED_MULTIPLIER = 1.0

  // Setup animations and disable scrolling
  React.useEffect(() => {
    document.body.style.overflow = 'hidden'

    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes textDissolve {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      
      @keyframes screenFlash {
        0% { opacity: 0; }
        5% { opacity: 0.3; }
        15% { opacity: 1; }
        100% { opacity: 0; }
      }
      
      @keyframes droneSwarm {
        0% { 
          transform: translate(0, 0) scale(0.5); 
          opacity: 0; 
        }
        10% { 
          opacity: 1; 
          transform: translate(0, 0) scale(1); 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.3); 
          opacity: 0; 
        }
      }
      
      @keyframes radiateGlow {
        0% { 
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.8;
        }
        50% { 
          transform: translate(-50%, -50%) scale(1.1);
          opacity: 0.4;
        }
        100% { 
          transform: translate(-50%, -50%) scale(1.3);
          opacity: 0.1;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
      document.body.style.overflow = 'auto'
    }
  }, [])

  // Handle experience start
  const handleBeginExperience = () => {
    // Start effects immediately
    setIsExploding(true)
    setShowExplosionParticles(true)
    setExperienceStarted(true)

    // Initialize audio
    grantPermission()
    startExperience()

    // Timing sequence
    setTimeout(() => setShowTextParticles(true), 4000) // Text fade starts
    setTimeout(() => setShowEntryOverlay(false), 6500) // Overlay disappears

    // Music starts after 15 seconds
    setTimeout(() => startPlayback(), (15 * 1000) / SHOW_SPEED_MULTIPLIER)
  }

  // Handle hover effects
  const handleMouseEnter = (e) => {
    if (!isExploding && !showTextParticles) {
      e.target.style.transform = 'scale(1.05)'
      e.target.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'

      const glow = e.target.parentElement.querySelector('.hover-glow')
      if (glow) {
        glow.style.opacity = '1'
        glow.style.animation = 'radiateGlow 2s ease-out infinite'
      }
    }
  }

  const handleMouseLeave = (e) => {
    if (!isExploding && !showTextParticles) {
      e.target.style.transform = 'scale(1)'
      e.target.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'

      const glow = e.target.parentElement.querySelector('.hover-glow')
      if (glow) {
        glow.style.opacity = '0'
        glow.style.animation = 'none'
        glow.style.transform = 'translate(-50%, -50%) scale(0)'
      }
    }
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {/* Drone show canvas */}
      {experienceStarted && <DroneScene speedMultiplier={SHOW_SPEED_MULTIPLIER} />}

      {/* Music control */}
      {experienceStarted && <MusicControl />}

      {/* Entry overlay */}
      {showEntryOverlay && <EntryOverlay showTextParticles={showTextParticles} isExploding={isExploding} showExplosionParticles={showExplosionParticles} onBeginExperience={handleBeginExperience} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} />}

      {/* Home button */}
      {experienceStarted && <HomeButton />}
    </div>
  )
}

// Entry overlay component
function EntryOverlay({ showTextParticles, isExploding, showExplosionParticles, onBeginExperience, onMouseEnter, onMouseLeave }) {
  return (
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
        background: showTextParticles ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.3) 0%, rgba(10, 10, 10, 0.2) 100%)' : 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%)',
        zIndex: 100,
        backdropFilter: showTextParticles ? 'blur(5px)' : 'blur(20px)',
        transition: 'all 1s ease-out',
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block' }}>
        {/* Hover glow effect */}
        <div
          className="hover-glow"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '1000px',
            height: '1000px',
            background: 'radial-gradient(circle at center, rgba(0, 255, 157, 0.15) 0%, rgba(0, 255, 157, 0.08) 30%, rgba(0, 255, 157, 0.02) 60%, transparent 100%)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%) scale(0)',
            opacity: 0,
            zIndex: -1,
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease',
          }}
        />

        {/* Thank You text */}
        <span
          onClick={onBeginExperience}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '300',
            color: '#ffffff',
            cursor: 'pointer',
            letterSpacing: '0.05em',
            textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.9)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            position: 'relative',
            zIndex: 10,
            animation: showTextParticles ? 'textDissolve 2s ease-out forwards' : 'fadeInUp 4s ease-out 1s both',
            transition: isExploding ? 'none' : 'all 0.3s ease',
          }}
        >
          Thank You
        </span>

        {/* Screen flash effect */}
        {isExploding && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, rgba(0, 255, 157, 0.1) 0%, transparent 60%)',
              animation: 'screenFlash 3s ease-out forwards',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          />
        )}

        {/* Drone particles */}
        {showExplosionParticles && <DroneParticles />}
      </div>
    </div>
  )
}

// Drone particles component
function DroneParticles() {
  const colors = ['#00ff9d', '#4a9eff', '#ff6b35', '#ffd60a', '#9d4edd', '#ffffff', '#00d4aa', '#ff8c42', '#6bb6ff', '#b084cc']

  return (
    <>
      {Array.from({ length: 300 }, (_, i) => {
        const layer = Math.floor(i / 75)
        const baseDistance = 150 + layer * 200
        const angle = Math.random() * 360 * (Math.PI / 180)
        const distance = baseDistance + Math.random() * 300
        const dx = Math.cos(angle) * distance
        const dy = Math.sin(angle) * distance
        const size = 2 + Math.random() * 5
        const animationDuration = 3 + Math.random() * 4
        const delay = Math.random() * 0.8
        const color = colors[Math.floor(Math.random() * colors.length)]

        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${size}px`,
              height: `${size}px`,
              background: `radial-gradient(circle, ${color} 0%, ${color}80 50%, transparent 100%)`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `droneSwarm ${animationDuration}s ease-out ${delay}s forwards`,
              '--dx': `${dx}px`,
              '--dy': `${dy}px`,
              zIndex: 8,
              boxShadow: `0 0 ${size * 2}px ${color}40`,
            }}
          />
        )
      })}
    </>
  )
}

// Music control component
function MusicControl() {
  const { isPlaying, togglePlayback, isInitialized, startPlayback } = useAudioStore()

  if (!isInitialized) return null

  const handleMusicToggle = () => {
    if (!isPlaying) {
      startPlayback()
    } else {
      togglePlayback()
    }
  }

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
        onClick={handleMusicToggle}
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

// Home button component
function HomeButton() {
  const handleHomeClick = () => {
    window.location.href = '/'
  }

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        zIndex: 30,
        opacity: 0.7,
        transition: 'opacity 0.3s ease',
      }}
      onMouseEnter={(e) => (e.target.style.opacity = '1')}
      onMouseLeave={(e) => (e.target.style.opacity = '0.7')}
    >
      <button
        onClick={handleHomeClick}
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
        title="Go to Home"
      >
        🏠
      </button>
    </div>
  )
}
