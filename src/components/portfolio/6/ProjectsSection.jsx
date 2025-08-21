'use client'

import Link from 'next/link'

import { AnimatedSection } from '@/components/portfolio/6/AnimatedSection'

import { projects } from './data/projects'

export const ProjectsSection = () => {
  return (
    <section className="min-h-[150vh] flex items-center justify-center px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatedSection>
          <h2 className="text-4xl md:text-6xl font-light text-center mb-16 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Project Showcase
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, index) => {
            const Wrapper = project.link ? Link : 'div'
            const wrapperProps = project.link
              ? {
                  href: project.link,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'block h-full',
                }
              : {}

            return (
              <AnimatedSection key={project.title} delay={index * 0.1}>
                <Wrapper {...wrapperProps}>
                  <div
                    className={`bg-slate-800/50 border border-white/10 rounded-2xl overflow-hidden h-full transition-all duration-300 ${
                      project.link ? 'hover:bg-slate-800/70 hover:border-white/20 cursor-pointer' : ''
                    }`}
                  >
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

                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="px-3 py-1 bg-slate-700/60 border border-white/10 rounded-full text-xs text-gray-200">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Wrapper>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
