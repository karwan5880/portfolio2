'use client'

/**
 * Performance optimization utilities for the multiverse portfolio
 * Includes lazy loading, throttling, debouncing, and performance monitoring
 * Enhanced with comprehensive error handling and recovery mechanisms
 */
import { useCallback, useEffect, useRef, useState } from 'react'

import { ERROR_SEVERITY, ERROR_TYPES, globalErrorHandler, safeAsync, withErrorHandling } from './errorHandling'

// Performance monitoring utilities
export class PerformanceMonitor {
  constructor() {
    this.metrics = {
      frameRate: 60,
      scrollPerformance: 0,
      animationPerformance: 0,
      themeSwitch: 0,
      memoryUsage: 0,
    }
    this.observers = new Set()
    this.isMonitoring = false
  }

  startMonitoring() {
    if (this.isMonitoring || typeof window === 'undefined') return

    this.isMonitoring = true
    this.monitorFrameRate()
    this.monitorMemoryUsage()
  }

  stopMonitoring() {
    this.isMonitoring = false
    this.observers.clear()
  }

  monitorFrameRate() {
    let lastTime = performance.now()
    let frameCount = 0
    const targetFPS = 60

    const measureFrame = withErrorHandling(
      (currentTime) => {
        if (!this.isMonitoring) return

        frameCount++
        const elapsed = currentTime - lastTime

        if (elapsed >= 1000) {
          const fps = Math.round((frameCount * 1000) / elapsed)

          if (isNaN(fps) || fps < 0) {
            throw new Error(`Invalid FPS calculation: ${fps}`)
          }

          this.metrics.frameRate = fps

          // Notify observers of performance changes
          this.notifyObservers('frameRate', fps)

          // Check for performance issues
          if (fps < 30) {
            globalErrorHandler.handleError(new Error(`Low frame rate detected: ${fps} FPS`), {
              type: ERROR_TYPES.SCROLL_PERFORMANCE,
              context: 'frame_rate_monitoring',
              severity: ERROR_SEVERITY.MEDIUM,
              metadata: { fps, targetFPS },
            })
          }

          frameCount = 0
          lastTime = currentTime
        }

        requestAnimationFrame(measureFrame)
      },
      {
        type: ERROR_TYPES.SCROLL_PERFORMANCE,
        context: 'frame_rate_measurement',
        severity: ERROR_SEVERITY.LOW,
      }
    )

    requestAnimationFrame(measureFrame)
  }

  monitorMemoryUsage() {
    if (!performance.memory) {
      console.warn('Memory monitoring not available in this browser')
      return
    }

    const checkMemory = withErrorHandling(
      () => {
        if (!this.isMonitoring) return

        const memoryInfo = performance.memory
        if (!memoryInfo || typeof memoryInfo.usedJSHeapSize !== 'number') {
          throw new Error('Invalid memory information')
        }

        const usedMB = Math.round(memoryInfo.usedJSHeapSize / 1048576)
        const limitMB = Math.round(memoryInfo.jsHeapSizeLimit / 1048576)

        if (isNaN(usedMB) || usedMB < 0) {
          throw new Error(`Invalid memory usage calculation: ${usedMB}`)
        }

        this.metrics.memoryUsage = usedMB

        this.notifyObservers('memoryUsage', usedMB)

        // Check for memory issues
        const memoryUsagePercent = (usedMB / limitMB) * 100
        if (memoryUsagePercent > 80) {
          globalErrorHandler.handleError(new Error(`High memory usage detected: ${usedMB}MB (${memoryUsagePercent.toFixed(1)}%)`), {
            type: ERROR_TYPES.SCROLL_PERFORMANCE,
            context: 'memory_monitoring',
            severity: ERROR_SEVERITY.MEDIUM,
            metadata: { usedMB, limitMB, usagePercent: memoryUsagePercent },
          })
        }

        setTimeout(checkMemory, 5000) // Check every 5 seconds
      },
      {
        type: ERROR_TYPES.SCROLL_PERFORMANCE,
        context: 'memory_usage_check',
        severity: ERROR_SEVERITY.LOW,
      }
    )

    checkMemory()
  }

  measureScrollPerformance(callback) {
    return withErrorHandling(
      (...args) => {
        const startTime = performance.now()

        try {
          const result = callback(...args)
          const endTime = performance.now()
          const duration = endTime - startTime

          if (isNaN(duration) || duration < 0) {
            throw new Error(`Invalid scroll performance measurement: ${duration}`)
          }

          this.metrics.scrollPerformance = duration
          this.notifyObservers('scrollPerformance', duration)

          // Check for performance issues
          if (duration > 16) {
            // More than one frame at 60fps
            globalErrorHandler.handleError(new Error(`Slow scroll performance: ${duration.toFixed(2)}ms`), {
              type: ERROR_TYPES.SCROLL_PERFORMANCE,
              context: 'scroll_performance_measurement',
              severity: duration > 32 ? ERROR_SEVERITY.MEDIUM : ERROR_SEVERITY.LOW,
              metadata: { duration, targetDuration: 16 },
            })
          }

          return result
        } catch (callbackError) {
          const endTime = performance.now()
          const duration = endTime - startTime
          this.metrics.scrollPerformance = duration
          throw callbackError
        }
      },
      {
        type: ERROR_TYPES.SCROLL_PERFORMANCE,
        context: 'scroll_performance_wrapper',
        severity: ERROR_SEVERITY.LOW,
      }
    )
  }

