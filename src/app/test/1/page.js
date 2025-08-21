'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { FaAws, FaBullseye, FaChartLine, FaFigma, FaNodeJs, FaReact } from 'react-icons/fa'
import { FiArrowDown, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import { MdWork } from 'react-icons/md'
import { SiMongodb, SiNextdotjs, SiTailwindcss } from 'react-icons/si'

import styles from './page.module.css'

// --- Data for sections ---

const educationData = [
  {
    degree: 'Master of Science in Computer Science',
    institution: 'University of Technology',
    period: '2020 - 2022',
    details: 'Focused on AI and Machine Learning, graduating with honors.',
  },
  {
    degree: 'Bachelor of Science in Software Engineering',
    institution: 'State University',
    period: '2016 - 2020',
    details: 'Gained a strong foundation in software development principles and practices.',
  },
]

const journeyData = [
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
  {
    role: 'Senior Frontend Developer',
    company: 'Tech Solutions Inc.',
    period: '2022 - Present',
    description: 'Leading the development of a large-scale React application, mentoring junior developers, and improving code quality.',
  },
  {
    role: 'Frontend Developer',
    company: 'Innovate Co.',
    period: '2020 - 2022',
    description: 'Developed and maintained user interfaces for various client projects using Vue.js and modern frontend technologies.',
  },
]

const skills = [
  { name: 'React', icon: <FaReact className={styles.skillIcon} /> },
  { name: 'Next.js', icon: <SiNextdotjs className={styles.skillIcon} /> },
  { name: 'Node.js', icon: <FaNodeJs className={styles.skillIcon} /> },
  { name: 'MongoDB', icon: <SiMongodb className={styles.skillIcon} /> },
  { name: 'Tailwind CSS', icon: <SiTailwindcss className={styles.skillIcon} /> },
  { name: 'Figma', icon: <FaFigma className={styles.skillIcon} /> },
  { name: 'AWS', icon: <FaAws className={styles.skillIcon} /> },
]

const projects = [
  {
    title: 'Project One',
    description: 'A cutting-edge e-commerce platform built with Next.js and Stripe.',
    image: '/project1.jpg', // Add images to /public
    tags: ['React', 'Next.js', 'Stripe'],
  },
  {
    title: 'Project Two',
    description: 'A data visualization dashboard for a SaaS product.',
    image: '/project2.jpg', // Add images to /public
    tags: ['Vue', 'D3.js', 'Node.js'],
  },
]

export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%'])

  return (
    <main className={styles.main}>
      {/* 1. Landing Hero Section */}
      <section ref={heroRef} className={styles.hero}>
        <motion.div
          className={styles.heroBackground}
          style={{
            backgroundImage: `url(/hero-background.jpg)`, // Add a background image to your /public folder
            y: backgroundY,
          }}
        />
        <div className={styles.heroOverlay} />
        <motion.div className={styles.heroContent} style={{ y: textY }}>
          <h1 className={styles.heroTitle}>Your Name</h1>
          <p className={styles.heroSubtitle}>I'm a [Your Role] passionate about building beautiful and functional web experiences.</p>
          <motion.a href="#projects" className={styles.heroCtaButton} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            View My Work
          </motion.a>
        </motion.div>
        <motion.div
          className={styles.scrollIndicator}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FiArrowDown />
        </motion.div>
      </section>

      {/* 2. Education Section */}
      <section id="education" className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Education</h2>
          <div>
            {educationData.map((edu, index) => (
              <motion.div
                key={index}
                className={styles.educationCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <h3 className={styles.educationDegree}>{edu.degree}</h3>
                <p className={styles.educationInstitution}>{edu.institution}</p>
                <p className={styles.educationPeriod}>{edu.period}</p>
                <p className={styles.educationDetails}>{edu.details}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Journey Section */}
      <section id="journey" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>My Journey</h2>
          <div className={styles.timeline}>
            <div className={styles.timelineLine}></div>
            {journeyData.map((item, index) => (
              <motion.div
                key={index}
                className={styles.timelineItem}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6 }}
              >
                <div className={styles.timelineIcon}>
                  <MdWork />
                </div>
                <div className={styles.timelineContent}>
                  <span className={styles.timelinePeriod}>{item.period}</span>
                  <h3 className={styles.timelineRole}>{item.role}</h3>
                  <p className={styles.timelineCompany}>{item.company}</p>
                  <p className={styles.timelineDescription}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Expertise Section */}
      <section id="expertise" className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>My Expertise</h2>
          <div className={styles.expertiseGrid}>
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className={styles.skillCard}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1 }}
              >
                {skill.icon}
                <h3 className={styles.skillName}>{skill.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Career Plan Section */}
      <section id="career-plan" className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Career Plan</h2>
          <div className={styles.careerPlanGrid}>
            <motion.div
              className={styles.careerCard}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className={styles.careerCardHeader}>
                <FaBullseye className={styles.careerIcon} />
                <h3 className={styles.careerTitle}>Short-Term Goals</h3>
              </div>
              <p className={styles.careerText}>
                Within the next 1-2 years, I aim to deepen my expertise in cloud-native technologies and take on a leadership role in a challenging
                project.
              </p>
            </motion.div>
            <motion.div
              className={styles.careerCard}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className={styles.careerCardHeader}>
                <FaChartLine className={styles.careerIcon} />
                <h3 className={styles.careerTitle}>Long-Term Goals</h3>
              </div>
              <p className={styles.careerText}>
                In 5-10 years, I aspire to become a Principal Engineer, where I can architect scalable systems and mentor the next generation of
                developers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. Project Showcase Section */}
      <section id="projects" className={`${styles.section} ${styles.sectionGray}`}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Project Showcase</h2>
          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className={styles.projectCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className={styles.projectImageContainer}>
                  <Image src={project.image} alt={project.title} layout="fill" objectFit="cover" className={styles.projectImage} />
                </div>
                <div className={styles.projectContent}>
                  <h3 className={styles.projectTitle}>{project.title}</h3>
                  <p className={styles.projectDescription}>{project.description}</p>
                  <div className={styles.projectTags}>
                    {project.tags.map((tag) => (
                      <span key={tag} className={styles.projectTag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer Section */}
      <footer className={styles.footer}>
        <div className={styles.container}>
          <h2 className={styles.footerTitle}>Get In Touch</h2>
          <p className={styles.footerText}>I'm currently open to new opportunities. Feel free to reach out.</p>
          <a href="mailto:your.email@example.com" className={styles.footerEmailLink}>
            your.email@example.com
          </a>
          <div className={styles.socialLinks}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FiGithub />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FiLinkedin />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <FiTwitter />
            </a>
          </div>
          <p className={styles.copyright}>&copy; {new Date().getFullYear()} Your Name. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  )
}
