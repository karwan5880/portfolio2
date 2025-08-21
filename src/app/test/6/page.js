'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { FiArrowDown } from 'react-icons/fi'

// Using an icon for the scroll indicator

// ============================================================================
// THE "GROUNDED HERO" COMPONENT
// ============================================================================
const GroundedHeroSection = () => {
  // 1. A ref to the main section to track its scroll progress
  const ref = useRef(null)

  // 2. The useScroll hook tracks the section as it moves through the viewport
  const { scrollYProgress } = useScroll({
    target: ref,
    // 'start start': Progress is 0 when the top of the section hits the top of the screen.
    // 'end start': Progress is 1 when the bottom of the section hits the top of the screen.
    offset: ['start start', 'end start'],
  })

  // 3. The Parallax Transformations
  // The background moves at half the speed of the scroll (0% to 50%)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  // The text moves twice as fast as the scroll (0% to 200%), making it quickly scroll out of view
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '200%'])

  return (
    // The main container is a normal section. It is NOT sticky.
    // It needs 'relative' for the z-index stacking and 'overflow-hidden'
    // to contain the parallaxing elements.
    <section ref={ref} className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Layer 1: The Parallax Background Image */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070)`, // A nice placeholder
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          y: backgroundY, // Apply the parallax effect
        }}
      />

      {/* Layer 2: The Dark Overlay for Readability */}
      <div className="absolute inset-0 z-10 bg-black/60" />

      {/* Layer 3: The Content */}
      <motion.div
        className="relative z-20 flex flex-col items-center text-center text-white px-4"
        style={{ y: textY }} // Apply the parallax effect
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold">Grounded Hero</h1>

        <p className="mt-4 text-lg text-gray-200 max-w-2xl">This section introduces the content, and then gracefully scrolls out of the way.</p>

        <motion.a
          href="#"
          className="mt-8 px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg transition-colors hover:bg-blue-700"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Call to Action
        </motion.a>
      </motion.div>

      {/* The Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-3xl text-white"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <FiArrowDown />
      </motion.div>
    </section>
  )
}

// ============================================================================
// THE MAIN PAGE COMPONENT
// ============================================================================
export default function TestPage() {
  return (
    <main className="bg-slate-900">
      {/* This first section creates space so you can scroll TO the hero */}
      <div className="h-screen flex items-center justify-center text-center text-white">
        <h1 className="text-5xl">
          This is the section BEFORE the hero.
          <br />
          Scroll Down.
        </h1>
      </div>

      {/* This is the hero we are testing */}
      <GroundedHeroSection />

      {/* This third section proves that the hero has scrolled away */}
      <div className="h-screen flex items-center justify-center text-center text-white">
        <h1 className="text-5xl">
          This is the section AFTER the hero.
          <br />
          The hero is now gone.
        </h1>
      </div>
    </main>
  )
}
