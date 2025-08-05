'use client'

import { AnimatePresence, motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

// Individual dimension component
const Dimension = ({ dimension, index, scrollY, onPortalClick }) => {
  const yOffset = index * 100 // Stagger dimensions vertically

  // Parallax effects based on scroll and dimension index
  const y = useTransform(scrollY, [0, 1000], [yOffset, yOffset - 200 * (index + 1)])
  const opacity = useTransform(scrollY, [index * 200, index * 200 + 100, index * 200 + 300, index * 200 + 400], [0, 1, 1, 0])
  const scale = useTransform(scrollY, [index * 200, index * 200 + 200], [0.8, 1])

  const colors = {
    current: 'from-blue-600 to-purple-600',
    'ai-researcher': 'from-green-600 to-teal-600',
    'startup-founder': 'from-orange-600 to-red-600',
    'game-developer': 'from-purple-600 to-pink-600',
    'quantum-programmer': 'from-cyan-600 to-blue-600',
  }

  return (
    <motion.div style={{ y, opacity, scale }} className="absolute inset-0 flex items-center justify-center">
      {/* Dimension portal */}
      <motion.div
        className="relative w-96 h-96 rounded-full overflow-hidden cursor-pointer"
        whileHover={{ scale: 1.1 }}
        onClick={() => onPortalClick(dimension)}
        animate={{
          boxShadow: [`0 0 20px rgba(255,255,255,0.3)`, `0 0 40px rgba(255,255,255,0.6)`, `0 0 20px rgba(255,255,255,0.3)`],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        {/* Portal background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${colors[dimension.id]} opacity-80`} />

        {/* Quantum ripples */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute inset-0 border-2 border-white/30 rounded-full"
            animate={{
              scale: [1, 1.5, 2],
              opacity: [0.6, 0.3, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
            }}
          />
        ))}

        {/* Dimension content */}
        <div className="relative z-10 p-8 text-center text-white h-full flex flex-col justify-center">
          <motion.div className="text-6xl mb-4" animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}>
            {dimension.icon}
          </motion.div>

          <h3 className="text-2xl font-light mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {dimension.title}
          </h3>

          <p className="text-sm opacity-90 mb-4">{dimension.description}</p>

          <div className="text-xs opacity-70">Dimension #{index + 1}</div>
        </div>

        {/* Portal energy */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  )
}

// Quantum particle field
const QuantumField = ({ scrollY }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 1,
      })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 5 / particle.speed,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  )
}

