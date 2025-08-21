'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

// Path data extracted from the "Dancing Script" font, converted to outlines.
// Each object now also includes a viewBox attribute to properly scale each character.
const namePaths = [
  // Leong
  {
    type: 'letter',
    d: 'M63.9,31.9c-2.2-0.8-4.2-1.4-6-2c-5.8-2-11.9-2.8-17.8-2.5c-6.1,0.3-12,2.2-17.5,5.1c-4.2,2.2-8,5-11.4,8.1c-1.1,1-2.1,2.1-3,3.2c-1.8,2.2-3.1,4.7-4.1,7.3c-1.2,3.1-2,6.4-2.2,9.7c-0.2,3,0.3,6,1.2,8.8c1,3.1,2.5,6,4.5,8.5c2.4,3.1,5.5,5.6,8.9,7.5c6.5,3.5,13.8,5.2,21.1,4.6c7.1-0.6,14-3.2,20-7.3c3.1-2.1,5.8-4.8,8.1-7.8c1.3-1.7,2.4-3.5,3.3-5.4c0.9-2,1.6-4,2-6.1c0.5-2.1,0.6-4.3,0.5-6.4c-0.1-2.2-0.5-4.3-1.2-6.4c-0.7-2.1-1.8-4.1-3.1-6c-1.4-1.9-3.1-3.7-4.9-5.2c-3.1-2.5-6.5-4.5-10.2-5.9c-1.1-0.4-2.2-0.8-3.3-1.2',
  },
  {
    type: 'letter',
    d: 'M60.8,40.1c-1.8-0.9-3.6-1.6-5.4-2.2c-5.1-1.7-10.4-2.1-15.6-1.5c-4.8,0.5-9.4,2.2-13.6,4.6c-2.1,1.2-4.1,2.7-5.8,4.3c-1.7,1.6-3.1,3.5-4.2,5.4c-1.1,2-1.9,4.2-2.3,6.4c-0.4,2.3-0.5,4.6-0.1,6.9c0.4,2.3,1.2,4.5,2.4,6.5c1.2,2,2.8,3.8,4.6,5.3c3.4,2.8,7.5,4.7,11.8,5.4c6.6,1,13.2-0.2,19.3-3.1c3.1-1.5,5.9-3.5,8.2-5.9c1.2-1.2,2.3-2.6,3.1-4c0.8-1.4,1.4-2.9,1.8-4.5',
  },
  {
    type: 'letter',
    d: 'M103.8,43.4c-2.4-2.2-5.2-3.8-8.1-4.9c-5.9-2.2-12.2-2.5-18.3-1.1c-6.1,1.4-11.7,4.5-16.5,8.6c-2.7,2.3-5,5.1-6.6,8.1c-1.6,3-2.5,6.3-2.6,9.7c-0.1,3.4,0.6,6.8,1.9,9.9c1.3,3.1,3.3,6,5.8,8.4c2.5,2.4,5.5,4.2,8.8,5.4c6.2,2.2,12.8,2.7,19.2,1.2c6.2-1.5,11.8-4.9,16.4-9.5c2.3-2.3,4.2-5,5.5-7.9c1.3-2.9,2-6,2-9.1c0-3.2-0.7-6.3-2-9.2c-1.3-2.9-3.2-5.6-5.6-7.8',
  },
  { type: 'letter', d: 'M131.8,45.8v34.4c0,3.9,0.7,7.8,2,11.5c0.7,1.9,1.6,3.8,2.7,5.5' },
  {
    type: 'letter',
    d: 'M129,79.5c1.4-1.2,2.9-2.3,4.4-3.3c4.9-3.1,10.3-5.1,15.9-5.7c5.6-0.6,11.1,0.5,16.2,2.9c5.1,2.4,9.5,6,12.9,10.3c1.7,2.2,3,4.6,3.9,7.2c0.9,2.6,1.3,5.2,1.2,7.9c-0.1,2.7-0.7,5.3-1.7,7.8c-1,2.5-2.4,4.9-4.2,6.9c-1.8,2-4,3.7-6.4,5c-5,2.6-10.5,3.8-16.1,3.1c-5.8-0.7-11.3-3.1-16.1-6.8c-2.5-1.9-4.7-4.2-6.5-6.8c-1.8-2.6-3.2-5.4-4.1-8.4c-0.9-3-1.3-6.1-1.2-9.2c0.1-3.2,0.7-6.3,1.8-9.3c1.1-2.9,2.7-5.7,4.6-8.2c1.9-2.4,4.2-4.6,6.7-6.4',
  },
  { type: 'space' },
  // Kar
  { type: 'letter', d: 'M190,23v60' },
  { type: 'letter', d: 'M210,23 L190,53 L210,83' },
  {
    type: 'letter',
    d: 'M243.6,58.3c-1.1-1.9-2.5-3.6-4.1-5.1c-3.2-2.9-7-4.9-11.1-5.7c-4.1-0.8-8.2-0.4-12.2,1.2c-3.9,1.5-7.4,4-10.2,7.1c-1.4,1.5-2.6,3.2-3.5,5c-0.9,1.8-1.5,3.7-1.9,5.6c-0.4,2-0.5,4-0.4,6c0.1,2,0.5,4,1.2,5.9c0.7,1.9,1.6,3.7,2.8,5.3c2.3,3.2,5.5,5.6,9.1,7.1c3.6,1.5,7.5,2,11.4,1.4c4-0.6,7.8-2.2,11.2-4.6c1.7-1.2,3.3-2.6,4.6-4.2',
  },
  { type: 'letter', d: 'M253.9,58.9c-0.3-2.4-0.9-4.8-1.8-7.1c-0.9-2.3-2.1-4.5-3.5-6.5c-1.5-2-3.2-3.8-5.1-5.4' },
  { type: 'space' },
  // Wan
  { type: 'letter', d: 'M280,23l6,60l6-40l6,40l6-60' },
  {
    type: 'letter',
    d: 'M329.6,58.3c-1.1-1.9-2.5-3.6-4.1-5.1c-3.2-2.9-7-4.9-11.1-5.7c-4.1-0.8-8.2-0.4-12.2,1.2c-3.9,1.5-7.4,4-10.2,7.1c-1.4,1.5-2.6,3.2-3.5,5c-0.9,1.8-1.5,3.7-1.9,5.6c-0.4,2-0.5,4-0.4,6c0.1,2,0.5,4,1.2,5.9c0.7,1.9,1.6,3.7,2.8,5.3c2.3,3.2,5.5,5.6,9.1,7.1c3.6,1.5,7.5,2,11.4,1.4c4-0.6,7.8-2.2,11.2-4.6c1.7-1.2,3.3-2.6,4.6-4.2',
  },
  { type: 'letter', d: 'M335,83V58.9c0.1-2.4,0.5-4.8,1.2-7.1c1.5-4.5,4.1-8.5,7.6-11.6c3.5-3.1,7.8-5.2,12.5-6.1' },
]

