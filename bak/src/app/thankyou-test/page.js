'use client'

import React, { useState } from 'react'

export default function ThankYouTestPage() {
  const [activeEffect, setActiveEffect] = useState(null)
  const [showParticles, setShowParticles] = useState({})

  // Add animations
  React.useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      /* Current Design - Drone Swarm */
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

      /* 1. Ripple Wave Effect */
      @keyframes rippleWave {
        0% { 
          transform: translate(-50%, -50%) scale(0); 
          opacity: 1; 
        }
        100% { 
          transform: translate(-50%, -50%) scale(var(--scale)); 
          opacity: 0; 
        }
      }

      @keyframes rippleDrone {
        0% { 
          transform: translate(0, 0) scale(0); 
          opacity: 0; 
        }
        20% { 
          opacity: 1; 
          transform: translate(0, 0) scale(1); 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.2); 
          opacity: 0; 
        }
      }

      /* 2. Text Transformation */
      @keyframes letterMorph {
        0% { 
          transform: scale(1) rotate(0deg); 
          opacity: 1; 
        }
        50% { 
          transform: scale(1.5) rotate(180deg); 
          opacity: 0.5; 
        }
        100% { 
          transform: scale(0) rotate(360deg); 
          opacity: 0; 
        }
      }

      @keyframes newLetterAppear {
        0% { 
          transform: scale(0) rotate(-180deg); 
          opacity: 0; 
        }
        50% { 
          transform: scale(1.2) rotate(0deg); 
          opacity: 0.8; 
        }
        100% { 
          transform: scale(1) rotate(0deg); 
          opacity: 1; 
        }
      }

      /* 3. Gravity Well Effect */
      @keyframes gravityImplode {
        0% { 
          transform: scale(1); 
          opacity: 1; 
        }
        70% { 
          transform: scale(0.1); 
          opacity: 1; 
        }
        100% { 
          transform: scale(0); 
          opacity: 0; 
        }
      }

      @keyframes gravityExplode {
        0% { 
          transform: translate(0, 0) scale(0); 
          opacity: 1; 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.3); 
          opacity: 0; 
        }
      }

      /* 4. Typewriter Reverse */
      @keyframes typewriterDelete {
        0% { 
          width: 100%; 
          opacity: 1; 
        }
        100% { 
          width: 0%; 
          opacity: 0; 
        }
      }

      @keyframes characterDrone {
        0% { 
          transform: translate(0, 0) scale(1); 
          opacity: 1; 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.2); 
          opacity: 0; 
        }
      }

      /* 5. Constellation Formation */
      @keyframes starPoint {
        0% { 
          transform: translate(0, 0) scale(1); 
          opacity: 1; 
        }
        50% { 
          transform: translate(var(--constellation-x), var(--constellation-y)) scale(1.5); 
          opacity: 1; 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.2); 
          opacity: 0; 
        }
      }

      /* 6. Matrix Digital Rain */
      @keyframes digitalRain {
        0% { 
          transform: translateY(0) scale(1); 
          opacity: 1; 
        }
        50% { 
          transform: translateY(100px) scale(0.8); 
          opacity: 0.8; 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.3); 
          opacity: 0; 
        }
      }

      /* 7. Origami Unfold */
      @keyframes origamiFold {
        0% { 
          transform: scale(1) rotateX(0deg) rotateY(0deg); 
          opacity: 1; 
        }
        25% { 
          transform: scale(0.8) rotateX(45deg) rotateY(45deg); 
          opacity: 0.8; 
        }
        50% { 
          transform: scale(0.6) rotateX(90deg) rotateY(90deg); 
          opacity: 0.6; 
        }
        75% { 
          transform: scale(0.4) rotateX(135deg) rotateY(135deg); 
          opacity: 0.4; 
        }
        100% { 
          transform: scale(0) rotateX(180deg) rotateY(180deg); 
          opacity: 0; 
        }
      }

      @keyframes origamiDrone {
        0% { 
          transform: translate(0, 0) scale(0) rotateZ(0deg); 
          opacity: 0; 
        }
        20% { 
          transform: translate(0, 0) scale(1) rotateZ(90deg); 
          opacity: 1; 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.2) rotateZ(360deg); 
          opacity: 0; 
        }
      }

      /* 8. Sound Wave Visualization */
      @keyframes soundWave {
        0% { 
          transform: translate(-50%, -50%) scaleX(0) scaleY(1); 
          opacity: 1; 
        }
        100% { 
          transform: translate(-50%, -50%) scaleX(var(--wave-width)) scaleY(0.1); 
          opacity: 0; 
        }
      }

      @keyframes waveDrone {
        0% { 
          transform: translate(0, 0) scale(0); 
          opacity: 0; 
        }
        30% { 
          opacity: 1; 
          transform: translate(0, 0) scale(1); 
        }
        100% { 
          transform: translate(var(--dx), var(--dy)) scale(0.3); 
          opacity: 0; 
        }
      }

      /* Common animations */
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

      @keyframes textDissolve {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const handleEffectClick = (effectName) => {
    setActiveEffect(effectName)
    setShowParticles((prev) => ({ ...prev, [effectName]: true }))

    // Reset after animation
    setTimeout(() => {
      setActiveEffect(null)
      setShowParticles((prev) => ({ ...prev, [effectName]: false }))
    }, 5000)
  }

  const effects = [
    {
      name: 'current',
      title: 'Current Design - Drone Swarm',
      description: 'Simple fade + 300 colorful drones burst out',
    },
    {
      name: 'ripple',
      title: '1. Ripple Wave Effect',
      description: 'Expanding ripple waves spawn drones at different distances',
    },
    {
      name: 'transform',
      title: '2. Text Transformation',
      description: '"Thank You" morphs letter-by-letter into "FINALE"',
    },
    {
      name: 'gravity',
      title: '3. Gravity Well Effect',
      description: 'Text implodes then explodes outward dramatically',
    },
    {
      name: 'typewriter',
      title: '4. Typewriter Reverse',
      description: 'Text "untypes" itself, each character becomes drones',
    },
    {
      name: 'constellation',
      title: '5. Constellation Formation',
      description: 'Text breaks into stars, forms constellation, then explodes',
    },
    {
      name: 'matrix',
      title: '6. Matrix Digital Rain',
      description: 'Text dissolves into falling digital characters',
    },
    {
      name: 'origami',
      title: '7. Origami Unfold',
      description: 'Text appears to be paper that unfolds into geometric shapes',
    },
    {
      name: 'soundwave',
      title: '8. Sound Wave Visualization',
      description: 'Text vibrates and creates visible sound waves',
    },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(10, 10, 10, 0.9) 100%)',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '1rem 2rem',
          zIndex: 1000,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#00ff9d' }}>Thank You Effect Showcase</h1>
        <p style={{ margin: '0.5rem 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>Click any "Thank You" text below to see the effect</p>
      </div>

      {/* Effects Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          padding: '6rem 2rem 2rem 2rem',
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {effects.map((effect) => (
          <EffectDemo key={effect.name} effect={effect} isActive={activeEffect === effect.name} showParticles={showParticles[effect.name]} onClick={() => handleEffectClick(effect.name)} />
        ))}
      </div>
    </div>
  )
}

function EffectDemo({ effect, isActive, showParticles, onClick }) {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '2rem',
        minHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Effect Info */}
      <div style={{ marginBottom: '2rem' }}>
        <h3
          style={{
            margin: '0 0 0.5rem 0',
            color: '#00ff9d',
            fontSize: '1.1rem',
          }}
        >
          {effect.title}
        </h3>
        <p
          style={{
            margin: 0,
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            lineHeight: '1.4',
          }}
        >
          {effect.description}
        </p>
      </div>

      {/* Effect Demo Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          minHeight: '150px',
        }}
      >
        {/* Thank You Text */}
        <ThankYouText effectName={effect.name} isActive={isActive} onClick={onClick} />

        {/* Particles */}
        {showParticles && <ParticleSystem effectName={effect.name} />}
      </div>
    </div>
  )
}

function ThankYouText({ effectName, isActive, onClick }) {
  const getTextAnimation = () => {
    if (!isActive) return 'fadeInUp 2s ease-out'

    switch (effectName) {
      case 'current':
        return 'textDissolve 2s ease-out forwards'
      case 'ripple':
        return 'textDissolve 3s ease-out forwards'
      case 'transform':
        return 'letterMorph 2s ease-out forwards'
      case 'gravity':
        return 'gravityImplode 1.5s ease-out forwards'
      case 'typewriter':
        return 'typewriterDelete 2s ease-out forwards'
      case 'constellation':
        return 'textDissolve 3s ease-out forwards'
      case 'matrix':
        return 'textDissolve 2.5s ease-out forwards'
      case 'origami':
        return 'origamiFold 2s ease-out forwards'
      case 'soundwave':
        return 'textDissolve 2s ease-out forwards'
      default:
        return 'textDissolve 2s ease-out forwards'
    }
  }

  return (
    <span
      onClick={onClick}
      style={{
        fontSize: 'clamp(1.5rem, 4vw, 2rem)',
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
        animation: getTextAnimation(),
        transition: isActive ? 'none' : 'all 0.3s ease',
        transform: isActive ? 'none' : 'scale(1)',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.target.style.transform = 'scale(1.05)'
          e.target.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))'
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.target.style.transform = 'scale(1)'
          e.target.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
        }
      }}
    >
      {effectName === 'transform' && isActive ? 'FINALE' : 'Thank You'}
    </span>
  )
}

