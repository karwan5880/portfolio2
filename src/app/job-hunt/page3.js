'use client'

import { useEffect, useState } from 'react'

import { DogEar } from '@/components/DogEar'

import styles from './job-spec.module.css'
import { skillsData } from '@/data/skills-data'

// Helper function to create the ASCII progress bar
const createProgressBar = (level) => {
  const cappedLevel = Math.min(level, 10)
  const filled = '█'.repeat(cappedLevel)
  const empty = ' '.repeat(10 - cappedLevel)
  return `[${filled}${empty}]`
}

// All the lines for our boot sequence
const bootSequenceLines = [
  '[0.000001] Kernel boot sequence initiated...',
  '[0.000045] Loading core directives...',
  '[0.000098] > Directive [AI_ENGINEER]:       [ LOADED ] [ ONLINE ]',
  '[0.000153] > Directive [EMBEDDED_SYSTEMS]:  [ LOADED ] [ ONLINE ]',
  '[0.000210] > Subroutine [WEB_DEV_STACK]:   [ LOADED ] [ STANDBY ]',
  ' ', // spacer
  '[0.000350] Running system proficiency diagnostics...',
  '[0.000400] Scanning language modules:',
  ...skillsData.map(
    (skill) =>
      `[0.000${451 + skillsData.indexOf(skill) * 50}]   - ${skill.name.padEnd(14, ' ')} ${createProgressBar(skill.level)} ${skill.level}/10 (STATUS: ${skill.status})`
  ),
  ' ', // spacer
  '[0.001000] System check complete. All systems nominal.',
  '[0.001025] Waiting for next command...',
]

export default function JobSpecPage() {
  const [visibleLines, setVisibleLines] = useState([])
  const [showCursor, setShowCursor] = useState(false)

  useEffect(() => {
    let isMounted = true
    bootSequenceLines.forEach((line, index) => {
      setTimeout(() => {
        if (isMounted) {
          setVisibleLines((prev) => [...prev, line])
          if (index === bootSequenceLines.length - 1) {
            setShowCursor(true) // Show cursor only after the last line
          }
        }
      }, index * 80) // Adjust delay for typing speed
    })

    return () => {
      isMounted = false
    } // Cleanup to prevent state updates on unmounted component
  }, [])

  // Function to add syntax highlighting classes
  const renderLine = (line) => {
    if (line.includes('[ ONLINE ]')) return <span className={styles.online}>{line}</span>
    if (line.includes('[ STANDBY ]')) return <span className={styles.standby}>{line}</span>
    if (line.includes('OVERCLOCKED')) return <span className={styles.overclocked}>{line}</span>
    return line
  }

  return (
    <div className={styles.terminalWrapper}>
      <pre className={styles.output}>
        {visibleLines.map((line, index) => (
          <div key={index}>{renderLine(line)}</div>
        ))}
        {showCursor && <span className={styles.blinkingCursor}></span>}
      </pre>
      <DogEar href="/dev-history" position="bottom-left" aria-label="Return to dev-history" />
      <DogEar href="/applications" position="bottom-right" aria-label="View applications" />
    </div>
  )
}
