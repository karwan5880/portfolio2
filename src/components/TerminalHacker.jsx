'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// Terminal typing effect component
const TypingText = ({ text, speed = 50, onComplete, className = '' }) => {
  const [displayText, setDisplayText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={className}>
      {displayText}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="inline-block w-2 h-5 bg-green-400 ml-1" />
    </span>
  )
}

// Matrix rain effect
const MatrixRain = () => {
  const [drops, setDrops] = useState([])

  useEffect(() => {
    const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const newDrops = []

    for (let i = 0; i < 50; i++) {
      newDrops.push({
        id: i,
        x: Math.random() * 100,
        chars: Array.from({ length: 20 }, () => characters[Math.floor(Math.random() * characters.length)]),
        speed: Math.random() * 2 + 1,
      })
    }
    setDrops(newDrops)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute text-green-400 text-sm font-mono"
          style={{ left: `${drop.x}%` }}
          animate={{ y: ['0vh', '100vh'] }}
          transition={{
            duration: 10 / drop.speed,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {drop.chars.map((char, index) => (
            <motion.div
              key={index}
              animate={{ opacity: [1, 0] }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                repeat: Infinity,
              }}
            >
              {char}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

// Command output component
const CommandOutput = ({ command, output, delay = 0 }) => {
  const [showOutput, setShowOutput] = useState(false)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }} className="mb-4">
      <div className="flex items-center mb-2">
        <span className="text-green-400 mr-2">$</span>
        <TypingText text={command} speed={30} onComplete={() => setShowOutput(true)} className="text-white font-mono" />
      </div>

      <AnimatePresence>
        {showOutput && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.5 }} className="text-green-300 font-mono text-sm ml-4 whitespace-pre-line">
            {output}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Interactive terminal component
const InteractiveTerminal = ({ onCommandEnter }) => {
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      const result = onCommandEnter(input.trim())
      setHistory((prev) => [...prev, { command: input, output: result }])
      setInput('')
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="bg-black/80 border border-green-400/30 rounded-lg p-6 backdrop-blur-sm">
      <div className="text-green-400 text-sm mb-4 font-mono">Interactive Terminal - Type 'help' for commands</div>

      {/* Command history */}
      <div className="mb-4 max-h-40 overflow-y-auto">
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            <div className="text-green-400 font-mono">$ {item.command}</div>
            <div className="text-green-300 font-mono text-sm ml-4 whitespace-pre-line">{item.output}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center">
        <span className="text-green-400 mr-2 font-mono">$</span>
        <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)} className="flex-1 bg-transparent text-white font-mono outline-none" placeholder="Enter command..." />
        <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-5 bg-green-400 ml-1" />
      </form>
    </div>
  )
}

// Main Terminal Hacker component
export const TerminalHacker = () => {
  const [currentSection, setCurrentSection] = useState('boot')
  const [commands, setCommands] = useState([])

  // Command handler
  const handleCommand = (command) => {
    const cmd = command.toLowerCase()

    switch (cmd) {
      case 'help':
        return `Available commands:
whoami     - Display user information
ls         - List available sections
cat about  - Show about information
cat skills - Show skills
cat projects - Show projects
cat contact - Show contact info
clear      - Clear terminal
hack       - Enter the matrix...`

      case 'whoami':
        return 'Leong Kar Wan - Full Stack Developer & AI Enthusiast'

      case 'ls':
        return `total 5
drwxr-xr-x  about/
drwxr-xr-x  skills/
drwxr-xr-x  projects/
drwxr-xr-x  contact/
-rw-r--r--  README.md`

      case 'cat about':
        return `# About Me
Name: Leong Kar Wan
Role: Full Stack Developer
Education: Master of Engineering Science
Interests: AI, Computer Vision, Web Development
Status: Building the future, one line of code at a time...`

      case 'cat skills':
        return `# Core Skills
[████████████████████] Python      100%
[████████████████████] C/C++       100%
[████████████████████] React       100%
[██████████████████  ] JavaScript   90%
[████████████████    ] AI/ML        80%
[██████████████      ] Three.js     75%`

      case 'cat projects':
        return `# Projects
1. License Plate Detection - AI system using YOLO
2. 3D Earth Model - Interactive WebGL visualization
3. Drone Show Simulator - Choreographed light shows
4. Raspberry Pi Hub - IoT Bluetooth controller`

      case 'cat contact':
        return `# Contact Information
GitHub: https://github.com/karwan5880/portfolio2
LinkedIn: https://linkedin.com/in/karwanleong
Email: [ENCRYPTED]
Location: Malaysia`

      case 'clear':
        return '[TERMINAL CLEARED]'

      case 'hack':
        setCurrentSection('matrix')
        return 'Entering the matrix... Reality is not what it seems...'

      case 'exit':
        setCurrentSection('boot')
        return 'Exiting matrix mode...'

      default:
        return `Command not found: ${command}
Type 'help' for available commands.`
    }
  }

  // Boot sequence
  useEffect(() => {
    if (currentSection === 'boot') {
      const bootCommands = [
        { command: 'sudo su -', output: "Welcome to Leong Kar Wan's Terminal Portfolio" },
        { command: 'whoami', output: 'root@portfolio:~# Leong Kar Wan - Full Stack Developer' },
        {
          command: 'ls -la /skills',
          output: `total 42
drwxr-xr-x  2 root root 4096 Jan 01 2025 python/
drwxr-xr-x  2 root root 4096 Jan 01 2025 react/
drwxr-xr-x  2 root root 4096 Jan 01 2025 ai/
drwxr-xr-x  2 root root 4096 Jan 01 2025 cpp/`,
        },
        {
          command: 'cat /etc/motd',
          output: `
╔══════════════════════════════════════╗
║        TERMINAL PORTFOLIO v2.0       ║
║     Leong Kar Wan - Developer        ║
╚══════════════════════════════════════╝

Type 'help' for available commands.
Ready for interactive mode...`,
        },
      ]
      setCommands(bootCommands)
    }
  }, [currentSection])

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Matrix rain background */}
      <MatrixRain />

      {/* Glitch overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          background: ['transparent', 'rgba(0, 255, 0, 0.02)', 'transparent'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      />

      <div className="relative z-10 p-6 max-w-6xl mx-auto">
        {/* Terminal header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-900 border border-green-400/30 rounded-t-lg p-3 flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="ml-4 text-sm">root@portfolio:~#</span>
        </motion.div>

        {/* Terminal content */}
        <div className="bg-black border-x border-b border-green-400/30 rounded-b-lg p-6 min-h-[70vh]">
          {currentSection === 'boot' && (
            <div>
              {/* Boot sequence */}
              {commands.map((cmd, index) => (
                <CommandOutput key={index} command={cmd.command} output={cmd.output} delay={index * 1.5} />
              ))}

              {/* Interactive terminal */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: commands.length * 1.5 + 1 }}>
                <InteractiveTerminal onCommandEnter={handleCommand} />
              </motion.div>
            </div>
          )}

          {currentSection === 'matrix' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  textShadow: ['0 0 10px #00ff00', '0 0 20px #00ff00, 0 0 30px #00ff00', '0 0 10px #00ff00'],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl mb-8"
              >
                WELCOME TO THE MATRIX
              </motion.div>
              <div className="text-lg mb-8">
                <TypingText text="Reality is an illusion. Code is truth. You have entered the developer's realm..." speed={50} />
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setCurrentSection('boot')} className="px-6 py-3 border border-green-400 rounded bg-black/50 hover:bg-green-400/10 transition-colors">
                Type 'exit' to return
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 }} className="mt-8 text-center">
          <a href="/test" className="inline-flex items-center gap-2 px-6 py-3 border border-green-400/50 rounded hover:bg-green-400/10 transition-colors">
            ← Back to Test Lab
          </a>
        </motion.div>
      </div>
    </div>
  )
}
