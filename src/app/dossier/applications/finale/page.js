// app/dossier/applications/finale/page.js
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import styles from './finale.module.css'

// app/dossier/applications/finale/page.js

// app/dossier/applications/finale/page.js

const finalMessage = '> Status: Still building.'

export default function FinalePage() {
  const [text, setText] = useState('')
  const [showLinks, setShowLinks] = useState(false)

  useEffect(() => {
    // Typing animation for the final message
    const typeText = (index) => {
      if (index < finalMessage.length) {
        setText(finalMessage.substring(0, index + 1))
        setTimeout(() => typeText(index + 1), 100)
      } else {
        // After typing is done, wait a moment then show the links
        setTimeout(() => setShowLinks(true), 1000)
      }
    }

    // Start the animation after a brief pause
    const startTimeout = setTimeout(() => typeText(0), 1500)

    return () => clearTimeout(startTimeout)
  }, [])

  return (
    <div className={styles.finaleWrapper}>
      <div className={styles.content}>
        <p className={styles.finalText}>
          {text}
          {/* Only show the cursor while typing */}
          {!showLinks && <span className={styles.blinkingCursor}></span>}
        </p>

        {showLinks && (
          <div className={styles.linksContainer}>
            <a
              href="https://github.com/karwan5880/portfolio2"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              [View Source on GitHub]
            </a>
            <a
              href="https://www.linkedin.com/in/karwanleong"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              [Connect on LinkedIn]
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
