'use client'

import { motion } from 'framer-motion'

import letters from './letters.json'

export default function Home() {
  //   return (
  //     <div className="flex items-center justify-center h-screen bg-white">
  //       <svg viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg" className="w-[600px] h-[120px]">
  //         {letters.map((d, i) => (
  //           <motion.path
  //             key={i}
  //             d={d}
  //             fill="none"
  //             stroke="black"
  //             strokeWidth="2"
  //             initial={{ pathLength: 0 }}
  //             animate={{ pathLength: 1 }}
  //             transition={{
  //               duration: 1,
  //               ease: 'easeInOut',
  //             }}
  //           />
  //         ))}
  //       </svg>
  //     </div>
  //   )

  return (
    <main className="flex items-center justify-center min-h-screen bg-white">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 300" className="w-[900px]">
        {letters.map((letter, i) => (
          <g key={i}>
            <defs>
              <mask id={`mask-${i}`}>
                <motion.rect
                  x="0"
                  y="0"
                  width="0"
                  height="300"
                  fill="white"
                  initial={{ width: 0 }}
                  animate={{ width: 2000 }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.4,
                    ease: 'easeInOut',
                  }}
                />
              </mask>
            </defs>
            <path d={letter.d} fill="black" mask={`url(#mask-${i})`} />
          </g>
        ))}
      </svg>
    </main>
  )
}
