'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Code Editor Component (simplified)
// Enhanced Code Editor with Professional Features
const CodeEditor = ({ code, onChange, language = 'jsx' }) => {
  const textareaRef = useRef(null)
  const [lineNumbers, setLineNumbers] = useState([])
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })

  useEffect(() => {
    const lines = code.split('\n')
    setLineNumbers(lines.map((_, i) => i + 1))
  }, [code])

  const handleKeyDown = (e) => {
    const textarea = e.target
    const { selectionStart, selectionEnd } = textarea

    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault()
      const newCode = code.substring(0, selectionStart) + '  ' + code.substring(selectionEnd)
      onChange(newCode)

      // Set cursor position after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 2
      }, 0)
    }

    // Handle Enter key for auto-indentation
    if (e.key === 'Enter') {
      const currentLine = code.substring(0, selectionStart).split('\n').pop()
      const indent = currentLine.match(/^\s*/)[0]

      // Add extra indent if line ends with { or (
      const extraIndent = /[{(]\s*$/.test(currentLine.trim()) ? '  ' : ''

      setTimeout(() => {
        const newCode = code.substring(0, selectionStart) + '\n' + indent + extraIndent + code.substring(selectionEnd)
        onChange(newCode)
        textarea.selectionStart = textarea.selectionEnd = selectionStart + 1 + indent.length + extraIndent.length
      }, 0)
    }
  }

  const handleCursorChange = (e) => {
    const textarea = e.target
    const { selectionStart } = textarea
    const textBeforeCursor = code.substring(0, selectionStart)
    const lines = textBeforeCursor.split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    setCursorPosition({ line, column })
  }

  return (
    <div className="relative bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
      {/* VS Code-style Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <div className="text-xs text-gray-400 font-mono flex items-center space-x-2">
          <span>📝</span>
          <span>animation.{language}</span>
        </div>
        <div className="text-xs text-gray-400">
          {code.split('\n').length} lines • {code.length} chars
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex">
        {/* Line Numbers */}
        <div className="bg-gray-800 px-3 py-4 text-right border-r border-gray-700 select-none min-w-[50px]">
          {lineNumbers.map((num) => (
            <div key={num} className={`text-xs font-mono leading-6 ${num === cursorPosition.line ? 'text-white font-bold' : 'text-gray-500'}`}>
              {num}
            </div>
          ))}
        </div>

        {/* Code Area */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => {
              onChange(e.target.value)
              handleCursorChange(e)
            }}
            onKeyDown={handleKeyDown}
            onSelect={handleCursorChange}
            onClick={handleCursorChange}
            className="w-full h-96 p-4 bg-transparent text-white font-mono text-sm resize-none outline-none leading-6"
            style={{
              fontFamily: '"Fira Code", Monaco, Menlo, "Ubuntu Mono", monospace',
              tabSize: 2,
            }}
            spellCheck={false}
            placeholder="// 🚀 Start typing your animation code here...
// Try editing the existing code or write something new!
// Press Tab for indentation, Enter for auto-indent"
          />
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-4 py-2 bg-gray-800 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Preview</span>
          </span>
          <span>Auto-save: ON</span>
        </div>
        <div className="flex items-center space-x-4">
          <span>
            Ln {cursorPosition.line}, Col {cursorPosition.column}
          </span>
          <span>UTF-8</span>
          <span>Spaces: 2</span>
          <span className="text-purple-400">{language.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}

// Enhanced Live Preview Component
const LivePreview = ({ code, library }) => {
  const [error, setError] = useState(null)
  const [component, setComponent] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    setIsUpdating(true)
    const timer = setTimeout(() => {
      try {
        setError(null)
        // Simulate code analysis
        if (code.includes('syntax error') || code.includes('undefined')) {
          throw new Error('Syntax error detected in code')
        }
        setComponent(getPreviewComponent(library, code))
      } catch (err) {
        setError(err.message)
      } finally {
        setIsUpdating(false)
      }
    }, 300) // Debounce updates

    return () => clearTimeout(timer)
  }, [code, library])

  const getPreviewComponent = (lib, code) => {
    switch (lib) {
      case 'framer-motion':
        return <FramerMotionPreview code={code} />
      case 'react-spring':
        return <ReactSpringPreview code={code} />
      case 'gsap':
        return <GSAPPreview code={code} />
      default:
        return <DefaultPreview />
    }
  }

  return (
    <div className="h-96 bg-black border border-gray-700 rounded-lg overflow-hidden relative">
      {/* Preview Header */}
      <div className="absolute top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm px-4 py-2 border-b border-gray-700 z-10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <span>🎬</span>
            <span>Live Preview</span>
            {isUpdating && <motion.div className="w-2 h-2 bg-blue-500 rounded-full" animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
          </div>
          <div className="flex items-center space-x-2">
            <span>{library}</span>
            <div className={`w-2 h-2 rounded-full ${error ? 'bg-red-500' : 'bg-green-500'}`} />
          </div>
        </div>
      </div>

      {/* Preview Content */}
      <div className="w-full h-full pt-10">
        {error ? (
          <div className="p-6 text-red-400 font-mono text-sm">
            <div className="flex items-center space-x-2 text-red-300 font-bold mb-3">
              <span>❌</span>
              <span>Compilation Error:</span>
            </div>
            <div className="bg-red-900/20 border border-red-500/30 rounded p-3">{error}</div>
            <div className="mt-3 text-xs text-gray-400">💡 Tip: Check your syntax and make sure all brackets are closed</div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {isUpdating && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                <motion.div className="text-white text-sm" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                  Updating preview...
                </motion.div>
              </div>
            )}
            {component}
          </div>
        )}
      </div>
    </div>
  )
}

