// app/dossier/applications/page.js
import Link from 'next/link'

import styles from './applications.module.css'
import { applications } from '@/data/applications2'

export default function ApplicationWallPage() {
  // To make the scroll infinite, we duplicate the list a few times.
  const displayList = [...applications, ...applications, ...applications]

  return (
    <div className={styles.wallWrapper}>
      <div className={styles.scrollContainer}>
        {displayList.map((app, index) => (
          <div
            key={index}
            className={`${styles.companyName} ${app.status === 'interviewed' ? styles.interviewed : styles.applied}`}
          >
            {app.name}
          </div>
        ))}
      </div>
      <div className={styles.vignette}></div>
      <h1 className={styles.header}>SYSTEM LOG: APPLICATIONS</h1>
      <Link href="/dossier/applications/finale" className={styles.dogEar} aria-label="Go to the final page"></Link>
    </div>
  )
}