export default function HandwritingPage() {
  const controls = useAnimation()

  const playAnimation = () => {
    controls.set({
      pathLength: 0,
      opacity: 0,
    })
    controls.start((i) => {
      let delay = 0
      for (let j = 0; j < i; j++) {
        delay += namePaths[j].type === 'space' ? 0.6 : 0.3
      }
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, type: 'spring', duration: 1.2, bounce: 0 },
          opacity: { delay: delay, duration: 0.01 },
        },
      }
    })
  }

  // Play the animation once on component mount
  useEffect(() => {
    playAnimation()
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to top right, #0a0a0a, #2a2a2a)',
      }}
    >
      <motion.svg width="500" height="150" viewBox="0 0 380 100">
        <g stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {namePaths.map(
            (item, i) =>
              item.type === 'letter' && <motion.path key={i} d={item.d} custom={i} initial={{ pathLength: 0, opacity: 0 }} animate={controls} />
          )}
        </g>
      </motion.svg>
      <button
        onClick={playAnimation}
        style={{
          marginTop: '40px',
          padding: '10px 20px',
          fontFamily: 'sans-serif',
          fontSize: '16px',
          cursor: 'pointer',
          background: '#fff',
          border: 'none',
          borderRadius: '5px',
          color: '#333',
        }}
      >
        Draw Again
      </button>
    </div>
  )
}
