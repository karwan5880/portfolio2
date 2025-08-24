'use client'

import { motion, useInView } from 'framer-motion'
import { useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { MdWork } from 'react-icons/md'

import { GitHubIcon } from '@/components/icons/GitHubIcon'
import { LinkedInIcon } from '@/components/icons/LinkedInIcon'
import { TwitchIcon } from '@/components/icons/TwitchIcon'
import { YouTubeIcon } from '@/components/icons/YouTubeIcon'

import styles from './page.module.css'
import { careerPaths, education, personalInfo, projects, skills, timeline } from '@/data/portfolio-data'

const BREAKPOINTS = {
  mobile: 768,
}

const ANIMATION_CONFIG = {
  duration: 0.6,
  ease: 'easeOut',
  viewportMargin: '-50px',
}

const TYPOGRAPHY = {
  heading: "'Playfair Display', 'Georgia', serif",
}

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.mobile)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

const socialLinks = [
  { name: 'GitHub', url: personalInfo.github, Icon: GitHubIcon },
  { name: 'LinkedIn', url: personalInfo.linkedin, Icon: LinkedInIcon },
  { name: 'YouTube', url: personalInfo.youtube, Icon: YouTubeIcon },
  { name: 'Twitch', url: personalInfo.twitch, Icon: TwitchIcon },
]

const AnimatedSection = ({ children, className = '', delay = 0, direction = 'up' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    once: true,
    margin: ANIMATION_CONFIG.viewportMargin,
  })

  const initialAnimation = {
    opacity: 0,
    x: direction === 'left' ? -30 : direction === 'right' ? 30 : 0,
    y: direction === 'up' ? 20 : 0,
  }

  const animateState = { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      ref={ref}
      initial={initialAnimation}
      animate={isInView ? animateState : initialAnimation}
      transition={{
        duration: ANIMATION_CONFIG.duration,
        delay,
        ease: ANIMATION_CONFIG.ease,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const SectionTitle = ({ children, className = '' }) => (
  <h2 className={`text-4xl md:text-6xl font-light text-center mb-16 text-white ${className}`} style={{ fontFamily: TYPOGRAPHY.heading }}>
    {children}
  </h2>
)

const Card = ({ children, className = '' }) => <div className={`bg-slate-800/50 border border-white/10 rounded-2xl ${className}`}>{children}</div>

const timelineContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
    },
  },
}

const timelineItemVariants = {
  hidden: { opacity: 0, y: 20, rotate: -3 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: ANIMATION_CONFIG.duration,
      ease: ANIMATION_CONFIG.ease,
    },
  },
}

const StunningLandingSection = () => {
  const isMobile = useIsMobile()
  const ref = useRef(null)
  const [currentEffect, setCurrentEffect] = useState(0)
  const [showEffects, setShowEffects] = useState(false)
  const [particles, setParticles] = useState([])

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.7], [1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  // Cycle through different text effects
  const textEffects = ['holographic', 'neon', 'glitch', 'liquid', 'shimmer', 'typewriter', '3d', 'matrix']

  useEffect(() => {
    // Generate floating particles only on the client-side
    const generatedParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 20,
      size: Math.random() * 3 + 1,
    }))
    setParticles(generatedParticles)

    // This effect should only run once, so we can keep the rest of your logic here
    setShowEffects(true)
    const interval = setInterval(() => {
      setCurrentEffect((prev) => (prev + 1) % textEffects.length)
    }, 4000) // Change effect every 4 seconds

    return () => clearInterval(interval)
  }, []) // Empty dependency array ensures this runs only once on the client
  // --- END: FIX FOR HYDRATION ERROR ---

  // // Generate floating particles
  // const particles = Array.from({ length: 50 }, (_, i) => ({
  //   id: i,
  //   left: Math.random() * 100,
  //   animationDelay: Math.random() * 20,
  //   size: Math.random() * 3 + 1,
  // }))

  const getTextEffectClass = (effect) => {
    switch (effect) {
      case 'holographic':
        return styles.holographicText
      case 'neon':
        return styles.neonText
      case 'glitch':
        return styles.glitchWrapper
      case 'liquid':
        return styles.liquidText
      case 'shimmer':
        return styles.shimmerText
      case 'typewriter':
        return styles.typewriterText
      case '3d':
        return styles.text3D
      case 'matrix':
        return styles.matrixText
      default:
        return ''
    }
  }

  const renderTextWithEffect = (text, effect) => {
    if (effect === 'glitch') {
      return (
        <span className={styles.glitchText} data-text={text}>
          {text}
        </span>
      )
    }
    if (effect === 'liquid') {
      return (
        <span className={styles.liquidText} data-text={text}>
          {text}
        </span>
      )
    }
    return <span className={getTextEffectClass(effect)}>{text}</span>
  }

  return (
    <section ref={ref} className={`${styles.heroContainer} relative h-screen sticky top-0 flex items-center justify-center`}>
      {/* Animated background */}
      <div className={styles.heroBackground} />

      {/* Floating particles */}
      {!isMobile && (
        <div className={styles.heroParticles}>
          {particles.map((particle) => (
            <div
              key={particle.id}
              className={styles.heroParticle}
              style={{
                left: `${particle.left}%`,
                animationDelay: `${particle.animationDelay}s`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
            />
          ))}
        </div>
      )}

      <motion.div className="text-center relative z-10 w-full max-w-6xl px-4" initial="hidden" animate="visible">
        {/* Main title with cycling effects */}
        <motion.h1
          style={{ fontFamily: TYPOGRAPHY.heading, y, opacity, scale }}
          className={`${styles.heroTitle} text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide leading-tight mb-8`}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {showEffects && renderTextWithEffect(personalInfo.name, textEffects[currentEffect])}
        </motion.h1>

        {/* Subtitle with fade-in effect */}
        <motion.p className={`${styles.heroSubtitle} text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto`} style={{ opacity }}>
          Crafting digital experiences with passion and precision
        </motion.p>

        {/* CTA Button */}
        <motion.button
          className={styles.heroCTA}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          onClick={() => {
            document.querySelector('#projects')?.scrollIntoView({
              behavior: 'smooth',
            })
          }}
        >
          Explore My Work
        </motion.button>

        {/* Effect indicator */}
        <motion.div className="mt-8 text-sm text-gray-400 opacity-60" initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 2 }}>
          {textEffects[currentEffect].charAt(0).toUpperCase() + textEffects[currentEffect].slice(1)} Effect
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        style={{ opacity }}
      />
    </section>
  )
}

