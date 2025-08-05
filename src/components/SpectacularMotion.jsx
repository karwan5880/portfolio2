'use client'

import { AnimatePresence, motion, useAnimation, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Seeded random for consistent rendering
const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// EXPLOSIVE PARTICLE SYSTEM
const ParticleExplosion = ({ trigger, x, y, color = '#8b5cf6' }) => {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    angle: (i / 50) * Math.PI * 2,
    velocity: seededRandom(trigger + i * 123) * 500 + 200,
    size: seededRandom(trigger + i * 456) * 8 + 3,
    life: seededRandom(trigger + i * 789) * 2 + 1,
  }))

  if (!trigger) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <motion.div
          key={`${trigger}-${particle.id}`}
          className="absolute rounded-full"
          style={{
            backgroundColor: color,
            width: particle.size,
            height: particle.size,
            left: x,
            top: y,
            filter: 'blur(1px)',
            boxShadow: `0 0 ${particle.size * 2}px ${color}`,
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos(particle.angle) * particle.velocity,
            y: Math.sin(particle.angle) * particle.velocity,
            opacity: [1, 0.8, 0],
          }}
          transition={{
            duration: particle.life,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  )
}

// MIND-BLOWING LIQUID HERO
const LiquidHero = () => {
  const ref = useRef(null)
  const [explosions, setExplosions] = useState([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // Extreme transforms
  const y = useTransform(scrollYProgress, [0, 1], [0, -1000])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 2, 0.2])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 720])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 1], [1, 0.8, 0])

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 200,
        y: (e.clientY / window.innerHeight - 0.5) * 200,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleTitleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const colors = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b']

    setExplosions((prev) => [
      ...prev,
      {
        id: Date.now(),
        x,
        y,
        color: colors[Math.floor(seededRandom(Date.now()) * colors.length)],
      },
    ])

    setTimeout(() => {
      setExplosions((prev) => prev.slice(1))
    }, 3000)
  }

  return (
    <section ref={ref} className="relative h-screen overflow-hidden bg-black">
      {/* LIQUID MORPHING BACKGROUND */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(circle at ${50 + mousePos.x * 0.1}% ${50 + mousePos.y * 0.1}%, 
              rgba(139, 92, 246, 0.6) 0%, 
              rgba(59, 130, 246, 0.4) 20%, 
              rgba(6, 182, 212, 0.3) 40%, 
              rgba(16, 185, 129, 0.2) 60%, 
              rgba(245, 158, 11, 0.1) 80%, 
              transparent 100%),
            radial-gradient(circle at ${30 - mousePos.x * 0.05}% ${70 - mousePos.y * 0.05}%, 
              rgba(236, 72, 153, 0.4) 0%, 
              transparent 50%)
          `,
          y,
        }}
        animate={{
          scale: [1, 1.5, 1.2, 1],
          rotate: [0, 90, 180, 270, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* FLOATING ENERGY ORBS */}
      {Array.from({ length: 25 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${seededRandom(i * 111) * 100}%`,
            top: `${seededRandom(i * 222) * 100}%`,
            y,
          }}
          animate={{
            x: [0, seededRandom(i * 333) * 400 - 200, seededRandom(i * 444) * 300 - 150, 0],
            y: [0, seededRandom(i * 555) * 400 - 200, seededRandom(i * 666) * 300 - 150, 0],
            scale: [1, seededRandom(i * 777) * 3 + 1, 1],
            rotate: [0, 360, 720, 1080],
          }}
          transition={{
            duration: seededRandom(i * 888) * 15 + 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <motion.div
            className="relative"
            animate={{
              rotate: [0, -360],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <motion.div
              className="w-12 h-12 rounded-full"
              style={{
                background: `conic-gradient(from 0deg, 
                  ${['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i % 6]}, 
                  transparent, 
                  ${['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'][i % 6]})`,
                filter: 'blur(3px)',
              }}
              animate={{
                scale: [1, 2, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: seededRandom(i * 999) * 3,
              }}
            />
            <motion.div
              className="absolute inset-2 rounded-full bg-white/20"
              animate={{
                scale: [0.5, 1.5, 0.5],
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: seededRandom(i * 1111) * 2,
              }}
            />
          </motion.div>
        </motion.div>
      ))}

      {/* EXPLOSIVE TITLE */}
      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ y, scale, opacity, rotate }}>
        <div className="text-center relative">
          <motion.h1
            className="text-[8rem] md:text-[15rem] font-black mb-8 cursor-pointer select-none relative"
            initial={{ opacity: 0, scale: 0, rotateY: -360, rotateX: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0, rotateX: 0 }}
            transition={{
              duration: 3,
              type: 'spring',
              stiffness: 50,
              delay: 0.5,
            }}
            whileHover={{
              scale: 1.2,
              rotateY: 20,
              rotateX: 10,
              rotateZ: 5,
            }}
            onClick={handleTitleClick}
            style={{
              transformStyle: 'preserve-3d',
              perspective: '2000px',
            }}
          >
            <motion.span
              className="inline-block bg-gradient-to-r from-purple-400 via-blue-400 via-cyan-400 via-green-400 via-yellow-400 to-red-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '200% 50%', '0% 50%'],
                rotateY: [0, 15, 0, -15, 0],
                rotateX: [0, 10, 0, -10, 0],
                scale: [1, 1.1, 1, 1.05, 1],
              }}
              transition={{
                backgroundPosition: { duration: 3, repeat: Infinity },
                rotateY: { duration: 8, repeat: Infinity },
                rotateX: { duration: 6, repeat: Infinity },
                scale: { duration: 4, repeat: Infinity },
              }}
              style={{
                backgroundSize: '600% 600%',
                filter: 'drop-shadow(0 0 100px rgba(139, 92, 246, 1))',
                textShadow: '0 0 50px rgba(139, 92, 246, 0.8)',
              }}
            >
              FRAMER
            </motion.span>

            {/* Particle explosions */}
            {explosions.map((explosion) => (
              <ParticleExplosion key={explosion.id} trigger={explosion.id} x={explosion.x} y={explosion.y} color={explosion.color} />
            ))}
          </motion.h1>

          <motion.div
            className="text-5xl font-bold mb-16"
            initial={{ opacity: 0, y: 200, rotateX: -90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{
              duration: 2,
              delay: 1.5,
              type: 'spring',
              stiffness: 100,
            }}
          >
            <motion.span
              className="inline-block text-white"
              animate={{
                color: ['#ffffff', '#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ffffff'],
                scale: [1, 1.2, 1, 1.1, 1],
                rotateZ: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                filter: 'drop-shadow(0 0 30px currentColor)',
              }}
            >
              MOTION UNIVERSE
            </motion.span>
          </motion.div>

          {/* EXPLOSIVE BUTTON */}
          <motion.div initial={{ opacity: 0, scale: 0, rotateY: -180 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1.5, delay: 2.5, type: 'spring' }}>
            <motion.button
              className="relative px-16 py-8 bg-gradient-to-r from-purple-600 via-blue-600 via-cyan-600 to-green-600 rounded-3xl font-bold text-2xl overflow-hidden"
              whileHover={{
                scale: 1.3,
                rotateY: 20,
                rotateX: 10,
                boxShadow: '0 50px 150px rgba(139, 92, 246, 1)',
              }}
              whileTap={{
                scale: 0.8,
                rotateY: -15,
                rotateX: -5,
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '200% 50%', '0% 50%'],
              }}
              transition={{
                backgroundPosition: { duration: 3, repeat: Infinity },
              }}
              style={{
                backgroundSize: '400% 400%',
                transformStyle: 'preserve-3d',
              }}
            >
              <motion.span
                animate={{
                  textShadow: ['0 0 0px rgba(255,255,255,0)', '0 0 50px rgba(255,255,255,1)', '0 0 100px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0)'],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ENTER THE MATRIX
              </motion.span>

              {/* Button glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-400/50 via-blue-400/50 to-cyan-400/50 rounded-3xl"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* HYPNOTIC SCROLL INDICATOR */}
      <motion.div
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
        style={{ opacity, rotate: useTransform(scrollYProgress, [0, 1], [0, 1080]) }}
        animate={{
          y: [0, 50, 0],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <motion.div
          className="relative w-16 h-24 border-4 border-white/50 rounded-full flex justify-center overflow-hidden"
          whileHover={{
            scale: 2,
            borderColor: '#8b5cf6',
            boxShadow: '0 0 50px rgba(139, 92, 246, 1)',
          }}
          animate={{
            borderColor: ['rgba(255,255,255,0.5)', 'rgba(139, 92, 246, 1)', 'rgba(59, 130, 246, 1)', 'rgba(6, 182, 212, 1)', 'rgba(255,255,255,0.5)'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <motion.div
            className="w-4 h-12 bg-gradient-to-b from-purple-500 via-blue-500 to-cyan-500 rounded-full mt-6"
            animate={{
              y: [0, 40, 0],
              opacity: [1, 0.3, 1],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-purple-500/30 to-cyan-500/30 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  )
}

// MAIN SPECTACULAR COMPONENT
export const SpectacularMotion = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <motion.div
          className="text-white text-4xl font-bold"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Loading Magic...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen overflow-hidden">
      <LiquidHero />

      {/* Additional spectacular sections can go here */}
      <section className="py-32 px-6 text-center">
        <motion.h2 className="text-8xl font-black text-white mb-16" initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 2, type: 'spring' }} viewport={{ once: true }}>
          <motion.span
            className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            style={{ backgroundSize: '200% 200%' }}
          >
            PURE MAGIC
          </motion.span>
        </motion.h2>

        <motion.p className="text-2xl text-gray-300 max-w-4xl mx-auto" initial={{ opacity: 0, y: 100 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 0.5 }} viewport={{ once: true }}>
          This is what happens when you push Framer Motion to its absolute limits. Every animation is crafted with precision, every interaction designed to amaze.
        </motion.p>
      </section>
    </div>
  )
}
