'use client'

import Link from 'next/link'

import { DogEar } from '@/components/DogEar'

import styles from './projects.module.css'
import { useGatekeeper } from '@/hooks/useGatekeeper'

export default function ProjectPage() {
  useGatekeeper('/project')

  return (
    <div className={styles.projectWrapper}>
      <div className={styles.projectContainer}>
        <h1 className={styles.header}>Project</h1>

        <div className={styles.columnsContainer}>
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Embedded System</h2>
            <div className={styles.projectList}>
              <div className={styles.projectListItem}>Raspberry Pi Bluetooth Sender</div>
            </div>
          </div>

          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Software/Web</h2>
            <div className={styles.projectList}>
              <a href="/location" className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                <div className={styles.projectItem}>Earth Model</div>
              </a>
              <a href="/finale" className={styles.projectLink} target="_blank" rel="noopener noreferrer">
                <div className={styles.projectItem}>Drone Show</div>
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <h2 className={styles.columnTitle}>AI Related</h2>
            <div className={styles.projectList}>
              <div className={styles.projectListItem}>License Plate Detection</div>
            </div>
          </div>
        </div>

        <DogEar href="/career" position="bottom-left" aria-label="Return to career" />
        {/* <DogEar href="/" position="bottom-right" aria-label="Return to main page" /> */}
      </div>
    </div>
  )
}
