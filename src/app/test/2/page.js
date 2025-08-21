'use client'

import { motion, useScroll, useTransform } from 'framer-motion'

// --- 1. Icon Components ---
// These are stateless components. They receive animation instructions via props.

const LinkedInIcon = ({ variants }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants} // Apply variants here
    />
    <motion.rect
      x="2"
      y="9"
      width="4"
      height="12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants} // and here
    />
    <motion.circle
      cx="4"
      cy="4"
      r="2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants} // and here
    />
  </svg>
)

const GitHubIcon = ({ variants }) => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <motion.path
      d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={variants}
    />
  </svg>
)

// --- 2. Data for the Icons ---
const socialLinks = [
  { name: 'LinkedIn', url: '#', Icon: LinkedInIcon },
  { name: 'GitHub', url: '#', Icon: GitHubIcon },
]

// --- 3. Animation Variants ---
// These objects define the animation states (e.g., hidden, visible).

// Parent container variants: orchestrates the animation of its children.
const svgParentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Animate children one after the other with a 0.3s delay
    },
  },
}

// Child (SVG path) variants: defines how each individual path is "drawn".
const svgPathVariants = {
  hidden: {
    pathLength: 0, // Start as if the path is not drawn
    opacity: 0,
  },
  visible: {
    pathLength: 1, // Animate to the full path length
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
    },
  },
}

// Text animation variants
const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.5,
      staggerChildren: 0.08, // Stagger each letter
    },
  },
}

const letterVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

// --- Main Page Component ---
export default function HomePage() {
  const line1 = 'This text is'
  const line2 = 'drawn letter by letter.'

  // Hook for the scroll progress bar
  const { scrollYProgress } = useScroll()
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <main className="bg-gray-900 text-white min-h-[200vh] p-8 md:p-24">
      {/* Scroll Progress Bar at the top */}
      <motion.div className="fixed top-0 left-0 right-0 h-2 bg-purple-500 origin-left" style={{ scaleX }} />

      <div className="max-w-4xl mx-auto space-y-24">
        {/* --- Section 1: Instructions --- */}
        <div className="text-center h-screen flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Framer Motion Demo</h1>
          <p className="text-xl text-gray-400">Scroll down to see the animations.</p>
        </div>

        {/* --- Section 2: Animated "Drawn" Icons --- */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-12">Drawn SVG Icons</h2>
          <motion.div
            className="flex justify-center gap-8 mb-8"
            variants={svgParentVariants}
            initial="hidden"
            whileInView="visible" // Triggers animation when in view
            viewport={{ once: true, amount: 0.8 }} // Animate once, when 80% is visible
          >
            {socialLinks.map((link) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1, y: -5 }} // Hover effect
                title={link.name}
              >
                <link.Icon variants={svgPathVariants} />
              </motion.a>
            ))}
          </motion.div>
        </section>

        {/* --- Section 3: Animated "Drawn" Text --- */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-12">Drawn Text</h2>
          <motion.h3
            className="text-4xl md:text-5xl font-semibold"
            variants={sentenceVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.8 }}
          >
            {/* Split the text into letters and animate each one */}
            {line1.split('').map((char, index) => (
              <motion.span key={char + '-' + index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
            <br />
            {line2.split('').map((char, index) => (
              <motion.span key={char + '-' + index} variants={letterVariants}>
                {char}
              </motion.span>
            ))}
          </motion.h3>
        </section>

        {/* --- Section 4: Other Animation Examples --- */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-12">More Animation Types</h2>
          <motion.div
            className="w-32 h-32 bg-blue-500 rounded-lg mx-auto"
            whileHover={{ scale: 1.2, rotate: 90 }} // Hover animation
            whileTap={{ scale: 0.8, borderRadius: '100%' }} // Tap/Click animation
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          ></motion.div>
          <p className="mt-4 text-gray-400">Hover or click this box.</p>
        </section>
      </div>
    </main>
  )
}