// Dimension detail modal
const DimensionModal = ({ dimension, onClose }) => {
  if (!dimension) return null

  const achievements = {
    current: ['Master of Engineering Science', 'Full Stack Development', 'AI & Computer Vision Projects', 'Portfolio Websites'],
    'ai-researcher': ['PhD in Artificial Intelligence', 'Published 15+ Research Papers', 'Lead AI Scientist at Tech Giant', 'Revolutionary Neural Architecture'],
    'startup-founder': ['Founded 3 Successful Startups', 'Raised $50M in Funding', 'Exited to Fortune 500 Company', 'Tech Innovation Awards'],
    'game-developer': ['AAA Game Studio Director', 'Award-Winning Indie Games', 'VR/AR Gaming Pioneer', 'Game Engine Architect'],
    'quantum-programmer': ['Quantum Computing Researcher', 'Quantum Algorithm Designer', 'IBM Quantum Network Member', 'Quantum Supremacy Contributor'],
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <motion.div initial={{ scale: 0.8, rotateY: -90 }} animate={{ scale: 1, rotateY: 0 }} exit={{ scale: 0.8, rotateY: 90 }} className="bg-slate-900/90 border border-white/20 rounded-2xl p-8 max-w-lg mx-4 text-center" onClick={(e) => e.stopPropagation()}>
        <motion.div
          className="text-6xl mb-6"
          animate={{
            rotateY: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          {dimension.icon}
        </motion.div>

        <h2 className="text-3xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          {dimension.title}
        </h2>

        <p className="text-gray-300 mb-6 leading-relaxed">{dimension.fullDescription}</p>

        <div className="mb-6">
          <h3 className="text-xl font-medium text-white mb-3">Achievements in this Reality:</h3>
          <div className="space-y-2">
            {achievements[dimension.id]?.map((achievement, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="flex items-center gap-3 text-left">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-gray-300">{achievement}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onClose} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white transition-colors">
            Return to Multiverse
          </motion.button>

          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-6 py-3 border border-white/20 rounded-lg text-white hover:bg-white/10 transition-colors">
            Enter This Reality
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Interdimensional compass
const DimensionalCompass = ({ currentDimension, totalDimensions }) => {
  return (
    <div className="fixed top-1/2 right-8 transform -translate-y-1/2 z-40">
      <motion.div className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-full p-4" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
        <div className="relative w-16 h-16">
          {Array.from({ length: totalDimensions }, (_, i) => {
            const angle = (i / totalDimensions) * 360
            const isActive = i === currentDimension

            return (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-white/30'}`}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-24px)`,
                }}
                animate={{
                  scale: isActive ? [1, 1.5, 1] : 1,
                  opacity: isActive ? [0.5, 1, 0.5] : 0.3,
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )
          })}

          {/* Compass needle */}
          <motion.div className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-red-500 origin-bottom" style={{ transform: 'translate(-50%, -100%)' }} animate={{ rotate: currentDimension * (360 / totalDimensions) }} transition={{ type: 'spring', stiffness: 100, damping: 20 }} />
        </div>
      </motion.div>
    </div>
  )
}

// Main Infinite Scroll Multiverse component
export const InfiniteScrollMultiverse = () => {
  const [selectedDimension, setSelectedDimension] = useState(null)
  const [currentDimensionIndex, setCurrentDimensionIndex] = useState(0)
  const containerRef = useRef(null)

  const { scrollY } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Smooth scroll progress
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  // Dimension data
  const dimensions = useMemo(
    () => [
      {
        id: 'current',
        title: 'Current Reality',
        icon: '🌍',
        description: "The path I'm on right now",
        fullDescription: "In this dimension, I'm a Full Stack Developer with a Master's degree, building innovative projects and exploring AI technologies. This is where my journey in tech began and continues to evolve.",
      },
      {
        id: 'ai-researcher',
        title: 'AI Researcher',
        icon: '🧠',
        description: 'Leading breakthrough AI research',
        fullDescription: 'In this reality, I pursued a PhD and became a leading AI researcher, publishing groundbreaking papers on neural networks and contributing to the next generation of artificial intelligence.',
      },
      {
        id: 'startup-founder',
        title: 'Tech Entrepreneur',
        icon: '🚀',
        description: 'Building the next unicorn startup',
        fullDescription: 'Here I founded multiple successful startups, revolutionizing how people interact with technology. From ideation to IPO, this dimension shows the entrepreneurial path.',
      },
      {
        id: 'game-developer',
        title: 'Game Architect',
        icon: '🎮',
        description: 'Creating immersive virtual worlds',
        fullDescription: 'In this universe, I became a renowned game developer, creating award-winning titles and pioneering new forms of interactive entertainment that blur the line between reality and fiction.',
      },
      {
        id: 'quantum-programmer',
        title: 'Quantum Pioneer',
        icon: '⚛️',
        description: 'Programming the quantum realm',
        fullDescription: 'This dimension shows me as a quantum computing pioneer, developing algorithms that harness quantum mechanics to solve previously impossible computational problems.',
      },
    ],
    []
  )

  // Update current dimension based on scroll
  useEffect(() => {
    const unsubscribe = smoothScrollY.onChange((latest) => {
      const newIndex = Math.floor(latest / 200) % dimensions.length
      setCurrentDimensionIndex(Math.max(0, Math.min(newIndex, dimensions.length - 1)))
    })

    return unsubscribe
  }, [smoothScrollY, dimensions.length])

  return (
    <div className="min-h-[500vh] bg-black text-white relative overflow-hidden">
      <div ref={containerRef}>
        {/* Quantum field background */}
        <QuantumField scrollY={smoothScrollY} />

        {/* Multiverse title */}
        <motion.div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-40 text-center" initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-light mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            Infinite Scroll Multiverse
          </h1>
          <p className="text-gray-400">Explore parallel dimensions of possibility</p>
        </motion.div>

        {/* Dimensions */}
        <div className="relative">
          {dimensions.map((dimension, index) => (
            <Dimension key={dimension.id} dimension={dimension} index={index} scrollY={smoothScrollY} onPortalClick={setSelectedDimension} />
          ))}
        </div>

        {/* Dimensional compass */}
        <DimensionalCompass currentDimension={currentDimensionIndex} totalDimensions={dimensions.length} />

        {/* Scroll indicator */}
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <motion.div className="flex flex-col items-center gap-2 text-gray-400" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <span className="text-sm">Scroll to explore dimensions</span>
            <div className="w-6 h-10 border border-white/30 rounded-full flex justify-center">
              <motion.div className="w-1 h-3 bg-white/60 rounded-full mt-2" animate={{ y: [0, 16, 0] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="fixed top-8 right-8 z-40">
          <motion.a href="/test" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 border border-white/20 rounded-lg hover:border-white/40 transition-colors">
            ← Back to Test Lab
          </motion.a>
        </div>

        {/* Dimension modal */}
        <AnimatePresence>{selectedDimension && <DimensionModal dimension={selectedDimension} onClose={() => setSelectedDimension(null)} />}</AnimatePresence>
      </div>
    </div>
  )
}
