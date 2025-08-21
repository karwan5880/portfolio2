'use client'

import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// ============================================================================
// REUSABLE & DEMO COMPONENTS
// ============================================================================

// --- Icon Components (needed for Effects 5 & 6) ---
const GitHubIcon = ({ variants }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants}
    />
  </svg>
)

const LinkedInIcon = ({ variants }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants}
    />
    <motion.rect
      x="2"
      y="9"
      width="4"
      height="12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants}
    />
    <motion.circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={variants} />
  </svg>
)

// --- EFFECT #6: Animated Text Reveal Component ---
const AnimatedTitle = ({ text }) => {
  const words = text.split(' ')
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.5 })

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
  }
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  }

  return (
    <motion.h2
      ref={containerRef}
      className="text-4xl font-bold text-slate-800 md:text-5xl"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      aria-label={text}
    >
      {words.map((word, index) => (
        <span key={index} className="inline-block overflow-hidden pb-2">
          <motion.span className="inline-block" variants={wordVariants}>
            {word}
          </motion.span>
          {/* Add a space back in */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </motion.h2>
  )
}

// ============================================================================
// THE MAIN DEMO PAGE COMPONENT
// ============================================================================

export default function AdvancedDemoPage() {
  // HOOKS FOR PAGE-WIDE EFFECTS
  const { scrollYProgress } = useScroll()

  // EFFECT #1: The scroll progress indicator
  // We map the page's scroll progress (0 to 1) directly to the scaleX of the progress bar.
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  // EFFECT #3: The "Color Journey" background transition
  // As we scroll, we transform the progress value into a sequence of colors.
  const backgroundColor = useTransform(scrollYProgress, [0, 0.25, 0.5, 0.75, 1], ['#ffffff', '#f1f5f9', '#e2e8f0', '#f1f5f9', '#ffffff'])

  return (
    <main>
      {/* EFFECT #1: The progress bar is fixed to the top of the screen */}
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50" style={{ scaleX }} />

      {/* A simple hero section to give some scroll space */}
      <section className="h-screen flex items-center justify-center bg-slate-100">
        <h1 className="text-5xl font-bold text-center">
          Advanced Framer Motion Demos
          <br />
          <span className="text-2xl text-slate-600 font-normal">Scroll Down to See the Effects</span>
        </h1>
      </section>

      {/* The main content wrapper that will change color */}
      <motion.div style={{ backgroundColor }}>
        {/* --- SECTION FOR EFFECT #6 --- */}
        <section className="py-24 lg:py-32 px-8">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedTitle text="Animated Text Reveal by Word" />
            <p className="mt-8 text-lg text-slate-600">
              This title animates word by word as it scrolls into view. It uses `staggerChildren` on a parent container to orchestrate the animation
              of each individual word, which is wrapped in its own motion component.
            </p>
          </div>
        </section>

        {/* --- EFFECT #2: Horizontal Scrolling "Filmstrip" Section --- */}
        <HorizontalScrollSection />

        {/* --- SECTION FOR EFFECTS #4 & #7 --- */}
        <Footer />
      </motion.div>
    </main>
  )
}

// ============================================================================
// HORIZONTAL SCROLL COMPONENT (Effect #2)
// ============================================================================
const HorizontalScrollSection = () => {
  // 1. A ref to the container that will be scrolled through
  const targetRef = useRef(null)
  // 2. Use useScroll to track the scroll progress of the targetRef
  const { scrollYProgress } = useScroll({ target: targetRef })
  // 3. Map the vertical scroll progress (0 to 1) to a horizontal movement (x)
  // We move it from 0% to -50% to scroll through two "pages" of content.
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-55%'])

  const projects = [
    { title: 'Project Alpha', color: 'bg-red-500' },
    { title: 'Project Beta', color: 'bg-green-500' },
    { title: 'Project Gamma', color: 'bg-purple-500' },
    { title: 'Project Delta', color: 'bg-yellow-500' },
  ]

  return (
    // The container needs a specific height to dedicate to the horizontal scroll
    <section ref={targetRef} className="relative h-[300vh] bg-slate-900">
      {/* The sticky container acts as our "viewport" for the horizontal content */}
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* The horizontally moving div */}
        <motion.div style={{ x }} className="flex gap-8">
          {/* A title card that stays on the left */}
          <div className="flex-shrink-0 w-screen max-w-2xl px-8 flex flex-col justify-center">
            <h2 className="text-5xl font-bold text-white">Horizontal Scroll</h2>
            <p className="text-slate-300 mt-4 text-lg">
              As you scroll down, the content moves sideways. This is achieved by linking the vertical `scrollYProgress` of the tall parent container
              to the horizontal `x` position of this content.
            </p>
          </div>
          {/* The project cards that scroll by */}
          {projects.map((p, i) => (
            <div key={i} className={`w-[60vw] h-[60vh] rounded-2xl flex items-center justify-center text-4xl font-bold text-white ${p.color}`}>
              {p.title}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// FOOTER COMPONENT (Effects #4 & #7)
// ============================================================================
const Footer = () => {
  // State to track the currently hovered link for the magic underline
  const [hovered, setHovered] = useState(null)

  const socialLinks = [
    { name: 'GitHub', Icon: GitHubIcon },
    { name: 'LinkedIn', Icon: LinkedInIcon },
  ]

  // Variants for the SVG drawing animation
  const svgParentVariants = { visible: { transition: { staggerChildren: 0.2 } } }
  const svgPathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 1, ease: 'easeInOut' } },
  }

  return (
    <footer className="py-24 lg:py-32 px-8 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-slate-800 md:text-5xl mb-8">Interactive Demos</h2>

        {/* --- EFFECT #4: "Magic" Sliding Underline --- */}
        <p className="text-slate-600 mb-2">Hover over the icons below.</p>
        <div
          className="relative flex justify-center gap-8"
          onMouseLeave={() => setHovered(null)} // Reset when the mouse leaves the container
        >
          {socialLinks.map((link, index) => (
            <div key={link.name} className="relative" onMouseEnter={() => setHovered(index)}>
              <a href="#" className="block p-2 text-slate-500 hover:text-blue-600 transition-colors">
                <span className="sr-only">{link.name}</span>
                <link.Icon />
              </a>

              {/* The underline div. It only renders under the hovered item. */}
              {hovered === index && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  layoutId="underline" // The magic prop!
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </div>
          ))}
        </div>

        {/* --- EFFECT #7: SVG Icon Drawing Animation --- */}
        <p className="text-slate-600 mt-16 mb-2">These icons "draw" themselves when they scroll into view.</p>
        <motion.div
          className="flex justify-center gap-8"
          variants={svgParentVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {socialLinks.map((link) => (
            <a key={link.name} href="#" className="p-2 text-slate-800">
              <span className="sr-only">{link.name}</span>
              <link.Icon variants={svgPathVariants} />
            </a>
          ))}
        </motion.div>
      </div>
    </footer>
  )
}
