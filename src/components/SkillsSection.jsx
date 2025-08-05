'use client'

import { motion } from 'framer-motion'

import { CornerLink } from '@/components/CornerLink'

import styles from './SkillsSection.module.css'
import { useAnimations } from '@/hooks/useAnimations'
import { useScrollManager } from '@/hooks/useScrollManager'

// Core skills data
const coreSkills = [
  {
    name: 'Python',
    level: 9,
    description: 'Automation, Scripting, App Development',
    category: 'primary',
    icon: '/icons/python.png',
    tags: ['Flask', 'FastAPI', 'Automation'],
  },
  {
    name: 'C++',
    level: 8,
    description: 'Performance-Critical Applications, Game Development, Dynamic Libraries, Drivers',
    category: 'primary',
    icon: '/icons/cpp.png',
    tags: ['Performance', 'Memory Management', 'Algorithms'],
  },
  {
    name: 'React',
    level: 8,
    description: 'Frontend Development, Modern Web Apps, Portfolio, Landing Page, Business',
    category: 'primary',
    icon: '/icons/react.png',
    tags: ['Hooks', 'State Management', 'UI/UX'],
  },
  {
    name: 'Computer Vision',
    level: 7,
    description: 'OpenCV, Image Processing, YOLO, Object Detection, Linux, Ubuntu, Script',
    category: 'primary',
    icon: '/icons/opencv.png',
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
    icon: '/icons/flutter.png',
    tags: ['Mobile', 'Cross-platform', 'Dart'],
  },
  {
    name: 'Godot',
    level: 2,
    description: 'Game Engine, 2D/3D Game Development',
    category: 'emerging',
    icon: '/icons/godot.png',
    tags: ['Game Engine', 'GDScript', 'Indie Games'],
  },
  {
    name: 'Rust',
    level: 0,
    description: 'Systems Programming, Memory Safety',
    category: 'emerging',
    icon: '/icons/rust.png',
    tags: ['Systems', 'Memory Safety', 'Performance'],
  },
  {
    name: 'Go',
    level: 0,
    description: 'Backend Services, Microservices',
    category: 'emerging',
    icon: '/icons/go.png',
    tags: ['Backend', 'Concurrency', 'Microservices'],
  },
]

