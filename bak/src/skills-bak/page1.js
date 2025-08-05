// app/dossier/job-spec/page.js
'use client'

import { useEffect, useState } from 'react'

import { DogEar } from '@/components/DogEar'

import styles from './job-spec.module.css'
import { skillsData } from '@/data/skills-data'

// app/dossier/job-spec/page.js

// app/dossier/job-spec/page.js

// app/dossier/job-spec/page.js

// app/dossier/job-spec/page.js

// app/dossier/job-spec/page.js

// app/dossier/job-spec/page.js

// app/dossier/job-spec/page.js

export default function JobSpecPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    // Trigger animations once the component is mounted
    setIsMounted(true)
  }, [])

  const getBarClass = (level) => {
    if (level > 10) return `${styles.barFill} ${styles.overclocked}`
    if (level > 7) return `${styles.barFill} ${styles.optimized}`
    return styles.barFill
  }

  return (
    <div className={`${styles.wrapper} ${isMounted ? styles.visible : ''}`}>
      <div className={styles.primaryDirectives}>
        <h1>AI ENGINEER</h1>
        <h1>EMBEDDED SYSTEMS ENGINEER</h1>
        {/* <h1>ROBOTICS ENGINEER</h1> */}
      </div>

      <div className={styles.secondaryProtocols}>
        <h2>// SECONDARY PROTOCOLS</h2>
        {/* <p>Software Engineer</p> */}
        <p>Frontend Engineer • Backend Engineer • Full-Stack Developer</p>
      </div>

      <div className={styles.proficiencies}>
        <h3>SYSTEM PROFICIENCIES</h3>
        <div className={styles.skillGrid}>
          {skillsData.map((skill, index) => (
            <div key={index} className={styles.skillEntry}>
              <span className={styles.skillName}>{skill.name}</span>
              <div className={styles.barContainer}>
                <div className={getBarClass(skill.level)} style={{ width: `calc(10% * ${skill.level})` }}></div>
              </div>
              <span className={styles.skillLevel}>{skill.level}/10</span>
            </div>
          ))}
        </div>
      </div>

      <DogEar href="/dev-history" position="bottom-left" aria-label="Return to dev-history" />
      <DogEar href="/applications" position="bottom-right" aria-label="View applications" />
    </div>
  )
}
