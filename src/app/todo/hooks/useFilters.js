import { useMemo, useState } from 'react'

/**
 * Custom hook for handling todo filtering logic
 * @param {Array} todos - Array of todos to filter
 * @param {string} searchTerm - Search term to filter by
 * @returns {Object} Filter state and filtered todos
 */
export const useFilters = (todos, searchTerm) => {
  const [showCompleted, setShowCompleted] = useState(true)
  const [showIncomplete, setShowIncomplete] = useState(true)

  // Filter todos based on search and completion status
  const filteredTodos = useMemo(() => {
    if (!Array.isArray(todos)) return []

    const searchLower = searchTerm.toLowerCase()

    // Hardcoded date range for testing: August 1st to August 31st, 2025
    const startDate = new Date('2025-08-01T00:00:00.000Z')
    const endDate = new Date('2025-08-31T23:59:59.999Z')

    return todos
      .filter((todo) => {
        // Search filter
        const matchesSearch = !searchTerm || todo.title.toLowerCase().includes(searchLower) || todo.description.toLowerCase().includes(searchLower)

        // Status filter
        const matchesStatus = (todo.completed && showCompleted) || (!todo.completed && showIncomplete)

        // // Date range filter
        // let matchesDateRange = true;
        // if (todo.dueDate) {
        //   const todoDate = new Date(todo.dueDate);
        //   matchesDateRange = todoDate >= startDate && todoDate <= endDate;
        //   // // Debug logging
        //   // console.log("Todo:", todo.title);
        //   // console.log("Due date:", todo.dueDate);
        //   // console.log("Parsed date:", todoDate);
        //   // console.log("In range (Aug 1-31):", matchesDateRange);
        //   // console.log("---");
        // }

        return matchesSearch && matchesStatus
        // return matchesSearch && matchesStatus && matchesDateRange;
      })
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }, [todos, searchTerm, showCompleted, showIncomplete])

  // Check if drag and drop should be enabled
  const isDragEnabled = useMemo(() => searchTerm === '' && showCompleted && showIncomplete, [searchTerm, showCompleted, showIncomplete])

  // Clear all filters
  const clearFilters = () => {
    setShowCompleted(true)
    setShowIncomplete(true)
  }

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => searchTerm !== '' || !showCompleted || !showIncomplete, [searchTerm, showCompleted, showIncomplete])

  return {
    // State
    showCompleted,
    showIncomplete,

    // Actions
    setShowCompleted,
    setShowIncomplete,
    clearFilters,

    // Computed values
    filteredTodos,
    isDragEnabled,
    hasActiveFilters,

    // Stats
    totalTodos: todos.length,
    filteredCount: filteredTodos.length,
    completedCount: filteredTodos.filter((t) => t.completed).length,
    incompleteCount: filteredTodos.filter((t) => !t.completed).length,
  }
}
