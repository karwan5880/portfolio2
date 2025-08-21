/**
 * Safely execute array operations with null/undefined checks
 */

/**
 * Safely map over an array with null/undefined checks
 * @param {Array} array - Array to map over
 * @param {Function} mapFn - Mapping function
 * @param {Array} fallback - Fallback value if array is invalid
 * @returns {Array} Mapped array or fallback
 */
export const safeMap = (array, mapFn, fallback = []) => {
  if (!Array.isArray(array)) return fallback;
  try {
    return array.filter(item => item != null).map(mapFn);
  } catch (error) {
    console.warn('Error in safeMap:', error);
    return fallback;
  }
};

/**
 * Safely filter an array with null/undefined checks
 * @param {Array} array - Array to filter
 * @param {Function} filterFn - Filter function
 * @param {Array} fallback - Fallback value if array is invalid
 * @returns {Array} Filtered array or fallback
 */
export const safeFilter = (array, filterFn, fallback = []) => {
  if (!Array.isArray(array)) return fallback;
  try {
    return array.filter(item => item != null && filterFn(item));
  } catch (error) {
    console.warn('Error in safeFilter:', error);
    return fallback;
  }
};

/**
 * Safely find an item in an array with null/undefined checks
 * @param {Array} array - Array to search
 * @param {Function} findFn - Find function
 * @param {*} fallback - Fallback value if not found
 * @returns {*} Found item or fallback
 */
export const safeFind = (array, findFn, fallback = null) => {
  if (!Array.isArray(array)) return fallback;
  try {
    const result = array.find(item => item != null && findFn(item));
    return result !== undefined ? result : fallback;
  } catch (error) {
    console.warn('Error in safeFind:', error);
    return fallback;
  }
};

/**
 * Safely access object properties with fallback
 * @param {Object} obj - Object to access
 * @param {string} path - Property path (e.g., 'user.name')
 * @param {*} fallback - Fallback value
 * @returns {*} Property value or fallback
 */
export const safeGet = (obj, path, fallback = null) => {
  if (!obj || typeof obj !== 'object') return fallback;
  
  try {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result == null || typeof result !== 'object') return fallback;
      result = result[key];
    }
    
    return result !== undefined ? result : fallback;
  } catch (error) {
    console.warn('Error in safeGet:', error);
    return fallback;
  }
};

/**
 * Safely parse a date with fallback
 * @param {*} dateValue - Date value to parse
 * @param {Date|null} fallback - Fallback date
 * @returns {Date|null} Parsed date or fallback
 */
export const safeParseDate = (dateValue, fallback = null) => {
  if (!dateValue) return fallback;
  
  try {
    const date = new Date(dateValue);
    return isNaN(date.getTime()) ? fallback : date;
  } catch (error) {
    console.warn('Error parsing date:', error);
    return fallback;
  }
};

/**
 * Safely execute a function with error handling
 * @param {Function} fn - Function to execute
 * @param {*} fallback - Fallback value if function fails
 * @param {...*} args - Arguments to pass to function
 * @returns {*} Function result or fallback
 */
export const safeExecute = (fn, fallback = null, ...args) => {
  if (typeof fn !== 'function') return fallback;
  
  try {
    return fn(...args);
  } catch (error) {
    console.warn('Error in safeExecute:', error);
    return fallback;
  }
};