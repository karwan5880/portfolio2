'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { CornerLink } from '@/components/CornerLink'

import styles from './CareerSection.module.css'
import { useAnimations } from '@/hooks/useAnimations'
import { useScrollManager } from '@/hooks/useScrollManager'

// Enhanced Desktop Career View with animations
function DesktopCareerView() {
  const { animationsEnabled } = useAnimations()

  // Animation variants
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
        stiffness: 120,
        damping: 20,
        duration: 0.8,
      },
    },
  }

  const arrowVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        delay: 0.5,
        duration: 0.6,
        type: 'spring',
        stiffness: 200,
        damping: 25,
      },
    },
  }

  const timelineVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
        delay: 0.3,
      },
    },
  }

  return (
    <motion.div className={styles.container} variants={animationsEnabled ? containerVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false}>
      {/* Header */}
      <motion.div className={styles.header} variants={animationsEnabled ? headerVariants : undefined}>
        <h1>Career Roadmap</h1>
        <p>Future Planning</p>
      </motion.div>

      {/* Five Column Layout */}
      <div className={styles.threeColumns}>
        {/* Time Labels - Positioned relative to entire layout */}
        <motion.div className={styles.timeLabelsColumn} variants={animationsEnabled ? containerVariants : undefined}>
          <motion.div className={styles.timeLabelInColumn + ' ' + styles.futurePosition} variants={animationsEnabled ? cardVariants : undefined} whileHover={animationsEnabled ? { scale: 1.1, x: 10 } : undefined}>
            FUTURE
          </motion.div>
          <motion.div className={styles.timeLabelInColumn + ' ' + styles.presentPosition} variants={animationsEnabled ? cardVariants : undefined} whileHover={animationsEnabled ? { scale: 1.1, x: 10 } : undefined}>
            PRESENT
          </motion.div>
          <motion.div className={styles.timeLabelInColumn + ' ' + styles.pastPosition} variants={animationsEnabled ? cardVariants : undefined} whileHover={animationsEnabled ? { scale: 1.1, x: 10 } : undefined}>
            PAST
          </motion.div>
        </motion.div>

        {/* Left Column - Embedded Systems */}
        <motion.div className={styles.leftColumn} variants={animationsEnabled ? containerVariants : undefined}>
          <motion.div
            className={styles.card}
            variants={animationsEnabled ? cardVariants : undefined}
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
          >
            <motion.div className={styles.cardIcon} initial={animationsEnabled ? { scale: 0, rotate: -180 } : false} animate={animationsEnabled ? { scale: 1, rotate: 0 } : false} transition={{ delay: 0.8, duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}>
              ⚙️
            </motion.div>
            <h3>Embedded Systems Engineer</h3>
            <p>Building firmware and low-level systems for IoT devices, sensors, and microcontrollers. Real-time performance and hardware optimization.</p>
            <div className={styles.tags}>
              <span>C/C++</span>
              <span>RTOS</span>
              <span>Microcontrollers</span>
              <span>IoT</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Left Arrow Column */}
        <motion.div className={styles.arrowColumn} variants={animationsEnabled ? containerVariants : undefined}>
          <motion.div className={styles.arrowToCenter} variants={animationsEnabled ? arrowVariants : undefined}>
            ↗
          </motion.div>
          <motion.div className={styles.arrowFromCenter} variants={animationsEnabled ? arrowVariants : undefined}>
            ↖
          </motion.div>
        </motion.div>

        {/* Middle Column - Main Path */}
        <motion.div className={styles.middleColumn} variants={animationsEnabled ? containerVariants : undefined}>
          {/* Timeline line */}
          <motion.div className={styles.timelineLine} variants={animationsEnabled ? timelineVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false} />

          {/* PhD - Top */}
          <motion.div className={styles.phdTag} variants={animationsEnabled ? cardVariants : undefined} whileHover={animationsEnabled ? { scale: 1.1, rotate: 5 } : undefined}>
            🎓 PhD
          </motion.div>

          {/* Arrow up */}
          <motion.div className={styles.arrowUp} variants={animationsEnabled ? arrowVariants : undefined}>
            ↑
          </motion.div>

          {/* AI + Robotics */}
          <motion.div
            className={styles.card + ' ' + styles.convergence}
            variants={animationsEnabled ? cardVariants : undefined}
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
          >
            <motion.h2 initial={animationsEnabled ? { opacity: 0, y: 20 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ delay: 1.0, duration: 0.6 }}>
              🤖 AI + Robotics
            </motion.h2>
            <motion.p initial={animationsEnabled ? { opacity: 0, y: 20 } : false} animate={animationsEnabled ? { opacity: 1, y: 0 } : false} transition={{ delay: 1.2, duration: 0.6 }}>
              Building intelligent systems that bridge the digital-physical divide through autonomous robotics, computer vision, and embodied AI
            </motion.p>
          </motion.div>

          {/* Spacing */}
          <div className={styles.reducedSpace}></div>

          {/* Current Position */}
          <motion.div
            className={styles.card + ' ' + styles.current}
            variants={animationsEnabled ? cardVariants : undefined}
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
          >
            <motion.div className={styles.cardIcon} initial={animationsEnabled ? { scale: 0, rotate: -180 } : false} animate={animationsEnabled ? { scale: 1, rotate: 0 } : false} transition={{ delay: 0.6, duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}>
              👨‍💻
            </motion.div>
            <h3>Software Engineer</h3>
            <p className={styles.degree}>Master of Engineering Science</p>
            <p>Building web apps, automation scripts, and backend systems. Currently working on data pipelines and React frontends.</p>
            <div className={styles.tags}>
              <span>Python</span>
              <span>C/C++</span>
              <span>React</span>
              <span>JavaScript</span>
            </div>
          </motion.div>

          {/* Arrow up */}
          <motion.div className={styles.arrowUp} variants={animationsEnabled ? arrowVariants : undefined}>
            ↑
          </motion.div>

          {/* Past */}
          <motion.div
            className={styles.card + ' ' + styles.foundation}
            variants={animationsEnabled ? cardVariants : undefined}
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
          >
            <motion.div className={styles.cardIcon} initial={animationsEnabled ? { scale: 0, rotate: -180 } : false} animate={animationsEnabled ? { scale: 1, rotate: 0 } : false} transition={{ delay: 0.4, duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}>
              🎓
            </motion.div>
            <h3>Student</h3>
            <p className={styles.degree}>Bachelor of Computer Science (Honours)</p>
            <p>Building theoretical foundation in algorithms, data structures, and software engineering principles through coursework and projects.</p>
          </motion.div>
        </motion.div>

        {/* Right Arrow Column */}
        <motion.div className={styles.arrowColumn} variants={animationsEnabled ? containerVariants : undefined}>
          <motion.div className={styles.arrowToCenter} variants={animationsEnabled ? arrowVariants : undefined}>
            ↖
          </motion.div>
          <motion.div className={styles.arrowFromCenter} variants={animationsEnabled ? arrowVariants : undefined}>
            ↗
          </motion.div>
        </motion.div>

        {/* Right Column - AI Engineering */}
        <motion.div className={styles.rightColumn} variants={animationsEnabled ? containerVariants : undefined}>
          <motion.div
            className={styles.card}
            variants={animationsEnabled ? cardVariants : undefined}
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
          >
            <motion.div className={styles.cardIcon} initial={animationsEnabled ? { scale: 0, rotate: -180 } : false} animate={animationsEnabled ? { scale: 1, rotate: 0 } : false} transition={{ delay: 1.0, duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}>
              🧠
            </motion.div>
            <h3>AI/ML Engineer</h3>
            <p>Developing intelligent systems through machine learning, computer vision, LLM, and neural networks for real-world applications</p>
            <div className={styles.tags}>
              <span>Python</span>
              <span>TensorFlow</span>
              <span>PyTorch</span>
              <span>OpenCV</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Enhanced Mobile Career View with animations
function MobileCareerView() {
  const { animationsEnabled } = useAnimations()

  // Animation variants for mobile
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const sectionVariants = {
    hidden: {
      opacity: 0,
      x: -50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 20,
        duration: 0.8,
      },
    },
  }

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 20,
        duration: 0.6,
      },
    },
  }

  return (
    <motion.div className={styles.mobileContainer} variants={animationsEnabled ? containerVariants : undefined} initial={animationsEnabled ? 'hidden' : false} animate={animationsEnabled ? 'visible' : false}>
      {/* Header */}
      <motion.div className={styles.header} variants={animationsEnabled ? sectionVariants : undefined}>
        <h1>Career Roadmap</h1>
        <p>Future Planning</p>
      </motion.div>

      {/* Mobile Career Cards */}
      <div className={styles.careerFlow}>
        {/* Future Goal */}
        <motion.div className={styles.futureSection} variants={animationsEnabled ? sectionVariants : undefined}>
          <div className={styles.sectionLabel}>Future Goal</div>
          <motion.div className={styles.phdBadge} variants={animationsEnabled ? cardVariants : undefined} whileHover={animationsEnabled ? { scale: 1.1, rotate: 5 } : undefined}>
            🎓 PhD
          </motion.div>
          <motion.div
            className={styles.card + ' ' + styles.futureCard}
            variants={animationsEnabled ? cardVariants : undefined}
            whileHover={
              animationsEnabled
                ? {
                    scale: 1.02,
                    y: -5,
                    transition: { type: 'spring', stiffness: 300, damping: 25 },
                  }
                : undefined
            }
          >
            <div className={styles.cardIcon}>🤖</div>
            <h2>AI + Robotics</h2>
            <p>Building intelligent systems that bridge the digital-physical divide through autonomous robotics, computer vision, and embodied AI</p>
          </motion.div>
        </motion.div>

        {/* Jobs I'm Looking For */}
        <motion.div className={styles.alternativesSection} variants={animationsEnabled ? sectionVariants : undefined}>
          <div className={styles.sectionLabel}>Jobs I'm Looking For</div>

          <motion.div className={styles.alternativeCards} variants={animationsEnabled ? containerVariants : undefined}>
            <motion.div
              className={styles.card + ' ' + styles.alternativeCard}
              variants={animationsEnabled ? cardVariants : undefined}
              whileHover={
                animationsEnabled
                  ? {
                      scale: 1.05,
                      y: -5,
                      transition: { type: 'spring', stiffness: 300, damping: 25 },
                    }
                  : undefined
              }
            >
              <div className={styles.cardIcon}>⚙️</div>
              <h4>Embedded Systems</h4>
              <p>IoT devices, sensors, and microcontrollers</p>
              <div className={styles.miniTags}>
                <span>C/C++</span>
                <span>RTOS</span>
                <span>IoT</span>
              </div>
            </motion.div>

            <motion.div
              className={styles.card + ' ' + styles.alternativeCard}
              variants={animationsEnabled ? cardVariants : undefined}
              whileHover={
                animationsEnabled
                  ? {
                      scale: 1.05,
                      y: -5,
                      transition: { type: 'spring', stiffness: 300, damping: 25 },
                    }
                  : undefined
              }
            >
              <div className={styles.cardIcon}>🧠</div>
              <h4>AI/ML Engineer</h4>
              <p>Machine learning and neural networks</p>
              <div className={styles.miniTags}>
                <span>Python</span>
                <span>TensorFlow</span>
                <span>PyTorch</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Current Position */}
        <motion.div className={styles.currentSection} variants={animationsEnabled ? sectionVariants : undefined}>
          <div className={styles.sectionLabel}>Present</div>
          <motion.div
            className={styles.card + ' ' + styles.currentCard}
            variants={animationsEnabled ? cardVariants : undefined}
            whileHover={
              animationsEnabled
                ? {
                    scale: 1.02,
                    y: -5,
                    transition: { type: 'spring', stiffness: 300, damping: 25 },
                  }
                : undefined
            }
          >
            <div className={styles.cardIcon}>👨‍💻</div>
            <h3>Software Engineer</h3>
            <p className={styles.degree}>Master of Engineering Science</p>
            <p>Building web apps, automation scripts, and backend systems. Currently working on data pipelines and React frontends.</p>
            <div className={styles.tags}>
              <span>Python</span>
              <span>C/C++</span>
              <span>React</span>
              <span>JavaScript</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Past */}
        <motion.div className={styles.pastSection} variants={animationsEnabled ? sectionVariants : undefined}>
          <div className={styles.sectionLabel}>Past</div>
          <motion.div
            className={styles.card + ' ' + styles.foundationCard}
            variants={animationsEnabled ? cardVariants : undefined}
            whileHover={
              animationsEnabled
                ? {
                    scale: 1.02,
                    y: -5,
                    transition: { type: 'spring', stiffness: 300, damping: 25 },
                  }
                : undefined
            }
          >
            <div className={styles.cardIcon}>🎓</div>
            <h3>Student</h3>
            <p className={styles.degree}>Bachelor of Computer Science (Honours)</p>
            <p>Building theoretical foundation in algorithms, data structures, and software engineering principles through coursework and projects.</p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export const CareerSection = () => {
  const { scrollToSection } = useScrollManager()
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Handle responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
      setIsLoading(false)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Show loading state to prevent hydration mismatch
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <>
      {isMobile ? <MobileCareerView /> : <DesktopCareerView />}

      {/* Enhanced CornerLink components with section navigation */}
      <CornerLink
        href="#skills"
        position="bottom-left"
        label="Skills"
        aria-label="Navigate to skills section"
        onNavigateStart={(e) => {
          e.preventDefault()
          scrollToSection('skills')
        }}
      />
      <CornerLink
        href="#project"
        position="bottom-right"
        label="Project"
        aria-label="Navigate to project section"
        onNavigateStart={(e) => {
          e.preventDefault()
          scrollToSection('project')
        }}
      />
    </>
  )
}