// Keep the original as backup
const LandingSection = () => {
  const isMobile = useIsMobile()
  const ref = useRef(null)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 0.7], [1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85])

  const dividerVariants = {
    hidden: { opacity: 0, width: 0 },
    visible: {
      opacity: 1,
      width: isMobile ? '200px' : '300px',
      transition: { duration: 1.0, ease: 'easeOut', delay: 1.5 },
    },
  }

  return (
    <section
      ref={ref}
      className="relative h-screen sticky top-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20" />

      <motion.div className="text-center relative z-10 w-full max-w-6xl px-4" initial="hidden" animate="visible">
        <motion.h1
          style={{ fontFamily: TYPOGRAPHY.heading, y, opacity, scale }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-wide leading-tight"
        >
          <span className={styles.heroDrawnTextWrapper}>
            <span className={styles.heroDrawnTextOutline}>{personalInfo.name}</span>

            <motion.span
              className={styles.heroDrawnTextFill}
              initial={{ clipPath: 'inset(0 100% 0 0)' }}
              animate={{ clipPath: 'inset(0 0% 0 0)' }}
              transition={{ duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.5 }}
            >
              {personalInfo.name}
            </motion.span>
          </span>
        </motion.h1>

        <motion.div
          variants={dividerVariants}
          style={{ opacity }}
          className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-8"
        />
      </motion.div>
    </section>
  )
}

