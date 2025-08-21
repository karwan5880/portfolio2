import { LOCAL_STORAGE_KEY } from './constants';

// Simple default state
const defaultState = {
  todos: []
};

// Check if localStorage is available
const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

// Load data from localStorage
export const loadFromStorage = () => {
  // Return default state during SSR
  if (typeof window === 'undefined') {
    return defaultState;
  }
  
  if (!isLocalStorageAvailable()) {
    return defaultState;
  }

  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!stored) {
      return defaultState;
    }

    const parsed = JSON.parse(stored);
    
    // Simple merge with default state
    return {
      ...defaultState,
      ...parsed
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultState;
  }
};

// Save data to localStorage
export const saveToStorage = (data) => {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
};