  measureAnimationPerformance(animationName, callback) {
    const startTime = performance.now()

    return (...args) => {
      const result = callback(...args)
      const endTime = performance.now()
      const duration = endTime - startTime

      this.metrics.animationPerformance = duration
      this.notifyObservers('animationPerformance', { name: animationName, duration })

      return result
    }
  }

  measureThemeSwitchPerformance(callback) {
    const startTime = performance.now()

    return (...args) => {
      const result = callback(...args)
      const endTime = performance.now()
      const duration = endTime - startTime

      this.metrics.themeSwitch = duration
      this.notifyObservers('themeSwitch', duration)

      return result
    }
  }

  subscribe(callback) {
    this.observers.add(callback)
    return () => this.observers.delete(callback)
  }

  notifyObservers(metric, value) {
    this.observers.forEach((callback) => {
      try {
        callback(metric, value, this.metrics)
      } catch (error) {
        console.warn('Performance observer error:', error)
      }
    })
  }

  getMetrics() {
    return { ...this.metrics }
  }

  isPerformancePoor() {
    return this.metrics.frameRate < 30 || this.metrics.scrollPerformance > 16 || this.metrics.memoryUsage > 100
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor()

// Throttling utility with performance awareness
export const createThrottledFunction = (func, delay, options = {}) => {
  const { leading = true, trailing = true, performanceAware = true } = options
  let lastCallTime = 0
  let timeoutId = null
  let lastArgs = null

  return function throttledFunction(...args) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime

    // Adjust delay based on performance if enabled
    let adjustedDelay = delay
    if (performanceAware && performanceMonitor.isPerformancePoor()) {
      adjustedDelay = Math.min(delay * 2, 100) // Double delay but cap at 100ms
    }

    const shouldCallLeading = leading && timeSinceLastCall >= adjustedDelay
    const shouldScheduleTrailing = trailing && timeSinceLastCall < adjustedDelay

    if (shouldCallLeading) {
      lastCallTime = now
      lastArgs = args
      return func.apply(this, args)
    }

    if (shouldScheduleTrailing) {
      lastArgs = args

      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        lastCallTime = Date.now()
        func.apply(this, lastArgs)
        timeoutId = null
      }, adjustedDelay - timeSinceLastCall)
    }
  }
}

// Debouncing utility
export const createDebouncedFunction = (func, delay, options = {}) => {
  const { immediate = false, maxWait = null } = options
  let timeoutId = null
  let maxTimeoutId = null
  let lastCallTime = 0

  return function debouncedFunction(...args) {
    const now = Date.now()
    const callNow = immediate && !timeoutId

    const later = () => {
      timeoutId = null
      if (!immediate) {
        func.apply(this, args)
      }
      if (maxTimeoutId) {
        clearTimeout(maxTimeoutId)
        maxTimeoutId = null
      }
    }

    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(later, delay)

    // Handle maxWait option
    if (maxWait && !maxTimeoutId) {
      maxTimeoutId = setTimeout(() => {
        if (timeoutId) {
          clearTimeout(timeoutId)
          timeoutId = null
        }
        func.apply(this, args)
        maxTimeoutId = null
      }, maxWait)
    }

    if (callNow) {
      func.apply(this, args)
    }

    lastCallTime = now
  }
}

// Lazy loading utility for theme assets
export class LazyAssetLoader {
  constructor() {
    this.cache = new Map()
    this.loading = new Set()
    this.preloadQueue = []
    this.maxConcurrentLoads = 3
    this.currentLoads = 0
  }

  async loadAsset(url, type = 'auto') {
    // Return cached asset if available
    if (this.cache.has(url)) {
      return this.cache.get(url)
    }

    // Return existing promise if already loading
    if (this.loading.has(url)) {
      return new Promise((resolve, reject) => {
        const checkLoading = () => {
          if (this.cache.has(url)) {
            resolve(this.cache.get(url))
          } else if (!this.loading.has(url)) {
            reject(new Error('Asset loading failed'))
          } else {
            setTimeout(checkLoading, 50)
          }
        }
        checkLoading()
      })
    }

    // Queue if too many concurrent loads
    if (this.currentLoads >= this.maxConcurrentLoads) {
      return new Promise((resolve, reject) => {
        this.preloadQueue.push({ url, type, resolve, reject })
      })
    }

    return this._loadAssetInternal(url, type)
  }

