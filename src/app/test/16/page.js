'use client'

import { motion } from 'framer-motion'
import { Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaGraduationCap } from 'react-icons/fa'

import { GitHubIcon } from '@/components/icons/GitHubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { ResumeIcon } from '@/components/icons/ResumeIcon'
import { TwitchIcon } from '@/components/icons/TwitchIcon'
import { YouTubeIcon } from '@/components/icons/YouTubeIcon'

import styles from './page.module.css'
import { careerPaths, education, personalInfo, projects, skills, timeline } from '@/data/portfolio-data'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
})

const LandingSection = () => {
  const socialLinks = [
    { name: 'Resume', url: personalInfo.resume, Icon: ResumeIcon },
    { name: 'GitHub', url: personalInfo.github, Icon: GitHubIcon },
    { name: 'LinkedIn', url: personalInfo.linkedin, Icon: LinkedInIcon },
    { name: 'YouTube', url: personalInfo.youtube, Icon: YouTubeIcon },
    { name: 'Twitch', url: personalInfo.twitch, Icon: TwitchIcon },
  ]

  const sectionNav = [
    { name: 'Education', href: '#education' },
    { name: 'Journey', href: '#journey' },
    { name: 'Expertise', href: '#expertise' },
    { name: 'Career', href: '#career' },
    { name: 'Projects', href: '#projects' }, // Corrected link
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  }
  const svgParentVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
  }
  const svgPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1.0, ease: 'easeInOut' } },
  }

  return (
    <section className={styles.landingSection}>
      <div className={styles.landingBackground}></div>
      <motion.div className={styles.introContainer} variants={containerVariants} initial="hidden" animate="visible">
        <motion.h1 variants={itemVariants} className={`${styles.introHeading} ${playfair.className}`}>
          Hello, my name is <span className={styles.gradientText}>Leong Kar Wan</span>
        </motion.h1>
        <motion.p variants={itemVariants} className={styles.introParagraph}>
          I'm from Kuala Lumpur, Malaysia. I'm a software engineer and developer, building everything from Windows apps to modern web solutions. My
          main language is Python, with a little C/C++, and I'm currently expanding my skills in React, Django.
        </motion.p>
        <motion.div variants={itemVariants} className={styles.sectionNav}>
          {sectionNav.map((link) => (
            <a key={link.name} href={link.href} className={styles.navButton}>
              {link.name}
            </a>
          ))}
        </motion.div>
        <motion.div className={styles.socialContainer} variants={svgParentVariants} initial="hidden" animate="visible">
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialIcon}
              whileHover={{ scale: 1.2, y: -5 }}
              title={link.name}
            >
              <span className="sr-only">{link.name}</span>
              <link.Icon variants={svgPathVariants} />
            </motion.a>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}

const StickySection = ({ title, children, bgColor = styles.bgSlate900, id, className = '' }) => {
  return (
    <section id={id} className={`${styles.stickySection} ${bgColor}`}>
      <div className={`${styles.sectionContent} ${className}`}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.container}>{children}</div>
      </div>
    </section>
  )
}

const EducationSection = () => (
  <StickySection title="Education" id="education">
    <div className={`${styles.grid} ${styles.gridCols2}`}>
      {education.map((edu) => (
        <div key={edu.id} className={styles.educationCard}>
          <div className={styles.educationIcon}>
            <FaGraduationCap />
          </div>
          <div className={styles.educationText}>
            <h3 className={styles.educationDegree}>{edu.degree}</h3>
            <p className={`${styles.educationInstitution} ${edu.color}`}>{edu.institution}</p>
          </div>
        </div>
      ))}
    </div>
  </StickySection>
)
const TimelineSection = () => (
  <StickySection title="Journey" id="journey" bgColor={styles.bgBlack} className={styles.autoHeight}>
    <div className={styles.timeline}>
      <div className={styles.timelineLine}></div>
      {timeline.map((item, index) => {
        const isLeft = index % 2 === 0
        return (
          <motion.div
            key={`${item.year}-${index}`}
            className={`${styles.timelineItem} ${isLeft ? styles.timelineItemLeft : styles.timelineItemRight}`}
            initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className={styles.timelineIcon}></div>
            <div className={styles.timelineContent}>
              <span className={styles.timelinePeriod}>{item.year}</span>
              <h3 className="text-xl font-bold mt-1 text-white">{item.title}</h3>
              <p className="text-gray-300">{item.status}</p>
              <p className="text-gray-400 mt-2 text-sm">{item.description}</p>
            </div>
          </motion.div>
        )
      })}
    </div>
  </StickySection>
)

