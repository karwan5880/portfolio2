'use client'

import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin)
}

// GSAP Timeline Controller
const TimelineController = ({ timeline, isPlaying, onPlayPause, onRestart, onScrub }) => {
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!timeline) return

    setDuration(timeline.duration())

    const updateProgress = () => {
      setProgress(timeline.progress())
    }

    timeline.eventCallback('onUpdate', updateProgress)

    return () => {
      timeline.eventCallback('onUpdate', null)
    }
  }, [timeline])

  const handleScrub = (e) => {
    const newProgress = parseFloat(e.target.value)
    setProgress(newProgress)
    if (timeline) {
      timeline.progress(newProgress)
      onScrub && onScrub(newProgress)
    }
  }

  return (
    <div className="bg-black/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h3 className="text-white font-bold mb-4">Timeline Controls</h3>

      {/* Progress Bar */}
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={progress}
          onChange={handleScrub}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${progress * 100}%, #374151 ${progress * 100}%, #374151 100%)`,
          }}
        />
        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>0s</span>
          <span>{duration.toFixed(1)}s</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex space-x-3">
        <button onClick={onPlayPause} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white font-medium transition-colors">
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </button>
        <button onClick={onRestart} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white font-medium transition-colors">
          🔄 Restart
        </button>
      </div>
    </div>
  )
}

