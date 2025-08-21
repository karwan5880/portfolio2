'use client'

import styles from './mobile-career.module.css'

export default function MobileCareerView() {
  return (
    <div className={styles.mobileContainer}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Career Roadmap</h1>
        <p>Future Planning</p>
      </div>

      {/* Mobile Career Cards */}
      <div className={styles.careerFlow}>
        {/* Future Goal */}
        <div className={styles.futureSection}>
          <div className={styles.sectionLabel}>Future Goal</div>
          <div className={styles.phdBadge}>🎓 PhD</div>
          <div className={styles.card + ' ' + styles.futureCard}>
            <div className={styles.cardIcon}>🤖</div>
            <h2>AI + Robotics</h2>
            <p>Building intelligent systems that bridge the digital-physical divide through autonomous robotics, computer vision, and embodied AI</p>
          </div>
        </div>

        {/* Jobs I'm Looking For */}
        <div className={styles.alternativesSection}>
          <div className={styles.sectionLabel}>Jobs I'm Looking For</div>

          <div className={styles.alternativeCards}>
            <div className={styles.card + ' ' + styles.alternativeCard}>
              <div className={styles.cardIcon}>⚙️</div>
              <h4>Embedded Systems</h4>
              <p>IoT devices, sensors, and microcontrollers</p>
              <div className={styles.miniTags}>
                <span>C/C++</span>
                <span>RTOS</span>
                <span>IoT</span>
              </div>
            </div>

            <div className={styles.card + ' ' + styles.alternativeCard}>
              <div className={styles.cardIcon}>🧠</div>
              <h4>AI/ML Engineer</h4>
              <p>Machine learning and neural networks</p>
              <div className={styles.miniTags}>
                <span>Python</span>
                <span>TensorFlow</span>
                <span>PyTorch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Position */}
        <div className={styles.currentSection}>
          <div className={styles.sectionLabel}>Present</div>
          <div className={styles.card + ' ' + styles.currentCard}>
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
          </div>
        </div>

        {/* Past */}
        <div className={styles.pastSection}>
          <div className={styles.sectionLabel}>Past</div>
          <div className={styles.card + ' ' + styles.foundationCard}>
            <div className={styles.cardIcon}>🎓</div>
            <h3>Student</h3>
            <p className={styles.degree}>Bachelor of Computer Science (Honours)</p>
            <p>Building theoretical foundation in algorithms, data structures, and software engineering principles through coursework and projects.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
