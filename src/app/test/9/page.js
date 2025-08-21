'use client'

import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <svg viewBox="0 0 800 200" xmlns="http://www.w3.org/2000/svg" className="w-[600px] h-[150px]">
        {/* Define a mask that will "reveal" the text */}
        <mask id="revealMask">
          {/* Start with the mask hidden (x=0 width=0) */}
          <motion.rect
            initial={{ x: 0, width: 0 }}
            animate={{ width: 800 }} // Reveal full text
            transition={{ duration: 8, ease: 'easeInOut' }}
            y="0"
            height="200"
            fill="white"
          />
        </mask>

        {/* Your text — masked so it reveals like handwriting */}
        <text x="50" y="120" fontFamily="'Caveat', cursive" fontSize="80" fill="black" mask="url(#revealMask)">
          Leong Kar Wan
        </text>
      </svg>
    </div>
  )
}
