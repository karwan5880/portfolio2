'use client'

import { motion } from 'framer-motion'

import { useIsMobile } from '@/lib/hooks/useIsMobile'

export const LandingSection = () => {
  const isMobile = useIsMobile()

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-pink-900/20" />

      <div className="text-center relative z-10 w-full max-w-6xl px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.5, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-wide leading-tight"
          style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
        >
          Leong Kar Wan
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: isMobile ? '200px' : '300px' }}
          transition={{ duration: 1.5, delay: 1.5 }}
          className="h-px bg-gradient-to-r from-transparent via-white/60 to-transparent mx-auto mt-8"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border border-white/30 rounded-full flex justify-center"
        >
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  )
}
