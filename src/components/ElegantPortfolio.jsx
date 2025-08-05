'use client'

import { motion, useInView } from 'framer-motion'
import Link from 'next/link'
import { useRef } from 'react'

// Simple fade-in animation component
const FadeInSection = ({ children, delay = 0, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }} className={className}>
      {children}
    </motion.div>
  )
}

// Hero Section
const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}>
          <h1 className="text-6xl md:text-8xl font-light mb-8 text-white leading-tight">Leong Kar Wan</h1>

          <motion.div initial={{ width: 0 }} animate={{ width: '200px' }} transition={{ duration: 1, delay: 0.5 }} className="h-px bg-white mx-auto mb-12" />

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1 }} className="text-xl md:text-2xl text-gray-300 font-light mb-16 max-w-2xl mx-auto leading-relaxed">
            Full Stack Developer crafting digital experiences with precision and purpose
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.5 }} className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-black font-medium rounded-sm hover:bg-gray-100 transition-colors">
              View My Work
            </motion.button>

            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 border border-white text-white font-medium rounded-sm hover:bg-white hover:text-black transition-colors">
              Get In Touch
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// About Section
const AboutSection = () => {
  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <FadeInSection>
            <h2 className="text-4xl md:text-5xl font-light mb-8 text-white">About Me</h2>
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>I'm a passionate full stack developer with a Master's in Engineering Science, specializing in creating seamless digital experiences that bridge the gap between design and functionality.</p>
              <p>My journey spans from computer vision research to modern web development, always driven by curiosity and the desire to build meaningful solutions.</p>
              <p>When I'm not coding, you'll find me exploring new technologies, contributing to open source projects, or diving deep into AI and machine learning.</p>
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium text-white mb-4">Education</h3>
                <div className="space-y-3 text-gray-300">
                  <div>
                    <div className="font-medium">Master of Engineering Science</div>
                    <div className="text-sm text-gray-400">Universiti Tunku Abdul Rahman</div>
                  </div>
                  <div>
                    <div className="font-medium">Bachelor of Computer Science</div>
                    <div className="text-sm text-gray-400">Universiti Tunku Abdul Rahman</div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-white mb-4">Focus Areas</h3>
                <div className="flex flex-wrap gap-3">
                  {['Full Stack Development', 'AI & Machine Learning', 'Computer Vision', 'Web Technologies'].map((area) => (
                    <span key={area} className="px-4 py-2 border border-gray-600 text-gray-300 text-sm rounded-sm">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  )
}

// Skills Section
const SkillsSection = () => {
  const skills = [
    { name: 'Python', level: 95 },
    { name: 'React', level: 92 },
    { name: 'Node.js', level: 88 },
    { name: 'TypeScript', level: 85 },
    { name: 'Next.js', level: 90 },
    { name: 'Django', level: 82 },
    { name: 'Machine Learning', level: 78 },
    { name: 'Computer Vision', level: 80 },
  ]

  return (
    <section className="py-32 px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-white text-center">Skills & Expertise</h2>
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-8">
          {skills.map((skill, index) => (
            <FadeInSection key={skill.name} delay={index * 0.1}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-white font-medium">{skill.name}</span>
                  <span className="text-gray-400 text-sm">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 h-1 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }} viewport={{ once: true }} className="h-full bg-white rounded-full" />
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// Projects Section
const ProjectsSection = () => {
  const projects = [
    {
      title: 'License Plate Detection System',
      description: 'AI-powered system for automatic license plate recognition using deep learning and computer vision techniques.',
      tech: ['Python', 'OpenCV', 'YOLO', 'TensorFlow'],
      status: 'Research Complete',
    },
    {
      title: '3D Earth Visualization',
      description: 'Interactive 3D Earth model with real-time data visualization and smooth navigation controls.',
      tech: ['Three.js', 'WebGL', 'JavaScript', 'APIs'],
      status: 'Live Demo',
      link: '/location',
    },
    {
      title: 'Drone Light Show Simulator',
      description: 'Choreographed drone performance simulator with synchronized lighting and music integration.',
      tech: ['React Three Fiber', 'GLSL', 'WebGL', 'Audio APIs'],
      status: 'Performance Ready',
      link: '/finale',
    },
    {
      title: 'IoT Bluetooth Hub',
      description: 'Raspberry Pi-based communication hub for seamless device connectivity and data management.',
      tech: ['Raspberry Pi', 'Python', 'Bluetooth 5.0', 'Linux'],
      status: 'Experimental',
    },
  ]

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <FadeInSection>
          <h2 className="text-4xl md:text-5xl font-light mb-16 text-white text-center">Selected Projects</h2>
        </FadeInSection>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <FadeInSection key={project.title} delay={index * 0.1}>
              <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="border border-gray-700 p-8 rounded-sm hover:border-gray-600 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium text-white group-hover:text-gray-100 transition-colors">{project.title}</h3>
                  <span className="text-xs text-gray-400 border border-gray-600 px-2 py-1 rounded-sm">{project.status}</span>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech) => (
                    <span key={tech} className="text-xs text-gray-400 bg-gray-800 px-3 py-1 rounded-sm">
                      {tech}
                    </span>
                  ))}
                </div>

                {project.link && (
                  <Link href={project.link} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 text-sm font-medium inline-flex items-center gap-2 transition-colors">
                    View Project <span>→</span>
                  </Link>
                )}
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// Contact Section
const ContactSection = () => {
  return (
    <section className="py-32 px-6 bg-gray-900/50">
      <div className="max-w-4xl mx-auto text-center">
        <FadeInSection>
          <h2 className="text-4xl md:text-5xl font-light mb-8 text-white">Let's Connect</h2>
          <p className="text-xl text-gray-300 mb-16 max-w-2xl mx-auto leading-relaxed">I'm always interested in new opportunities and meaningful conversations. Feel free to reach out if you'd like to collaborate or just say hello.</p>
        </FadeInSection>

        <FadeInSection delay={0.2}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <motion.a href="https://github.com/karwan5880/portfolio2" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 border border-gray-600 text-white font-medium rounded-sm hover:bg-white hover:text-black transition-colors inline-flex items-center gap-3">
              <span>GitHub</span>
              <span>→</span>
            </motion.a>

            <motion.a href="https://linkedin.com/in/karwanleong" target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-black font-medium rounded-sm hover:bg-gray-100 transition-colors inline-flex items-center gap-3">
              <span>LinkedIn</span>
              <span>→</span>
            </motion.a>
          </div>
        </FadeInSection>

        <FadeInSection delay={0.4}>
          <div className="border-t border-gray-700 pt-8">
            <p className="text-gray-400 text-sm">Thanks for visiting my portfolio</p>
          </div>
        </FadeInSection>
      </div>
    </section>
  )
}

// Main component
export const ElegantPortfolio = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
    </div>
  )
}
