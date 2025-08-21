import { useState, useCallback, useEffect } from 'react';

/**
 * Custom hook for calendar navigation and view management
 */
export const useCalendarNavigation = (calendarRef) => {
  const [currentView, setCurrentView] = useState('dayGridMonth');
  const [calendarTitle, setCalendarTitle] = useState('');

  // Update calendar title when calendar changes
  const updateCalendarTitle = useCallback(() => {
    const calendar = calendarRef.current?.getApi();
    if (calendar) {
      setCalendarTitle(calendar.view.title);
      setCurrentView(calendar.view.type);
    }
  }, [calendarRef]);

  // Navigation functions
  const goToToday = useCallback(() => {
    const calendar = calendarRef.current?.getApi();
    if (calendar) {
      calendar.today();
      setTimeout(updateCalendarTitle, 100);
    }
  }, [calendarRef, updateCalendarTitle]);

  const goToPrevious = useCallback(() => {
    const calendar = calendarRef.current?.getApi();
    if (calendar) {
      calendar.prev();
      setTimeout(updateCalendarTitle, 100);
    }
  }, [calendarRef, updateCalendarTitle]);

  const goToNext = useCallback(() => {
    const calendar = calendarRef.current?.getApi();
    if (calendar) {
      calendar.next();
      setTimeout(updateCalendarTitle, 100);
    }
  }, [calendarRef, updateCalendarTitle]);

  const changeView = useCallback((view) => {
    setCurrentView(view);
    const calendar = calendarRef.current?.getApi();
    if (calendar) {
      calendar.changeView(view);
      setTimeout(updateCalendarTitle, 100);
    }
  }, [calendarRef, updateCalendarTitle]);

  const goToDate = useCallback((date, view = null) => {
    const calendar = calendarRef.current?.getApi();
    if (calendar) {
      if (view) {
        calendar.changeView(view, date);
        setCurrentView(view);
      } else {
        calendar.gotoDate(date);
      }
      setTimeout(updateCalendarTitle, 100);
    }
  }, [calendarRef, updateCalendarTitle]);

  // Initialize calendar title when calendar loads
  useEffect(() => {
    const timeoutId = setTimeout(updateCalendarTitle, 100);
    return () => clearTimeout(timeoutId);
  }, [updateCalendarTitle]);

  return {
    currentView,
    calendarTitle,
    goToToday,
    goToPrevious,
    goToNext,
    changeView,
    goToDate,
    updateCalendarTitle,
  };
};