import { useCallback, useEffect, useMemo, useState } from 'react'

// Data validation utilities
export const validateTodo = (text, category, dueDate) => {
  const errors = []

  if (!text || text.trim().length === 0) {
    errors.push('Todo text is required')
  }

  if (text && text.trim().length > 500) {
    errors.push('Todo text must be less than 500 characters')
  }

  if (category && category.length > 50) {
    errors.push('Category must be less than 50 characters')
  }

  if (dueDate) {
    const date = new Date(dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (isNaN(date.getTime())) {
      errors.push('Invalid due date')
    } else if (date < today) {
      errors.push('Due date cannot be in the past')
    }
  }

  return errors
}

// Custom hook for todo management
export const useTodos = () => {
  const [allTodos, setAllTodos] = useState([])
  const [isClient, setIsClient] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  // Initialize todos from localStorage
  useEffect(() => {
    setIsClient(true)

    const saved = localStorage.getItem('advanced-todos')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setAllTodos(parsed)
        } else {
          throw new Error('Invalid data format')
        }
      } catch (e) {
        console.warn('Failed to load todos from localStorage:', e)
        setAllTodos(getDefaultTodos())
      }
    } else {
      setAllTodos(getDefaultTodos())
    }
  }, [])

  // Save todos to localStorage
  useEffect(() => {
    if (isClient && allTodos.length > 0) {
      localStorage.setItem('advanced-todos', JSON.stringify(allTodos))
    }
  }, [allTodos, isClient])

  const getDefaultTodos = () => [
    { id: '1', text: 'Learn React', completed: false, category: 'Work', dueDate: '2025-01-20', createdAt: 1704067200000 },
    { id: '2', text: 'Build a todo app', completed: true, category: 'Personal', dueDate: null, createdAt: 1704067200000 },
    { id: '3', text: 'Master drag and drop', completed: false, category: 'Work', dueDate: '2025-01-25', createdAt: 1704067200000 },
    { id: '4', text: 'Add dark theme', completed: true, category: null, dueDate: null, createdAt: 1704067200000 },
    { id: '5', text: 'Deploy to production', completed: false, category: 'Work', dueDate: '2025-02-01', createdAt: 1704067200000 },
  ]

  // Add todo with validation
  const addTodo = useCallback((text, category = '', dueDate = '') => {
    const errors = validateTodo(text, category, dueDate)

    if (errors.length > 0) {
      setValidationErrors(errors)
      return false
    }

    const todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      category: category.trim() || null,
      dueDate: dueDate || null,
      createdAt: Date.now(),
    }

    setAllTodos((prev) => [todo, ...prev])
    setValidationErrors([])
    return true
  }, [])

  // Update todo with validation
  const updateTodo = useCallback(
    (id, updates) => {
      if (updates.text !== undefined || updates.category !== undefined || updates.dueDate !== undefined) {
        const todo = allTodos.find((t) => t.id === id)
        if (!todo) return false

        const newText = updates.text !== undefined ? updates.text : todo.text
        const newCategory = updates.category !== undefined ? updates.category : todo.category
        const newDueDate = updates.dueDate !== undefined ? updates.dueDate : todo.dueDate

        const errors = validateTodo(newText, newCategory, newDueDate)

        if (errors.length > 0) {
          setValidationErrors(errors)
          return false
        }
      }

      setAllTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo)))
      setValidationErrors([])
      return true
    },
    [allTodos]
  )

  const toggleComplete = useCallback(
    (id) => {
      updateTodo(id, { completed: !allTodos.find((t) => t.id === id)?.completed })
    },
    [allTodos, updateTodo]
  )

  const deleteTodo = useCallback((id) => {
    setAllTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const markAllComplete = useCallback(() => {
    setAllTodos((prev) => prev.map((todo) => ({ ...todo, completed: true })))
  }, [])

  const deleteCompleted = useCallback(() => {
    setAllTodos((prev) => prev.filter((todo) => !todo.completed))
  }, [])

  // One-time sorting
  const sortTodos = useCallback(
    (sortBy, sortOrder) => {
      const sorted = [...allTodos].sort((a, b) => {
        let aVal, bVal

        switch (sortBy) {
          case 'text':
            aVal = a.text.toLowerCase()
            bVal = b.text.toLowerCase()
            break
          case 'category':
            aVal = a.category || 'zzz'
            bVal = b.category || 'zzz'
            break
          case 'dueDate':
            aVal = a.dueDate ? new Date(a.dueDate).getTime() : Infinity
            bVal = b.dueDate ? new Date(b.dueDate).getTime() : Infinity
            break
          case 'completed':
            aVal = a.completed ? 1 : 0
            bVal = b.completed ? 1 : 0
            break
          case 'priority':
            aVal = a.priority || 0
            bVal = b.priority || 0
            break
          default: // createdAt
            aVal = a.createdAt
            bVal = b.createdAt
        }

        if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1
        if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1
        return 0
      })

      setAllTodos(sorted)
    },
    [allTodos]
  )

  // Export/Import
  const exportTodos = useCallback(() => {
    const dataStr = JSON.stringify(allTodos, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `todos-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }, [allTodos])

  const importTodos = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedTodos = JSON.parse(e.target.result)
          if (!Array.isArray(importedTodos)) {
            reject(new Error('Invalid file format. Expected an array of todos.'))
            return
          }

          // Validate each todo
          const validTodos = []
          const invalidTodos = []

          importedTodos.forEach((todo, index) => {
            if (todo.id && todo.text && typeof todo.completed === 'boolean') {
              validTodos.push({
                ...todo,
                id: todo.id || Date.now().toString() + index,
                createdAt: todo.createdAt || Date.now(),
              })
            } else {
              invalidTodos.push(index + 1)
            }
          })

          if (validTodos.length === 0) {
            reject(new Error('No valid todos found in the file.'))
            return
          }

          setAllTodos(validTodos)
          resolve({
            imported: validTodos.length,
            invalid: invalidTodos.length,
            invalidIndices: invalidTodos,
          })
        } catch (error) {
          reject(new Error('Error reading file. Please select a valid JSON file.'))
        }
      }
      reader.readAsText(file)
    })
  }, [])

  // Statistics
  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)

    return {
      total: allTodos.length,
      completed: allTodos.filter((t) => t.completed).length,
      active: allTodos.filter((t) => !t.completed).length,
      overdue: allTodos.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate) < today).length,
      categories: [...new Set(allTodos.filter((t) => t.category).map((t) => t.category))].length,
    }
  }, [allTodos])

  return {
    allTodos,
    setAllTodos,
    isClient,
    validationErrors,
    setValidationErrors,
    addTodo,
    updateTodo,
    toggleComplete,
    deleteTodo,
    markAllComplete,
    deleteCompleted,
    sortTodos,
    exportTodos,
    importTodos,
    stats,
  }
}

// Custom hook for filtering and pagination
export const useFiltering = (allTodos) => {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showCompleted, setShowCompleted] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [dateRangeFilter, setDateRangeFilter] = useState({ start: '', end: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Advanced filtering
  const filteredTodos = useMemo(() => {
    return allTodos.filter((todo) => {
      // Text search
      if (search && !todo.text.toLowerCase().includes(search.toLowerCase())) {
        return false
      }

      // Status filter
      if (filter === 'active' && todo.completed) return false
      if (filter === 'completed' && !todo.completed) return false
      if (!showCompleted && todo.completed) return false

      // Category filter
      if (categoryFilter && todo.category !== categoryFilter) return false

      // Priority filter
      if (priorityFilter && todo.priority !== priorityFilter) return false

      // Date range filter
      if (dateRangeFilter.start || dateRangeFilter.end) {
        if (!todo.dueDate) return false
        const todoDate = new Date(todo.dueDate)

        if (dateRangeFilter.start && todoDate < new Date(dateRangeFilter.start)) return false
        if (dateRangeFilter.end && todoDate > new Date(dateRangeFilter.end)) return false
      }

      return true
    })
  }, [allTodos, search, filter, showCompleted, categoryFilter, priorityFilter, dateRangeFilter])

  // Pagination
  const totalPages = Math.ceil(filteredTodos.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTodos = filteredTodos.slice(startIndex, startIndex + itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [search, filter, showCompleted, categoryFilter, priorityFilter, dateRangeFilter])

  // Get unique categories for filter dropdown
  const availableCategories = useMemo(() => {
    return [...new Set(allTodos.filter((t) => t.category).map((t) => t.category))].sort()
  }, [allTodos])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearch('')
    setFilter('all')
    setShowCompleted(true)
    setCategoryFilter('')
    setPriorityFilter('')
    setDateRangeFilter({ start: '', end: '' })
    setCurrentPage(1)
  }, [])

  return {
    filter,
    setFilter,
    search,
    setSearch,
    showCompleted,
    setShowCompleted,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    dateRangeFilter,
    setDateRangeFilter,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    filteredTodos,
    paginatedTodos,
    totalPages,
    availableCategories,
    clearFilters,
  }
}

// Custom hook for calendar functionality
export const useCalendar = (todos) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)

  // Memoized calendar data for performance
  const calendarData = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    const calendarDays = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(null)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(day)
    }

    return { calendarDays, firstDay, daysInMonth }
  }, [currentMonth, currentYear])

  const getTodosForDate = useCallback(
    (day) => {
      if (!day) return []
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return todos.filter((todo) => todo.dueDate === dateStr)
    },
    [todos, currentMonth, currentYear]
  )

  const isToday = useCallback(
    (day) => {
      const today = new Date()
      return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()
    },
    [currentMonth, currentYear]
  )

  const isSelected = useCallback(
    (day) => {
      if (!selectedDate || !day) return false
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      return selectedDate === dateStr
    },
    [selectedDate, currentMonth, currentYear]
  )

  const navigateMonth = useCallback(
    (direction) => {
      if (direction === 'prev') {
        if (currentMonth === 0) {
          setCurrentMonth(11)
          setCurrentYear((prev) => prev - 1)
        } else {
          setCurrentMonth((prev) => prev - 1)
        }
      } else {
        if (currentMonth === 11) {
          setCurrentMonth(0)
          setCurrentYear((prev) => prev + 1)
        } else {
          setCurrentMonth((prev) => prev + 1)
        }
      }
    },
    [currentMonth]
  )

  const goToToday = useCallback(() => {
    const today = new Date()
    setCurrentMonth(today.getMonth())
    setCurrentYear(today.getFullYear())
    setSelectedDate(null)
  }, [])

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return {
    currentMonth,
    currentYear,
    selectedDate,
    setSelectedDate,
    calendarData,
    getTodosForDate,
    isToday,
    isSelected,
    navigateMonth,
    goToToday,
    monthName,
  }
}

// Custom hook for theme management
export const useTheme = () => {
  const [isDark, setIsDark] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedTheme = localStorage.getItem('advanced-theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('advanced-theme', isDark ? 'dark' : 'light')
    }
  }, [isDark, isClient])

  const toggleTheme = useCallback(() => {
    setIsDark((prev) => !prev)
  }, [])

  return { isDark, toggleTheme, isClient }
}

// Custom hook for keyboard shortcuts
export const useKeyboardShortcuts = (callbacks) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + N: Focus new todo input
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        callbacks.focusNewTodo?.()
      }

      // Ctrl/Cmd + L: Toggle between list and calendar view
      if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
        e.preventDefault()
        callbacks.toggleView?.()
      }

      // Ctrl/Cmd + D: Toggle dark mode
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault()
        callbacks.toggleTheme?.()
      }

      // Escape: Clear search and reset filters
      if (e.key === 'Escape') {
        callbacks.clearFilters?.()
      }

      // Ctrl/Cmd + E: Export todos
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault()
        callbacks.exportTodos?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [callbacks])
}
