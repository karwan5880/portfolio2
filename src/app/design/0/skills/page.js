'use client'

import { CornerLink } from '@/components/shared/CornerLink'

import styles from './page.module.css'
import { useGatekeeper } from '@/hooks/useGatekeeper'

// Core skills data
const coreSkills = [
  {
    name: 'Python',
    level: 9,
    description: 'Automation, Scripting, App Development',
    category: 'primary',
    icon: '/icons/python.png', // Path to icon in public folder
    tags: ['Flask', 'FastAPI', 'Automation'],
  },
  {
    name: 'C++',
    level: 8,
    description: 'Performance-Critical Applications, Game Development, Dynamic Libraries, Drivers',
    category: 'primary',
    icon: '/icons/cpp.png', // Path to icon in public folder
    tags: ['Performance', 'Memory Management', 'Algorithms'],
  },
  {
    name: 'React',
    level: 8,
    description: 'Frontend Development, Modern Web Apps, Portfolio, Landing Page, Business',
    category: 'primary',
    icon: '/icons/react.png', // Path to icon in public folder
    tags: ['Hooks', 'State Management', 'UI/UX'],
  },
  {
    name: 'Computer Vision',
    level: 7,
    description: 'OpenCV, Image Processing, YOLO, Object Detection, Linux, Ubuntu, Script',
    category: 'primary',
    icon: '/icons/opencv.png', // Path to icon in public folder
    tags: ['OpenCV', 'YOLO', 'Image Processing'],
  },
]

// Emerging skills - technologies I'm interested in learning
const emergingSkills = [
  {
    name: 'Flutter',
    level: 3,
    description: 'Cross-platform Mobile Development',
    category: 'emerging',
    icon: '/icons/flutter.png', // Path to icon in public folder
    tags: ['Mobile', 'Cross-platform', 'Dart'],
  },
  {
    name: 'Godot',
    level: 2,
    description: 'Game Engine, 2D/3D Game Development',
    category: 'emerging',
    icon: '/icons/godot.png', // Path to icon in public folder
    tags: ['Game Engine', 'GDScript', 'Indie Games'],
  },
  {
    name: 'Rust',
    level: 0,
    description: 'Systems Programming, Memory Safety',
    category: 'emerging',
    icon: '/icons/rust.png', // Path to icon in public folder
    tags: ['Systems', 'Memory Safety', 'Performance'],
  },
  {
    name: 'Go',
    level: 0,
    description: 'Backend Services, Microservices',
    category: 'emerging',
    icon: '/icons/go.png', // Path to icon in public folder
    tags: ['Backend', 'Concurrency', 'Microservices'],
  },
]

// Skill card component
function SkillCard({ skill }) {
  const getBarClass = (level) => {
    if (level >= 9) return `${styles.barFill} ${styles.expert}`
    if (level >= 7) return `${styles.barFill} ${styles.advanced}`
    if (level >= 4) return `${styles.barFill} ${styles.intermediate}`
    return `${styles.barFill} ${styles.beginner}`
  }

  const getCardClass = (category) => {
    return category === 'emerging' ? `${styles.skillCard} ${styles.emergingCard}` : styles.skillCard
  }

  return (
    <div className={getCardClass(skill.category)}>
      <div className={styles.skillIcon}>
        <img src={skill.icon} alt={`${skill.name} icon`} width="40" height="40" />
      </div>
      {skill.category === 'emerging' && <div className={styles.emergingBadge}>Learning</div>}
      <div className={styles.skillHeader}>
        <h3 className={styles.skillName}>{skill.name}</h3>
        <span className={styles.skillLevel}>{skill.level}/10</span>
      </div>
      <div className={styles.skillBar}>
        <div className={getBarClass(skill.level)} style={{ width: `${skill.level * 10}%` }} />
      </div>
      <p className={styles.skillDescription}>{skill.description}</p>
      <div className={styles.skillTags}>
        {skill.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function SkillsPage() {
  useGatekeeper('/skills')

  return (
    <div className={styles.wrapper}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Technical Skills</h1>
          <p className={styles.subtitle}>Current expertise and future interests</p>
        </header>

        <section className={styles.skillSection}>
          <h2 className={styles.sectionTitle}>Core Competencies</h2>
          <div className={styles.skillsGrid}>
            {coreSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </section>

        <section className={styles.skillSection}>
          <h2 className={styles.sectionTitle}>Emerging Interests</h2>
          <div className={styles.skillsGrid}>
            {emergingSkills.map((skill) => (
              <SkillCard key={skill.name} skill={skill} />
            ))}
          </div>
        </section>
      </main>

      <CornerLink href="/design/0/dev-history" position="bottom-left" label="Dev" aria-label="Return to dev-history" />
      <CornerLink href="/design/0/career" position="bottom-right" label="Career" aria-label="Go to career" />
    </div>
  )
}
