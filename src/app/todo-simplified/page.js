'use client'

import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useRef, useState } from 'react'

import { AdvancedFilters, CalendarView, SortableItem, ValidationMessage } from './components'
// Import our custom hooks and components
import { useCalendar, useFiltering, useKeyboardShortcuts, useTheme, useTodos } from './hooks'
import { getStyles } from './styles'

export default function TodoPage() {
  // Custom hooks for state management
  const { isDark, toggleTheme, isClient } = useTheme()
  const {
    allTodos,
    setAllTodos,
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
  } = useTodos()

  const {
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
    filteredTodos,
    paginatedTodos,
    totalPages,
    availableCategories,
    clearFilters,
  } = useFiltering(allTodos)

  const {
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
  } = useCalendar(allTodos)

  // Local state
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'
  const [showAdvancedAdd, setShowAdvancedAdd] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newPriority, setNewPriority] = useState('')
  const [editingTodo, setEditingTodo] = useState(null)

  // Refs
  const todoInputRef = useRef(null)
  const fileInputRef = useRef(null)

  // Get styles
  const styles = getStyles(isDark)

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  )

  // Keyboard shortcuts
  useKeyboardShortcuts({
    focusNewTodo: () => todoInputRef.current?.focus(),
    toggleView: () => setViewMode(viewMode === 'list' ? 'calendar' : 'list'),
    toggleTheme,
    clearFilters,
    exportTodos,
  })

  // Handlers
  const handleAddTodo = () => {
    const success = addTodo(newTodo, newCategory, newDueDate, newPriority)
    if (success) {
      setNewTodo('')
      setNewCategory('')
      setNewDueDate('')
      setNewPriority('')
      setShowAdvancedAdd(false)
    }
  }

  const handleUpdateTodo = (id, updates) => {
    const success = updateTodo(id, updates)
    if (success) {
      setEditingTodo(null)
    }
  }

  const handleImportTodos = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      const result = await importTodos(file)
      alert(`Successfully imported ${result.imported} todos!${result.invalid > 0 ? ` (${result.invalid} invalid items skipped)` : ''}`)
    } catch (error) {
      alert(error.message)
    }
  }

  // Drag handler - works with current order
  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    // Find actual indices in allTodos
    const actualOldIndex = allTodos.findIndex((todo) => todo.id === active.id)
    const actualNewIndex = allTodos.findIndex((todo) => todo.id === over.id)

    if (actualOldIndex === -1 || actualNewIndex === -1) return

    // Reorder in the main array
    const result = [...allTodos]
    const [removed] = result.splice(actualOldIndex, 1)
    result.splice(actualNewIndex, 0, removed)

    setAllTodos(result)
  }

  if (!isClient) {
    return <div style={styles.flexCenter}>Loading...</div>
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1>Advanced Todo App</h1>
          <div style={styles.headerInfo}>Shortcuts: Ctrl+N (New), Ctrl+L (View), Ctrl+D (Theme), Ctrl+E (Export), Esc (Clear)</div>
        </div>
        <button onClick={toggleTheme} style={styles.themeButton} title="Toggle theme (Ctrl+D)">
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>

      {/* Validation Messages */}
      <ValidationMessage errors={validationErrors} />

      {/* Add Todo Section */}
      <div style={styles.addTodoContainer}>
        <div style={styles.addTodoRow}>
          <input
            ref={todoInputRef}
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            onKeyDown={(e) => e.key === 'Enter' && !showAdvancedAdd && handleAddTodo()}
            style={styles.todoInput}
          />
          <button onClick={() => setShowAdvancedAdd(!showAdvancedAdd)} style={styles.advancedToggle(showAdvancedAdd)}>
            {showAdvancedAdd ? '📝' : '+'}
          </button>
          <button onClick={handleAddTodo} style={styles.addButton}>
            Add
          </button>
        </div>

        {showAdvancedAdd && (
          <div style={styles.advancedInputs}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Category (optional)"
              style={styles.smallInput}
            />
            <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} style={styles.smallInput} />
            <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)} style={styles.smallInput}>
              <option value="">No Priority</option>
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
        )}
      </div>

      {/* View Mode Toggle */}
      <div style={styles.viewModeContainer}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setViewMode('list')} style={styles.viewModeButton(viewMode === 'list')}>
            📋 List View
          </button>
          <button onClick={() => setViewMode('calendar')} style={styles.viewModeButton(viewMode === 'calendar')}>
            📅 Calendar View
          </button>
        </div>

        {viewMode === 'list' && (
          <div style={styles.sortButtonsContainer}>
            <button onClick={() => sortTodos('text', 'asc')} style={styles.sortButton}>
              📝 A-Z
            </button>
            <button onClick={() => sortTodos('category', 'asc')} style={styles.sortButton}>
              🏷️ Category
            </button>
            <button onClick={() => sortTodos('dueDate', 'asc')} style={styles.sortButton}>
              📅 Due Date
            </button>
            <button onClick={() => sortTodos('priority', 'desc')} style={styles.sortButton}>
              🔥 Priority
            </button>
            <button onClick={() => sortTodos('completed', 'asc')} style={styles.sortButton}>
              ✅ Status
            </button>
          </div>
        )}
      </div>

      {/* Advanced Filters - Only for List View */}
      {viewMode === 'list' && (
        <AdvancedFilters
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          dateRangeFilter={dateRangeFilter}
          setDateRangeFilter={setDateRangeFilter}
          availableCategories={availableCategories}
          clearFilters={clearFilters}
          isDark={isDark}
        />
      )}

      {/* Statistics */}
      <div style={styles.statsContainer}>
        <div style={styles.statsInfo}>
          <span>📊 Total: {stats.total}</span>
          <span>✅ Completed: {stats.completed}</span>
          <span>⏳ Active: {stats.active}</span>
          <span>🏷️ Categories: {stats.categories}</span>
          {stats.overdue > 0 && <span style={{ color: '#ff3b30' }}>⚠️ Overdue: {stats.overdue}</span>}
        </div>

        <div style={styles.statsActions}>
          <button onClick={markAllComplete} disabled={stats.active === 0} style={styles.actionButton('success', stats.active === 0)}>
            Complete All
          </button>
          <button onClick={deleteCompleted} disabled={stats.completed === 0} style={styles.actionButton('danger', stats.completed === 0)}>
            Delete Completed
          </button>
          <button onClick={exportTodos} style={styles.actionButton('primary')}>
            📤 Export
          </button>
          <label style={styles.actionButton('info')}>
            📥 Import
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportTodos} style={styles.hidden} />
          </label>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {viewMode === 'calendar' ? (
        <CalendarView
          todos={allTodos}
          isDark={isDark}
          onToggleComplete={toggleComplete}
          onDelete={deleteTodo}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onNavigateMonth={navigateMonth}
          onGoToToday={goToToday}
          monthName={monthName}
          calendarData={calendarData}
          getTodosForDate={getTodosForDate}
          isToday={isToday}
          isSelected={isSelected}
        />
      ) : (
        <>
          {/* Todo List with Working Drag & Drop */}
          <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <SortableContext items={paginatedTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
              {paginatedTodos.map((todo) => (
                <SortableItem
                  key={todo.id}
                  id={todo.id}
                  item={todo}
                  isDark={isDark}
                  onToggleComplete={toggleComplete}
                  onDelete={deleteTodo}
                  onUpdate={handleUpdateTodo}
                  isEditing={editingTodo === todo.id}
                  onStartEdit={() => setEditingTodo(todo.id)}
                  onCancelEdit={() => setEditingTodo(null)}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Pagination - Only for List View */}
          {totalPages > 1 && (
            <div style={styles.paginationContainer}>
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                style={styles.paginationButton(currentPage === 1)}
              >
                Previous
              </button>

              <span style={styles.paginationInfo}>
                Page {currentPage} of {totalPages} ({filteredTodos.length} items)
              </span>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                style={styles.paginationButton(currentPage === totalPages)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
