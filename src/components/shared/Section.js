import { useState } from 'react'

import styles from './Section.module.css'

export function Section({ title, children, isInteractive = false }) {
  const [isGlitching, setIsGlitching] = useState(false)

  const handleMouseEnter = () => {
    if (isInteractive) {
      setIsGlitching(true)
    }
  }

  const handleMouseLeave = () => {
    if (isInteractive) {
      setIsGlitching(false)
    }
  }

  const titleClasses = `
    ${styles.title}
    ${isInteractive ? styles.interactive : ''}
    ${isGlitching ? styles.glitchEffect : ''}
  `

  return (
    <section className={styles.section}>
      <h2 className={titleClasses} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} data-text={title}>
        {title}
      </h2>
      <div className={styles.content}>{children}</div>
    </section>
  )
}
