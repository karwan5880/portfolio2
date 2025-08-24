'use client'

import { motion } from 'framer-motion'
import { Playfair_Display } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

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

// --- Landing, Sticky, Education, and Timeline Sections (No Changes) ---
const LandingSection = () => {
  // const sectionRef = useRef(null) // Create a ref for the section element
  // useEffect(() => {
  //   const landingSection = sectionRef.current
  //   if (!landingSection) return
  //   const handleMouseMove = (e) => {
  //     const rect = landingSection.getBoundingClientRect()
  //     const x = e.clientX - rect.left
  //     const y = e.clientY - rect.top
  //     landingSection.style.setProperty('--x', `${x}px`)
  //     landingSection.style.setProperty('--y', `${y}px`)
  //   }
  //   landingSection.addEventListener('mousemove', handleMouseMove)
  //   return () => {
  //     landingSection.removeEventListener('mousemove', handleMouseMove)
  //   }
  // }, [])

  const socialLinks = [
    { name: 'GitHub', url: personalInfo.github, Icon: GitHubIcon },
    { name: 'LinkedIn', url: personalInfo.linkedin, Icon: LinkedInIcon },
    { name: 'YouTube', url: personalInfo.youtube, Icon: YouTubeIcon },
    { name: 'Twitch', url: personalInfo.twitch, Icon: TwitchIcon },
    { name: 'Resume', url: personalInfo.resume, Icon: ResumeIcon },
  ]

  const sectionNav = [
    { name: 'Education', href: '#education' },
    { name: 'Journey', href: '#journey' },
    { name: 'Skills', href: '#skills' },
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
      {/* <section className={styles.landingSection} ref={sectionRef}> */}
      {/* <div className={styles.landingBackground}></div> */}
      <motion.div className={styles.introContainer} variants={containerVariants} initial="hidden" animate="visible">
        <motion.h1 variants={itemVariants} className={`${styles.introHeading} ${playfair.className}`}>
          Hi, my name is{' '}
          <span className={styles.hoverContainer}>
            <span className={styles.gradientText}>Leong Kar Wan</span>
          </span>
        </motion.h1>
        <motion.p variants={itemVariants} className={styles.introParagraph}>
          I'm from <span className={styles.highlightLocation}>Kuala Lumpur, Malaysia.</span> I'm a software engineer and developer, building
          everything from Windows apps to modern web solutions. My main language is Python, with a little C/C++, and I'm currently expanding my skills
          in React, Django.
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
        {children}
      </div>
    </section>
  )
}

const EducationSection = () => (
  <StickySection title="Education" id="education">
    <div className={styles.container}>
      {/* FIXED: Using single column grid for alignment */}
      <div className={`${styles.grid} ${styles.singleColumnGrid}`}>
        {education.map((edu) => (
          <div key={edu.id} className={styles.educationCard}>
            <Image
              src="/images/utar.jpg"
              alt="Universiti Tunku Abdul Rahman Logo"
              width={100} /* Adjust width as needed */
              height={100} /* Adjust height as needed */
              className={styles.educationIcon}
            />
            <p className={`${styles.educationInstitution} ${edu.color}`}>{edu.institution}</p>
            <h3 className={styles.educationDegree}>{edu.degree}</h3>
          </div>
        ))}
      </div>
    </div>
  </StickySection>
)

const TimelineSection = () => (
  <StickySection title="Journey" id="journey" bgColor={styles.bgBlack} className={styles.autoHeight}>
    <div className={styles.container}>
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
                <h3 className={styles.timelineTitle}>{item.title}</h3>
                <p className={styles.timelineStatus}>{item.status}</p>
                <p className={styles.timelineDescription}>{item.description}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  </StickySection>
)

const SkillsSection = () => {
  const marqueeSkills = [...skills.other, ...skills.other]

  return (
    <StickySection title="Skills" id="skills" className={styles.skillsSectionLayout}>
      <div className={styles.container}>
        <div className={styles.mainSkillsGrid}>
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
              <div>
                <h3 className={styles.skillName}>{skill.name}</h3>
                <p className={styles.skillDescription}>{skill.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className={styles.marqueeSubheading}>
        <h4>Also familiar with...</h4>
      </div>

      <div className={styles.marqueeContainer}>
        <motion.div
          className={styles.marqueeContent}
          animate={{ x: '-50%' }}
          transition={{
            duration: 50,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'linear',
          }}
        >
          {marqueeSkills.map((skill, index) => (
            <div key={index} className={styles.skillTag}>
              {skill}
            </div>
          ))}
        </motion.div>
      </div>
    </StickySection>
  )
}

const CareerPlanSection = () => (
  <StickySection title="Career Plan" id="career" bgColor={styles.bgBlack}>
    <div className={styles.container}>
      <div className={`${styles.grid} ${styles.singleColumnGrid}`}>
        {careerPaths.map((path) => (
          <motion.div
            key={path.id}
            className={styles.careerCard} // The parent card needs to be a positioning anchor
            whileHover={{ scale: 1.03, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.shinyTag}>{path.statusTag}</div>
            <div className={styles.careerCardHeader}>
              <div className={styles.careerCardIcon}>{path.icon}</div>
              <h3 className={styles.careerCardTitle}>{path.title}</h3>
              {/* <span className={styles.careerCardTag}>{path.tag}</span> */}
            </div>
            <p className={styles.careerCardDescription}>{path.description}</p>
            <div className={styles.careerCardTechContainer}>
              {path.technologies.map((tech) => (
                <span key={tech} className={styles.careerCardTech}>
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </StickySection>
)

const ProjectsSection = () => {
  const recentProjects = projects.filter((project) => project.category === 'recent')
  const olderProjects = projects.filter((project) => project.category === 'older')
  const renderProjectList = (projectList) => {
    return projectList.map((project) => {
      const cardContent = (
        <>
          <img src={project.imageUrl} alt={project.title} className={styles.projectCardImage} />
          <div className={styles.projectCardOverlay} />
          <div className={styles.projectCardContent}>
            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDescription}>{project.description}</p>
            <div className={styles.projectTechContainer}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.projectTech}>
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </>
      )
      const cardClasses = `${styles.projectCard} ${project.link ? styles.projectCardLink : ''}`
      return project.link ? (
        <Link key={project.title} href={project.link} target="_blank" rel="noopener noreferrer" className={cardClasses}>
          {cardContent}
        </Link>
      ) : (
        <div key={project.title} className={cardClasses}>
          {cardContent}
        </div>
      )
    })
  }
  return (
    <StickySection title="Project Showcase" id="projects">
      <div className={styles.container}>
        <h2 className={styles.projectSubheading}>Recent Projects (click to view)</h2>
        <div className={`${styles.grid} ${styles.projectGrid}`}>{renderProjectList(recentProjects)}</div>
        <h2 className={`${styles.projectSubheading} ${styles.marginTopLarge}`}>Older Projects</h2>
        <div className={`${styles.grid} ${styles.projectGrid}`}>{renderProjectList(olderProjects)}</div>
      </div>
    </StickySection>
  )
}

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
