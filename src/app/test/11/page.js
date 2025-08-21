'use client'

import { animate, stagger } from 'animejs'
import { svg } from 'animejs'
import { useEffect, useRef } from 'react'

export default function AnimatedHello() {
  const pathsRef = useRef([])

  useEffect(() => {
    pathsRef.current.forEach((path, idx) => {
      if (!path) return
      const [drawable] = svg.createDrawable(path)

      animate(drawable, {
        draw: ['0 0', '0 1'], // draw from invisible to full
        ease: 'inOutQuad', // updated easing name
        duration: 1500,
        delay: idx * 400, // simple stagger
      })
    })
  }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center', background: 'white' }}>
      <svg viewBox="0 0 600 150" width="600" height="150" fill="none" stroke="black" strokeWidth="4">
        {/* Replace these with actual handwritten SVG paths for HELLO */}
        <path ref={(el) => (pathsRef.current[0] = el)} d="M50 120 V30 M50 75 H100 M100 120 V30" />
        <path ref={(el) => (pathsRef.current[1] = el)} d="M150 120 V30 H220 V120 Z" />
        <path ref={(el) => (pathsRef.current[2] = el)} d="M270 120 V30" />
        <path ref={(el) => (pathsRef.current[3] = el)} d="M320 120 V30 H390 V120 Z" />
        <path ref={(el) => (pathsRef.current[4] = el)} d="M440 120 V30 H510 V120 Z" />
      </svg>
    </div>
  )
}
