'use client'

import { CornerLink } from '@/components/CornerLink'

import styles from './career.module.css'
import { useGatekeeper } from '@/hooks/useGatekeeper'

export default function CareerPage() {
  useGatekeeper('/career')

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Career Roadmap</h1>
        <p>Future Planning</p>
      </div>

      {/* Five Column Layout */}
      <div className={styles.threeColumns}>
        {/* Time Labels - Positioned relative to entire layout */}
        <div className={styles.timeLabelsColumn}>
          <div className={styles.timeLabelInColumn + ' ' + styles.futurePosition}>FUTURE</div>
          <div className={styles.timeLabelInColumn + ' ' + styles.presentPosition}>PRESENT</div>
          <div className={styles.timeLabelInColumn + ' ' + styles.pastPosition}>PAST</div>
        </div>

        {/* Left Column - Embedded Systems */}
        <div className={styles.leftColumn}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>⚙️</div>
            <h3>Embedded Systems Engineer</h3>
            <p>Building firmware and low-level systems for IoT devices, sensors, and microcontrollers. Real-time performance and hardware optimization.</p>
            <div className={styles.tags}>
              <span>C/C++</span>
              <span>RTOS</span>
              <span>Microcontrollers</span>
              <span>IoT</span>
            </div>
          </div>
        </div>

        {/* Left Arrow Column */}
        <div className={styles.arrowColumn}>
          <div className={styles.arrowToCenter}>↗</div>
          <div className={styles.arrowFromCenter}>↖</div>
        </div>

        {/* Middle Column - Main Path */}
        <div className={styles.middleColumn}>
          {/* PhD - Top */}
          <div className={styles.phdTag}>🎓 PhD</div>

          {/* Arrow up */}
          <div className={styles.arrowUp}>↑</div>

          {/* AI + Robotics */}
          <div className={styles.card + ' ' + styles.convergence}>
            {/* <div className={styles.cardIcon}>🤖</div> */}
            <h2>🤖 &nbsp; &nbsp;&nbsp; AI + Robotics</h2>
            {/* <p>Building intelligent systems that bridge the digital-physical divide through autonomous robotics, computer vision, and embodied AI</p> */}
          </div>

          {/* Spacing */}
          <div className={styles.reducedSpace}></div>

          {/* Current Position */}
          <div className={styles.card + ' ' + styles.current}>
            <div className={styles.cardIcon}>👨‍💻</div>
            <h3>Software Engineer</h3>
            <p className={styles.degree}>Master of Engineering Science</p>
            <p>Building web apps, automation scripts, and backend systems. Currently working on data pipelines and React frontends.</p>
            <div className={styles.tags}>
              <span>Python</span>
              <span>C/C++</span>
              <span>React</span>
              <span>JavaScript</span>
              {/* <span>SQL</span> */}
            </div>
          </div>

          {/* Arrow up */}
          <div className={styles.arrowUp}>↑</div>

          {/* Foundation */}
          <div className={styles.card + ' ' + styles.foundation}>
            <div className={styles.cardIcon}>🎓</div>
            <h3>Student</h3>
            <p className={styles.degree}>Bachelor of Computer Science (Honours)</p>
            <p>Building theoretical foundation in algorithms, data structures, and software engineering principles through coursework and projects.</p>
          </div>
        </div>

        {/* Right Arrow Column */}
        <div className={styles.arrowColumn}>
          <div className={styles.arrowToCenter}>↖</div>
          <div className={styles.arrowFromCenter}>↗</div>
        </div>

        {/* Right Column - AI Engineering */}
        <div className={styles.rightColumn}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🧠</div>
            <h3>AI/ML Engineer</h3>
            <p>Developing intelligent systems through machine learning, computer vision, llm, and neural networks for real-world applications</p>
            <div className={styles.tags}>
              <span>Python</span>
              <span>TensorFlow</span>
              <span>PyTorch</span>
              <span>OpenCV</span>
            </div>
          </div>
        </div>
      </div>

      <CornerLink href="/skills" position="bottom-left" label="Skills" aria-label="Return to skills" />
      <CornerLink href="/location" position="bottom-right" label="Location" aria-label="Go to location" />
    </div>
  )
}
