import { useEffect } from 'react';

/**
 * Custom hook for calendar keyboard shortcuts
 */
export const useKeyboardShortcuts = ({
  calendarRef,
  goToPrevious,
  goToNext,
  goToToday,
  changeView,
  onAddTodo,
  onCloseModals,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const calendar = calendarRef.current?.getApi();
      if (!calendar) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
        case "ArrowUp":
          e.preventDefault();
          if (e.shiftKey) {
            changeView("dayGridMonth");
          }
          break;
        case "ArrowDown":
          e.preventDefault();
          if (e.shiftKey) {
            changeView("timeGridDay");
          } else {
            changeView("timeGridWeek");
          }
          break;
        case "t":
        case "T":
          e.preventDefault();
          goToToday();
          break;
        case "n":
        case "N":
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            onAddTodo?.(new Date());
          }
          break;
        case "Escape":
          e.preventDefault();
          onCloseModals?.();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [calendarRef, goToPrevious, goToNext, goToToday, changeView, onAddTodo, onCloseModals]);
};