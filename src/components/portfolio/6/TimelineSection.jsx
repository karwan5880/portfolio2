'use client'

import { AnimatedSection } from '@/components/portfolio/6/AnimatedSection'

import { timelineEvents } from './data/timeline'

export const TimelineSection = () => {
  return (
    <section className="min-h-[150vh] flex items-center justify-center px-4 bg-gradient-to-b from-slate-900 to-black">
      <div className="max-w-4xl mx-auto w-full">
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
