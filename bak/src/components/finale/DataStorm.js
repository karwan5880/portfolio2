'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './finale.module.css'
import { useSnippetPool } from '@/hooks/useSnippetPool'

const SyntaxHighlightedCode = ({ content }) => {
  if (typeof content !== 'string') {
    return null
  }
  const html = content
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/(const|let|class|return|def|fn|public|static|void)/g, '<span class="keyword">$1</span>')
    .replace(/("[^"]*")/g, '<span class="string">$1</span>')
    .replace(/(\/\/.*|\#.*|\/\*.*\*\/)/g, '<span class="comment">$1</span>')
  return <pre dangerouslySetInnerHTML={{ __html: html }} />
}

const useParticleSystem = (config, createParticleData) => {
  const [particles, setParticles] = useState([])
  const lastSpawnTime = useRef(0)
  const requestRef = useRef()
  const startTimeRef = useRef(0)
  const totalSpawned = useRef(0)

  useEffect(() => {
    if (config.isActive) {
      startTimeRef.current = 0
      setParticles([])
      totalSpawned.current = 0
    }

    const animate = (currentTime) => {
      if (startTimeRef.current === 0) {
        startTimeRef.current = currentTime
      }
      const elapsedTime = currentTime - startTimeRef.current
      const isBursting = config.pauseDuration === 0 ? true : elapsedTime % (config.burstDuration + config.pauseDuration) < config.burstDuration

      // let batch = []
      // // 2. Loop as many times as we can within a frame
      // while (currentTime - lastSpawnTime.current > config.spawnRate) {
      //   const data = createParticleData()
      //   if (data) {
      //     const scale = Math.random() * 0.7 + 0.5 // Random scale between 0.5 and 1.2
      //     const lifetime = config.particleLifetime * scale + 1000 // e.g., 3500ms to 7000ms
      //     const newParticle = {
      //       id: Math.random(),
      //       data: data,
      //       style: {
      //         // Allows spawning across the entire screen for a full-screen effect
      //         top: `${Math.random() * 120 - 10}%`,
      //         left: `${Math.random() * 120 - 10}%`,
      //         opacity: Math.random() * 0.4 + 0.3,
      //         '--particle-color': `hsl(${Math.random() * 360}, 70%, 70%)`,
      //         '--particle-scale': scale,
      //         '--particle-lifetime': `${lifetime}ms`,
      //         '--x-drift': `${(Math.random() - 0.5) * 40}vw`, // Drifts left/right
      //         '--y-drift': `${(Math.random() - 0.5) * 40}vh`, // Drifts up/down
      //         '--rotation': `${(Math.random() - 0.5) * 60}deg`, // A slight initial tilt
      //         // Sets a random initial opacity for each bubble
      //       },
      //     }
      //     batch.push(newParticle) // 3. Add to batch instead of setting state
      //     totalSpawned.current += 1
      //   } else {
      //     // If we run out of data, stop trying for this frame
      //     break
      //   }
      //   // 4. Update the spawn time for the next iteration in the while loop
      //   lastSpawnTime.current += config.spawnRate
      // }
      // // 5. If the batch has anything, update the state ONCE.
      // if (batch.length > 0) {
      //   setParticles((prev) => [...prev.slice(-400 + batch.length), ...batch])
      // }

      if (isBursting && currentTime - lastSpawnTime.current > config.spawnRate) {
        lastSpawnTime.current = currentTime
        const data = createParticleData()
        if (data) {
          const scale = Math.random() * 0.7 + 0.5 // Random scale between 0.5 and 1.2
          const lifetime = config.particleLifetime * scale + 1000 // e.g., 3500ms to 7000ms
          const newParticle = {
            id: Math.random(),
            data: data,
            style: {
              // Allows spawning across the entire screen for a full-screen effect
              top: `${Math.random() * 120 - 10}%`,
              left: `${Math.random() * 120 - 10}%`,
              opacity: Math.random() * 0.4 + 0.3,
              '--particle-color': `hsl(${Math.random() * 360}, 70%, 70%)`,
              '--particle-scale': scale,
              '--particle-lifetime': `${lifetime}ms`,
              '--x-drift': `${(Math.random() - 0.5) * 40}vw`, // Drifts left/right
              '--y-drift': `${(Math.random() - 0.5) * 40}vh`, // Drifts up/down
              '--rotation': `${(Math.random() - 0.5) * 60}deg`, // A slight initial tilt
              // Sets a random initial opacity for each bubble
            },
          }
          setParticles((prev) => [...prev.slice(-400), newParticle])
          totalSpawned.current += 1
        }
      }
      requestRef.current = requestAnimationFrame(animate)
    }

    if (config.isActive) {
      requestRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [config, createParticleData])

  return { particles, totalSpawned }
}

export function DataStorm({ isActive, particleLifetime = 5000, cname = 'c0' }) {
  const { getSnippet } = useSnippetPool()
  const [targetCoords, setTargetCoords] = useState({ x: '50%', y: '50%' })

  // This new state triggers the final "Gravity Well" animation
  const [isCollapsing, setIsCollapsing] = useState(false)

  // When the storm is no longer active, trigger the collapse instead of disappearing
  useEffect(() => {
    if (!isActive) {
      setIsCollapsing(true)
    }
  }, [isActive])

  const config = useMemo(
    () => ({
      isActive,
      spawnRate: 5,
      particleLifetime,
      burstDuration: 2000,
      pauseDuration: 0, // Continuous spawning
    }),
    [isActive, particleLifetime]
  )

  const { particles, totalSpawned } = useParticleSystem(config, getSnippet)

  if (isActive) {
    console.log(`Active Particles: ${particles.length} / 400 | Total Spawned: ${totalSpawned.current} | ${cname}`)
  }

  // Keep the component rendered while it's collapsing
  if (!isActive && !isCollapsing) {
    return null
  }

  return (
    <div className={styles.dataStormOverlay}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          // Add the .collapsing class when the final animation should play
          className={`${styles.stormBlock} ${isCollapsing ? styles.collapsing : ''}`}
          style={{ ...particle.style, '--particle-lifetime': `${particleLifetime}ms` }}
        >
          <div className={styles.codeTitle}>{particle.data.title}</div>
          <SyntaxHighlightedCode content={particle.data.code} />
        </div>
      ))}
    </div>
  )
}
