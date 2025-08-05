'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { DogEar } from '@/components/DogEar'

import styles from './ProjectSection.module.css'
import { useAnimations } from '@/hooks/useAnimations'
import { useScrollManager } from '@/hooks/useScrollManager'

// Enhanced project data with more details
const projectData = {
  embedded: [
    {
      title: 'Raspberry Pi Bluetooth Sender',
      description: 'IoT device for wireless data transmission using Bluetooth protocols',
      technologies: ['Raspberry Pi', 'Bluetooth', 'Python', 'GPIO'],
      status: 'completed',
      icon: '📡',
    },
  ],
  software: [
    {
      title: 'Earth Model',
      description: 'Interactive 3D visualization of Earth with real-time data',
      technologies: ['Three.js', 'WebGL', 'JavaScript', 'API Integration'],
      status: 'completed',
      icon: '🌍',
      link: '/location',
    },
    {
      title: 'Drone Show',
      description: 'Choreographed drone performance with synchronized lighting',
      technologies: ['Drone Control', 'Choreography', 'LED Programming'],
      status: 'completed',
      icon: '🚁',
      link: '/finale',
    },
  ],
  ai: [
    {
      title: 'License Plate Detection',
      description: 'Computer vision system for automatic license plate recognition',
      technologies: ['OpenCV', 'YOLO', 'Python', 'Machine Learning'],
      status: 'completed',
      icon: '🚗',
    },
  ],
}

// Enhanced project item component with animations
function ProjectItem({ project, index, categoryIndex }) {
  const { animationsEnabled } = useAnimations()

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
      rotateY: -10,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        delay: categoryIndex * 0.2 + index * 0.1,
      },
    },
  }

  const hoverVariants = {
    hover: {
      scale: 1.05,
      y: -10,
      rotateY: 5,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  }

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 25,
      },
    },
  }

  const ProjectContent = () => (
    <motion.div className={`${styles.projectItem} ${styles[project.status]}`} variants={animationsEnabled ? itemVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false} whileHover={animationsEnabled ? 'hover' : undefined} whileTap={animationsEnabled ? 'tap' : undefined} {...(animationsEnabled ? hoverVariants : {})}>
      <motion.div
        className={styles.projectIcon}
        variants={animationsEnabled ? iconVariants : undefined}
        initial={animationsEnabled ? { scale: 0, rotate: -180 } : false}
        animate={animationsEnabled ? { scale: 1, rotate: 0 } : false}
        transition={{
          delay: categoryIndex * 0.2 + index * 0.1 + 0.3,
          duration: 0.6,
          type: 'spring',
          stiffness: 200,
          damping: 20,
        }}
      >
        {project.icon}
      </motion.div>

      <div className={styles.projectContent}>
        <motion.h3 className={styles.projectTitle} initial={animationsEnabled ? { opacity: 0, x: -20 } : false} animate={animationsEnabled ? { opacity: 1, x: 0 } : false} transition={{ delay: categoryIndex * 0.2 + index * 0.1 + 0.4, duration: 0.6 }}>
          {project.title}
        </motion.h3>

        <motion.p className={styles.projectDescription} initial={animationsEnabled ? { opacity: 0, y: 10 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ delay: categoryIndex * 0.2 + index * 0.1 + 0.5, duration: 0.6 }}>
          {project.description}
        </motion.p>

        <motion.div className={styles.projectTechnologies} initial={animationsEnabled ? { opacity: 0 } : false} animate={animationsEnabled ? { opacity: 1 } : false} transition={{ delay: categoryIndex * 0.2 + index * 0.1 + 0.6, duration: 0.4 }}>
          {project.technologies.map((tech, techIndex) => (
            <motion.span
              key={tech}
              className={styles.techTag}
              initial={animationsEnabled ? { opacity: 0, scale: 0.8 } : false}
              animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
              transition={{
                delay: categoryIndex * 0.2 + index * 0.1 + 0.7 + techIndex * 0.05,
                duration: 0.3,
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
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
              {tech}
            </motion.span>
          ))}
        </motion.div>

        <motion.div
          className={styles.projectStatus}
          initial={animationsEnabled ? { opacity: 0, scale: 0 } : false}
          animate={animationsEnabled ? { opacity: 1, scale: 1 } : false}
          transition={{
            delay: categoryIndex * 0.2 + index * 0.1 + 0.8,
            duration: 0.4,
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        >
          <span className={styles.statusBadge}>✓ {project.status}</span>
        </motion.div>
      </div>
    </motion.div>
  )

  // Wrap with Link if project has a link
  if (project.link) {
    return (
      <a href={project.link} className={styles.projectLink} target="_blank" rel="noopener noreferrer">
        <ProjectContent />
      </a>
    )
  }

  return <ProjectContent />
}

// Enhanced project column component
function ProjectColumn({ title, projects, categoryIndex, icon }) {
  const { animationsEnabled } = useAnimations()

  const columnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        delay: categoryIndex * 0.15,
      },
    },
  }

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: categoryIndex * 0.15 + 0.2,
      },
    },
  }

  return (
    <motion.div className={styles.column} variants={animationsEnabled ? columnVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false}>
      <motion.h2
        className={styles.columnTitle}
        variants={animationsEnabled ? titleVariants : undefined}
        whileHover={
          animationsEnabled
            ? {
                scale: 1.05,
                x: 10,
                transition: { type: 'spring', stiffness: 300, damping: 25 },
              }
            : undefined
        }
      >
        <span className={styles.columnIcon}>{icon}</span>
        {title}
      </motion.h2>

      <div className={styles.projectList}>
        {projects.map((project, index) => (
          <ProjectItem key={project.title} project={project} index={index} categoryIndex={categoryIndex} />
        ))}
      </div>
    </motion.div>
  )
}

export const ProjectSection = () => {
  const { scrollToSection } = useScrollManager()
  const { animationsEnabled } = useAnimations()

  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const headerVariants = {
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

  const columnsVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  }

  return (
    <motion.div className={styles.projectWrapper} variants={animationsEnabled ? containerVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false}>
      <div className={styles.projectContainer}>
        <motion.h1 className={styles.header} variants={animationsEnabled ? headerVariants : undefined}>
          Projects
        </motion.h1>

        <motion.div className={styles.columnsContainer} variants={animationsEnabled ? columnsVariants : undefined}>
          <ProjectColumn title="Embedded Systems" projects={projectData.embedded} categoryIndex={0} icon="⚙️" />
          <ProjectColumn title="Software/Web" projects={projectData.software} categoryIndex={1} icon="💻" />
          <ProjectColumn title="AI Related" projects={projectData.ai} categoryIndex={2} icon="🤖" />
        </motion.div>

        {/* Enhanced DogEar components with section navigation */}
        <DogEar
          href="#career"
          position="bottom-left"
          aria-label="Navigate to career section"
          onNavigateStart={(e) => {
            e.preventDefault()
            scrollToSection('career')
          }}
        />
        <DogEar
          href="#home"
          position="bottom-right"
          aria-label="Navigate to home section"
          onNavigateStart={(e) => {
            e.preventDefault()
            scrollToSection('home')
          }}
        />
      </div>
    </motion.div>
  )
}
