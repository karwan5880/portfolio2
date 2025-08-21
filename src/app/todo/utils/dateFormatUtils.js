// Date formatting utilities to avoid timezone issues

/**
 * Formats a Date object to YYYY-MM-DD string in local timezone
 * Avoids timezone offset issues that occur with toISOString()
 */
export const formatDateToLocalString = (date) => {
  if (!date || !(date instanceof Date)) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Creates a Date object from YYYY-MM-DD string in local timezone
 * Avoids timezone offset issues that occur with new Date(string)
 */
export const parseDateFromLocalString = (dateString) => {
  if (!dateString) return null;
  
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    // Month is 0-indexed in Date constructor
    return new Date(year, month - 1, day);
  } catch (error) {
    console.warn('Invalid date string:', dateString);
    return null;
  }
};

/**
 * Formats a date for display (e.g., "Aug 19, 2024")
 */
export const formatDateForDisplay = (date) => {
  if (!date) return '';
  
  // Ensure we have a Date object
  const dateObj = date instanceof Date ? date : parseDateFromLocalString(date);
  if (!dateObj) return '';
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Checks if two dates are the same day (ignoring time)
 */
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = date1 instanceof Date ? date1 : parseDateFromLocalString(date1);
  const d2 = date2 instanceof Date ? date2 : parseDateFromLocalString(date2);
  
  if (!d1 || !d2) return false;
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};