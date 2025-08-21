'use client'

import { animated, config, useSpring } from '@react-spring/web'
import { useGesture } from '@use-gesture/react'
import { PanInfo, motion, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Draggable Card with Physics
const DraggableCard = ({ children, color, index = 0 }) => {
  const [{ x, y, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    config: config.wobbly,
  }))

  const bind = useGesture({
    onDrag: ({ offset: [ox, oy], velocity: [vx, vy], direction: [dx, dy], cancel }) => {
      // Swipe away if dragged far enough
      if (Math.abs(ox) > 200) {
        api.start({
          x: dx > 0 ? 1000 : -1000,
          y: oy + dy * 200,
          rotate: dx * 20,
          scale: 0.8,
          config: { tension: 200, friction: 10 },
        })
        setTimeout(() => {
          api.start({ x: 0, y: 0, rotate: 0, scale: 1 })
        }, 1000)
        cancel()
      } else {
        api.start({
          x: ox,
          y: oy,
          rotate: ox * 0.1,
          scale: 1.1,
        })
      }
    },
    onDragEnd: () => {
      api.start({ x: 0, y: 0, rotate: 0, scale: 1 })
    },
  })

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        y,
        rotate,
        scale,
        touchAction: 'none',
        background: `linear-gradient(135deg, ${color}, ${color}80)`,
      }}
      className="w-64 h-40 rounded-2xl p-6 cursor-grab active:cursor-grabbing shadow-2xl border border-white/20"
    >
      <div className="text-white font-bold text-lg mb-2">Drag Me!</div>
      <div className="text-white/80 text-sm">{children}</div>
      <div className="text-white/60 text-xs mt-4">Swipe left/right to dismiss</div>
    </animated.div>
  )
}

// Multi-Touch Pinch & Zoom Gallery
const PinchZoomImage = ({ src, alt, index }) => {
  const [{ scale, x, y }, api] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
    config: config.gentle,
  }))

  const bind = useGesture({
    onPinch: ({ offset: [s], origin: [ox, oy] }) => {
      api.start({ scale: Math.max(0.5, Math.min(3, s)) })
    },
    onDrag: ({ offset: [ox, oy] }) => {
      api.start({ x: ox, y: oy })
    },
    onDoubleClick: () => {
      api.start({ scale: scale.get() > 1 ? 1 : 2, x: 0, y: 0 })
    },
  })

  // Generate a colorful placeholder since we don't have actual images
  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899']
  const bgColor = colors[index % colors.length]

  return (
    <div className="relative w-full h-64 bg-gray-800 rounded-2xl overflow-hidden">
      <animated.div
        {...bind()}
        style={{
          scale,
          x,
          y,
          touchAction: 'none',
          background: `linear-gradient(135deg, ${bgColor}, ${bgColor}80)`,
        }}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="text-center text-white">
          <div className="text-4xl mb-2">🖼️</div>
          <div className="font-bold">Image {index + 1}</div>
          <div className="text-sm opacity-80 mt-2">Pinch to zoom • Drag to pan • Double-tap to reset</div>
        </div>
      </animated.div>
    </div>
  )
}

