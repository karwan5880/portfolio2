import { useState } from 'react';

/**
 * Custom hook for managing view state (list/calendar)
 * @param {string} initialView - Initial view ('list' or 'calendar')
 * @returns {Object} View state and handlers
 */
export const useViewManager = (initialView = 'list') => {
  const [currentView, setCurrentView] = useState(initialView);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  // Toggle between list and calendar view
  const toggleView = () => {
    setCurrentView(prev => prev === 'list' ? 'calendar' : 'list');
  };

  // Set specific view
  const setView = (view) => {
    if (view === 'list' || view === 'calendar') {
      setCurrentView(view);
    }
  };

  // Toggle search expansion
  const toggleSearch = () => {
    setIsSearchExpanded(prev => !prev);
  };

  // Close search
  const closeSearch = () => {
    setIsSearchExpanded(false);
  };

  // Open search
  const openSearch = () => {
    setIsSearchExpanded(true);
  };

  return {
    // View state
    currentView,
    isListView: currentView === 'list',
    isCalendarView: currentView === 'calendar',
    
    // Search state
    isSearchExpanded,
    
    // View actions
    setCurrentView,
    toggleView,
    setView,
    
    // Search actions
    toggleSearch,
    closeSearch,
    openSearch,
    setIsSearchExpanded
  };
};