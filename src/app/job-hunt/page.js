'use client'

import { CornerLink } from '@/components/CornerLink'
import { DogEar } from '@/components/DogEar'

import styles from './page.module.css'
import { skillsData } from '@/data/skills-data'
import { useGatekeeper } from '@/hooks/useGatekeeper'

// Separate Python from the other skills
const pythonSkill = skillsData.find((skill) => skill.name.toLowerCase() === 'python')
const otherSkills = skillsData.filter((skill) => skill.name.toLowerCase() !== 'python')

// A reusable progress bar component for clarity
function SkillBar({ level }) {
  const getBarClass = (lvl) => {
    if (lvl > 10) return `${styles.barFill} ${styles.overclocked}`
    if (lvl > 7) return `${styles.barFill} ${styles.optimized}`
    return styles.barFill
  }

  return (
    <div className={styles.barContainer}>
      <div className={getBarClass(level)} style={{ width: `calc(10% * ${Math.min(level, 11)})` }}></div>
    </div>
  )
}

export default function JobSpecPage() {
  useGatekeeper('/job-hunt')

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        {/* SECTION 1: PRIMARY JOB TARGETS */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>PRIMARY TARGETS</h2>
          <div className={styles.primaryTargets}>
            <h1>AI ENGINEER</h1>
            <h1>EMBEDDED SYSTEMS ENGINEER</h1>
            <h1>LINUX ENGINEER</h1>
          </div>
        </section>

        {/* SECTION 2: PYTHON CORE COMPETENCY */}
        {pythonSkill && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>CORE LANGUAGE PROFICIENCY</h2>
            <div className={styles.coreProficiency}>
              <div className={styles.skillName}>
                {pythonSkill.name}
                <span className={styles.coreTag}>CORE</span>
              </div>
              <div className={styles.coreBarContainer}>
                <div className={styles.coreBarFill} style={{ width: `calc(10% * ${pythonSkill.level})` }}></div>
              </div>
              <span className={styles.skillLevel}>{pythonSkill.level}/10</span>
            </div>
          </section>
        )}

        {/* SECTION 3: EXTENDED SKILLSET & SECONDARY ROLES */}
        <div className={styles.dualSection}>
          <section className={`${styles.section} ${styles.fullHeight}`}>
            <h2 className={styles.sectionTitle}>EXTENDED SKILLSET</h2>
            <div className={styles.skillGrid}>
              {otherSkills.map((skill) => (
                <div key={skill.name} className={styles.skillEntry}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <SkillBar level={skill.level} />
                  <span className={styles.skillLevel}>{skill.level}/10</span>
                </div>
              ))}
            </div>
          </section>

          <section className={`${styles.section} ${styles.fullHeight}`}>
            <h2 className={styles.sectionTitle}>SECONDARY PROTOCOLS</h2>
            <div className={styles.secondaryTargets}>
              <p>Software Engineer</p>
              <p>Frontend Engineer</p>
              <p>Backend Engineer</p>
              <p>Full-Stack Developer</p>
            </div>
          </section>
        </div>
      </main>
      {/* <DogEar href="/dossier" position="bottom-left" aria-label="Return to dossier" />
      <DogEar href="/applications" position="bottom-right" aria-label="View applications" /> */}
      <CornerLink href="/dossier" position="bottom-left" label="Life Log" aria-label="Return to dossier" />
      <CornerLink href="/applications" position="bottom-right" label="Applications" aria-label="Go to applications" />
    </div>
  )
}
