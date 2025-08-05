import { LazyAssetLoader, PerformanceMonitor, createDebouncedFunction, createThrottledFunction, lazyAssetLoader, performanceMonitor } from '../utils/performanceOptimizations'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// Mock performance API
global.performance = {
  now: vi.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 50 * 1048576, // 50MB
    totalJSHeapSize: 100 * 1048576, // 100MB
  },
}

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 16)
  return 1
})

describe('PerformanceMonitor', () => {
  let monitor

  beforeEach(() => {
    monitor = new PerformanceMonitor()
    vi.clearAllMocks()
  })

  afterEach(() => {
    monitor.stopMonitoring()
  })

  test('should initialize with default metrics', () => {
    const metrics = monitor.getMetrics()

    expect(metrics).toHaveProperty('frameRate', 60)
    expect(metrics).toHaveProperty('scrollPerformance', 0)
    expect(metrics).toHaveProperty('animationPerformance', 0)
    expect(metrics).toHaveProperty('themeSwitch', 0)
    expect(metrics).toHaveProperty('memoryUsage', 0)
  })

  test('should start and stop monitoring', () => {
    expect(monitor.isMonitoring).toBe(false)

    monitor.startMonitoring()
    expect(monitor.isMonitoring).toBe(true)

    monitor.stopMonitoring()
    expect(monitor.isMonitoring).toBe(false)
  })

  test('should measure scroll performance', () => {
    const mockCallback = vi.fn(() => 'result')
    const measuredCallback = monitor.measureScrollPerformance(mockCallback)

    const result = measuredCallback('arg1', 'arg2')

    expect(result).toBe('result')
    expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2')
    expect(monitor.metrics.scrollPerformance).toBeGreaterThan(0)
  })

  test('should measure animation performance', () => {
    const mockCallback = vi.fn(() => 'animation-result')
    const measuredCallback = monitor.measureAnimationPerformance('test-animation', mockCallback)

    const result = measuredCallback()

    expect(result).toBe('animation-result')
    expect(monitor.metrics.animationPerformance).toBeGreaterThan(0)
  })

  test('should detect poor performance', () => {
    // Set poor performance metrics
    monitor.metrics.frameRate = 15
    monitor.metrics.scrollPerformance = 60
    monitor.metrics.memoryUsage = 200

    expect(monitor.isPerformancePoor()).toBe(true)

    // Set good performance metrics
    monitor.metrics.frameRate = 60
    monitor.metrics.scrollPerformance = 10
    monitor.metrics.memoryUsage = 50

    expect(monitor.isPerformancePoor()).toBe(false)
  })

  test('should notify observers', () => {
    const observer = vi.fn()
    const unsubscribe = monitor.subscribe(observer)

    monitor.notifyObservers('frameRate', 45)

    expect(observer).toHaveBeenCalledWith('frameRate', 45, monitor.metrics)

    unsubscribe()
    monitor.notifyObservers('frameRate', 30)

    // Should not be called after unsubscribe
    expect(observer).toHaveBeenCalledTimes(1)
  })
})

describe('createThrottledFunction', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should throttle function calls', () => {
    const mockFn = vi.fn()
    const throttled = createThrottledFunction(mockFn, 100)

    // Call multiple times rapidly
    throttled('call1')
    throttled('call2')
    throttled('call3')

    // Should only call once immediately (leading edge)
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call1')

    // Advance time and check trailing call
    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(2)
    expect(mockFn).toHaveBeenLastCalledWith('call3')
  })

  test('should adjust delay based on performance', () => {
    // Mock poor performance
    performanceMonitor.metrics.frameRate = 20

    const mockFn = vi.fn()
    const throttled = createThrottledFunction(mockFn, 50, { performanceAware: true })

    throttled('test')

    // Should use adjusted delay (doubled but capped at 100ms)
    vi.advanceTimersByTime(50)
    expect(mockFn).toHaveBeenCalledTimes(1) // Leading call only

    throttled('test2')
    vi.advanceTimersByTime(100) // Adjusted delay
    expect(mockFn).toHaveBeenCalledTimes(2)
  })
})

