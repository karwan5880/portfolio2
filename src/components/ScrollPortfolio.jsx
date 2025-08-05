'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { DesignFooter } from './DesignFooter'

// Mobile detection hook
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// SIMPLE animated section that ACTUALLY WORKS
const AnimatedSection = ({ children, className = '', delay = 0 }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>
      {children}
    </motion.div>
  )
}

// Landing section
const LandingSection = () => {
  const isMobile = useIsMobile()

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20" />

      <div className="text-center relative z-10 w-full max-w-6xl px-4">
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2.5, ease: 'easeOut' }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-wide leading-tight" style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}>
          Leong Kar Wan
        </motion.h1>

        <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: isMobile ? '200px' : '300px' }} transition={{ duration: 1.5, delay: 1.5 }} className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-8" />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// Education section
const EducationSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-4xl md:text-6xl font-light text-center mb-16 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Education
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <AnimatedSection delay={0.2}>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Master of Engineering Science
              </h3>
              <p className="text-blue-300 font-light">Universiti Tunku Abdul Rahman</p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-light text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Bachelor of Computer Science
              </h3>
              <p className="text-purple-300 font-light">Universiti Tunku Abdul Rahman</p>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// Timeline section
const TimelineSection = () => {
  const timelineEvents = [
    { year: '2025.06', title: 'Full Stack App Practice', description: 'Building a social media app with React and Django', status: 'Present' },
    { year: '2025.02', title: 'WinRT, KMDF, Flutter, Godot, Next.js', description: 'Building new projects and learning new languages/framework', status: 'Recent' },
    { year: '2024.08', title: 'Leetcode Practice', description: 'Practicing coding problems and learning new programming languages', status: 'Growth' },
    { year: '2024.01', title: 'Desktop Application Design', description: 'Making desktop apps for Windows', status: 'Achievement' },
    { year: '2022', title: "Master's Research", description: 'Using AI to detect license plates in images', status: 'Academic' },
    { year: '2020', title: 'Python and Computer Vision', description: 'Learning Python and C++ by building Computer Vision applications', status: 'Learning' },
    { year: '2019', title: 'Final Year Project', description: 'Big school project that taught me how to code properly', status: 'Milestone' },
    { year: '2018', title: 'First Job, Internship', description: 'My first real job building websites with Angular and .NET', status: 'Beginning' },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          <h2 className="text-4xl md:text-6xl font-light text-center mb-16 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Journey
          </h2>
        </AnimatedSection>

        <div className="space-y-8">
          {timelineEvents.map((event, index) => (
            <AnimatedSection key={event.year} delay={index * 0.1}>
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-light text-blue-300" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {event.year}
                  </span>
                  <span className="px-3 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300 border border-purple-500/30">{event.status}</span>
                </div>

                <h3 className="text-lg md:text-xl font-medium text-white mb-3">{event.title}</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">{event.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// Skills section
const SkillsSection = () => {
  const coreSkills = ['Python', 'C/C++', 'React']
  const otherSkills = ['JavaScript', 'TypeScript', 'HTML/CSS', 'Node.js', 'Django', 'Flask', 'Three.js', 'WebGL', 'OpenCV', 'YOLO', 'Machine Learning', 'Computer Vision', 'PyQt6', 'PySide6', 'Angular', '.NET Core', 'SQL', 'MongoDB', 'Git', 'Docker', 'Linux', 'Raspberry Pi', 'IoT', 'Bluetooth', 'Flutter', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'GSAP', 'Godot', 'Game Development', 'Reinforcement Learning', 'Deep Learning']

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-4xl md:text-6xl font-light text-center mb-16 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Expertise
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatedSection delay={0.2}>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-light text-white mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Core Languages
              </h3>
              <div className="space-y-4">
                {coreSkills.map((skill) => (
                  <div key={skill} className="bg-slate-700/50 border border-white/10 rounded-xl p-4 text-center">
                    <span className="text-lg md:text-xl font-medium text-white">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-light text-white mb-6 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>
                Other Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {otherSkills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-slate-700/60 border border-white/10 rounded-full text-sm text-gray-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// Career Plan section
const CareerPlanSection = () => {
  const careerPaths = [
    { id: 'ai-robotics', title: 'PhD & AI Robotics', description: 'Building smart robots and AI systems that work in the real world', technologies: ['Deep Learning', 'Computer Vision', 'Robotics', 'Research'], color: 'from-blue-500 to-cyan-400', icon: '🤖', tag: 'Future' },
    { id: 'ai-engineer', title: 'AI Engineer', description: 'Creating smart AI solutions that solve real problems', technologies: ['Machine Learning', 'Neural Networks', 'MLOps', 'Data Science'], color: 'from-purple-500 to-pink-400', icon: '🧠', tag: 'Alternative Choice' },
    { id: 'embedded', title: 'Embedded Systems', description: 'Making hardware and software work together perfectly', technologies: ['C/C++', 'RTOS', 'Microcontrollers', 'IoT'], color: 'from-orange-500 to-red-400', icon: '⚙️', tag: 'Alternative Choice' },
    { id: 'fullstack', title: 'Full Stack Developer', description: 'Building websites and apps that people love to use', technologies: ['React', 'Django', 'Cloud', 'DevOps'], color: 'from-green-500 to-teal-400', icon: '💻', tag: 'Present' },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-4xl md:text-6xl font-light text-center mb-16 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Career Plan
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {careerPaths.map((path, index) => (
            <AnimatedSection key={path.id} delay={index * 0.1}>
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 md:p-8 h-full">
                <div className="text-center mb-4">
                  <div className="text-4xl mb-3">{path.icon}</div>
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <h3 className="text-xl md:text-2xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {path.title}
                    </h3>
                    <span className="px-2 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white/80">{path.tag}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4 text-center">{path.description}</p>

                <div className="flex flex-wrap gap-2 justify-center">
                  {path.technologies.map((tech) => (
                    <span key={tech} className={`px-3 py-1 bg-gradient-to-r ${path.color} bg-opacity-20 border border-white/10 rounded-full text-xs text-white`}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// Projects section
const ProjectsSection = () => {
  const projects = [
    { title: 'License Plate Detection', description: 'AI system that can find and read license plates in photos', technologies: ['OpenCV', 'YOLO', 'EfficientDet', 'CenterNet', 'Faster R-CNN', 'SSD', 'Python', 'Deep Learning'], status: 'Complete', category: 'AI Research', color: 'from-purple-600 to-pink-500', link: null },
    { title: 'Earth Model', description: '3D Earth model you can spin around and explore with real data', technologies: ['Three.js', 'WebGL', 'JavaScript', 'Real-time APIs'], status: 'Live Demo', category: '3D Visualization', color: 'from-blue-600 to-cyan-500', link: '/location' },
    { title: 'Drone Show Simulator', description: 'Drones that dance in the sky with lights and music', technologies: ['React Three Fiber', 'Choreography', 'Light Systems', 'GLSL', 'Shaders'], status: 'Performance Ready', category: 'React Three GLSL', color: 'from-green-600 to-teal-500', link: '/finale' },
    { title: 'Raspberry Pi 4 Bluetooth Hub', description: 'Small computer that helps devices talk to each other wirelessly', technologies: ['Raspberry Pi 4', 'Bluetooth 5.0', 'Python', 'Bus'], status: 'Experimental', category: 'Embedded IoT', color: 'from-orange-600 to-red-500', link: null },
  ]

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection>
          <h2 className="text-4xl md:text-6xl font-light text-center mb-16 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Project Showcase
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <AnimatedSection key={project.title} delay={index * 0.1}>
              <div className="bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden h-full">
                <div className={`h-24 bg-gradient-to-br ${project.color} relative flex items-center justify-center`}>
                  <div className="text-center">
                    <div className="text-white/80 text-sm font-light">{project.category}</div>
                    <div className="text-white text-lg font-medium">{project.title}</div>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 bg-black/30 rounded-full text-xs text-white">{project.status}</span>
                  </div>
                  {project.link && (
                    <div className="absolute top-3 left-3">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🔗</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-slate-700/60 border border-white/10 rounded-full text-xs text-gray-200">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.link && (
                    <Link href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
                      <span>Click to explore</span>
                      <span>→</span>
                    </Link>
                  )}
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// Links section
const LinksSection = () => {
  const mottos = ['Code with purpose, build with heart', 'Dream it, code it, make it real', 'Building tomorrow, one line at a time', 'Where creativity meets technology', 'Think different, code better', 'Making ideas come alive through code', 'Every bug is a step closer to perfection', 'Code is poetry, software is art', 'Turning coffee into code since 2018', 'Keep coding, keep dreaming', 'Simple code, powerful results', 'Innovation through dedication', 'Crafting digital experiences', 'Code today, change tomorrow']
  const [randomMotto, setRandomMotto] = useState(mottos[0])

  useEffect(() => {
    setRandomMotto(mottos[Math.floor(Math.random() * mottos.length)])
  }, [])

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection>
          {/* <h2 className="text-4xl md:text-6xl font-light text-center mb-16 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Connect
          </h2> */}
        </AnimatedSection>

        <div className="space-y-6 max-w-md mx-auto">
          <AnimatedSection delay={0.2}>
            <a href="https://github.com/karwan5880/portfolio2" target="_blank" rel="noopener noreferrer" className="block w-full bg-slate-800/50 border border-white/10 rounded-2xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center">
                  <Image src="/icons/github.svg" alt="GitHub" width={24} height={24} className="filter invert" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    GitHub
                  </h3>
                  <p className="text-sm text-gray-400">View Source Code</p>
                </div>
                <div className="text-gray-400">→</div>
              </div>
            </a>
          </AnimatedSection>

          <AnimatedSection delay={0.4}>
            <a href="https://linkedin.com/in/karwanleong" target="_blank" rel="noopener noreferrer" className="block w-full bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 hover:bg-slate-800/70 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                  <Image src="/icons/linkedin.svg" alt="LinkedIn" width={24} height={24} className="filter invert" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-light text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    LinkedIn
                  </h3>
                  <p className="text-sm text-blue-300">Add me</p>
                </div>
                <div className="text-blue-400">→</div>
              </div>
            </a>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.6}>
          <div className="text-center mt-16 mb-12">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8 w-48" />
            <div className="space-y-4 px-4">
              <p className="text-white font-light text-lg leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                {/* "{randomMotto}" */}
              </p>
              <p className="text-gray-400 font-light text-sm">Thanks for visiting</p>
            </div>
            <div className="h-16" />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// Main portfolio component
export const ScrollPortfolio = () => {
  return (
    <div className="overflow-x-hidden">
      <LandingSection />
      <EducationSection />
      <TimelineSection />
      <SkillsSection />
      <CareerPlanSection />
      <ProjectsSection />
      <LinksSection />
      <DesignFooter />
    </div>
  )
}
