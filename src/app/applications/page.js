'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'
import { DogEar } from '@/components/DogEar'

import styles from './page.module.css'
import { applications } from '@/data/applications2'
import { useGatekeeper } from '@/hooks/useGatekeeper'

// A simple helper function to generate a random-looking file size
const randomFileSize = () => {
  const size = Math.random() * 8 + 0.5 // 0.5 to 8.5
  return `${size.toFixed(1)}M`
}

export default function ApplicationWallPage() {
  useGatekeeper('/applications')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // This effect runs only on the client, after the initial render
    setIsMounted(true)
  }, [])

  // We still duplicate the list to make the scroll feel endless
  const displayList = [...applications, ...applications, ...applications, ...applications]

  return (
    <div className={styles.wallWrapper}>
      <div className={styles.terminalWindow}>
        <div className={styles.scrollContainer}>
          {displayList.map((app, index) => (
            <div key={index} className={styles.fileEntry}>
              <span className={styles.permissions}>{app.status === 'interviewed' ? '-rwxr-xr--' : '-rw-r--r--'}</span>
              <span className={styles.owner}>1 kw_leong root</span>
              <span className={styles.size}>{isMounted ? randomFileSize() : '1.0M'}</span>
              <span className={styles.date}>Mar 25</span>
              <span className={`${styles.fileName} ${app.status === 'interviewed' ? styles.interviewed : styles.applied}`}>{app.name.replace(/ /g, '_')}.log</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.vignette}></div>
      <h1 className={styles.header}>SCANNING ARCHIVES...</h1>
      {/* <Link href="/dossier/applications/finale" className={styles.dogEar} aria-label="Go to the final page"></Link> */}
      {/* <DogEar href="/dossier/applications/finale" aria-label="Go to the final page" />
      <DogEar direction="previous" aria-label="Go to previous page" /> */}
      {/* <DogEar href="/finale" position="bottom-right" aria-label="View finale" /> */}
      {/* <DogEar href="/job-hunt" position="bottom-left" aria-label="Return to job-hunt" />
      <DogEar href="/dev-history" position="bottom-right" aria-label="View dev-history" /> */}
      <CornerLink href="/job-hunt" position="bottom-left" label="Job Hunt" aria-label="Return to job-hunt" />
      <CornerLink href="/dev-history" position="bottom-right" label="Timeline" aria-label="Go to dev-history" />
    </div>
  )
}
