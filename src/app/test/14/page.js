'use client'

import { motion } from 'framer-motion'

export default function Home() {
  // Replace the SVG content below with your own SVG code.
  // Make sure your SVG has a <path> element.
  const svgIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 100" // Adjust viewBox to fit your SVG
      width="500"
      height="100"
    >
      <motion.path
        d="M 50,80 C 150,20 350,20 450,80" // Example path, replace with your own
        stroke="#000000"
        strokeWidth="2"
        fill="transparent"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: 'easeInOut' }}
      />
    </svg>
  )

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Animated SVG Signature</h1>
      {svgIcon}
    </main>
  )
}
