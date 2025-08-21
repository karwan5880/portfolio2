'use client'

import { AnimatedSection } from '@/components/portfolio/6/AnimatedSection'

export const EducationSection = () => {
  return (
    <section className="min-h-[150vh] flex items-center justify-center px-4 bg-gradient-to-b from-black to-slate-900">
      <div className="max-w-6xl mx-auto w-full">
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
