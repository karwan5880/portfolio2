'use client'

import { motion } from 'framer-motion'

// --- Best Practice: A reusable component for inline code snippets ---
const InlineCode = ({ children }) => {
  return <code className="bg-gray-700 text-orange-300 font-mono text-base rounded px-1 py-0.5">{children}</code>
}

// --- Component 1: Reusable Single-Line SVG Text Drawer ---
const SvgTextDraw = ({ text, className, strokeWidth = 1 }) => {
  // ... (Component code is unchanged, no need to repeat here)
  const parentVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.5 } } }
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 2, ease: 'easeInOut' } },
  }
  return (
    <motion.svg
      width="100%"
      viewBox="0 0 500 100"
      className={className}
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.text
        x="50%"
        y="70%"
        textAnchor="middle"
        fontSize="80"
        fontWeight="bold"
        fill="transparent"
        stroke="white"
        strokeWidth={strokeWidth}
        variants={pathVariants}
      >
        {text}
      </motion.text>
    </motion.svg>
  )
}

// --- Component 2: Drawing and Then Filling with Color ---
const SvgTextFill = ({ text, className }) => {
  // ... (Component code is unchanged, no need to repeat here)
  const parentVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 2, ease: 'easeInOut' }, opacity: { duration: 0.1 } } },
  }
  const fillVariants = {
    hidden: { fill: 'rgba(255, 255, 255, 0)' },
    visible: { fill: 'rgba(255, 255, 255, 1)', transition: { delay: 2, duration: 0.5 } },
  }
  return (
    <motion.svg
      width="100%"
      viewBox="0 0 500 100"
      className={className}
      variants={parentVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.text x="50%" y="70%" textAnchor="middle" fontSize="80" fontWeight="bold" variants={fillVariants}>
        {text}
      </motion.text>
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

// --- Component 3: Handling Multiple Lines ---
const MultiLineSvgText = () => {
  // ... (Component code is unchanged, no need to repeat here)
  const lines = ['Animating', 'SVG', 'Excellence']
  const parentVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 1.5 } } }
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { pathLength: 1, opacity: 1, transition: { duration: 2, ease: 'easeInOut' } },
  }
  return (
    <motion.svg width="100%" viewBox="0 0 500 300" variants={parentVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      {lines.map((line, index) => (
        <motion.text
          key={line}
          x="50%"
          y={80 + index * 100}
          textAnchor="middle"
          fontSize="80"
          fontWeight="bold"
          fill="transparent"
          stroke="#06b6d4"
          strokeWidth="1.5"
          variants={pathVariants}
        >
          {line}
        </motion.text>
      ))}
    </motion.svg>
  )
}

// --- Main Page Component ---
export default function HomePage() {
  return (
    <main className="bg-gray-900 text-white min-h-screen p-8 md:p-16">
      <div className="max-w-4xl mx-auto space-y-32">
        <div className="h-screen flex flex-col justify-center items-center text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">SVG Text Drawing</h1>
          <p className="text-xl text-gray-400">A deep dive. Scroll to begin.</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold text-purple-400 mb-4">1. The Core Concept: `pathLength`</h2>
          <p className="mb-8 text-lg text-gray-300">
            The magic behind this effect is Framer Motion's ability to animate the SVG <InlineCode>pathLength</InlineCode> property. By animating it
            from 0 to 1, we create the illusion that the text's stroke is being drawn in real-time.
          </p>
          <SvgTextDraw text="Discovery" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-green-400 mb-4">2. Advanced: Draw then Fill</h2>
          <p className="mb-8 text-lg text-gray-300">
            We can create a more polished effect by animating the fill color after the drawing is complete. This is achieved by layering two text
            elements and using a <InlineCode>delay</InlineCode> on the fill animation's transition.
          </p>
          <SvgTextFill text="Reveal" />
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-cyan-400 mb-4">3. Orchestration: Multi-Line Drawing</h2>
          <p className="mb-8 text-lg text-gray-300">
            Using <InlineCode>staggerChildren</InlineCode> on the parent <InlineCode>{'<svg>'}</InlineCode> container, we can orchestrate a beautiful
            sequence, drawing each line one after the other.
          </p>
          <MultiLineSvgText />
        </section>

        {/* --- Section 4: Your Turn - A "How-To" Guide --- */}
        <section className="pb-24">
          <h2 className="text-2xl font-semibold text-orange-400 mb-4">4. How to Create Your Own</h2>
          <div className="prose prose-invert prose-lg text-gray-300">
            {/* THIS IS THE FULLY CORRECTED AND BEST-PRACTICE SECTION */}
            <p>
              The <InlineCode>{'<text>'}</InlineCode> element is great, but for complex logos or custom fonts, you need to use SVG{' '}
              <InlineCode>{'<path>'}</InlineCode> elements. Here’s the workflow:
            </p>
            <ol>
              <li>
                <strong>Design Tool:</strong> Go to a vector editor like Figma, Adobe Illustrator, or Inkscape.
              </li>
              <li>
                <strong>Create Text:</strong> Use the Type Tool to write your word or phrase. Choose any font you like.
              </li>
              <li>
                <strong>Convert to Paths:</strong> This is the crucial step. Select the text and find the "Create Outlines," "Convert to Path," or
                "Object to Path" option. This turns the editable text into a vector shape.
              </li>
              <li>
                <strong>Export as SVG:</strong> Export your selection or frame as an SVG file. Choose the "minify" option if available.
              </li>
              <li>
                <strong>Inspect & Clean:</strong> Open the <InlineCode>.svg</InlineCode> file in a code editor. You will see{' '}
                <InlineCode>{'<path d="..." />'}</InlineCode> code instead of a <InlineCode>{'<text>'}</InlineCode> tag. Copy this path data.
              </li>
              <li>
                <strong>Create a Component:</strong> Paste the path into a React component. Replace the <InlineCode>{'<path>'}</InlineCode> tag with{' '}
                <InlineCode>{'<motion.path>'}</InlineCode> and pass it the <InlineCode>pathVariants</InlineCode> just like in our text examples!
              </li>
            </ol>
            <p>For example, the word "Motion" converted to a path might look like this:</p>
          </div>
          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <svg width="100%" viewBox="0 0 454 103" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M51.62 4.07... (very long string of path data) ...Z"
                stroke="white"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                transition={{ duration: 3, ease: 'easeInOut' }}
                viewport={{ once: true }}
              />
            </svg>
          </div>
        </section>
      </div>
    </main>
  )
}
