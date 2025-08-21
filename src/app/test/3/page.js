'use client'

import { motion } from 'framer-motion'

// --- Reusable Component for Technique 1: Staggered Letter Reveal ---
const StaggeredText = ({ text, el: Wrapper = motion.p, className }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  }

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', damping: 12, stiffness: 100 },
    },
  }

  return (
    <Wrapper className={className} variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.25em]">
          {word.split('').map((char, charIndex) => (
            <motion.span key={charIndex} className="inline-block" variants={childVariants}>
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </Wrapper>
  )
}

// --- Component for Technique 2: SVG Text Path Drawing ---
const SvgDrawnText = () => {
  const text = 'Creative'
  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.5 },
    },
  }

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 2, ease: 'easeInOut' },
    },
  }

  return (
    // FIXED: Removed height="auto"
    <motion.svg width="100%" viewBox="0 0 500 100" variants={textVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <motion.text
        x="50%"
        y="70%"
        textAnchor="middle"
        fontSize="80"
        fontWeight="bold"
        fill="transparent"
        stroke="white"
        strokeWidth="1"
        variants={pathVariants}
      >
        {text}
      </motion.text>
    </motion.svg>
  )
}

// --- Component for Technique 3: Clip-Path Reveal ---
// FIXED: Changed default element to motion.p
const ClipPathText = ({ text, el: Wrapper = motion.p, className }) => {
  const variants = {
    hidden: {
      clipPath: 'inset(0 100% 0 0)',
    },
    visible: {
      clipPath: 'inset(0 0 0 0)',
      transition: {
        duration: 1.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  }

  return (
    <Wrapper className={className}>
      <motion.span className="inline-block" variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
        {text}
      </motion.span>
    </Wrapper>
  )
}

// --- Main Page Component ---
export default function HomePage() {
  return (
    <main className="bg-gray-900 text-white min-h-[300vh] p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-48">
        <div className="h-screen flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Text Drawing Techniques</h1>
          <p className="text-xl text-gray-400">Scroll down to see the magic.</p>
        </div>

        {/* --- Section 1: Staggered Letter Reveal --- */}
        <section>
          <h2 className="text-lg font-semibold text-purple-400 mb-4">Technique 1: Staggered Reveal</h2>
          <StaggeredText el={motion.h2} text="Animate every single letter." className="text-4xl md:text-6xl font-bold" />
          {/* This instance now correctly defaults to <motion.p> */}
          <StaggeredText
            text="This technique offers granular control and is great for engaging headlines and paragraphs. Each character fades and slides into view in a delightful sequence."
            className="mt-6 text-xl text-gray-300"
          />
        </section>

        {/* --- Section 2: SVG Text Path Drawing --- */}
        <section>
          <h2 className="text-lg font-semibold text-cyan-400 mb-4">Technique 2: SVG Path Drawing</h2>
          <p className="mb-6 text-xl text-gray-300">
            For a true "hand-drawn" effect, we use SVG text. Framer Motion animates the stroke as if a pen is writing the letters.
          </p>
          <SvgDrawnText />
        </section>

        {/* --- Section 3: Clip-Path Reveal --- */}
        <section>
          <h2 className="text-lg font-semibold text-green-400 mb-4">Technique 3: Clip-Path Reveal</h2>
          <ClipPathText
            el={motion.h2} // el prop is explicitly a motion component
            text="Modern & Clean"
            className="text-4xl md:text-6xl font-bold"
          />
          {/* This instance now correctly defaults to <motion.p> */}
          <ClipPathText
            text="Here, we animate a clipping mask. It's a highly performant and stylish way to reveal text with a smooth, wiping motion."
            className="mt-6 text-xl text-gray-300"
          />
        </section>
      </div>
    </main>
  )
}