// Swipe Navigation Carousel
const SwipeCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [{ x }, api] = useSpring(() => ({ x: 0 }))

  const items = [
    { title: 'Slide 1', content: 'Swipe left or right to navigate', color: '#8b5cf6' },
    { title: 'Slide 2', content: 'Smooth physics-based transitions', color: '#06b6d4' },
    { title: 'Slide 3', content: 'Momentum and velocity detection', color: '#10b981' },
    { title: 'Slide 4', content: 'Touch-friendly mobile experience', color: '#f59e0b' },
  ]

  const bind = useGesture({
    onDrag: ({ offset: [ox], velocity: [vx], direction: [dx], cancel }) => {
      const threshold = 100
      const momentum = Math.abs(vx) > 0.5

      if (Math.abs(ox) > threshold || momentum) {
        const newIndex = dx > 0 ? Math.max(0, currentIndex - 1) : Math.min(items.length - 1, currentIndex + 1)

        if (newIndex !== currentIndex) {
          setCurrentIndex(newIndex)
          cancel()
        }
      }

      api.start({ x: ox })
    },
    onDragEnd: () => {
      api.start({ x: 0 })
    },
  })

  useEffect(() => {
    api.start({ x: 0 })
  }, [currentIndex, api])

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden rounded-2xl">
        <animated.div
          {...bind()}
          style={{
            x,
            touchAction: 'pan-y',
            transform: x.to((x) => `translateX(calc(${-currentIndex * 100}% + ${x}px))`),
          }}
          className="flex cursor-grab active:cursor-grabbing"
        >
          {items.map((item, index) => (
            <div key={index} className="w-full flex-shrink-0 h-64 p-8 flex flex-col justify-center items-center text-center" style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}80)` }}>
              <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
              <p className="text-white/90">{item.content}</p>
            </div>
          ))}
        </animated.div>
      </div>

      {/* Indicators */}
      <div className="flex justify-center mt-4 space-x-2">
        {items.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/30'}`} />
        ))}
      </div>
    </div>
  )
}

// Elastic Pull-to-Refresh
const PullToRefresh = () => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [{ y, rotate, scale }, api] = useSpring(() => ({
    y: 0,
    rotate: 0,
    scale: 1,
    config: config.wobbly,
  }))

  const bind = useGesture({
    onDrag: ({ offset: [, oy], velocity: [, vy], direction: [, dy], cancel }) => {
      if (oy > 0) {
        const pullDistance = Math.min(oy, 120)
        api.start({
          y: pullDistance,
          rotate: pullDistance * 2,
          scale: 1 + pullDistance * 0.01,
        })

        if (pullDistance > 80 && !isRefreshing) {
          setIsRefreshing(true)
          cancel()

          // Simulate refresh
          setTimeout(() => {
            setIsRefreshing(false)
            api.start({ y: 0, rotate: 0, scale: 1 })
          }, 2000)
        }
      }
    },
    onDragEnd: () => {
      if (!isRefreshing) {
        api.start({ y: 0, rotate: 0, scale: 1 })
      }
    },
  })

  return (
    <div className="relative w-full max-w-sm mx-auto bg-gray-800 rounded-2xl overflow-hidden">
      {/* Pull indicator */}
      <animated.div style={{ y, rotate, scale }} className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">{isRefreshing ? <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} /> : <span className="text-white text-sm">↓</span>}</div>
      </animated.div>

      {/* Content */}
      <animated.div {...bind()} style={{ y, touchAction: 'pan-x' }} className="p-6 cursor-grab active:cursor-grabbing">
        <div className="text-center text-white mb-6 mt-8">
          <h3 className="text-xl font-bold mb-2">Pull to Refresh</h3>
          <p className="text-gray-300 text-sm">{isRefreshing ? 'Refreshing...' : 'Pull down to refresh content'}</p>
        </div>

        {/* Mock content */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white/10 rounded-lg p-4">
              <div className="h-4 bg-white/20 rounded mb-2" />
              <div className="h-3 bg-white/10 rounded w-3/4" />
            </div>
          ))}
        </div>
      </animated.div>
    </div>
  )
}

