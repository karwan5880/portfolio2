'use client'

import styles from './Header.module.css'
import { ResumeIcon } from './ResumeIcon'
import { ScrambledText } from './ScrambledText'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.infoContainer}>
        <ScrambledText targetText="KAR WAN LEONG" />
        <div className={styles.contactBar}>
          <span>Malaysia</span>
          <span className={styles.separator}>•</span>
          {/* <span>•</span> */}
          <a href="mailto:karwanlyt@gmail.com">karwanlyt@gmail.com</a>
          {/* <span>•</span> */}
          <span className={styles.separator}>•</span>
          <a href="https://www.linkedin.com/in/karwanleong" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  )
}
