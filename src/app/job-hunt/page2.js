import { DogEar } from '@/components/DogEar'

import styles from './job-spec.module.css'
import { skillsData } from '@/data/skills-data'

// A sub-component for our RAM sticks to keep the main return clean
const SkillStick = ({ name, level, status }) => {
  const displayLevel = Math.min(level, 10) // Cap the visual bar at 10
  const isOverclocked = status === 'OVERCLOCKED'

  return (
    <div className={styles.skillStick}>
      <span className={styles.skillName}>{name}</span>
      <div className={styles.levelBar}>
        <div
          className={`${styles.levelIndicator} ${isOverclocked ? styles.overclocked : ''}`}
          style={{ width: `calc(10% * ${displayLevel})` }}
        ></div>
      </div>
      <span className={`${styles.skillStatus} ${isOverclocked ? styles.overclockedText : ''}`}>
        {level}/10 {isOverclocked && `(${status})`}
      </span>
    </div>
  )
}

export default function JobSpecPage() {
  return (
    <div className={styles.boardWrapper}>
      <div className={styles.cpu}>CORE DIRECTIVES</div>

      <div className={`${styles.module} ${styles.aiModule}`}>AI_PROCESSOR</div>
      <div className={`${styles.module} ${styles.roboticsModule}`}>ROBOTICS_CONTROLLER</div>

      <div className={`${styles.module} ${styles.webModule}`}>WEB_SERVER</div>
      <div className={`${styles.module} ${styles.uiModule}`}>UI_RENDERER</div>

      <div className={styles.ramBank}>
        <h3 className={styles.bankTitle}>SYSTEM PROFICIENCIES (RAM)</h3>
        {skillsData.map((skill) => (
          <SkillStick key={skill.name} {...skill} />
        ))}
      </div>

      <DogEar href="/dev-history" position="bottom-left" aria-label="Return to application logs" />
      <DogEar href="/applications" position="bottom-right" aria-label="View finale" />
    </div>
  )
}
