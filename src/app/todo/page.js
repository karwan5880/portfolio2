'use client'

import { useState } from 'react'

import AppHeader from './components/AppHeader'
import AppModals from './components/AppModals'
import IconPagination from './components/IconPagination'
import TodoContent from './components/TodoContent'
import { useEventHandlers } from './hooks/useEventHandlers'
import { useFilters } from './hooks/useFilters'
import { usePagination } from './hooks/usePagination'
import { useSearch } from './hooks/useSearch'
import { useTheme } from './hooks/useTheme'
import { useToast } from './hooks/useToast'
import { useTodos } from './hooks/useTodos'
import { useViewManager } from './hooks/useViewManager'
import './styles/search-animations.css'

export default function Home() {
  // UI State
  const [showAddTodo, setShowAddTodo] = useState(false)
  const [selectedTodo, setSelectedTodo] = useState(null)

  // Custom hooks for complex logic
  const { todos, addTodo, updateTodo, deleteTodo, toggleTodoComplete, importTodos, reorderTodos, clearAllTodos } = useTodos()
  const { getThemeClasses, isHydrated } = useTheme()
  const { search, debouncedSearch, setSearch, clearSearch } = useSearch()
  const { showCompleted, showIncomplete, setShowCompleted, setShowIncomplete, filteredTodos, isDragEnabled, hasActiveFilters, clearFilters } = useFilters(todos, debouncedSearch)
  const { currentPage, itemsPerPage, paginatedItems: paginatedTodos, totalPages, setCurrentPage, setItemsPerPage, shouldShowPagination } = usePagination(filteredTodos)
  const { toast, showCelebration, showTaskCreated, showCalendarTaskCreated, hideToast } = useToast()
  const { currentView, isSearchExpanded, setCurrentView, setIsSearchExpanded } = useViewManager()
  const { handleSortByDueDate, handleReorderPaginated, handleToggleComplete } = useEventHandlers({
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
    isDragEnabled,
  })

  // Show loading screen if not hydrated yet
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`h-screen flex flex-col ${getThemeClasses('body')}`}>
      {/* Application Header */}
      <AppHeader currentView={currentView} onViewChange={setCurrentView} search={search} onSearchChange={setSearch} onClearSearch={clearSearch} isSearchExpanded={isSearchExpanded} onToggleSearchExpanded={setIsSearchExpanded} todos={todos} onImportTodos={importTodos} showCompleted={showCompleted} showIncomplete={showIncomplete} onToggleCompleted={setShowCompleted} onToggleIncomplete={setShowIncomplete} onSortByDueDate={handleSortByDueDate} onClearAll={clearAllTodos} onShowAddTodo={() => setShowAddTodo(true)} itemsPerPage={itemsPerPage} onItemsPerPageChange={setItemsPerPage} />

      {/* Scrollable Content Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col max-w-4xl mx-auto">
          {/* Content Area - Fixed height with scroll */}
          <div className="flex-1 overflow-y-auto px-3 py-4 min-h-0">
            <TodoContent
              currentView={currentView}
              todos={todos}
              paginatedTodos={paginatedTodos}
              isDragEnabled={isDragEnabled}
              hasActiveFilters={hasActiveFilters}
              filteredTodos={filteredTodos}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              onToggleComplete={handleToggleComplete}
              onReorder={handleReorderPaginated}
              onViewTodo={setSelectedTodo}
              onAddTodo={(todoData) => {
                addTodo(todoData)
                showCalendarTaskCreated()
              }}
              clearSearch={clearSearch}
              clearFilters={clearFilters}
            />
          </div>

          {/* Icon-Based Pagination - only show when pagination is active */}
          {todos.length > 0 && currentView === 'list' && shouldShowPagination && <IconPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
        </div>
      </main>

      {/* App Modals */}
      <AppModals showAddTodo={showAddTodo} onCloseAddTodo={() => setShowAddTodo(false)} selectedTodo={selectedTodo} onCloseSelectedTodo={() => setSelectedTodo(null)} toast={toast} onAddTodo={addTodo} onUpdateTodo={updateTodo} onDeleteTodo={deleteTodo} onToggleComplete={handleToggleComplete} onHideToast={hideToast} showTaskCreated={showTaskCreated} />
    </div>
  )
}