// Framer Motion Preview
const FramerMotionPreview = ({ code }) => {
  const [trigger, setTrigger] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTrigger((prev) => prev + 1)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      key={trigger}
      className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 10,
        duration: 1,
      }}
      whileHover={{
        scale: 1.1,
        rotate: 10,
        boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)',
      }}
    >
      FM
    </motion.div>
  )
}

// React Spring Preview
const ReactSpringPreview = ({ code }) => {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsActive((prev) => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="w-32 h-32 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl cursor-pointer"
      animate={{
        scale: isActive ? 1.2 : 1,
        rotate: isActive ? 180 : 0,
        borderRadius: isActive ? '50%' : '16px',
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
      onClick={() => setIsActive(!isActive)}
    >
      RS
    </motion.div>
  )
}

// GSAP Preview
const GSAPPreview = ({ code }) => {
  const boxRef = useRef(null)

  useEffect(() => {
    if (!boxRef.current) return

    // Simulate GSAP animation
    const element = boxRef.current
    let animation

    const animate = () => {
      element.style.transform = 'scale(1) rotate(0deg)'
      element.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'

      setTimeout(() => {
        element.style.transform = 'scale(1.3) rotate(360deg)'
        element.style.background = 'linear-gradient(135deg, #eab308, #ca8a04)'
      }, 500)

      setTimeout(() => {
        element.style.transform = 'scale(1) rotate(720deg)'
        element.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'
      }, 1500)
    }

    animate()
    const interval = setInterval(animate, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      ref={boxRef}
      className="w-32 h-32 rounded-2xl flex items-center justify-center text-white font-bold text-xl transition-all duration-1000 ease-out"
      style={{
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
      }}
    >
      GSAP
    </div>
  )
}

// Default Preview
const DefaultPreview = () => {
  return (
    <div className="text-gray-400 text-center">
      <div className="text-6xl mb-4">🎨</div>
      <div className="text-lg font-medium">Select a library to start</div>
      <div className="text-sm">Your animation will appear here</div>
    </div>
  )
}

// Library Selector
const LibrarySelector = ({ selectedLibrary, onSelect }) => {
  const libraries = [
    { id: 'framer-motion', name: 'Framer Motion', color: '#8b5cf6', icon: '🎭' },
    { id: 'react-spring', name: 'React Spring', color: '#10b981', icon: '🌊' },
    { id: 'gsap', name: 'GSAP', color: '#22c55e', icon: '⚡' },
    { id: 'lottie', name: 'Lottie', color: '#f59e0b', icon: '🎬' },
  ]

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {libraries.map((lib) => (
        <motion.button
          key={lib.id}
          onClick={() => onSelect(lib.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${selectedLibrary === lib.id ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            borderColor: selectedLibrary === lib.id ? lib.color : 'transparent',
            borderWidth: '2px',
          }}
        >
          <span>{lib.icon}</span>
          <span>{lib.name}</span>
        </motion.button>
      ))}
    </div>
  )
}

// Code Templates
const getCodeTemplate = (library) => {
  const templates = {
    'framer-motion': `import { motion } from 'framer-motion'

export default function Animation() {
  return (
    <motion.div
      className="w-32 h-32 bg-purple-500 rounded-2xl"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100,
        damping: 10 
      }}
      whileHover={{ 
        scale: 1.1, 
        rotate: 10 
      }}
    >
      Framer Motion
    </motion.div>
  )
}`,
    'react-spring': `import { useSpring, animated } from '@react-spring/web'

export default function Animation() {
  const [flip, setFlip] = useState(false)
  
  const springs = useSpring({
    transform: flip ? 'scale(1.2) rotate(180deg)' : 'scale(1) rotate(0deg)',
    background: flip ? '#10b981' : '#06b6d4',
    config: { tension: 200, friction: 10 }
  })

  return (
    <animated.div
      style={springs}
      className="w-32 h-32 rounded-2xl cursor-pointer"
      onClick={() => setFlip(!flip)}
    >
      React Spring
    </animated.div>
  )
}`,
    gsap: `import { gsap } from 'gsap'
import { useEffect, useRef } from 'react'

export default function Animation() {
  const boxRef = useRef()

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 })
    
    tl.to(boxRef.current, {
      scale: 1.3,
      rotation: 360,
      duration: 1,
      ease: 'power2.inOut'
    })
    .to(boxRef.current, {
      scale: 1,
      rotation: 720,
      duration: 1,
      ease: 'power2.inOut'
    })

    return () => tl.kill()
  }, [])

  return (
    <div
      ref={boxRef}
      className="w-32 h-32 bg-green-500 rounded-2xl"
    >
      GSAP
    </div>
  )
}`,
    lottie: `import Lottie from 'lottie-react'
import animationData from './animation.json'

export default function Animation() {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: 128, height: 128 }}
    />
  )
}`,
  }

  return templates[library] || '// Select a library to see code template'
}

// Component Gallery
const ComponentGallery = ({ onSelectComponent }) => {
  const components = [
    {
      id: 'button',
      name: 'Animated Button',
      description: 'Interactive button with hover effects',
      preview: '🔘',
    },
    {
      id: 'card',
      name: 'Morphing Card',
      description: 'Card with smooth hover transformations',
      preview: '🃏',
    },
    {
      id: 'loader',
      name: 'Loading Spinner',
      description: 'Smooth loading animation',
      preview: '⏳',
    },
    {
      id: 'modal',
      name: 'Modal Transition',
      description: 'Smooth modal enter/exit animations',
      preview: '🪟',
    },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-white mb-4">Component Gallery</h3>
      <div className="grid grid-cols-2 gap-3">
        {components.map((comp) => (
          <motion.button key={comp.id} onClick={() => onSelectComponent(comp)} className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition-colors" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <div className="text-2xl mb-2">{comp.preview}</div>
            <div className="text-white font-medium text-sm">{comp.name}</div>
            <div className="text-gray-400 text-xs">{comp.description}</div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

// Export Modal
const ExportModal = ({ isOpen, onClose, code, library }) => {
  const [exportFormat, setExportFormat] = useState('component')

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    // Show success message
  }

  if (!isOpen) return null

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-white">Export Animation</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">
            ×
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-white font-medium mb-2">Export Format:</label>
          <select value={exportFormat} onChange={(e) => setExportFormat(e.target.value)} className="w-full p-3 bg-gray-800 text-white border border-gray-700 rounded-lg">
            <option value="component">React Component</option>
            <option value="hook">Custom Hook</option>
            <option value="css">CSS Animation</option>
          </select>
        </div>

        <div className="mb-6">
          <CodeEditor code={code} onChange={() => {}} language="jsx" />
        </div>

        <div className="flex space-x-3">
          <button onClick={handleCopy} className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
            📋 Copy Code
          </button>
          <button onClick={onClose} className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Main Playground Component
export default function AnimationPlayground() {
  const [selectedLibrary, setSelectedLibrary] = useState('framer-motion')
  const [code, setCode] = useState('')
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    setCode(getCodeTemplate(selectedLibrary))
  }, [selectedLibrary])

  const handleSelectComponent = (component) => {
    // Load component template
    const componentCode = getCodeTemplate(selectedLibrary)
    setCode(componentCode)
  }

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
          Loading Playground...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <Link href="/animation-universe" className="text-blue-400 hover:text-blue-300">
            ← Back to Animation Universe
          </Link>
          <button onClick={() => setIsExportOpen(true)} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
            📤 Export Code
          </button>
        </div>
      </div>

      {/* Hero */}
      <section className="py-12 px-6 text-center border-b border-gray-800">
        <motion.h1 className="text-4xl md:text-6xl font-black mb-4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">Animation Playground</span>
        </motion.h1>

        <motion.p className="text-lg text-gray-300 max-w-2xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          Experiment with different animation libraries, edit code in real-time, and export your creations as React components.
        </motion.p>
      </section>

      {/* Main Playground */}
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Sidebar */}
        <div className="lg:w-80 p-6 border-r border-gray-800 bg-gray-900/50">
          <LibrarySelector selectedLibrary={selectedLibrary} onSelect={setSelectedLibrary} />

          <ComponentGallery onSelectComponent={handleSelectComponent} />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Code Editor */}
          <div className="flex-1 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Code Editor</h3>
            <CodeEditor code={code} onChange={setCode} language="jsx" />
          </div>

          {/* Live Preview */}
          <div className="flex-1 p-6 border-l border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Live Preview</h3>
            <LivePreview code={code} library={selectedLibrary} />
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <AnimatePresence>
        <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} code={code} library={selectedLibrary} />
      </AnimatePresence>
    </div>
  )
}
