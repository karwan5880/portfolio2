'use client'

import { AnimatedSection } from '@/components/portfolio/6/AnimatedSection'

import { coreSkills, otherSkills } from './data/skills'

export const SkillsSection = () => {
  return (
    <section className="min-h-[150vh] flex items-center justify-center px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto w-full">
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