// Enhanced skill card component with animations
function SkillCard({ skill, index }) {
  const { animationsEnabled } = useAnimations()

  const getBarClass = (level) => {
    if (level >= 9) return `${styles.barFill} ${styles.expert}`
    if (level >= 7) return `${styles.barFill} ${styles.advanced}`
    if (level >= 4) return `${styles.barFill} ${styles.intermediate}`
    return `${styles.barFill} ${styles.beginner}`
  }

  const getCardClass = (category) => {
    return category === 'emerging' ? `${styles.skillCard} ${styles.emergingCard}` : styles.skillCard
  }

  // Animation variants for skill cards
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.8,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1, // Staggered delay
      },
    },
  }

  const barVariants = {
    hidden: { width: 0 },
    visible: {
      width: `${skill.level * 10}%`,
      transition: {
        duration: 1.2,
        delay: index * 0.1 + 0.5, // Animate after card appears
        ease: 'easeOut',
      },
    },
  }

  const tagVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1 + 0.8 + i * 0.1, // Staggered tag animations
        duration: 0.4,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      },
    }),
  }

  return (
    <motion.div
      className={getCardClass(skill.category)}
      variants={animationsEnabled ? cardVariants : undefined}
      initial={animationsEnabled ? 'hidden' : false}
      animate={animationsEnabled ? 'visible' : false}
      whileHover={
        animationsEnabled
          ? {
              scale: 1.05,
              y: -10,
              rotateY: 5,
              transition: { type: 'spring', stiffness: 300, damping: 25 },
            }
          : undefined
      }
      whileTap={
        animationsEnabled
          ? {
              scale: 0.98,
              transition: { type: 'spring', stiffness: 400, damping: 25 },
            }
          : undefined
      }
    >
      <motion.div
        className={styles.skillIcon}
        initial={animationsEnabled ? { scale: 0, rotate: -180 } : false}
        animate={animationsEnabled ? { scale: 1, rotate: 0 } : false}
        transition={{
          delay: index * 0.1 + 0.3,
          duration: 0.6,
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
      >
        <img src={skill.icon} alt={`${skill.name} icon`} width="40" height="40" />
      </motion.div>

      {skill.category === 'emerging' && (
        <motion.div
          className={styles.emergingBadge}
          initial={animationsEnabled ? { opacity: 0, scale: 0 } : false}
          animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
          transition={{
            delay: index * 0.1 + 0.4,
            duration: 0.5,
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        >
          Learning
        </motion.div>
      )}

      <motion.div className={styles.skillHeader} initial={animationsEnabled ? { opacity: 0, x: -20 } : false} animate={animationsEnabled ? { opacity: 1, x: 0 } : false} transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}>
        <h3 className={styles.skillName}>{skill.name}</h3>
        <span className={styles.skillLevel}>{skill.level}/10</span>
      </motion.div>

      <div className={styles.skillBar}>
        <motion.div className={getBarClass(skill.level)} variants={animationsEnabled ? barVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false} style={!animationsEnabled ? { width: `${skill.level * 10}%` } : undefined} />
      </div>

      <motion.p className={styles.skillDescription} initial={animationsEnabled ? { opacity: 0, y: 10 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ delay: index * 0.1 + 0.6, duration: 0.6 }}>
        {skill.description}
      </motion.p>

      <motion.div className={styles.skillTags} initial={animationsEnabled ? { opacity: 0 } : false} animate={animationsEnabled ? { opacity: 1 } : false} transition={{ delay: index * 0.1 + 0.7, duration: 0.4 }}>
        {skill.tags.map((tag, tagIndex) => (
          <motion.span
            key={tag}
            className={styles.tag}
            variants={animationsEnabled ? tagVariants : undefined}
            initial={animationsEnabled ? 'hidden' : false}
            animate={animationsEnabled ? 'visible' : false}
            custom={tagIndex}
            whileHover={
              animationsEnabled
                ? {
                    scale: 1.1,
                    y: -2,
                    transition: { type: 'spring', stiffness: 400, damping: 25 },
                  }
                : undefined
            }
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  )
}

export const SkillsSection = () => {
  const { scrollToSection } = useScrollManager()
  const { animationsEnabled } = useAnimations()

  // Animation variants for sections
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const sectionTitleVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  return (
    <motion.div className={styles.wrapper} variants={animationsEnabled ? containerVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false}>
      <main className={styles.container}>
        <motion.header className={styles.header} variants={animationsEnabled ? titleVariants : undefined}>
          <h1 className={styles.title}>Technical Skills</h1>
          <p className={styles.subtitle}>Current expertise and future interests</p>
        </motion.header>

        <motion.section className={styles.skillSection} variants={animationsEnabled ? containerVariants : undefined}>
          <motion.h2 className={styles.sectionTitle} variants={animationsEnabled ? sectionTitleVariants : undefined}>
            Core Competencies
          </motion.h2>
          <motion.div className={styles.skillsGrid} variants={animationsEnabled ? gridVariants : undefined}>
            {coreSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index} />
            ))}
          </motion.div>
        </motion.section>

        <motion.section className={styles.skillSection} variants={animationsEnabled ? containerVariants : undefined}>
          <motion.h2 className={styles.sectionTitle} variants={animationsEnabled ? sectionTitleVariants : undefined}>
            Emerging Interests
          </motion.h2>
          <motion.div className={styles.skillsGrid} variants={animationsEnabled ? gridVariants : undefined}>
            {emergingSkills.map((skill, index) => (
              <SkillCard key={skill.name} skill={skill} index={index + coreSkills.length} />
            ))}
          </motion.div>
        </motion.section>
      </main>

      {/* Enhanced CornerLink components with section navigation */}
      <CornerLink
        href="#dev-history"
        position="bottom-left"
        label="Dev"
        aria-label="Navigate to dev-history section"
        onNavigateStart={(e) => {
          e.preventDefault()
          scrollToSection('dev-history')
        }}
      />
      <CornerLink
        href="#career"
        position="bottom-right"
        label="Career"
        aria-label="Navigate to career section"
        onNavigateStart={(e) => {
          e.preventDefault()
          scrollToSection('career')
        }}
      />
    </motion.div>
  )
}
