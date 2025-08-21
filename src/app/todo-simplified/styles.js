// Todo App Styles
export const getStyles = (isDark) => ({
  // Main container
  container: {
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
    background: isDark ? '#1a1a1a' : '#fff',
    color: isDark ? '#fff' : '#000',
    minHeight: '100vh',
  },

  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },

  headerInfo: {
    fontSize: '0.8rem',
    color: isDark ? '#888' : '#666',
    marginTop: '0.25rem',
  },

  themeButton: {
    padding: '0.5rem 1rem',
    background: isDark ? '#444' : '#f0f0f0',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: isDark ? '#fff' : '#000',
  },

  // Add Todo Section
  addTodoContainer: {
    marginBottom: '2rem',
  },

  addTodoRow: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },

  todoInput: {
    flex: 1,
    padding: '0.75rem',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    background: isDark ? '#2a2a2a' : '#fff',
    color: isDark ? '#fff' : '#000',
    fontSize: '1rem',
    outline: 'none',
  },

  advancedToggle: (showAdvanced) => ({
    padding: '0.75rem 1rem',
    background: showAdvanced ? '#ff9500' : isDark ? '#444' : '#f0f0f0',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: showAdvanced ? 'white' : isDark ? '#fff' : '#000',
    fontSize: '1rem',
  }),

  addButton: {
    padding: '0.75rem 1.5rem',
    background: '#007aff',
    border: 'none',
    borderRadius: '6px',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
  },

  advancedInputs: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },

  smallInput: {
    padding: '0.5rem',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    background: isDark ? '#2a2a2a' : '#fff',
    color: isDark ? '#fff' : '#000',
    fontSize: '0.9rem',
    outline: 'none',
    minWidth: '150px',
  },

  // View Mode Toggle
  viewModeContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },

  viewModeButton: (isActive) => ({
    padding: '0.5rem 1rem',
    background: isActive ? '#007aff' : isDark ? '#444' : '#f0f0f0',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: isActive ? 'white' : isDark ? '#fff' : '#000',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }),

  sortButtonsContainer: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },

  sortButton: {
    padding: '0.5rem 0.75rem',
    background: isDark ? '#444' : '#f0f0f0',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: isDark ? '#fff' : '#000',
    fontSize: '0.8rem',
  },

  // Filters
  filtersContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    alignItems: 'center',
  },

  searchInput: {
    padding: '0.5rem',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    background: isDark ? '#2a2a2a' : '#fff',
    color: isDark ? '#fff' : '#000',
    fontSize: '0.9rem',
    outline: 'none',
    minWidth: '200px',
  },

  filterButton: (isActive) => ({
    padding: '0.5rem 1rem',
    background: isActive ? '#007aff' : isDark ? '#444' : '#f0f0f0',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: isActive ? 'white' : isDark ? '#fff' : '#000',
    textTransform: 'capitalize',
    fontSize: '0.9rem',
  }),

  toggleButton: (isActive) => ({
    padding: '0.5rem 1rem',
    background: isActive ? '#28a745' : isDark ? '#444' : '#f0f0f0',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: isActive ? 'white' : isDark ? '#fff' : '#000',
    fontSize: '0.9rem',
  }),

  // Statistics
  statsContainer: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
    padding: '1rem',
    background: isDark ? '#2a2a2a' : '#f8f9fa',
    borderRadius: '8px',
    border: `1px solid ${isDark ? '#444' : '#e5e5e5'}`,
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  statsInfo: {
    display: 'flex',
    gap: '2rem',
    flexWrap: 'wrap',
  },

  statsActions: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
  },

  actionButton: (variant, disabled = false) => {
    const variants = {
      success: disabled ? (isDark ? '#333' : '#e5e5e5') : '#28a745',
      danger: disabled ? (isDark ? '#333' : '#e5e5e5') : '#dc3545',
      primary: '#6f42c1',
      info: '#17a2b8',
    }

    return {
      padding: '0.5rem 1rem',
      background: variants[variant],
      border: 'none',
      borderRadius: '6px',
      color: disabled ? (isDark ? '#666' : '#999') : 'white',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: '0.8rem',
    }
  },

  // Todo Items
  todoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    margin: '0.5rem 0',
    background: isDark ? '#2a2a2a' : '#f0f0f0',
    border: `1px solid ${isDark ? '#444' : '#ccc'}`,
    borderRadius: '8px',
    color: isDark ? '#fff' : '#000',
  },

  dragHandle: {
    cursor: 'grab',
    padding: '0.75rem 0.5rem',
    color: isDark ? '#888' : '#666',
    fontSize: '1.4rem',
    userSelect: 'none',
    touchAction: 'none',
    minWidth: '44px',
    minHeight: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  todoContent: {
    flex: 1,
    fontSize: '1rem',
  },

  todoText: (completed) => ({
    textDecoration: completed ? 'line-through' : 'none',
    opacity: completed ? 0.6 : 1,
  }),

  categoryTag: {
    marginLeft: '0.5rem',
    padding: '0.125rem 0.5rem',
    background: '#007aff',
    color: 'white',
    borderRadius: '12px',
    fontSize: '0.75rem',
  },

  dueDateTag: {
    marginLeft: '0.5rem',
    fontSize: '0.8rem',
    color: isDark ? '#888' : '#666',
  },

  checkbox: (completed) => ({
    width: '24px',
    height: '24px',
    borderRadius: '4px',
    border: `2px solid ${isDark ? '#666' : '#ccc'}`,
    background: completed ? '#007aff' : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    color: 'white',
    marginRight: '0.5rem',
  }),

  deleteButton: {
    background: 'none',
    border: 'none',
    color: '#ff3b30',
    cursor: 'pointer',
    fontSize: '1.2rem',
    padding: '0.25rem',
  },

  // Calendar
  calendarContainer: {
    padding: '1rem',
  },

  calendarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },

  calendarTitle: {
    textAlign: 'center',
    color: isDark ? '#fff' : '#000',
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },

  navButton: {
    padding: '0.5rem 1rem',
    background: isDark ? '#444' : '#f0f0f0',
    border: `1px solid ${isDark ? '#666' : '#ccc'}`,
    borderRadius: '6px',
    cursor: 'pointer',
    color: isDark ? '#fff' : '#000',
    fontSize: '0.9rem',
  },

  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '1px',
    background: isDark ? '#444' : '#ccc',
    borderRadius: '8px',
    overflow: 'hidden',
  },

  dayHeader: {
    padding: '0.5rem',
    background: isDark ? '#333' : '#f5f5f5',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '0.8rem',
    color: isDark ? '#fff' : '#000',
  },

  calendarDay: (day, isToday, isSelected) => ({
    minHeight: '80px',
    padding: '0.25rem',
    background: isDark ? '#2a2a2a' : '#fff',
    cursor: day ? 'pointer' : 'default',
    border: isSelected ? '2px solid #007aff' : isToday ? '2px solid #ff9500' : 'none',
    position: 'relative',
  }),

  dayNumber: (isToday) => ({
    fontSize: '0.8rem',
    fontWeight: isToday ? 'bold' : 'normal',
    color: isToday ? '#ff9500' : isDark ? '#fff' : '#000',
    marginBottom: '0.25rem',
  }),

  todoPreview: (hasOverdue, completed) => ({
    fontSize: '0.6rem',
    padding: '1px 3px',
    margin: '1px 0',
    background: hasOverdue ? '#ff3b30' : completed ? '#28a745' : '#007aff',
    color: 'white',
    borderRadius: '2px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),

  moreIndicator: {
    fontSize: '0.6rem',
    color: isDark ? '#888' : '#666',
    textAlign: 'center',
  },

  // Selected Date Details
  selectedDateContainer: {
    marginTop: '1rem',
    padding: '1rem',
    background: isDark ? '#2a2a2a' : '#f8f9fa',
    borderRadius: '8px',
    border: `1px solid ${isDark ? '#444' : '#e5e5e5'}`,
  },

  selectedDateTitle: {
    color: isDark ? '#fff' : '#000',
    marginBottom: '0.5rem',
  },

  selectedDateTodo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    margin: '0.25rem 0',
    background: isDark ? '#333' : '#fff',
    borderRadius: '4px',
    border: `1px solid ${isDark ? '#555' : '#ddd'}`,
  },

  // Pagination
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1rem',
    marginTop: '2rem',
    padding: '1rem',
    background: isDark ? '#2a2a2a' : '#f8f9fa',
    borderRadius: '8px',
    border: `1px solid ${isDark ? '#444' : '#e5e5e5'}`,
  },

  paginationButton: (disabled) => ({
    padding: '0.5rem 1rem',
    background: disabled ? (isDark ? '#333' : '#e5e5e5') : '#007aff',
    border: 'none',
    borderRadius: '6px',
    color: disabled ? (isDark ? '#666' : '#999') : 'white',
    cursor: disabled ? 'not-allowed' : 'pointer',
  }),

  paginationInfo: {
    color: isDark ? '#fff' : '#000',
  },

  // Validation Messages
  validationMessage: (type) => {
    const types = {
      error: { background: isDark ? '#4a1a1a' : '#f8d7da', color: '#721c24', border: '#f5c6cb' },
      warning: { background: isDark ? '#4a3a1a' : '#fff3cd', color: '#856404', border: '#ffeaa7' },
      success: { background: isDark ? '#1a4a1a' : '#d4edda', color: '#155724', border: '#c3e6cb' },
    }

    return {
      padding: '0.75rem 1rem',
      background: types[type].background,
      border: `1px solid ${types[type].border}`,
      borderRadius: '6px',
      marginBottom: '1rem',
      color: types[type].color,
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }
  },

  // Loading states
  loadingSpinner: {
    display: 'inline-block',
    width: '20px',
    height: '20px',
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #007aff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },

  // Hidden elements
  hidden: {
    display: 'none',
  },

  // Utility classes
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  textEllipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

// CSS animations (to be added to global CSS)
export const animations = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
`
