'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { MdWork } from 'react-icons/md'

import { GitHubIcon } from '@/components/icons/GitHubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { TwitchIcon } from '@/components/icons/TwitchIcon'
import { YouTubeIcon } from '@/components/icons/YouTubeIcon'

import styles from './page.module.css'
import { careerPaths, education, personalInfo, projects, skills, timeline } from '@/data/portfolio-data'

// Simple Landing Section
const LandingSection = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className={styles.landingSection}>
      <motion.h1 className={styles.heroTitle} initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}>
        {mounted ? <span className={styles.neonText}>{personalInfo.name}</span> : <span className={styles.textWhite}>{personalInfo.name}</span>}
      </motion.h1>
    </section>
  )
}

// Clean Sticky Section Component
const StickySection = ({ title, children, bgColor = styles.bgSlate900 }) => {
  return (
    <section className={styles.stickySection}>
      <div className={`${styles.stickyTitle} ${bgColor}`}>
        <h2 className={styles.title}>{title}</h2>
      </div>
      <div className={`${styles.sectionContent} ${bgColor}`}>
        <div className={styles.container}>{children}</div>
      </div>
    </section>
  )
}

// Education Section
const EducationSection = () => (
  <StickySection title="Education">
    <div className={`${styles.grid} ${styles.gridCols2}`}>
      {education.map((edu) => (
        <div key={edu.id} className={styles.card}>
          <h3 className={`${styles.textWhite} text-xl font-light mb-2`}>{edu.degree}</h3>
          <p className={`${edu.color} font-light`}>{edu.institution}</p>
        </div>
      ))}
    </div>
  </StickySection>
)

// Timeline Section
const TimelineSection = () => (
  <StickySection title="Journey" bgColor={styles.bgBlack}>
    <div className={styles.timeline}>
      <div className={styles.timelineLine}></div>
      {timeline.map((item, index) => (
        <motion.div
          key={`${item.year}-${index}`}
          className={styles.timelineItem}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className={styles.timelineIcon}>
            <MdWork />
          </div>
          <div className={styles.timelineContent}>
            <span className={styles.textBlue400}>{item.year}</span>
            <h3 className={`${styles.textWhite} text-xl font-bold mt-1`}>{item.title}</h3>
            <p className={styles.textGray300}>{item.status}</p>
            <p className={styles.textGray300}>{item.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </StickySection>
)

// Skills Section
const SkillsSection = () => (
  <StickySection title="Expertise">
    <div className={`${styles.grid} ${styles.gridCols2}`}>
      <div className={styles.card}>
        <h3 className={`${styles.textWhite} text-2xl font-light mb-6 text-center`}>Core Languages</h3>
        <div className="space-y-4">
          {skills.core.map((skill) => (
            <div key={skill} className="bg-slate-700/50 border border-white/10 rounded-xl p-4 text-center">
              <span className={`${styles.textWhite} text-lg font-medium`}>{skill}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={`${styles.textWhite} text-2xl font-light mb-6 text-center`}>Other Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.other.map((skill) => (
            <span key={skill} className="px-3 py-1 bg-slate-700/60 border border-white/10 rounded-full text-sm text-gray-200">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  </StickySection>
)

// Career Plan Section
const CareerPlanSection = () => (
  <StickySection title="Career Plan">
    <div className={`${styles.grid} ${styles.gridCols2}`}>
      {careerPaths.map((path) => (
        <motion.div key={path.id} className={styles.card} whileHover={{ scale: 1.03, y: -8 }} transition={{ duration: 0.2 }}>
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">{path.icon}</div>
            <h3 className={`${styles.textWhite} text-xl font-light`}>{path.title}</h3>
            <span className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">{path.tag}</span>
          </div>
          <p className={`${styles.textGray300} text-center mb-4`}>{path.description}</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {path.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white/10 border border-white/10 rounded-full text-xs text-white">
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </StickySection>
)

// Projects Section
const ProjectsSection = () => (
  <StickySection title="Project Showcase">
    <div className="space-y-16">
      {projects.map((project) => (
        <div key={project.title} className="relative h-[80vh] rounded-2xl overflow-hidden">
          <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
          <div className="relative h-full flex flex-col justify-end p-8 text-white">
            <h3 className={`${styles.title} text-3xl`}>{project.title}</h3>
            <p className={`${styles.textGray300} mt-4 max-w-xl`}>{project.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </StickySection>
)

// Anime-Style "The End" Footer
const AnimeEndingFooter = () => {
  const socialLinks = [
    { name: 'GitHub', url: personalInfo.github, Icon: GitHubIcon },
    { name: 'LinkedIn', url: personalInfo.linkedin, Icon: LinkedInIcon },
    { name: 'YouTube', url: personalInfo.youtube, Icon: YouTubeIcon },
    { name: 'Twitch', url: personalInfo.twitch, Icon: TwitchIcon },
  ]

  const svgParentVariants = {
    visible: {
      transition: {
        staggerChildren: 0.5, // Delay between each icon (0.5 seconds)
        delayChildren: 0.1, // Wait 3 seconds after "Thank You" appears
      },
    },
    hidden: {},
  }

  const svgPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1, // How long each icon takes to draw (2 seconds)
        ease: 'easeInOut',
      },
    },
  }

  return (
    <section className={styles.animeEnding}>
      {/* Spacer to push sticky title up BEFORE thank you appears */}
      <div className={styles.stickyTitlePusher}></div>

      {/* "Thank You For Visiting" - Anime style */}
      <div className={styles.animeEndingContent}>
        <motion.div
          className={styles.thankYouContainer}
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <h2 className={styles.animeTitle}>{personalInfo.thankYou}</h2>
        </motion.div>

        {/* Social Media Icons - Delayed appearance */}
        <motion.div
          className={styles.socialContainer}
          variants={svgParentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              whileHover={{ scale: 1.2, y: -8 }}
              title={link.name}
            >
              <span className="sr-only">{link.name}</span>
              <link.Icon variants={svgPathVariants} />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// Main Component
export default function Home() {
  return (
    <main>
      <LandingSection />
      <EducationSection />
      <TimelineSection />
      <SkillsSection />
      <CareerPlanSection />
      <ProjectsSection />
      <AnimeEndingFooter />
    </main>
  )
}
