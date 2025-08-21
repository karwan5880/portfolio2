/**
 * Performance monitoring and optimization utilities
 * Note: Some functions require React to be available in the component context
 */

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Measure and log performance of a function
 * @param {Function} func - Function to measure
 * @param {string} label - Label for the measurement
 * @returns {Function} Wrapped function with performance measurement
 */
export const measurePerformance = (func, label) => {
  return function measuredFunction(...args) {
    const start = performance.now();
    const result = func.apply(this, args);
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${label} took ${end - start} milliseconds`);
    }
    
    return result;
  };
};

/**
 * Create a memoized version of a function with custom cache key
 * @param {Function} func - Function to memoize
 * @param {Function} getKey - Function to generate cache key
 * @returns {Function} Memoized function
 */
export const memoizeWithKey = (func, getKey) => {
  const cache = new Map();
  
  return function memoizedFunction(...args) {
    const key = getKey(...args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func.apply(this, args);
    cache.set(key, result);
    
    // Prevent memory leaks by limiting cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    
    return result;
  };
};

/**
 * Lazy load a component with error boundary
 * @param {Function} importFunc - Dynamic import function
 * @param {Object} fallback - Fallback component while loading
 * @returns {Function} Function that returns lazy loaded component
 */
export const lazyLoadWithFallback = (importFunc, fallback = null) => {
  // This function should be used with React.lazy in components
  // Example: const LazyComponent = React.lazy(() => import('./Component'));
  return {
    importFunc,
    fallback,
    // Helper to create the actual lazy component
    create: () => {
      if (typeof React !== 'undefined') {
        const LazyComponent = React.lazy(importFunc);
        return function LazyWrapper(props) {
          return React.createElement(
            React.Suspense,
            { fallback },
            React.createElement(LazyComponent, props)
          );
        };
      }
      return null;
    }
  };
};

/**
 * Check if an object has changed (shallow comparison)
 * @param {Object} prev - Previous object
 * @param {Object} next - Next object
 * @returns {boolean} Whether the object has changed
 */
export const hasChanged = (prev, next) => {
  if (prev === next) return false;
  if (!prev || !next) return true;
  
  const prevKeys = Object.keys(prev);
  const nextKeys = Object.keys(next);
  
  if (prevKeys.length !== nextKeys.length) return true;
  
  for (let key of prevKeys) {
    if (prev[key] !== next[key]) return true;
  }
  
  return false;
};

/**
 * Create a stable reference for objects/arrays to prevent unnecessary re-renders
 * This is a utility function that should be used with React hooks
 * @param {*} value - Value to stabilize
 * @param {Array} deps - Dependencies to watch
 * @returns {*} Stable reference
 */
export const createStableReference = (value, deps) => {
  // This should be used within a React component with useRef
  // Example usage in component:
  // const stableValue = useMemo(() => createStableReference(value, deps), deps);
  return { value, deps };
};

/**
 * Batch multiple state updates to prevent unnecessary re-renders
 * @param {Function} callback - Callback containing state updates
 */
export const batchUpdates = (callback) => {
  // In React 18+, batching is automatic, so we just call the callback
  // For older versions, this would need React.unstable_batchedUpdates
  if (typeof window !== 'undefined' && window.React?.unstable_batchedUpdates) {
    window.React.unstable_batchedUpdates(callback);
  } else {
    callback();
  }
};

/**
 * Check if we're in development mode
 * @returns {boolean} Whether in development mode
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Log performance metrics in development
 * @param {string} label - Label for the metric
 * @param {number} value - Metric value
 * @param {string} unit - Unit of measurement
 */
export const logPerformanceMetric = (label, value, unit = 'ms') => {
  if (isDevelopment()) {
    console.log(`🚀 Performance: ${label} = ${value}${unit}`);
  }
};

/**
 * Create a performance observer for monitoring
 * @param {string} type - Type of performance entry to observe
 * @param {Function} callback - Callback to handle entries
 */
export const createPerformanceObserver = (type, callback) => {
  if (typeof PerformanceObserver !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(callback);
    });
    
    try {
      observer.observe({ entryTypes: [type] });
      return observer;
    } catch (error) {
      console.warn('Performance observer not supported:', error);
      return null;
    }
  }
  return null;
};