'use client'

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

// Seeded random function for consistent server/client rendering
const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Particle explosion system
const ParticleExplosion = ({ trigger, x, y }) => {
  const particles = useMemo(
    () =>
      Array.from({ length: 25 }, (_, i) => ({
        id: i,
        angle: (i / 50) * Math.PI * 2,
        velocity: seededRandom(trigger + i * 123) * 300 + 100,
        size: seededRandom(trigger + i * 456) * 4 + 2,
        color: ['#a855f7', '#06b6d4', '#10b981', '#f59e0b'][Math.floor(seededRandom(trigger + i * 789) * 4)],
      })),
    [trigger]
  )

  if (!trigger) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={`${trigger}-${particle.id}`}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: particle.size,
            height: particle.size,
            left: x,
            top: y,
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos(particle.angle) * particle.velocity,
            y: Math.sin(particle.angle) * particle.velocity,
          }}
          transition={{ duration: 2, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// 3D Morphing Neural Network
const MorphingNeuralNetwork = ({ mouseX, mouseY }) => {
  const nodes = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        baseX: (Math.sin(i * 0.5) + 1) * 50,
        baseY: (Math.cos(i * 0.3) + 1) * 50,
        connections: Array.from({ length: 2 }, (_, j) => Math.floor(seededRandom(i * 100 + j * 50) * 15)),
      })),
    []
  )

  return (
    <div className="fixed inset-0 pointer-events-none opacity-20" style={{ willChange: 'transform' }}>
      <svg className="w-full h-full">
        {/* Dynamic connections that follow mouse */}
        {nodes.map((node) =>
          node.connections.map((targetId, j) => {
            const target = nodes[targetId]
            if (!target || !node.baseX || !node.baseY || !target.baseX || !target.baseY) return null

            const x1 = `${node.baseX + (mouseX || 0) * 0.02}%`
            const y1 = `${node.baseY + (mouseY || 0) * 0.02}%`
            const x2 = `${target.baseX + (mouseX || 0) * 0.01}%`
            const y2 = `${target.baseY + (mouseY || 0) * 0.01}%`

            return (
              <motion.line
                key={`neural-${node.id}-to-${targetId}-${j}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#neuralGradient)"
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  pathLength: { duration: 2, delay: (node.id + j) * 0.1 },
                }}
              />
            )
          })
        )}

        {/* Pulsing nodes with 3D effect */}
        {nodes.map((node) => {
          if (!node.baseX || !node.baseY) return null

          const cx = `${node.baseX + (mouseX || 0) * 0.02}%`
          const cy = `${node.baseY + (mouseY || 0) * 0.02}%`

          return (
            <motion.g key={node.id}>
              <motion.circle
                cx={cx}
                cy={cy}
                r="8"
                fill="url(#nodeGradient)"
                animate={{
                  scale: [0.75, 1.5, 0.75],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: node.id * 0.1,
                }}
              />
              <motion.circle
                cx={cx}
                cy={cy}
                r="4"
                fill="#ffffff"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.8, 0.3, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: node.id * 0.05,
                }}
              />
            </motion.g>
          )
        })}

        {/* Gradients */}
        <defs>
          <linearGradient id="neuralGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
          </linearGradient>
          <radialGradient id="nodeGradient">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}

// Spectacular Hero Section
const SpectacularHero = ({ mouseX, mouseY }) => {
  const [explosions, setExplosions] = useState([])
  const titleRef = useRef(null)

  const handleTitleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setExplosions((prev) => [...prev, { id: Date.now(), x, y }])
    setTimeout(() => {
      setExplosions((prev) => prev.slice(1))
    }, 2000)
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating geometric shapes */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${seededRandom(i * 123) * 100}%`,
            top: `${seededRandom(i * 456) * 100}%`,
          }}
          animate={{
            x: [0, seededRandom(i * 789) * 200 - 100, 0],
            y: [0, seededRandom(i * 987) * 200 - 100, 0],
            rotate: [0, 360],
            scale: [1, seededRandom(i * 654) + 0.5, 1],
          }}
          transition={{
            duration: seededRandom(i * 321) * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div className={`w-4 h-4 ${i % 4 === 0 ? 'bg-purple-500' : i % 4 === 1 ? 'bg-cyan-500' : i % 4 === 2 ? 'bg-green-500' : 'bg-yellow-500'} ${i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : 'rounded-sm'} opacity-20`} />
        </motion.div>
      ))}

      <div className="text-center z-10 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotateX: -90 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{
            duration: 1.5,
            type: 'spring',
            stiffness: 100,
            delay: 0.2,
          }}
        >
          <motion.h1
            ref={titleRef}
            className="text-8xl md:text-9xl font-black mb-8 cursor-pointer select-none"
            style={{
              fontFamily: "'Playfair Display', serif",
              perspective: '1000px',
            }}
            onClick={handleTitleClick}
            whileHover={{
              scale: 1.1,
              rotateY: 15,
              rotateX: 5,
              textShadow: '0 0 50px rgba(168, 85, 247, 0.8)',
            }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              rotateY: [0, 5, 0, -5, 0],
            }}
            transition={{
              backgroundPosition: { duration: 3, repeat: Infinity },
              rotateY: { duration: 8, repeat: Infinity },
            }}
            className="bg-gradient-to-r from-white via-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
            style={{
              backgroundSize: '400% 400%',
              transformStyle: 'preserve-3d',
            }}
          >
            PORTFOLIO
          </motion.h1>

          {/* Particle explosions */}
          {explosions.map((explosion) => (
            <ParticleExplosion key={explosion.id} trigger={explosion.id} x={explosion.x} y={explosion.y} />
          ))}

          <motion.div className="text-2xl md:text-3xl text-gray-300 mb-12 font-light" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}>
            <motion.span
              animate={{
                color: ['rgb(209, 213, 219)', 'rgb(168, 85, 247)', 'rgb(6, 182, 212)', 'rgb(16, 185, 129)', 'rgb(209, 213, 219)'],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Full Stack Developer
            </motion.span>
            {' • '}
            <motion.span
              animate={{
                color: ['rgb(209, 213, 219)', 'rgb(6, 182, 212)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(209, 213, 219)'],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            >
              AI Enthusiast
            </motion.span>
            {' • '}
            <motion.span
              animate={{
                color: ['rgb(209, 213, 219)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)', 'rgb(209, 213, 219)'],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 2 }}
            >
              Creative Technologist
            </motion.span>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row gap-6 justify-center" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}>
            <motion.button
              className="px-12 py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl font-bold text-xl relative overflow-hidden"
              whileHover={{
                scale: 1.1,
                rotateY: 10,
                boxShadow: '0 20px 60px rgba(168, 85, 247, 0.4)',
              }}
              whileTap={{
                scale: 0.95,
                rotateY: -5,
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                backgroundPosition: { duration: 3, repeat: Infinity },
              }}
              style={{
                backgroundSize: '200% 200%',
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.span
                animate={{
                  textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 20px rgba(255,255,255,0.8)', '0 0 0px rgba(255,255,255,0)'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                EXPLORE MY UNIVERSE
              </motion.span>
            </motion.button>

            <motion.button
              className="px-12 py-6 border-2 border-white/30 rounded-2xl font-bold text-xl backdrop-blur-sm relative overflow-hidden"
              whileHover={{
                scale: 1.1,
                rotateY: -10,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.8)',
              }}
              whileTap={{
                scale: 0.95,
                rotateY: 5,
              }}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.span
                animate={{
                  color: ['rgb(255, 255, 255)', 'rgb(168, 85, 247)', 'rgb(6, 182, 212)', 'rgb(255, 255, 255)'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                CONTACT ME
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* 3D Floating elements with physics */}
        <motion.div
          className="absolute -top-20 -left-20 text-6xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotateX: [0, 360],
            rotateY: [0, 180],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          💻
        </motion.div>

        <motion.div
          className="absolute -bottom-20 -right-20 text-6xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            rotateX: [0, -360],
            rotateY: [0, -180],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          🚀
        </motion.div>
      </div>

      {/* Animated scroll indicator with physics */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div className="flex flex-col items-center gap-4 text-gray-400" whileHover={{ scale: 1.2, color: '#a855f7' }}>
          <span className="text-lg font-medium">Scroll to Enter</span>
          <motion.div className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center relative overflow-hidden" whileHover={{ borderColor: '#a855f7' }}>
            <motion.div
              className="w-2 h-6 bg-gradient-to-b from-purple-500 to-cyan-500 rounded-full mt-3"
              animate={{
                y: [0, 20, 0],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
// Mind-blowing Skills Galaxy
const SkillsGalaxy = () => {
  const [selectedSkill, setSelectedSkill] = useState(null)

  const skills = [
    { name: 'React', icon: '⚛️', level: 95, color: '#61dafb', position: { x: 20, y: 30 } },
    { name: 'Node.js', icon: '🟢', level: 90, color: '#68a063', position: { x: 80, y: 20 } },
    { name: 'Python', icon: '🐍', level: 85, color: '#3776ab', position: { x: 70, y: 70 } },
    { name: 'AI/ML', icon: '🧠', level: 80, color: '#ff6b6b', position: { x: 30, y: 80 } },
    { name: 'TypeScript', icon: '📘', level: 88, color: '#3178c6', position: { x: 50, y: 15 } },
    { name: 'Next.js', icon: '▲', level: 92, color: '#000000', position: { x: 15, y: 60 } },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
      {/* Galaxy background effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${seededRandom(i * 111) * 100}%`,
              top: `${seededRandom(i * 222) * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, seededRandom(i * 333) + 0.5, 0],
            }}
            transition={{
              duration: seededRandom(i * 444) * 3 + 2,
              repeat: Infinity,
              delay: seededRandom(i * 555) * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 relative">
        <motion.h2 className="text-7xl font-black text-center mb-20" style={{ fontFamily: "'Playfair Display', serif" }} initial={{ opacity: 0, rotateX: -90 }} whileInView={{ opacity: 1, rotateX: 0 }} transition={{ duration: 1, type: 'spring' }} viewport={{ once: true }}>
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
            style={{ backgroundSize: '200% 200%' }}
          >
            SKILLS GALAXY
          </motion.span>
        </motion.h2>

        {/* 3D Skills Constellation */}
        <div className="relative h-96 w-full">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              className="absolute cursor-pointer"
              style={{
                left: `${skill.position.x}%`,
                top: `${skill.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ opacity: 0, scale: 0, rotateY: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                delay: index * 0.2,
                duration: 1,
                type: 'spring',
                stiffness: 100,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.5,
                rotateY: 180,
                z: 100,
              }}
              onClick={() => setSelectedSkill(skill)}
            >
              {/* Skill orb with 3D effect */}
              <motion.div
                className="relative"
                animate={{
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Outer glow ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${skill.color}40, transparent)`,
                    width: '120px',
                    height: '120px',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 0.7, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.5,
                  }}
                />

                {/* Main skill orb */}
                <motion.div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${skill.color}, ${skill.color}80)`,
                    boxShadow: `0 0 30px ${skill.color}60`,
                  }}
                  animate={{
                    boxShadow: [`0 0 20px ${skill.color}60`, `0 0 40px ${skill.color}80`, `0 0 20px ${skill.color}60`],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <motion.span
                    animate={{
                      rotateY: [0, -360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    {skill.icon}
                  </motion.span>

                  {/* Skill level indicator */}
                  <motion.div className="absolute bottom-0 left-0 h-1 bg-white/80 rounded-full" initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ delay: index * 0.2 + 1, duration: 1 }} />
                </motion.div>

                {/* Skill name */}
                <motion.div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white font-bold text-sm whitespace-nowrap" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.2 + 0.5 }}>
                  {skill.name}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}

          {/* Connecting lines between skills */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {skills.map((skill, i) =>
              skills.slice(i + 1).map((targetSkill, j) => {
                if (!skill.position || !targetSkill.position) return null

                return (
                  <motion.line
                    key={`skill-${skill.name}-to-${targetSkill.name}`}
                    x1={`${skill.position.x}%`}
                    y1={`${skill.position.y}%`}
                    x2={`${targetSkill.position.x}%`}
                    y2={`${targetSkill.position.y}%`}
                    stroke="url(#skillGradient)"
                    strokeWidth="2"
                    opacity="0.3"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{
                      delay: (i + j) * 0.1,
                      duration: 2,
                    }}
                  />
                )
              })
            )}
            <defs>
              <linearGradient id="skillGradient">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Skill detail modal with 3D effects */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setSelectedSkill(null)}>
            <motion.div initial={{ scale: 0, rotateY: -180, rotateX: 90 }} animate={{ scale: 1, rotateY: 0, rotateX: 0 }} exit={{ scale: 0, rotateY: 180, rotateX: -90 }} transition={{ type: 'spring', stiffness: 100 }} className="bg-gradient-to-br from-slate-900 to-slate-800 border border-white/20 rounded-3xl p-8 max-w-md mx-4 text-center relative overflow-hidden" style={{ transformStyle: 'preserve-3d' }} onClick={(e) => e.stopPropagation()}>
              {/* Background particles */}
              {Array.from({ length: 10 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/30 rounded-full"
                  style={{
                    left: `${seededRandom(i * 777) * 100}%`,
                    top: `${seededRandom(i * 888) * 100}%`,
                  }}
                  animate={{
                    y: [0, -100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: seededRandom(i * 999) * 2,
                  }}
                />
              ))}

              <motion.div
                className="text-8xl mb-6"
                animate={{
                  rotateY: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  rotateY: { duration: 4, repeat: Infinity },
                  scale: { duration: 2, repeat: Infinity },
                }}
              >
                {selectedSkill.icon}
              </motion.div>

              <h3 className="text-3xl font-bold mb-4" style={{ color: selectedSkill.color }}>
                {selectedSkill.name}
              </h3>

              <div className="mb-6">
                <div className="text-sm text-gray-400 mb-2">Mastery Level</div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${selectedSkill.color}, ${selectedSkill.color}80)` }} initial={{ width: 0 }} animate={{ width: `${selectedSkill.level}%` }} transition={{ duration: 1, delay: 0.5 }} />
                </div>
                <div className="text-right text-2xl font-bold mt-2" style={{ color: selectedSkill.color }}>
                  {selectedSkill.level}%
                </div>
              </div>

              <motion.button whileHover={{ scale: 1.05, rotateY: 5 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedSkill(null)} className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-bold">
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
// Spectacular Project Showcase with 3D Cards
const ProjectShowcase = () => {
  const [selectedProject, setSelectedProject] = useState(null)
  const [hoveredProject, setHoveredProject] = useState(null)

  const projects = [
    {
      id: 'neural-portfolio',
      title: 'Neural Network Portfolio',
      description: 'Interactive brain-inspired portfolio with dynamic connections and AI-powered animations',
      tech: ['React', 'Framer Motion', 'Three.js', 'WebGL'],
      color: '#a855f7',
      icon: '🧠',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
    },
    {
      id: 'multiverse-scroll',
      title: 'Infinite Scroll Multiverse',
      description: 'Explore parallel dimensions through infinite scroll with quantum physics animations',
      tech: ['Next.js', 'Framer Motion', 'CSS3', 'WebGL'],
      color: '#06b6d4',
      icon: '🌌',
      gradient: 'from-blue-600 via-cyan-600 to-teal-600',
    },
    {
      id: 'ai-assistant',
      title: 'AI Chat Assistant',
      description: 'Intelligent conversational AI with natural language processing and machine learning',
      tech: ['Python', 'OpenAI', 'FastAPI', 'TensorFlow'],
      color: '#10b981',
      icon: '🤖',
      gradient: 'from-green-600 via-emerald-600 to-teal-600',
    },
  ]

  return (
    <section className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
      {/* Dynamic background based on hovered project */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: hoveredProject ? `radial-gradient(circle at 50% 50%, ${hoveredProject.color}40, rgba(0,0,0,0))` : 'rgba(0,0,0,0)',
        }}
        transition={{ duration: 0.5 }}
      />

      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 className="text-7xl font-black text-center mb-20" style={{ fontFamily: "'Playfair Display', serif" }} initial={{ opacity: 0, y: 100, rotateX: -90 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1, type: 'spring', stiffness: 100 }} viewport={{ once: true }}>
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
            style={{ backgroundSize: '300% 300%' }}
          >
            PROJECT UNIVERSE
          </motion.span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 100, rotateY: -45 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{
                delay: index * 0.3,
                duration: 1,
                type: 'spring',
                stiffness: 80,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.1,
                rotateY: 15,
                rotateX: 5,
                z: 100,
              }}
              onHoverStart={() => setHoveredProject(project)}
              onHoverEnd={() => setHoveredProject(null)}
              onClick={() => setSelectedProject(project)}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* 3D Card Container */}
              <motion.div
                className="relative h-96 rounded-3xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${project.color}20, ${project.color}10)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${project.color}30`,
                }}
                animate={{
                  boxShadow: hoveredProject?.id === project.id ? `0 30px 80px ${project.color}40` : `0 10px 30px ${project.color}20`,
                }}
              >
                {/* Animated background particles */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full opacity-30"
                    style={{ backgroundColor: project.color }}
                    animate={{
                      x: [0, seededRandom(i * 111 + index * 222) * 300 - 150],
                      y: [0, seededRandom(i * 333 + index * 444) * 300 - 150],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: seededRandom(i * 555 + index * 666) * 4 + 3,
                      repeat: Infinity,
                      delay: seededRandom(i * 777 + index * 888) * 2,
                    }}
                  />
                ))}

                {/* Project Icon with 3D rotation */}
                <motion.div
                  className="absolute top-8 left-8 text-6xl"
                  animate={{
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotateY: { duration: 8, repeat: Infinity, ease: 'linear' },
                    scale: { duration: 3, repeat: Infinity },
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {project.icon}
                </motion.div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <motion.h3
                    className="text-2xl font-bold mb-3 text-white"
                    animate={{
                      textShadow: hoveredProject?.id === project.id ? `0 0 20px ${project.color}` : '0 0 0px transparent',
                    }}
                  >
                    {project.title}
                  </motion.h3>

                  <p className="text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${project.color}20`,
                          color: project.color,
                          border: `1px solid ${project.color}40`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.3 + techIndex * 0.1 }}
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: `${project.color}30`,
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity"
                  style={{
                    background: `radial-gradient(circle at center, ${project.color}, transparent)`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Spectacular Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedProject(null)}>
            <motion.div
              initial={{
                scale: 0,
                rotateY: -180,
                rotateX: 90,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                rotateY: 0,
                rotateX: 0,
                opacity: 1,
              }}
              exit={{
                scale: 0,
                rotateY: 180,
                rotateX: -90,
                opacity: 0,
              }}
              transition={{
                type: 'spring',
                stiffness: 100,
                damping: 20,
              }}
              className="max-w-2xl w-full rounded-3xl overflow-hidden relative"
              style={{
                background: `linear-gradient(135deg, ${selectedProject.color}20, ${selectedProject.color}10)`,
                backdropFilter: 'blur(20px)',
                border: `2px solid ${selectedProject.color}40`,
                transformStyle: 'preserve-3d',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated background */}
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: selectedProject.color,
                    left: `${seededRandom(i * 123) * 100}%`,
                    top: `${seededRandom(i * 456) * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, seededRandom(i * 789) + 0.5, 0],
                  }}
                  transition={{
                    duration: seededRandom(i * 987) * 3 + 2,
                    repeat: Infinity,
                    delay: seededRandom(i * 654) * 2,
                  }}
                />
              ))}

              <div className="p-12 text-center relative z-10">
                <motion.div
                  className="text-8xl mb-8"
                  animate={{
                    rotateY: [0, 360],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    rotateY: { duration: 4, repeat: Infinity },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                >
                  {selectedProject.icon}
                </motion.div>

                <h3 className="text-4xl font-bold mb-6 text-white">{selectedProject.title}</h3>

                <p className="text-gray-300 mb-8 text-lg leading-relaxed">{selectedProject.description}</p>

                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  {selectedProject.tech.map((tech, index) => (
                    <motion.span
                      key={tech}
                      className="px-4 py-2 rounded-full font-medium"
                      style={{
                        backgroundColor: `${selectedProject.color}30`,
                        color: selectedProject.color,
                        border: `1px solid ${selectedProject.color}60`,
                      }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: `${selectedProject.color}40`,
                      }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>

                <div className="flex gap-6 justify-center">
                  <motion.button
                    whileHover={{
                      scale: 1.1,
                      rotateY: 5,
                      boxShadow: `0 20px 40px ${selectedProject.color}40`,
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-xl font-bold text-white"
                    style={{
                      background: `linear-gradient(135deg, ${selectedProject.color}, ${selectedProject.color}80)`,
                    }}
                  >
                    View Project
                  </motion.button>

                  <motion.button whileHover={{ scale: 1.1, rotateY: -5 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedProject(null)} className="px-8 py-4 border-2 border-white/30 rounded-xl font-bold text-white hover:bg-white/10 transition-colors">
                    Close
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// Epic Contact Section
const EpicContact = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center py-20 relative overflow-hidden">
      {/* Interactive mouse-following gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, #a855f740, rgba(0,0,0,0))`,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.5 }}
      />

      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.h2 className="text-7xl font-black mb-12" style={{ fontFamily: "'Playfair Display', serif" }} initial={{ opacity: 0, scale: 0.5, rotateX: -90 }} whileInView={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 1, type: 'spring', stiffness: 100 }} viewport={{ once: true }}>
          <motion.span
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 4, repeat: Infinity }}
            className="bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 bg-clip-text text-transparent"
            style={{ backgroundSize: '200% 200%' }}
          >
            LET'S CONNECT
          </motion.span>
        </motion.h2>

        <motion.p className="text-2xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} viewport={{ once: true }}>
          Ready to create something{' '}
          <motion.span animate={{ color: ['rgb(168, 85, 247)', 'rgb(6, 182, 212)', 'rgb(16, 185, 129)', 'rgb(168, 85, 247)'] }} transition={{ duration: 3, repeat: Infinity }}>
            extraordinary
          </motion.span>{' '}
          together? Let's build the future!
        </motion.p>

        <motion.div className="flex flex-col sm:flex-row gap-8 justify-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 1 }} viewport={{ once: true }}>
          {[
            { icon: '📧', text: 'EMAIL ME', href: 'mailto:your.email@example.com', color: '#a855f7' },
            { icon: '💼', text: 'LINKEDIN', href: 'https://linkedin.com/in/yourprofile', color: '#06b6d4' },
            { icon: '🐙', text: 'GITHUB', href: 'https://github.com/yourusername', color: '#10b981' },
          ].map((contact, index) => (
            <motion.a
              key={contact.text}
              href={contact.href}
              className="px-10 py-6 rounded-2xl font-bold text-xl relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, ${contact.color}20, ${contact.color}10)`,
                border: `2px solid ${contact.color}40`,
              }}
              whileHover={{
                scale: 1.1,
                rotateY: 10,
                rotateX: 5,
                boxShadow: `0 20px 60px ${contact.color}40`,
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, rotateY: -90 }}
              whileInView={{ opacity: 1, rotateY: 0 }}
              transition={{
                delay: index * 0.2,
                type: 'spring',
                stiffness: 100,
              }}
              viewport={{ once: true }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <motion.span
                className="flex items-center gap-4"
                animate={{
                  color: ['rgb(255, 255, 255)', contact.color, 'rgb(255, 255, 255)'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.5,
                }}
              >
                <motion.span
                  animate={{
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotateY: { duration: 4, repeat: Infinity },
                    scale: { duration: 2, repeat: Infinity },
                  }}
                >
                  {contact.icon}
                </motion.span>
                {contact.text}
              </motion.span>

              {/* Hover effect particles */}
              <motion.div className="absolute inset-0 opacity-0 group-hover:opacity-100" transition={{ duration: 0.3 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: contact.color,
                      left: `${seededRandom(i * 111 + index * 222) * 100}%`,
                      top: `${seededRandom(i * 333 + index * 444) * 100}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: seededRandom(i * 555 + index * 666),
                    }}
                  />
                ))}
              </motion.div>
            </motion.a>
          ))}
        </motion.div>

        {/* Floating contact elements with physics */}
        <div className="absolute inset-0 pointer-events-none">
          {['💻', '🚀', '⚡'].map((emoji, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${10 + index * 15}%`,
                top: `${20 + Math.sin(index) * 30}%`,
              }}
              animate={{
                x: [0, Math.sin(index) * 100, 0],
                y: [0, Math.cos(index) * 50, 0],
                rotate: [0, 360],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 8 + index,
                repeat: Infinity,
                delay: index * 0.5,
                ease: 'easeInOut',
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// SPECTACULAR MAIN COMPONENT
export const PortfolioHome = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Throttle mouse movement for better performance
    let ticking = false
    const handleMouseMove = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setMousePosition({
            x: (e.clientX / window.innerWidth) * 100,
            y: (e.clientY / window.innerHeight) * 100,
          })
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  if (!isClient) {
    return (
      <div className="bg-black text-white relative overflow-hidden min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-8xl font-black mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="bg-gradient-to-r from-white via-purple-400 to-cyan-400 bg-clip-text text-transparent">PORTFOLIO</span>
          </h1>
          <p className="text-2xl text-gray-300">Loading spectacular experience...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-black text-white relative overflow-hidden">
      {/* Morphing Neural Network Background */}
      <MorphingNeuralNetwork mouseX={mousePosition.x} mouseY={mousePosition.y} />

      {/* All Spectacular Sections */}
      <SpectacularHero mouseX={mousePosition.x} mouseY={mousePosition.y} />
      <SkillsGalaxy />
      <ProjectShowcase />
      <EpicContact />
    </div>
  )
}
