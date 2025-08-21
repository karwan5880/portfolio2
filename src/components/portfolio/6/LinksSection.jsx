'use client'

import { AnimatedSection } from '@/components/portfolio/6/AnimatedSection'

export const LinksSection = () => {
  return (
    <section className="min-h-[150vh] flex items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto w-full">
        <AnimatedSection>
          <div className="text-center">
            <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8 w-48" />
            <div className="space-y-4 px-4">
              <p className="text-white font-light text-lg leading-relaxed" style={{ fontFamily: "'Playfair Display', serif" }}>
                "To see is to believe"
              </p>
              <p className="text-gray-400 font-light text-sm">Thank you for visiting</p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
