'use client'

import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

// Individual neuron component
const Neuron = ({ id, x, y, type, label, connections, isActive, onNeuronClick, pulseDelay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false)

  const colors = {
    skill: '#3b82f6', // Blue
    project: '#10b981', // Green
    experience: '#f59e0b', // Orange
    core: '#ef4444', // Red
    output: '#8b5cf6', // Purple
  }

  return (
    <motion.g>
      {/* Neuron body */}
      <motion.circle
        cx={x}
        cy={y}
        r={isHovered ? 12 : 8}
        fill={colors[type]}
        stroke={isActive ? '#ffffff' : colors[type]}
        strokeWidth={isActive ? 3 : 1}
        className="cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onNeuronClick(id)}
        animate={{
          opacity: isActive ? [0.7, 1, 0.7] : 0.8,
          scale: isActive ? [1, 1.2, 1] : 1,
          filter: isActive ? ['drop-shadow(0 0 5px rgba(255,255,255,0.5))', 'drop-shadow(0 0 15px rgba(255,255,255,0.8))', 'drop-shadow(0 0 5px rgba(255,255,255,0.5))'] : 'drop-shadow(0 0 0px rgba(255,255,255,0))',
        }}
        transition={{
          duration: 1.5,
          repeat: isActive ? Infinity : 0,
          delay: pulseDelay,
        }}
      />

      {/* Neuron label */}
      <AnimatePresence>
        {isHovered && (
          <motion.text x={x} y={y - 20} textAnchor="middle" className="fill-white text-sm font-medium pointer-events-none" initial={{ opacity: 0, y: y - 10 }} animate={{ opacity: 1, y: y - 20 }} exit={{ opacity: 0, y: y - 10 }}>
            {label}
          </motion.text>
        )}
      </AnimatePresence>
    </motion.g>
  )
}

