'use client'

import { motion, useMotionValue, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Seeded random for consistent effects
const seededRandom = (seed) => {
  let x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// Floating Glass Orb
const GlassOrb = ({ size = 100, x, y, delay = 0, color = 'rgba(255, 255, 255, 0.1)' }) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), ${color})`,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 6 + seededRandom(delay) * 4,
        repeat: Infinity,
        delay: delay,
        ease: 'easeInOut',
      }}
    />
  )
}

// Glassmorphism Card
const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
      whileHover={
        hover
          ? {
              scale: 1.02,
              y: -5,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            }
          : {}
      }
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {/* Animated glass reflection */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, transparent 50%, rgba(255, 255, 255, 0.1) 100%)',
        }}
        animate={{
          opacity: isHovered ? 0.6 : 0,
          x: isHovered ? ['-100%', '100%'] : '-100%',
        }}
        transition={{
          opacity: { duration: 0.3 },
          x: { duration: 1.5, ease: 'easeInOut' },
        }}
      />

      {children}
    </motion.div>
  )
}

// Frosted Glass Modal
const GlassModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(10px)',
        }}
        initial={{ backdropFilter: 'blur(0px)' }}
        animate={{ backdropFilter: 'blur(10px)' }}
        transition={{ duration: 0.3 }}
      />

      {/* Modal */}
      <motion.div
        className="relative max-w-md w-full rounded-3xl p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(30px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        // className="rounded-3xl p-8"
      >
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <div className="text-white/90 mb-6">{children}</div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl font-medium text-white"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  )
}

// Glass Navigation Bar
const GlassNavbar = () => {
  const [activeItem, setActiveItem] = useState('home')

  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'about', label: 'About', icon: '👤' },
    { id: 'work', label: 'Work', icon: '💼' },
    { id: 'contact', label: 'Contact', icon: '📧' },
  ]

  return (
    <motion.nav
      className="relative rounded-2xl p-2"
      style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="flex space-x-2">
        {navItems.map((item) => (
          <motion.button key={item.id} className="relative px-6 py-3 rounded-xl font-medium text-white/90 hover:text-white transition-colors" onClick={() => setActiveItem(item.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {/* Active background */}
            {activeItem === item.id && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
                layoutId="activeTab"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              />
            )}

            <span className="relative flex items-center space-x-2">
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </span>
          </motion.button>
        ))}
      </div>
    </motion.nav>
  )
}

// Glass Button Component
const GlassButton = ({ children, variant = 'primary', size = 'md', onClick, ...props }) => {
  const variants = {
    primary: 'rgba(139, 92, 246, 0.3)',
    secondary: 'rgba(59, 130, 246, 0.3)',
    success: 'rgba(16, 185, 129, 0.3)',
    danger: 'rgba(239, 68, 68, 0.3)',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <motion.button
      className={`relative rounded-xl font-medium text-white overflow-hidden ${sizes[size]}`}
      style={{
        background: variants[variant],
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...props}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
        }}
        whileHover={{
          opacity: 1,
          x: ['-100%', '100%'],
        }}
        transition={{
          x: { duration: 0.8, ease: 'easeInOut' },
          opacity: { duration: 0.3 },
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}

// Glass Input Field
const GlassInput = ({ label, type = 'text', placeholder, ...props }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(false)

  return (
    <div className="relative">
      <motion.input
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-white placeholder-white/50 outline-none"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false)
          setHasValue(e.target.value.length > 0)
        }}
        whileFocus={{
          scale: 1.02,
          borderColor: 'rgba(139, 92, 246, 0.5)',
          boxShadow: '0 8px 32px rgba(139, 92, 246, 0.2)',
        }}
        {...props}
      />

      {label && (
        <motion.label
          className="absolute left-4 text-white/70 pointer-events-none"
          animate={{
            y: isFocused || hasValue ? -32 : 12,
            scale: isFocused || hasValue ? 0.85 : 1,
            color: isFocused ? 'rgba(139, 92, 246, 1)' : 'rgba(255, 255, 255, 0.7)',
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      )}
    </div>
  )
}

// Glass Dashboard
const GlassDashboard = () => {
  const stats = [
    { label: 'Total Views', value: '12.5K', change: '+12%', color: 'rgba(16, 185, 129, 0.3)' },
    { label: 'Active Users', value: '3.2K', change: '+8%', color: 'rgba(59, 130, 246, 0.3)' },
    { label: 'Revenue', value: '$45.2K', change: '+23%', color: 'rgba(139, 92, 246, 0.3)' },
    { label: 'Conversion', value: '4.8%', change: '+2%', color: 'rgba(245, 158, 11, 0.3)' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          className="relative p-6 rounded-2xl"
          style={{
            background: stat.color,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{
            scale: 1.05,
            y: -5,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <div className="text-white/70 text-sm font-medium mb-2">{stat.label}</div>
          <div className="text-white text-3xl font-bold mb-2">{stat.value}</div>
          <div className="text-green-300 text-sm font-medium">{stat.change}</div>

          {/* Animated background pattern */}
          <motion.div
            className="absolute inset-0 opacity-10"
            style={{
              background: 'radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.3), transparent)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: index * 0.5,
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Main Demo Component
const GlassDemo = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  return (
    <div className="space-y-20">
      {/* Glass Navigation */}
      <div className="flex justify-center">
        <GlassNavbar />
      </div>

      {/* Glass Cards Grid */}
      <div>
        <h3 className="text-3xl font-bold text-center text-white mb-12">Glass Cards</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassCard className="p-8">
            <h4 className="text-xl font-bold text-white mb-4">Glassmorphism</h4>
            <p className="text-white/80 mb-6">Beautiful frosted glass effects with backdrop blur and transparency.</p>
            <GlassButton size="sm">Learn More</GlassButton>
          </GlassCard>

          <GlassCard className="p-8">
            <h4 className="text-xl font-bold text-white mb-4">Backdrop Blur</h4>
            <p className="text-white/80 mb-6">Advanced CSS backdrop-filter effects for modern browsers.</p>
            <GlassButton variant="secondary" size="sm">
              Explore
            </GlassButton>
          </GlassCard>

          <GlassCard className="p-8">
            <h4 className="text-xl font-bold text-white mb-4">Crystal Clear</h4>
            <p className="text-white/80 mb-6">Transparent interfaces that blend beautifully with any background.</p>
            <GlassButton variant="success" size="sm">
              Try Now
            </GlassButton>
          </GlassCard>
        </div>
      </div>

      {/* Glass Dashboard */}
      <div>
        <h3 className="text-3xl font-bold text-center text-white mb-12">Glass Dashboard</h3>
        <GlassDashboard />
      </div>

      {/* Glass Form */}
      <div>
        <h3 className="text-3xl font-bold text-center text-white mb-12">Glass Form</h3>
        <div className="max-w-md mx-auto">
          <GlassCard className="p-8">
            <div className="space-y-6">
              <GlassInput label="Full Name" placeholder="Enter your name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <GlassInput label="Email Address" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <GlassInput label="Message" placeholder="Your message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              <div className="flex space-x-4">
                <GlassButton className="flex-1" onClick={() => setModalOpen(true)}>
                  Send Message
                </GlassButton>
                <GlassButton variant="secondary" onClick={() => setFormData({ name: '', email: '', message: '' })}>
                  Clear
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Glass Modal */}
      <GlassModal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Message Sent!">
        <p>Thank you for your message! We'll get back to you soon.</p>
        <p className="text-sm text-white/70 mt-4">This is a demo modal showcasing glassmorphism effects with backdrop blur.</p>
      </GlassModal>
    </div>
  )
}

export default function GlassShowcase() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <motion.div
          className="w-20 h-20 rounded-full"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen text-white relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
        }}
        animate={{
          background: ['radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)', 'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 60% 60%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)', 'radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating Glass Orbs */}
      {Array.from({ length: 8 }).map((_, i) => (
        <GlassOrb key={i} size={50 + seededRandom(i * 123) * 100} x={`${seededRandom(i * 456) * 100}%`} y={`${seededRandom(i * 789) * 100}%`} delay={seededRandom(i * 987) * 2} color={['rgba(139, 92, 246, 0.1)', 'rgba(59, 130, 246, 0.1)', 'rgba(16, 185, 129, 0.1)'][i % 3]} />
      ))}

      <div className="relative z-10">
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <Link href="/animation-universe" className="text-blue-400 hover:text-blue-300">
            ← Back to Animation Universe
          </Link>
        </div>

        {/* Hero */}
        <section className="py-20 px-6 text-center">
          <motion.h1 className="text-6xl md:text-8xl font-black mb-8" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">Glass UI</span>
          </motion.h1>

          <motion.p className="text-xl text-white/80 max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
            Stunning glassmorphism effects with backdrop blur, transparency, and crystal-clear interfaces. Modern design that adapts beautifully to any background.
          </motion.p>
        </section>

        {/* Interactive Demos */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <GlassDemo />
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">Glass Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GlassCard className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-white">Backdrop Blur</h3>
                <p className="text-white/80">Advanced CSS backdrop-filter effects that create realistic frosted glass appearances.</p>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-white">Transparency</h3>
                <p className="text-white/80">Perfect balance of opacity and clarity that works on any background color or image.</p>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-white">Modern Design</h3>
                <p className="text-white/80">Contemporary glassmorphism aesthetic that's both beautiful and functional.</p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="py-20 px-6 text-center">
          <GlassCard className="max-w-2xl mx-auto p-8">
            <h3 className="text-3xl font-bold mb-8 text-white">Animation Universe Complete!</h3>
            <p className="text-white/80 mb-8">You've explored all the amazing React animation libraries. Ready to start building?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/animation-universe/gestures">
                <GlassButton variant="secondary">← Gesture Controls</GlassButton>
              </Link>
              <Link href="/animation-universe">
                <GlassButton>Back to Universe</GlassButton>
              </Link>
            </div>
          </GlassCard>
        </section>
      </div>
    </div>
  )
}
