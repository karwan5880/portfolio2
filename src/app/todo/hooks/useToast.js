import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing toast notifications
 * @returns {Object} Toast state and handlers
 */
export const useToast = () => {
  const [toast, setToast] = useState({ 
    isVisible: false, 
    message: '', 
    type: 'success' 
  });

  // Predefined celebration messages for task completion
  const celebrationMessages = useMemo(() => [
    "🎉 Awesome! Task completed!",
    "✨ Great job! One more done!",
    "🚀 You're crushing it!",
    "🌟 Task complete! Keep going!",
    "💪 Well done! You're on fire!",
    "🎊 Another one bites the dust!"
  ], []);

  // Predefined messages for task creation
  const taskCreationMessages = useMemo(() => [
    "✨ Task added! You're on a roll!",
    "🎯 New task locked and loaded!",
    "📝 Task added! Let's get it done!",
    "🚀 Another task ready to conquer!",
    "⭐ Task added! You're unstoppable!",
    "🎪 New task in the queue!"
  ], []);

  // Predefined messages for calendar task creation
  const calendarTaskMessages = useMemo(() => [
    "✨ Task scheduled! Right on time!",
    "📅 Task added to calendar!",
    "🎯 New deadline locked in!",
    "⏰ Task scheduled successfully!"
  ], []);

  // Show a toast notification
  const showToast = useCallback((message, type = 'success') => {
    setToast({ isVisible: true, message, type });
  }, []);

  // Hide the current toast
  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isVisible: false }));
  }, []);

  // Show a random celebration message
  const showCelebration = useCallback(() => {
    const randomMessage = celebrationMessages[
      Math.floor(Math.random() * celebrationMessages.length)
    ];
    showToast(randomMessage, 'completion');
  }, [celebrationMessages, showToast]);

  // Show a random task creation message
  const showTaskCreated = useCallback(() => {
    const randomMessage = taskCreationMessages[
      Math.floor(Math.random() * taskCreationMessages.length)
    ];
    showToast(randomMessage, 'celebration');
  }, [taskCreationMessages, showToast]);

  // Show a random calendar task message
  const showCalendarTaskCreated = useCallback(() => {
    const randomMessage = calendarTaskMessages[
      Math.floor(Math.random() * calendarTaskMessages.length)
    ];
    showToast(randomMessage, 'celebration');
  }, [calendarTaskMessages, showToast]);

  // Show error message
  const showError = useCallback((message) => {
    showToast(message, 'error');
  }, [showToast]);

  // Show success message
  const showSuccess = useCallback((message) => {
    showToast(message, 'success');
  }, [showToast]);

  // Show info message
  const showInfo = useCallback((message) => {
    showToast(message, 'info');
  }, [showToast]);

  return {
    // Current toast state
    toast,
    isVisible: toast.isVisible,
    
    // Basic actions
    showToast,
    hideToast,
    
    // Convenience methods
    showCelebration,
    showTaskCreated,
    showCalendarTaskCreated,
    showError,
    showSuccess,
    showInfo
  };
};