const EducationSection = () => {
  return (
    <section className="relative z-10 py-24 lg:py-32 px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatedSection>
          <SectionTitle>Education</SectionTitle>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {education.map((edu, index) => (
            <AnimatedSection key={edu.id} delay={index * 0.02} direction={index % 2 === 0 ? 'left' : 'right'}>
              <Card className="p-6 md:p-8">
                <h3 className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: TYPOGRAPHY.heading }}>
                  {edu.degree}
                </h3>
                <p className={`${edu.color} font-light`}>{edu.institution}</p>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

const TimelineSection = () => {
  return (
    <section className="py-24 lg:py-32 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto w-full relative">
        <AnimatedSection>
          <SectionTitle>Journey</SectionTitle>
        </AnimatedSection>
        <div className={styles.timeline}>
          <div className={styles.timelineLine}></div>
          {timeline.map((item, index) => (
            <motion.div
              key={item.year + index} // Use a more unique key
              className={styles.timelineItem}
              initial={{ opacity: 0, x: -50 }} // Start invisible and to the right
              whileInView={{ opacity: 1, x: 0 }} // Animate to visible and final position
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.timelineIcon}>
                <MdWork />
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.timelinePeriod}>{item.year}</span>
                <h3 className={styles.timelineRole}>{item.title}</h3>
                <p className={styles.timelineCompany}>{item.status}</p>
                <p className={styles.timelineDescription}>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

const SkillsSection = () => {
  const SkillCard = ({ title, children, delay }) => (
    <AnimatedSection delay={delay}>
      <Card className="p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-light text-white mb-6 text-center" style={{ fontFamily: TYPOGRAPHY.heading }}>
          {title}
        </h3>
        {children}
      </Card>
    </AnimatedSection>
  )

  return (
    <section className="py-24 lg:py-32 px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatedSection>
          <SectionTitle>Expertise</SectionTitle>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <SkillCard title="Core Languages" delay={0.2}>
            <ul className="space-y-4">
              {skills.main.map((skill) => (
                <li key={skill.name} className="bg-slate-700/50 border border-white/10 rounded-xl p-4 text-center">
                  <span className="text-lg md:text-xl font-medium text-white">{skill.name}</span>
                </li>
              ))}
            </ul>
          </SkillCard>

          <SkillCard title="Other Skills" delay={0.4}>
            <div className="flex flex-wrap gap-2">
              {skills.other.map((skill) => (
                <span key={skill} className="px-3 py-1 bg-slate-700/60 border border-white/10 rounded-full text-sm text-gray-200">
                  {skill}
                </span>
              ))}
            </div>
          </SkillCard>
        </div>
      </div>
    </section>
  )
}

const CareerPlanSection = () => {
  const CareerPathCard = ({ path, index }) => (
    <AnimatedSection key={path.id} delay={index * 0.01}>
      <motion.div className="h-full" whileHover={{ scale: 1.03, y: -8 }} transition={{ duration: 0.2, ease: 'easeOut' }}>
        <Card className="p-6 md:p-8 h-full">
          <div className="text-center mb-4">
            <div className="text-4xl mb-3">{path.icon}</div>
            <div className="flex items-center justify-center gap-3 mb-3">
              <h3 className="text-xl md:text-2xl font-light text-white" style={{ fontFamily: TYPOGRAPHY.heading }}>
                {path.title}
              </h3>
              <span className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">{path.tag}</span>
            </div>
          </div>

          <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 text-center">{path.description}</p>

          <div className="flex flex-wrap gap-2 justify-center">
            {path.technologies.map((tech) => (
              <span
                key={tech}
                className={`px-3 py-1 bg-gradient-to-r ${path.color} bg-opacity-20 border border-white/10 rounded-full text-xs text-white`}
              >
                {tech}
              </span>
            ))}
          </div>
        </Card>
      </motion.div>
    </AnimatedSection>
  )

  return (
    <section className="py-24 lg:py-32 px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatedSection>
          <SectionTitle>Career Plan</SectionTitle>
        </AnimatedSection>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {careerPaths.map((path, index) => (
              <CareerPathCard key={path.id} path={path} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const ProjectsSection = () => {
  const ProjectCard = ({ project, index }) => {
    const ref = useRef(null)

    const { scrollYProgress } = useScroll({
      target: ref,
      offset: ['start end', 'end start'],
    })

    const imageY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%'])

    const cardClasses = `
      bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden h-full 
      transition-all duration-300 
      ${project.link ? 'hover:bg-slate-800/70 hover:border-white/20 cursor-pointer' : ''}
    `.trim()

    return (
      <section ref={ref} className="relative h-[80vh] rounded-2xl overflow-hidden">
        <motion.img src={project.imageUrl} alt={project.title} className="absolute inset-0 w-full h-full object-cover" style={{ y: imageY }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
        <div className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white">
          <h3 className="text-3xl md:text-5xl font-light" style={{ fontFamily: TYPOGRAPHY.heading }}>
            {project.link ? (
              <Link href={project.link} target="_blank" rel="noopener noreferrer">
                <span className="absolute inset-0" aria-hidden="true" />
                {project.title}
              </Link>
            ) : (
              project.title
            )}
          </h3>
          <p className="mt-4 max-w-xl text-gray-300">{project.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span key={tech} className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 lg:py-32 px-4 bg-slate-900">
      <div className="max-w-6xl mx-auto w-full">
        <div className="text-center mb-16">
          <SectionTitle>Project Showcase</SectionTitle>
        </div>
        <div className="space-y-16 md:space-y-24">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

const DesignFooter = () => {
  const svgParentVariants = {
    visible: { transition: { staggerChildren: 0.2 } },
    hidden: {},
  }
  const svgPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1, ease: 'easeInOut' },
    },
  }
  return (
    <footer className="bg-black py-24 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        <p className="text-3xl lg:text-4xl font-light text-white mb-8" style={{ fontFamily: TYPOGRAPHY.heading }}>
          {personalInfo.thankYou}
        </p>
        <motion.div
          className="flex justify-center gap-6 mb-8"
          variants={svgParentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {socialLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1, y: -4 }}
              title={link.name}
            >
              <span className="sr-only">{link.name}</span>
              <link.Icon variants={svgPathVariants} />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main>
      <StunningLandingSection />
      <div className="relative z-10 bg-slate-900" id="projects">
        <EducationSection />
        <TimelineSection />
        <SkillsSection />
        <CareerPlanSection />
        <ProjectsSection />
        <DesignFooter />
      </div>
    </main>
  )
}