// Gesture-Controlled Slider
const GestureSlider = () => {
  const [value, setValue] = useState(50)
  const [{ x }, api] = useSpring(() => ({ x: 50 }))

  const bind = useGesture({
    onDrag: ({ offset: [ox] }) => {
      const newValue = Math.max(0, Math.min(100, (ox / 200) * 100 + 50))
      setValue(newValue)
      api.start({ x: newValue })
    },
  })

  const getColor = (value) => {
    if (value < 33) return '#ef4444'
    if (value < 66) return '#f59e0b'
    return '#10b981'
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center text-white mb-6">
        <h3 className="text-xl font-bold mb-2">Gesture Slider</h3>
        <div className="text-3xl font-bold" style={{ color: getColor(value) }}>
          {Math.round(value)}%
        </div>
      </div>

      <div className="relative h-16 bg-gray-800 rounded-full overflow-hidden">
        {/* Track */}
        <animated.div
          className="absolute inset-0 rounded-full"
          style={{
            background: x.to((x) => `linear-gradient(90deg, ${getColor(x)} 0%, ${getColor(x)}40 100%)`),
            width: x.to((x) => `${x}%`),
          }}
        />

        {/* Handle */}
        <animated.div
          {...bind()}
          style={{
            x: x.to((x) => `${(x / 100) * 200 - 16}px`),
            touchAction: 'none',
          }}
          className="absolute top-2 w-12 h-12 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <div className="w-6 h-6 bg-gray-400 rounded-full" />
        </animated.div>
      </div>

      <div className="flex justify-between text-gray-400 text-sm mt-2">
        <span>0%</span>
        <span>100%</span>
      </div>
    </div>
  )
}

// Interactive Demo Grid
const GestureDemo = () => {
  return (
    <div className="space-y-16">
      {/* Draggable Cards */}
      <div>
        <h3 className="text-3xl font-bold text-center text-white mb-8">Draggable Cards</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <DraggableCard color="#8b5cf6" index={0}>
            Physics-based dragging with momentum and spring animations
          </DraggableCard>
          <DraggableCard color="#06b6d4" index={1}>
            Swipe gestures with velocity detection and auto-dismiss
          </DraggableCard>
          <DraggableCard color="#10b981" index={2}>
            Rotation effects based on drag direction and distance
          </DraggableCard>
        </div>
      </div>

      {/* Pinch & Zoom Gallery */}
      <div>
        <h3 className="text-3xl font-bold text-center text-white mb-8">Pinch & Zoom Gallery</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <PinchZoomImage key={i} index={i} />
          ))}
        </div>
      </div>

      {/* Swipe Carousel */}
      <div>
        <h3 className="text-3xl font-bold text-center text-white mb-8">Swipe Navigation</h3>
        <SwipeCarousel />
      </div>

      {/* Pull to Refresh */}
      <div>
        <h3 className="text-3xl font-bold text-center text-white mb-8">Pull to Refresh</h3>
        <PullToRefresh />
      </div>

      {/* Gesture Slider */}
      <div>
        <h3 className="text-3xl font-bold text-center text-white mb-8">Gesture Controls</h3>
        <GestureSlider />
      </div>
    </div>
  )
}

export default function GesturesShowcase() {
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
          Loading Gesture Controls...
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
          <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Gesture Controls</span>
        </motion.h1>

        <motion.p className="text-xl text-gray-300 max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          Advanced multi-touch interactions with drag, pinch, swipe, and pull gestures. Physics-based animations that respond naturally to user input.
        </motion.p>
      </section>

      {/* Interactive Demos */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <GestureDemo />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Gesture Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">Multi-Touch</h3>
              <p className="text-gray-300">Pinch to zoom, two-finger rotation, and complex multi-touch gestures with precise tracking.</p>
            </motion.div>

            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-orange-400">Physics-Based</h3>
              <p className="text-gray-300">Momentum, velocity, and spring physics create natural feeling interactions that respond to user intent.</p>
            </motion.div>

            <motion.div className="p-6 bg-white/5 rounded-2xl border border-white/10" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} viewport={{ once: true }}>
              <h3 className="text-2xl font-bold mb-4 text-red-400">Mobile Optimized</h3>
              <p className="text-gray-300">Touch-friendly interactions that work perfectly on mobile devices with proper touch handling.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-20 px-6 text-center bg-gray-900/50">
        <h3 className="text-3xl font-bold mb-8">Explore More Libraries</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/animation-universe/lottie" className="px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-medium transition-colors">
            ← Lottie Animations
          </Link>
          <Link href="/animation-universe/glass" className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-xl font-medium transition-colors">
            Glass UI Effects →
          </Link>
        </div>
      </section>
    </div>
  )
}