  async _loadAssetInternal(url, type) {
    this.loading.add(url)
    this.currentLoads++

    try {
      let asset
      const detectedType = type === 'auto' ? this._detectAssetType(url) : type

      switch (detectedType) {
        case 'image':
          asset = await this._loadImage(url)
          break
        case 'css':
          asset = await this._loadCSS(url)
          break
        case 'json':
          asset = await this._loadJSON(url)
          break
        default:
          asset = await this._loadGeneric(url)
      }

      this.cache.set(url, asset)
      return asset
    } catch (error) {
      console.warn(`Failed to load asset: ${url}`, error)
      throw error
    } finally {
      this.loading.delete(url)
      this.currentLoads--
      this._processQueue()
    }
  }

  _loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = url
    })
  }

  _loadCSS(url) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = url
      link.onload = () => resolve(link)
      link.onerror = reject
      document.head.appendChild(link)
    })
  }

  async _loadJSON(url) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }

  async _loadGeneric(url) {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response
  }

  _detectAssetType(url) {
    const extension = url.split('.').pop()?.toLowerCase()

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image'
    }
    if (extension === 'css') {
      return 'css'
    }
    if (extension === 'json') {
      return 'json'
    }
    return 'generic'
  }

  _processQueue() {
    if (this.preloadQueue.length === 0 || this.currentLoads >= this.maxConcurrentLoads) {
      return
    }

    const { url, type, resolve, reject } = this.preloadQueue.shift()
    this._loadAssetInternal(url, type).then(resolve).catch(reject)
  }

  preloadAssets(urls) {
    return Promise.allSettled(urls.map((url) => this.loadAsset(url)))
  }

  clearCache() {
    this.cache.clear()
  }

  getCacheSize() {
    return this.cache.size
  }
}

// Global lazy asset loader instance
export const lazyAssetLoader = new LazyAssetLoader()

// React hook for performance monitoring
export const usePerformanceMonitor = (options = {}) => {
  const { autoStart = true, onMetricChange = null } = options
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics())
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    if (autoStart) {
      performanceMonitor.startMonitoring()
      setIsMonitoring(true)
    }

    const unsubscribe = performanceMonitor.subscribe((metric, value, allMetrics) => {
      setMetrics({ ...allMetrics })
      if (onMetricChange) {
        onMetricChange(metric, value, allMetrics)
      }
    })

    return () => {
      unsubscribe()
      if (autoStart) {
        performanceMonitor.stopMonitoring()
        setIsMonitoring(false)
      }
    }
  }, [autoStart, onMetricChange])

  const startMonitoring = useCallback(() => {
    performanceMonitor.startMonitoring()
    setIsMonitoring(true)
  }, [])

  const stopMonitoring = useCallback(() => {
    performanceMonitor.stopMonitoring()
    setIsMonitoring(false)
  }, [])

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    isPerformancePoor: performanceMonitor.isPerformancePoor(),
  }
}

// React hook for lazy asset loading
export const useLazyAssets = (assetUrls = [], options = {}) => {
  const { preload = false, type = 'auto' } = options
  const [loadedAssets, setLoadedAssets] = useState(new Map())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadAsset = useCallback(
    async (url) => {
      try {
        setLoading(true)
        setError(null)
        const asset = await lazyAssetLoader.loadAsset(url, type)
        setLoadedAssets((prev) => new Map(prev).set(url, asset))
        return asset
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [type]
  )

  const loadAssets = useCallback(
    async (urls) => {
      try {
        setLoading(true)
        setError(null)
        const results = await lazyAssetLoader.preloadAssets(urls)
        const newAssets = new Map(loadedAssets)

        results.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            newAssets.set(urls[index], result.value)
          }
        })

        setLoadedAssets(newAssets)
        return results
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [loadedAssets]
  )

  useEffect(() => {
    if (preload && assetUrls.length > 0) {
      loadAssets(assetUrls)
    }
  }, [preload, assetUrls, loadAssets])

  return {
    loadedAssets,
    loading,
    error,
    loadAsset,
    loadAssets,
  }
}

// React hook for optimized scroll handling
export const useOptimizedScroll = (callback, dependencies = [], options = {}) => {
  const { throttleDelay = 16, debounceDelay = 0, performanceAware = true } = options
  const callbackRef = useRef(callback)
  const throttledCallbackRef = useRef(null)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // Create throttled callback
  useEffect(() => {
    const wrappedCallback = (...args) => callbackRef.current(...args)

    if (debounceDelay > 0) {
      throttledCallbackRef.current = createDebouncedFunction(wrappedCallback, debounceDelay)
    } else {
      throttledCallbackRef.current = createThrottledFunction(wrappedCallback, throttleDelay, {
        performanceAware,
      })
    }
  }, [throttleDelay, debounceDelay, performanceAware, ...dependencies])

  return throttledCallbackRef.current
}
