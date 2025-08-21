'use client'

import { AnimatedSection } from '@/components/portfolio/6/AnimatedSection'

import { careerPaths } from './data/career-paths'

export const CareerPlanSection = () => {
  return (
    <section className="min-h-[150vh] flex items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-6xl mx-auto w-full">
        <AnimatedSection>
          <h2 className="text-4xl md:text-6xl font-light text-center mb-16 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            Career Plan
          </h2>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          {/* Career Path Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
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
                      <span
                        key={tech}
                        className={`px-3 py-1 bg-gradient-to-r ${path.color} bg-opacity-20 border border-white/10 rounded-full text-xs text-white`}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Career Flow Arrows - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute inset-0 pointer-events-none">
            {/* Full Stack -> AI Engineer (bottom row, left to right) */}
            <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center text-white/40">
                <span className="text-lg">→</span>
              </div>
            </div>

            {/* Full Stack -> Embedded Systems (left column, bottom to top) */}
            <div className="absolute left-1/4 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-90">
              <div className="flex items-center text-white/40">
                <span className="text-lg">→</span>
              </div>
            </div>

            {/* AI Engineer -> PhD & AI Robotics (right column, bottom to top) */}
            <div className="absolute right-1/4 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-90">
              <div className="flex items-center text-white/40">
                <span className="text-lg">→</span>
              </div>
            </div>

            {/* Embedded Systems -> PhD & AI Robotics (top row, left to right) */}
            <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2">
              <div className="flex items-center text-white/40">
                <span className="text-lg">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