function ParticleSystem({ effectName }) {
  const generateParticles = () => {
    const particles = []
    const colors = ['#00ff9d', '#4a9eff', '#ff6b35', '#ffd60a', '#9d4edd', '#ffffff', '#00d4aa', '#ff8c42', '#6bb6ff', '#b084cc']

    switch (effectName) {
      case 'current':
        // 300 drone particles
        for (let i = 0; i < 300; i++) {
          const angle = Math.random() * 360 * (Math.PI / 180)
          const distance = 150 + Math.random() * 300
          const dx = Math.cos(angle) * distance
          const dy = Math.sin(angle) * distance
          const size = 2 + Math.random() * 5
          const duration = 3 + Math.random() * 4
          const delay = Math.random() * 0.8
          const color = colors[Math.floor(Math.random() * colors.length)]

          particles.push(
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
                animation: `droneSwarm ${duration}s ease-out ${delay}s forwards`,
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
                zIndex: 8,
                boxShadow: `0 0 ${size * 2}px ${color}40`,
              }}
            />
          )
        }
        break

      case 'ripple':
        // Ripple waves + drones
        for (let wave = 0; wave < 3; wave++) {
          particles.push(
            <div
              key={`wave-${wave}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '4px',
                height: '4px',
                border: '2px solid rgba(0, 255, 157, 0.6)',
                borderRadius: '50%',
                animation: `rippleWave 2s ease-out ${wave * 0.3}s forwards`,
                '--scale': `${20 + wave * 10}`,
                zIndex: 5,
              }}
            />
          )
        }

        // Drones spawned by ripples
        for (let i = 0; i < 150; i++) {
          const angle = Math.random() * 360 * (Math.PI / 180)
          const distance = 100 + Math.random() * 250
          const dx = Math.cos(angle) * distance
          const dy = Math.sin(angle) * distance
          const size = 2 + Math.random() * 4
          const delay = Math.random() * 1.5
          const color = colors[Math.floor(Math.random() * colors.length)]

          particles.push(
            <div
              key={`ripple-drone-${i}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `rippleDrone 3s ease-out ${delay}s forwards`,
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
                zIndex: 8,
              }}
            />
          )
        }
        break

      case 'gravity':
        // Gravity explosion particles
        for (let i = 0; i < 200; i++) {
          const angle = Math.random() * 360 * (Math.PI / 180)
          const distance = 200 + Math.random() * 400
          const dx = Math.cos(angle) * distance
          const dy = Math.sin(angle) * distance
          const size = 2 + Math.random() * 6
          const delay = 1.5 + Math.random() * 0.5 // After implosion
          const color = colors[Math.floor(Math.random() * colors.length)]

          particles.push(
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `gravityExplode 2s ease-out ${delay}s forwards`,
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
                zIndex: 8,
                boxShadow: `0 0 ${size * 3}px ${color}60`,
              }}
            />
          )
        }
        break

      case 'typewriter':
        // Character-based drones
        const text = 'Thank You'
        for (let charIndex = 0; charIndex < text.length; charIndex++) {
          for (let i = 0; i < 15; i++) {
            const angle = Math.random() * 360 * (Math.PI / 180)
            const distance = 80 + Math.random() * 150
            const dx = Math.cos(angle) * distance
            const dy = Math.sin(angle) * distance
            const size = 2 + Math.random() * 4
            const delay = charIndex * 0.2 + Math.random() * 0.3
            const color = colors[Math.floor(Math.random() * colors.length)]

            particles.push(
              <div
                key={`char-${charIndex}-${i}`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: `${size}px`,
                  height: `${size}px`,
                  background: color,
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `characterDrone 2s ease-out ${delay}s forwards`,
                  '--dx': `${dx}px`,
                  '--dy': `${dy}px`,
                  zIndex: 8,
                }}
              />
            )
          }
        }
        break

      case 'constellation':
        // Star points that form constellation then explode
        for (let i = 0; i < 100; i++) {
          const angle = Math.random() * 360 * (Math.PI / 180)
          const constellationDistance = 50 + Math.random() * 100
          const constellationX = Math.cos(angle) * constellationDistance
          const constellationY = Math.sin(angle) * constellationDistance

          const finalDistance = 200 + Math.random() * 300
          const dx = Math.cos(angle) * finalDistance
          const dy = Math.sin(angle) * finalDistance

          const size = 2 + Math.random() * 5
          const delay = Math.random() * 0.5
          const color = colors[Math.floor(Math.random() * colors.length)]

          particles.push(
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `starPoint 4s ease-out ${delay}s forwards`,
                '--constellation-x': `${constellationX}px`,
                '--constellation-y': `${constellationY}px`,
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
                zIndex: 8,
                boxShadow: `0 0 ${size * 2}px ${color}80`,
              }}
            />
          )
        }
        break

      case 'matrix':
        // Digital rain effect
        for (let i = 0; i < 120; i++) {
          const angle = Math.random() * 360 * (Math.PI / 180)
          const distance = 150 + Math.random() * 250
          const dx = Math.cos(angle) * distance
          const dy = Math.sin(angle) * distance + 100 // Start from falling position
          const size = 2 + Math.random() * 4
          const delay = Math.random() * 1
          const color = i % 3 === 0 ? '#00ff9d' : colors[Math.floor(Math.random() * colors.length)]

          particles.push(
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `digitalRain 3s ease-out ${delay}s forwards`,
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
                zIndex: 8,
              }}
            />
          )
        }
        break

      case 'origami':
        // Geometric origami pieces
        for (let i = 0; i < 80; i++) {
          const angle = Math.random() * 360 * (Math.PI / 180)
          const distance = 150 + Math.random() * 300
          const dx = Math.cos(angle) * distance
          const dy = Math.sin(angle) * distance
          const size = 3 + Math.random() * 6
          const delay = Math.random() * 1
          const color = colors[Math.floor(Math.random() * colors.length)]

          particles.push(
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                transform: 'translate(-50%, -50%)',
                animation: `origamiDrone 3s ease-out ${delay}s forwards`,
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
                zIndex: 8,
                clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', // Triangle shape
              }}
            />
          )
        }
        break

      case 'soundwave':
        // Sound wave rings + drones
        for (let wave = 0; wave < 5; wave++) {
          particles.push(
            <div
              key={`soundwave-${wave}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '2px',
                height: '20px',
                background: 'rgba(0, 255, 157, 0.6)',
                animation: `soundWave 2s ease-out ${wave * 0.1}s forwards`,
                '--wave-width': `${30 + wave * 10}`,
                zIndex: 5,
              }}
            />
          )
        }

        // Wave-carried drones
        for (let i = 0; i < 100; i++) {
          const angle = Math.random() * 360 * (Math.PI / 180)
          const distance = 120 + Math.random() * 200
          const dx = Math.cos(angle) * distance
          const dy = Math.sin(angle) * distance
          const size = 2 + Math.random() * 4
          const delay = Math.random() * 1.5
          const color = colors[Math.floor(Math.random() * colors.length)]

          particles.push(
            <div
              key={`wave-drone-${i}`}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${size}px`,
                height: `${size}px`,
                background: color,
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `waveDrone 3s ease-out ${delay}s forwards`,
                '--dx': `${dx}px`,
                '--dy': `${dy}px`,
                zIndex: 8,
              }}
            />
          )
        }
        break

      default:
        break
    }

    return particles
  }

  return <>{generateParticles()}</>
}
