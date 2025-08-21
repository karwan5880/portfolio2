import { useCallback, useEffect } from 'react';

/**
 * Custom hook for managing event handlers
 * @param {Object} params - Parameters object
 * @returns {Object} Event handlers
 */
export const useEventHandlers = ({
  todos,
  reorderTodos,
  toggleTodoComplete,
  showCelebration,
  isSearchExpanded,
  setIsSearchExpanded,
  setSearch,
  currentPage,
  itemsPerPage,
  filteredTodos,
  isDragEnabled
}) => {
  // Handle search bar interactions
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isSearchExpanded) {
        setIsSearchExpanded(false);
        setSearch("");
      }
      // Open search with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchExpanded(true);
      }
    };

    const handleClickOutside = (e) => {
      if (isSearchExpanded && !e.target.closest(".morphing-search")) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isSearchExpanded, setIsSearchExpanded, setSearch]);

  // Memoized sort handler
  const handleSortByDueDate = useCallback(
    (direction) => {
      const sortedTodos = [...todos].sort((a, b) => {
        const aHasDate = !!a.dueDate;
        const bHasDate = !!b.dueDate;

        if (aHasDate && bHasDate) {
          const dateA = new Date(a.dueDate);
          const dateB = new Date(b.dueDate);
          return direction === "asc" ? dateA - dateB : dateB - dateA;
        }

        if (aHasDate && !bHasDate) return -1;
        if (!aHasDate && bHasDate) return 1;

        return (a.order || 0) - (b.order || 0);
      });

      reorderTodos(sortedTodos);
    },
    [todos, reorderTodos]
  );

  // Memoized reorder handler
  const handleReorderPaginated = useCallback(
    (reorderedPageTodos) => {
      if (!isDragEnabled) return;

      const pageStartIndex = (currentPage - 1) * itemsPerPage;
      const newFilteredTodos = [...filteredTodos];

      reorderedPageTodos.forEach((todo, index) => {
        const globalIndex = pageStartIndex + index;
        if (globalIndex < newFilteredTodos.length) {
          newFilteredTodos[globalIndex] = todo;
        }
      });

      reorderTodos(newFilteredTodos);
    },
    [isDragEnabled, currentPage, itemsPerPage, filteredTodos, reorderTodos]
  );

  // Handle toggle complete with celebration
  const handleToggleComplete = useCallback(
    (todoId) => {
      const todo = todos.find((t) => t.id === todoId);
      if (todo && !todo.completed) {
        showCelebration();
      }
      toggleTodoComplete(todoId);
    },
    [todos, showCelebration, toggleTodoComplete]
  );

  return {
    handleSortByDueDate,
    handleReorderPaginated,
    handleToggleComplete
  };
};