'use client'

import { useState } from 'react'

import styles from './Project.module.css'

export function Project({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={styles.projectContainer}>
      <h3 className={styles.title} onClick={toggleExpansion}>
        {title}
      </h3>
      <div className={`${styles.contentWrapper} ${isExpanded ? styles.expanded : ''}`}>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
