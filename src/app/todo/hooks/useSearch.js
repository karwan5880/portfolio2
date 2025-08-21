import { useState, useEffect, useMemo } from 'react';
import { debounce } from '../utils/performanceUtils';

/**
 * Custom hook for handling search functionality with debouncing
 * @param {number} delay - Debounce delay in milliseconds (default: 300)
 * @returns {Object} Search state and handlers
 */
export const useSearch = (delay = 300) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Create debounced search function
  const debouncedSetSearch = useMemo(
    () => debounce((value) => setDebouncedSearch(value), delay),
    [delay]
  );

  // Update debounced search when search changes
  useEffect(() => {
    debouncedSetSearch(search);
  }, [search, debouncedSetSearch]);

  // Clear both search values
  const clearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
  };

  return {
    search,
    debouncedSearch,
    setSearch,
    clearSearch,
    hasActiveSearch: debouncedSearch !== ""
  };
};