'use client'

import { useEffect, useRef, useState } from 'react'

// This should point to the component's CSS
import { useFinaleData } from './FinaleDataProvider'
import styles from './finale.module.css'

// Import the new hook

// This helper can stay here.
const SyntaxHighlightedCode = ({ content }) => {
  if (typeof content !== 'string') return null
  const html = content
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/(const|let|class|return|def|fn|public|static|void)/g, '<span class="keyword">$1</span>')
    .replace(/("[^"]*")/g, '<span class="string">$1</span>')
    .replace(/(\/\/.*|\#.*|\/\*.*\*\/)/g, '<span class="comment">$1</span>')
  return <pre dangerouslySetInnerHTML={{ __html: html }} />
}

// This sub-component is also fine.
const GlitchSnippet = ({ snippet }) => {
  if (!snippet) return null
  return (
    <div className={styles.glitchItem} style={{ top: snippet.top, left: snippet.left }}>
      <div className={styles.codeBlock}>
        <div className={styles.codeTitle}>{snippet.title}</div>
        <SyntaxHighlightedCode content={snippet.code} />
      </div>
    </div>
  )
}

export function GlitchOverlay({ isScrolling }) {
  const [currentGlitch, setCurrentGlitch] = useState(null)
  const glitchIndex = useRef(0)

  // --- THIS IS THE FIX ---
  // Get the data from our provider instead of the old hook.
  const { data, isLoading } = useFinaleData()
  const glitchDataPool = data?.multiStream || [] // Use multiStream as the source

  // The animation timer logic.
  useEffect(() => {
    // Only run if we are active AND the data has loaded.
    if (isScrolling && glitchDataPool.length > 0) {
      const interval = setInterval(() => {
        const nextSnippet = glitchDataPool[glitchIndex.current]

        setCurrentGlitch({
          ...nextSnippet,
          // Add random positioning each time
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
        })

        glitchIndex.current = (glitchIndex.current + 1) % glitchDataPool.length
      }, 3000) // New glitch every 3 seconds

      return () => clearInterval(interval)
    }
  }, [isScrolling, glitchDataPool]) // Effect depends on the data pool now

  // Don't render if we aren't supposed to be scrolling or if data is still loading.
  if (!isScrolling || isLoading) {
    return null
  }

  return (
    <div className={styles.glitchOverlay}>
      <GlitchSnippet snippet={currentGlitch} />
    </div>
  )
}