// Text Animation Showcase
const GSAPTextAnimation = () => {
  const textRef = useRef(null)
  const containerRef = useRef(null)
  const [timeline, setTimeline] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return

    const tl = gsap.timeline({ paused: true })

    // Split text into characters
    const text = textRef.current
    const chars = text.textContent.split('')
    text.innerHTML = chars.map((char) => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`).join('')

    const charElements = text.querySelectorAll('.char')

    tl.set(charElements, { opacity: 0, y: 50, rotationX: -90 })
      .to(charElements, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'back.out(1.7)',
      })
      .to(
        charElements,
        {
          color: '#8b5cf6',
          scale: 1.2,
          duration: 0.3,
          stagger: 0.02,
          yoyo: true,
          repeat: 1,
        },
        '-=0.5'
      )
      .to(charElements, {
        rotationY: 360,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.inOut',
      })

    setTimeline(tl)

    return () => {
      tl.kill()
    }
  }, [])

  const handlePlayPause = () => {
    if (!timeline) return

    if (isPlaying) {
      timeline.pause()
    } else {
      timeline.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    if (!timeline) return
    timeline.restart()
    setIsPlaying(true)
  }

  return (
    <div className="space-y-8">
      <div ref={containerRef} className="text-center py-16 bg-gradient-to-br from-gray-900 to-black rounded-2xl">
        <h2 ref={textRef} className="text-6xl md:text-8xl font-black text-white" style={{ perspective: '1000px' }}>
          GSAP MAGIC
        </h2>
      </div>

      <TimelineController timeline={timeline} isPlaying={isPlaying} onPlayPause={handlePlayPause} onRestart={handleRestart} />
    </div>
  )
}

// Morphing SVG Animation
const GSAPSVGMorph = () => {
  const svgRef = useRef(null)
  const [timeline, setTimeline] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const shapes = {
    circle: 'M50,10 C77.6,10 100,32.4 100,60 C100,87.6 77.6,110 50,110 C22.4,110 0,87.6 0,60 C0,32.4 22.4,10 50,10 Z',
    square: 'M10,10 L90,10 L90,90 L10,90 Z',
    star: 'M50,5 L61,35 L95,35 L68,57 L79,91 L50,70 L21,91 L32,57 L5,35 L39,35 Z',
    heart: 'M50,85 C50,85 20,60 20,40 C20,25 35,25 50,40 C65,25 80,25 80,40 C80,60 50,85 50,85 Z',
  }

  useEffect(() => {
    if (!svgRef.current) return

    const path = svgRef.current.querySelector('path')
    const tl = gsap.timeline({ paused: true, repeat: -1 })

    tl.to(path, {
      morphSVG: shapes.square,
      duration: 1,
      ease: 'power2.inOut',
      fill: '#06b6d4',
    })
      .to(path, {
        morphSVG: shapes.star,
        duration: 1,
        ease: 'power2.inOut',
        fill: '#10b981',
      })
      .to(path, {
        morphSVG: shapes.heart,
        duration: 1,
        ease: 'power2.inOut',
        fill: '#ef4444',
      })
      .to(path, {
        morphSVG: shapes.circle,
        duration: 1,
        ease: 'power2.inOut',
        fill: '#8b5cf6',
      })

    setTimeline(tl)

    return () => {
      tl.kill()
    }
  }, [])

  const handlePlayPause = () => {
    if (!timeline) return

    if (isPlaying) {
      timeline.pause()
    } else {
      timeline.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    if (!timeline) return
    timeline.restart()
    setIsPlaying(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center py-16 bg-gradient-to-br from-gray-900 to-black rounded-2xl">
        <svg ref={svgRef} width="200" height="200" viewBox="0 0 100 100" className="drop-shadow-2xl">
          <path d={shapes.circle} fill="#8b5cf6" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <TimelineController timeline={timeline} isPlaying={isPlaying} onPlayPause={handlePlayPause} onRestart={handleRestart} />
    </div>
  )
}

// Stagger Animation Grid
const GSAPStaggerGrid = () => {
  const gridRef = useRef(null)
  const [timeline, setTimeline] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!gridRef.current) return

    const boxes = gridRef.current.querySelectorAll('.stagger-box')
    const tl = gsap.timeline({ paused: true })

    tl.set(boxes, {
      scale: 0,
      rotation: -180,
      backgroundColor: '#374151',
    })
      .to(boxes, {
        scale: 1,
        rotation: 0,
        duration: 0.6,
        stagger: {
          grid: [6, 6],
          from: 'center',
          amount: 1.5,
        },
        ease: 'back.out(1.7)',
      })
      .to(boxes, {
        backgroundColor: '#8b5cf6',
        duration: 0.3,
        stagger: {
          grid: [6, 6],
          from: 'edges',
          amount: 0.8,
        },
      })
      .to(boxes, {
        rotation: 180,
        scale: 1.2,
        duration: 0.4,
        stagger: {
          grid: [6, 6],
          from: 'random',
          amount: 0.6,
        },
        yoyo: true,
        repeat: 1,
      })

    setTimeline(tl)

    return () => {
      tl.kill()
    }
  }, [])

  const handlePlayPause = () => {
    if (!timeline) return

    if (isPlaying) {
      timeline.pause()
    } else {
      timeline.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    if (!timeline) return
    timeline.restart()
    setIsPlaying(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center py-16 bg-gradient-to-br from-gray-900 to-black rounded-2xl">
        <div ref={gridRef} className="grid grid-cols-6 gap-2">
          {Array.from({ length: 36 }).map((_, i) => (
            <div key={i} className="stagger-box w-8 h-8 rounded-lg" />
          ))}
        </div>
      </div>

      <TimelineController timeline={timeline} isPlaying={isPlaying} onPlayPause={handlePlayPause} onRestart={handleRestart} />
    </div>
  )
}

// Scroll-Triggered Animation
const GSAPScrollTrigger = () => {
  const containerRef = useRef(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !containerRef.current) return

    const elements = containerRef.current.querySelectorAll('.scroll-item')

    elements.forEach((element, index) => {
      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: 100,
          rotation: -45,
          scale: 0.5,
        },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            markers: false,
          },
        }
      )
    })

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [isClient])

  const items = [
    { title: 'Scroll Triggered', description: 'Animations that fire on scroll', color: '#8b5cf6' },
    { title: 'Precise Control', description: 'Start and end points with pixel precision', color: '#06b6d4' },
    { title: 'Toggle Actions', description: 'Play, pause, resume, reverse on scroll', color: '#10b981' },
    { title: 'Performance', description: 'Optimized for smooth 60fps scrolling', color: '#f59e0b' },
  ]

  return (
    <div ref={containerRef} className="space-y-8">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-white mb-4">Scroll to See Magic</h3>
        <p className="text-gray-300">Each item animates as it enters the viewport</p>
      </div>

      {items.map((item, index) => (
        <div key={index} className="scroll-item p-8 rounded-2xl border border-white/20" style={{ backgroundColor: `${item.color}20` }}>
          <h4 className="text-2xl font-bold text-white mb-4">{item.title}</h4>
          <p className="text-white/80 text-lg">{item.description}</p>
        </div>
      ))}
    </div>
  )
}

export default function GSAPShowcase() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <motion.div
          className="text-white text-2xl font-bold"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Loading GSAP Magic...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <Link href="/animation-universe" className="text-blue-400 hover:text-blue-300">
          ← Back to Animation Universe
        </Link>
      </div>

      {/* Hero */}
      <section className="py-20 px-6 text-center">
        <motion.h1 className="text-6xl md:text-8xl font-black mb-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">GSAP Power</span>
        </motion.h1>

        <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          The industry standard for professional web animations. Timeline control, morphing SVGs, scroll triggers, and performance that can't be matched.
        </motion.p>
      </section>

      {/* Text Animation */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Character-by-Character Text Animation</h2>
          <GSAPTextAnimation />
        </div>
      </section>

      {/* SVG Morphing */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">SVG Shape Morphing</h2>
          <GSAPSVGMorph />
        </div>
      </section>

      {/* Stagger Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Advanced Stagger Patterns</h2>
          <GSAPStaggerGrid />
        </div>
      </section>

      {/* Scroll Trigger */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Scroll-Triggered Animations</h2>
          <GSAPScrollTrigger />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Why GSAP?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-green-400">Timeline Control</h3>
              <p className="text-gray-300">Precise control over complex animation sequences with play, pause, scrub, and reverse functionality.</p>
            </motion.div>

            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-blue-400">Performance</h3>
              <p className="text-gray-300">Industry-leading performance with 60fps animations, even with hundreds of elements animating simultaneously.</p>
            </motion.div>

            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-purple-400">Professional Grade</h3>
              <p className="text-gray-300">Used by major brands and agencies worldwide. The gold standard for web animation in production environments.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-20 px-6 text-center bg-gray-900/50">
        <h3 className="text-3xl font-bold mb-8">Explore More Advanced Features</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/animation-universe/glass" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition-colors">
            ← Glass UI Effects
          </Link>
          <Link href="/animation-universe/playground" className="px-6 py-3 bg-orange-600 hover:bg-orange-700 rounded-xl font-medium transition-colors">
            Interactive Playground →
          </Link>
        </div>
      </section>
    </div>
  )
}