// Synaptic connection component
const Synapse = ({ from, to, isActive, delay = 0 }) => {
  return (
    <motion.g>
      {/* Connection line */}
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={isActive ? '#ffffff' : '#4b5563'}
        strokeWidth={isActive ? 2 : 1}
        opacity={isActive ? 0.8 : 0.3}
        animate={{
          opacity: isActive ? [0.3, 0.8, 0.3] : 0.3,
          strokeWidth: isActive ? [1, 3, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isActive ? Infinity : 0,
          delay,
        }}
      />

      {/* Neural pulse */}
      {isActive && (
        <motion.circle
          r="3"
          fill="#ffffff"
          opacity="0.9"
          animate={{
            cx: [from.x, to.x],
            cy: [from.y, to.y],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.g>
  )
}

// Brain wave background
const BrainWaves = ({ mouseX, mouseY }) => {
  const waves = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      id: i,
      amplitude: 20 + i * 10,
      frequency: 0.02 + i * 0.01,
      phase: (i * Math.PI) / 3,
    }))
  }, [])

  return (
    <g className="opacity-20">
      {waves.map((wave) => (
        <motion.path
          key={wave.id}
          d={`M 0 ${300 + wave.amplitude} Q 200 ${300 - wave.amplitude} 400 ${300 + wave.amplitude} T 800 ${300 + wave.amplitude}`}
          fill="none"
          stroke="#3b82f6"
          strokeWidth="2"
          animate={{
            d: [`M 0 ${300 + wave.amplitude} Q 200 ${300 - wave.amplitude} 400 ${300 + wave.amplitude} T 800 ${300 + wave.amplitude}`, `M 0 ${300 - wave.amplitude} Q 200 ${300 + wave.amplitude} 400 ${300 - wave.amplitude} T 800 ${300 - wave.amplitude}`, `M 0 ${300 + wave.amplitude} Q 200 ${300 - wave.amplitude} 400 ${300 + wave.amplitude} T 800 ${300 + wave.amplitude}`],
          }}
          transition={{
            duration: 3 + wave.id,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </g>
  )
}

// Thought bubble component
const ThoughtBubble = ({ x, y, thought, onClose }) => {
  return (
    <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}>
      {/* Bubble background */}
      <motion.rect
        x={x - 100}
        y={y - 60}
        width="200"
        height="80"
        rx="15"
        fill="rgba(0, 0, 0, 0.9)"
        stroke="#ffffff"
        strokeWidth="1"
        animate={{
          filter: ['drop-shadow(0 0 10px rgba(255,255,255,0.3))', 'drop-shadow(0 0 20px rgba(255,255,255,0.6))', 'drop-shadow(0 0 10px rgba(255,255,255,0.3))'],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Bubble pointer */}
      <polygon points={`${x - 10},${y - 10} ${x},${y} ${x + 10},${y - 10}`} fill="rgba(0, 0, 0, 0.9)" stroke="#ffffff" strokeWidth="1" />

      {/* Thought text */}
      <text x={x} y={y - 30} textAnchor="middle" className="fill-white text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
        {thought.title}
      </text>
      <text x={x} y={y - 10} textAnchor="middle" className="fill-gray-300 text-xs">
        {thought.description}
      </text>

      {/* Close button */}
      <circle cx={x + 85} cy={y - 45} r="8" fill="#ef4444" className="cursor-pointer" onClick={onClose} />
      <text x={x + 85} y={y - 41} textAnchor="middle" className="fill-white text-xs cursor-pointer" onClick={onClose}>
        ×
      </text>
    </motion.g>
  )
}

// Main Neural Network Brain component
export const NeuralNetworkBrain = () => {
  const [activeNeurons, setActiveNeurons] = useState(new Set())
  const [selectedNeuron, setSelectedNeuron] = useState(null)
  const [thoughtBubble, setThoughtBubble] = useState(null)
  const svgRef = useRef(null)

  // Mouse position for brain wave effects
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Neural network data
  const neurons = useMemo(
    () => [
      // Core neurons (center)
      { id: 'core-brain', x: 400, y: 300, type: 'core', label: 'Neural Core', connections: ['skill-python', 'skill-react', 'skill-ai', 'exp-master'] },

      // Skill neurons (left hemisphere)
      { id: 'skill-python', x: 200, y: 200, type: 'skill', label: 'Python', connections: ['skill-ai', 'project-ai'] },
      { id: 'skill-react', x: 200, y: 300, type: 'skill', label: 'React', connections: ['project-earth', 'skill-js'] },
      { id: 'skill-ai', x: 200, y: 400, type: 'skill', label: 'AI/ML', connections: ['project-ai', 'skill-cv'] },
      { id: 'skill-js', x: 150, y: 350, type: 'skill', label: 'JavaScript', connections: ['skill-react', 'project-drone'] },
      { id: 'skill-cv', x: 150, y: 450, type: 'skill', label: 'Computer Vision', connections: ['skill-ai', 'project-ai'] },
      { id: 'skill-cpp', x: 250, y: 150, type: 'skill', label: 'C/C++', connections: ['skill-python', 'project-embedded'] },

      // Project neurons (right hemisphere)
      { id: 'project-ai', x: 600, y: 200, type: 'project', label: 'License Plate AI', connections: ['output-research'] },
      { id: 'project-earth', x: 600, y: 300, type: 'project', label: '3D Earth Model', connections: ['output-web'] },
      { id: 'project-drone', x: 600, y: 400, type: 'project', label: 'Drone Show', connections: ['output-creative'] },
      { id: 'project-embedded', x: 650, y: 150, type: 'project', label: 'IoT Hub', connections: ['output-hardware'] },

      // Experience neurons (top)
      { id: 'exp-master', x: 400, y: 150, type: 'experience', label: "Master's Degree", connections: ['skill-ai', 'project-ai'] },
      { id: 'exp-bachelor', x: 350, y: 100, type: 'experience', label: "Bachelor's Degree", connections: ['exp-master'] },
      { id: 'exp-work', x: 450, y: 100, type: 'experience', label: 'Work Experience', connections: ['skill-react', 'project-earth'] },

      // Output neurons (far right)
      { id: 'output-research', x: 750, y: 200, type: 'output', label: 'Research Output' },
      { id: 'output-web', x: 750, y: 300, type: 'output', label: 'Web Applications' },
      { id: 'output-creative', x: 750, y: 400, type: 'output', label: 'Creative Projects' },
      { id: 'output-hardware', x: 750, y: 150, type: 'output', label: 'Hardware Solutions' },
    ],
    []
  )

  // Thought data for each neuron
  const thoughts = {
    'skill-python': { title: 'Python Mastery', description: 'Core language for AI and backend development' },
    'skill-react': { title: 'React Expertise', description: 'Building modern, interactive user interfaces' },
    'skill-ai': { title: 'AI/ML Knowledge', description: 'Deep learning, computer vision, neural networks' },
    'project-ai': { title: 'AI Research Project', description: 'License plate detection using YOLO and OpenCV' },
    'project-earth': { title: '3D Visualization', description: 'Interactive Earth model with real-time data' },
    'project-drone': { title: 'Drone Choreography', description: 'Synchronized light shows with music' },
    'exp-master': { title: 'Advanced Education', description: 'Master of Engineering Science - AI focus' },
  }

  // Handle neuron clicks
  const handleNeuronClick = (neuronId) => {
    const neuron = neurons.find((n) => n.id === neuronId)
    if (!neuron) return

    // Activate this neuron and its connections
    const newActiveNeurons = new Set([neuronId])

    // Add connected neurons
    if (neuron.connections) {
      neuron.connections.forEach((connId) => newActiveNeurons.add(connId))
    }

    // Add neurons that connect to this one
    neurons.forEach((n) => {
      if (n.connections && n.connections.includes(neuronId)) {
        newActiveNeurons.add(n.id)
      }
    })

    setActiveNeurons(newActiveNeurons)
    setSelectedNeuron(neuronId)

    // Show thought bubble if available
    if (thoughts[neuronId]) {
      setThoughtBubble({
        x: neuron.x,
        y: neuron.y - 80,
        thought: thoughts[neuronId],
      })
    }

    // Auto-deactivate after 5 seconds
    setTimeout(() => {
      setActiveNeurons(new Set())
      setSelectedNeuron(null)
    }, 5000)
  }

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect()
        mouseX.set(e.clientX - rect.left)
        mouseY.set(e.clientY - rect.top)
      }
    }

    const svg = svgRef.current
    if (svg) {
      svg.addEventListener('mousemove', handleMouseMove)
      return () => svg.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  // Auto-demo mode
  useEffect(() => {
    const demoNeurons = ['skill-python', 'skill-react', 'skill-ai', 'project-ai', 'project-earth']
    let currentIndex = 0

    const interval = setInterval(() => {
      if (activeNeurons.size === 0) {
        // Only auto-demo when not manually activated
        handleNeuronClick(demoNeurons[currentIndex])
        currentIndex = (currentIndex + 1) % demoNeurons.length
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [activeNeurons.size])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Neural background pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
                           radial-gradient(circle at 75% 75%, #10b981 2px, transparent 2px)`,
            backgroundSize: '100px 100px',
          }}
        />
      </div>

      {/* Main SVG brain */}
      <svg ref={svgRef} className="w-full h-screen cursor-crosshair" viewBox="0 0 800 600">
        {/* Brain waves background */}
        <BrainWaves mouseX={mouseX} mouseY={mouseY} />

        {/* Neural connections */}
        {neurons.map((neuron) =>
          neuron.connections?.map((connId) => {
            const targetNeuron = neurons.find((n) => n.id === connId)
            if (!targetNeuron) return null

            const isConnectionActive = activeNeurons.has(neuron.id) && activeNeurons.has(connId)

            return <Synapse key={`${neuron.id}-${connId}`} from={neuron} to={targetNeuron} isActive={isConnectionActive} delay={Math.random() * 2} />
          })
        )}

        {/* Neurons */}
        {neurons.map((neuron, index) => (
          <Neuron key={neuron.id} {...neuron} isActive={activeNeurons.has(neuron.id)} onNeuronClick={handleNeuronClick} pulseDelay={index * 0.1} />
        ))}

        {/* Thought bubble */}
        <AnimatePresence>{thoughtBubble && <ThoughtBubble {...thoughtBubble} onClose={() => setThoughtBubble(null)} />}</AnimatePresence>
      </svg>

      {/* UI Overlay */}
      <div className="fixed top-8 left-8 z-40">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <h1 className="text-2xl font-light mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Neural Network Brain
          </h1>
          <div className="space-y-2 text-sm text-gray-300">
            <p>• Click neurons to activate neural pathways</p>
            <p>• Watch synaptic connections light up</p>
            <p>• Hover for neuron information</p>
            <p className="text-blue-400">Active: {activeNeurons.size} neurons</p>
          </div>
        </motion.div>
      </div>

      {/* Legend */}
      <div className="fixed bottom-8 left-8 z-40">
        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-black/70 backdrop-blur-sm border border-white/20 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Skills</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Projects</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Experience</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Core</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="fixed top-8 right-8 z-40">
        <motion.a href="/test" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-flex items-center gap-2 px-4 py-2 bg-black/70 border border-white/20 rounded-lg hover:border-white/40 transition-colors">
          ← Back to Test Lab
        </motion.a>
      </div>
    </div>
  )
}
