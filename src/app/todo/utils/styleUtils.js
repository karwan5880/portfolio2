import { isOverdue, isDueSoon } from './dateUtils';

/**
 * Get the appropriate CSS classes for due date styling based on date status
 * @param {Date|string|null} dueDate - The due date to evaluate
 * @param {boolean} completed - Whether the todo is completed
 * @param {Function} getThemeClasses - Theme class getter function
 * @returns {string} CSS classes for styling
 */
export const getDueDateStyle = (dueDate, completed, getThemeClasses) => {
  if (!dueDate) return getThemeClasses('textMuted');
  if (isOverdue(dueDate) && !completed) return 'text-red-500';
  if (isDueSoon(dueDate) && !completed) return 'text-yellow-600';
  return getThemeClasses('textMuted');
};

/**
 * Get due date style for draggable todo items (simplified version)
 * @param {Date|string|null} dueDate - The due date to evaluate
 * @param {boolean} completed - Whether the todo is completed
 * @returns {string} CSS classes for styling
 */
export const getDueDateStyleSimple = (dueDate, completed) => {
  if (!dueDate) return '';
  if (isOverdue(dueDate) && !completed) return 'text-red-600 font-semibold';
  if (isDueSoon(dueDate) && !completed) return 'text-yellow-600';
  return '';
};

/**
 * Safely get category color with fallback
 * @param {string} category - The category name
 * @param {Object} categoryColors - Category color mapping
 * @param {string} fallback - Fallback color if category not found
 * @returns {Object} Color configuration object
 */
export const getCategoryColorSafe = (category, categoryColors, fallback = 'bg-gray-500') => {
  if (!category || !categoryColors[category]) {
    return { bg: fallback };
  }
  return categoryColors[category];
};