const SkillsSection = () => {
  // We still duplicate the skills array for a seamless loop
  const marqueeSkills = [...skills.other, ...skills.other]

  return (
    <StickySection title="Expertise" id="expertise">
      {/* Main Skills Grid (no changes needed here) */}
      <div className={styles.skillsGrid}>
        {skills.main.map((skill) => (
          <motion.div
            key={skill.name}
            className={styles.mainSkillCard}
            whileHover={{ y: -8, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className={styles.skillIcon}>
              <skill.icon />
            </div>
            <h3 className={styles.skillName}>{skill.name}</h3>
            <p className={styles.skillDescription}>{skill.description}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.marqueeSubheading}>
        <h4>Also familiar with...</h4>
      </div>

      {/* The new Framer Motion-powered marquee */}
      <div className={styles.marquee}>
        <motion.div
          className={styles.marqueeContent}
          // The animation is now handled entirely by Framer Motion
          animate={{ x: '-50%' }}
          transition={{
            duration: 40, // Controls the speed
            repeat: Infinity, // Makes it loop forever
            repeatType: 'loop', // Ensures a smooth, continuous loop
            ease: 'linear', // Keeps the speed constant
          }}
        >
          {marqueeSkills.map((skill, index) => (
            <div key={`other-${index}`} className={styles.skillTag}>
              {skill}
            </div>
          ))}
        </motion.div>
      </div>
    </StickySection>
  )
}

const SkillsSection3 = () => {
  // We duplicate the 'other' skills for the seamless marquee loop
  const marqueeSkills = [...skills.other, ...skills.other]

  return (
    <StickySection title="Expertise" id="expertise">
      {/* Part 1: Main Skills Grid (no changes) */}
      <div className={`${styles.grid} ${styles.gridCols3}`}>
        {skills.main.map((skill) => (
          <motion.div
            key={skill.name}
            className={styles.mainSkillCard}
            whileHover={{ y: -8, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className={styles.skillIcon}>
              <skill.icon />
            </div>
            <h3 className={styles.skillName}>{skill.name}</h3>
            <p className={styles.skillDescription}>{skill.description}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.marqueeSubheading}>
        <h4>Also familiar with...</h4>
      </div>

      {/* Part 2: Marquee for Other Skills (now on all devices) */}
      <div className={styles.marquee}>
        <motion.div
          className={styles.marqueeContent}
          initial={{ x: 0 }}
          animate={{ x: '-50%' }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        >
          {marqueeSkills.map((skill, index) => (
            <div key={`other-${index}`} className={styles.skillTag}>
              {skill}
            </div>
          ))}
        </motion.div>
      </div>
    </StickySection>
  )
}

const SkillsSection2 = () => {
  const [isMobile, setIsMobile] = useState(false)

  // This effect runs on the client to detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    // Check on initial load
    checkScreenSize()
    // Add listener for screen size changes
    window.addEventListener('resize', checkScreenSize)
    // Cleanup listener on component unmount
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // We only duplicate skills for the desktop marquee
  const marqueeSkills = [...skills.other, ...skills.other]

  return (
    <StickySection title="Expertise" id="expertise">
      {/* Part 1: Main Skills Grid (no changes here) */}
      <div className={`${styles.grid} ${styles.gridCols3}`}>
        {skills.main.map((skill) => (
          <motion.div
            key={skill.name}
            className={styles.mainSkillCard}
            whileHover={{ y: -8, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className={styles.skillIcon}>
              <skill.icon />
            </div>
            <h3 className={styles.skillName}>{skill.name}</h3>
            <p className={styles.skillDescription}>{skill.description}</p>
          </motion.div>
        ))}
      </div>

      <div className={styles.marqueeSubheading}>
        <h4>Also familiar with...</h4>
      </div>

      {isMobile ? (
        <div className={styles.staticSkillsContainer}>
          {skills.other.map((skill) => (
            <div key={skill} className={styles.skillTag}>
              {skill}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.marquee}>
          <motion.div
            className={styles.marqueeContent}
            initial={{ x: 0 }}
            animate={{ x: '-50%' }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          >
            {marqueeSkills.map((skill, index) => (
              <div key={`other-${index}`} className={styles.skillTag}>
                {skill}
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </StickySection>
  )
}

const CareerPlanSection = () => (
  <StickySection title="Career Plan" id="career">
    <div className={`${styles.grid} ${styles.gridCols2}`}>
      {careerPaths.map((path) => (
        <motion.div key={path.id} className={styles.card} whileHover={{ scale: 1.03, y: -8 }} transition={{ duration: 0.2 }}>
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">{path.icon}</div>
            <h3 className="text-xl font-light text-white">{path.title}</h3>
            <span className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">{path.tag}</span>
          </div>
          <p className="text-center mb-4 text-gray-300">{path.description}</p>
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

const ProjectsSection = () => (
  <StickySection title="Project Showcase" id="projects">
    <div className={`${styles.grid} ${styles.gridCols2}`}>
      {projects.map((project) => {
        const cardContent = (
          <>
            <img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <h3 className={`${styles.title} text-3xl`}>{project.title}</h3>
              <p className="mt-4 max-w-xl text-gray-300">{project.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span key={tech} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </>
        )
        const clickableClasses = project.link ? styles.projectCardLink : ''
        const baseClasses = 'relative h-[60vh] rounded-2xl overflow-hidden block'
        return project.link ? (
          <Link key={project.title} href={project.link} target="_blank" rel="noopener noreferrer" className={`${baseClasses} ${clickableClasses}`}>
            {cardContent}
          </Link>
        ) : (
          <div key={project.title} className={baseClasses}>
            {cardContent}
          </div>
        )
      })}
    </div>
  </StickySection>
)

export default function Home() {
  return (
    <main className={styles.pageWrapper}>
      <LandingSection />
      <EducationSection />
      <TimelineSection />
      <SkillsSection />
      <CareerPlanSection />
      <ProjectsSection />
    </main>
  )
}