describe('createDebouncedFunction', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('should debounce function calls', () => {
    const mockFn = vi.fn()
    const debounced = createDebouncedFunction(mockFn, 100)

    // Call multiple times rapidly
    debounced('call1')
    debounced('call2')
    debounced('call3')

    // Should not call immediately
    expect(mockFn).not.toHaveBeenCalled()

    // Advance time
    vi.advanceTimersByTime(100)

    // Should call once with last arguments
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call3')
  })

  test('should handle immediate option', () => {
    const mockFn = vi.fn()
    const debounced = createDebouncedFunction(mockFn, 100, { immediate: true })

    debounced('immediate')

    // Should call immediately
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('immediate')

    debounced('delayed')
    vi.advanceTimersByTime(100)

    // Should not call again during debounce period
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  test('should handle maxWait option', () => {
    const mockFn = vi.fn()
    const debounced = createDebouncedFunction(mockFn, 100, { maxWait: 200 })

    // Keep calling to reset debounce
    debounced('call1')
    vi.advanceTimersByTime(50)
    debounced('call2')
    vi.advanceTimersByTime(50)
    debounced('call3')
    vi.advanceTimersByTime(50)
    debounced('call4')

    // Should not have called yet
    expect(mockFn).not.toHaveBeenCalled()

    // Advance to maxWait
    vi.advanceTimersByTime(50) // Total 200ms

    // Should call due to maxWait
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call4')
  })
})

describe('LazyAssetLoader', () => {
  let loader

  beforeEach(() => {
    loader = new LazyAssetLoader()

    // Mock Image constructor
    global.Image = vi.fn(() => ({
      onload: null,
      onerror: null,
      src: '',
    }))

    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      })
    )
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('should detect asset types correctly', () => {
    expect(loader._detectAssetType('image.jpg')).toBe('image')
    expect(loader._detectAssetType('image.png')).toBe('image')
    expect(loader._detectAssetType('styles.css')).toBe('css')
    expect(loader._detectAssetType('data.json')).toBe('json')
    expect(loader._detectAssetType('script.js')).toBe('generic')
  })

  test('should cache loaded assets', async () => {
    const mockImg = { onload: null, onerror: null }
    global.Image.mockReturnValue(mockImg)

    const loadPromise = loader.loadAsset('test.jpg', 'image')

    // Simulate successful load
    setTimeout(() => {
      mockImg.onload()
    }, 0)

    const result = await loadPromise

    expect(result).toBe(mockImg)
    expect(loader.cache.has('test.jpg')).toBe(true)
    expect(loader.cache.get('test.jpg')).toBe(mockImg)
  })

  test('should return cached assets on subsequent calls', async () => {
    const cachedAsset = { cached: true }
    loader.cache.set('cached.jpg', cachedAsset)

    const result = await loader.loadAsset('cached.jpg')

    expect(result).toBe(cachedAsset)
    expect(global.Image).not.toHaveBeenCalled()
  })

  test('should limit concurrent loads', async () => {
    loader.maxConcurrentLoads = 2

    const mockImg = { onload: null, onerror: null }
    global.Image.mockReturnValue(mockImg)

    // Start 3 loads
    const load1 = loader.loadAsset('img1.jpg', 'image')
    const load2 = loader.loadAsset('img2.jpg', 'image')
    const load3 = loader.loadAsset('img3.jpg', 'image')

    // Only 2 should start immediately
    expect(loader.currentLoads).toBe(2)
    expect(loader.preloadQueue).toHaveLength(1)

    // Complete first load
    setTimeout(() => mockImg.onload(), 0)
    await load1

    // Third load should now start
    expect(loader.currentLoads).toBe(2)
    expect(loader.preloadQueue).toHaveLength(0)
  })

  test('should preload multiple assets', async () => {
    const urls = ['img1.jpg', 'img2.jpg', 'data.json']

    const mockImg = { onload: null, onerror: null }
    global.Image.mockReturnValue(mockImg)

    const preloadPromise = loader.preloadAssets(urls)

    // Simulate successful loads
    setTimeout(() => {
      mockImg.onload()
    }, 0)

    const results = await preloadPromise

    expect(results).toHaveLength(3)
    expect(results.every((result) => result.status === 'fulfilled' || result.status === 'rejected')).toBe(true)
  })
})

describe('Global instances', () => {
  test('should provide global performance monitor instance', () => {
    expect(performanceMonitor).toBeInstanceOf(PerformanceMonitor)
  })

  test('should provide global lazy asset loader instance', () => {
    expect(lazyAssetLoader).toBeInstanceOf(LazyAssetLoader)
  })
})
