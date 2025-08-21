'use client'

import { useEffect, useState } from 'react'

import styles from './Preloader.module.css'

const bootLines = [
  ' ',
  'Initializing Mainframe...',
  'Loading Sentient Background...',
  'Compiling 3D Assets...',
  'Establishing Connection...',
  ' ',
  'Boot sequence complete. Welcome.',
]

export function Preloader({ onBootComplete }) {
  const [visibleLines, setVisibleLines] = useState([])

  useEffect(() => {
    let isMounted = true
    let lineTimeouts = []

    bootLines.forEach((line, index) => {
      const timeout = setTimeout(() => {
        if (isMounted) {
          setVisibleLines((prev) => [...prev, line])
          // If this is the last line, call the completion function
          if (index === bootLines.length - 1) {
            // Wait a little longer on the final message before fading
            setTimeout(onBootComplete, 750)
          }
        }
      }, index * 300) // Adjust delay for typing speed
      lineTimeouts.push(timeout)
    })

    return () => {
      isMounted = false
      lineTimeouts.forEach(clearTimeout)
    }
  }, [onBootComplete])

  return (
    <div className={styles.preloaderWrapper}>
      <div className={styles.bootText}>
        {visibleLines.map((line, index) => (
          <p key={index}>
            {line}
            {line.includes('...') ? '' : ' [ OK ]'}
          </p>
        ))}
        <div className={styles.blinkingCursor}></div>
      </div>
    </div>
  )
}
