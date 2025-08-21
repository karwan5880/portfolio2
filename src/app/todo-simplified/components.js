import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
// Import React hooks at the top (this should be added)
import { useState } from 'react'

import { getStyles } from './styles'

// Validation Message Component
export function ValidationMessage({ errors, type = 'error' }) {
  if (!errors || errors.length === 0) return null

  const styles = getStyles(false) // We'll pass isDark from parent

  return (
    <div style={styles.validationMessage(type)}>
      <span>⚠️</span>
      <div>
        {errors.map((error, index) => (
          <div key={index}>{error}</div>
        ))}
      </div>
    </div>
  )
}

// Enhanced Todo Item with Edit Mode
export function SortableItem({ id, item, isDark, onToggleComplete, onDelete, onUpdate, isEditing, onStartEdit, onCancelEdit }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const styles = getStyles(isDark)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <div style={styles.todoItem}>
        <div {...attributes} {...listeners} style={styles.dragHandle} title="Drag to reorder">
          ☰
        </div>

        <div style={styles.todoContent}>
          {isEditing ? (
            <EditTodoForm item={item} isDark={isDark} onSave={onUpdate} onCancel={onCancelEdit} />
          ) : (
            <TodoDisplay item={item} isDark={isDark} onStartEdit={onStartEdit} />
          )}
        </div>

        <button onClick={() => onToggleComplete(item.id)} style={styles.checkbox(item.completed)}>
          {item.completed ? '✓' : ''}
        </button>

        <button onClick={() => onDelete(item.id)} style={styles.deleteButton}>
          ×
        </button>
      </div>
    </div>
  )
}

// Todo Display Component
function TodoDisplay({ item, isDark, onStartEdit }) {
  const styles = getStyles(isDark)

  return (
    <div onClick={onStartEdit} style={{ cursor: 'pointer' }}>
      <span style={styles.todoText(item.completed)}>{item.text}</span>
      {item.category && <span style={styles.categoryTag}>{item.category}</span>}
      {item.priority && (
        <span
          style={{
            ...styles.categoryTag,
            background: getPriorityColor(item.priority),
          }}
        >
          {getPriorityLabel(item.priority)}
        </span>
      )}
      {item.dueDate && <span style={styles.dueDateTag}>📅 {new Date(item.dueDate).toLocaleDateString()}</span>}
    </div>
  )
}

// Edit Todo Form Component
function EditTodoForm({ item, isDark, onSave, onCancel }) {
  const styles = getStyles(isDark)
  const [text, setText] = useState(item.text)
  const [category, setCategory] = useState(item.category || '')
  const [dueDate, setDueDate] = useState(item.dueDate || '')
  const [priority, setPriority] = useState(item.priority || '')

  const handleSave = () => {
    onSave(item.id, { text, category, dueDate, priority })
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} style={styles.todoInput} autoFocus />
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" style={styles.smallInput} />
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={styles.smallInput} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)} style={styles.smallInput}>
          <option value="">No Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button onClick={handleSave} style={styles.actionButton('success')}>
            ✓
          </button>
          <button onClick={onCancel} style={styles.actionButton('danger')}>
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

// Enhanced Calendar Component with Navigation
export function CalendarView({
  todos,
  isDark,
  onToggleComplete,
  onDelete,
  selectedDate,
  onDateSelect,
  currentMonth,
  currentYear,
  onNavigateMonth,
  onGoToToday,
  monthName,
  calendarData,
  getTodosForDate,
  isToday,
  isSelected,
}) {
  const styles = getStyles(isDark)

  return (
    <div style={styles.calendarContainer}>
      {/* Calendar Header with Navigation */}
      <div style={styles.calendarHeader}>
        <button onClick={() => onNavigateMonth('prev')} style={styles.navButton}>
          ← Previous
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h3 style={styles.calendarTitle}>{monthName}</h3>
          <button onClick={onGoToToday} style={styles.navButton}>
            Today
          </button>
        </div>

        <button onClick={() => onNavigateMonth('next')} style={styles.navButton}>
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div style={styles.calendarGrid}>
        {/* Day headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} style={styles.dayHeader}>
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {calendarData.calendarDays.map((day, index) => {
          const todosForDay = getTodosForDate(day)
          const hasOverdue = todosForDay.some((todo) => !todo.completed && new Date(todo.dueDate) < new Date())

          return (
            <CalendarDay
              key={index}
              day={day}
              todos={todosForDay}
              isDark={isDark}
              isToday={isToday(day)}
              isSelected={isSelected(day)}
              hasOverdue={hasOverdue}
              onDateSelect={onDateSelect}
              currentMonth={currentMonth}
              currentYear={currentYear}
            />
          )
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <SelectedDateDetails
          selectedDate={selectedDate}
          todos={getTodosForDate(new Date(selectedDate).getDate())}
          isDark={isDark}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      )}
    </div>
  )
}

// Calendar Day Component
function CalendarDay({ day, todos, isDark, isToday, isSelected, hasOverdue, onDateSelect, currentMonth, currentYear }) {
  const styles = getStyles(isDark)

  const handleClick = () => {
    if (day) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      onDateSelect(dateStr)
    }
  }

  return (
    <div onClick={handleClick} style={styles.calendarDay(day, isToday, isSelected)}>
      {day && (
        <>
          <div style={styles.dayNumber(isToday)}>{day}</div>

          {todos.slice(0, 3).map((todo) => (
            <div key={todo.id} style={styles.todoPreview(hasOverdue, todo.completed)}>
              {todo.text}
            </div>
          ))}

          {todos.length > 3 && <div style={styles.moreIndicator}>+{todos.length - 3} more</div>}
        </>
      )}
    </div>
  )
}

// Selected Date Details Component
function SelectedDateDetails({ selectedDate, todos, isDark, onToggleComplete, onDelete }) {
  const styles = getStyles(isDark)

  return (
    <div style={styles.selectedDateContainer}>
      <h4 style={styles.selectedDateTitle}>
        📅{' '}
        {new Date(selectedDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </h4>

      {todos.map((todo) => (
        <div key={todo.id} style={styles.selectedDateTodo}>
          <button onClick={() => onToggleComplete(todo.id)} style={styles.checkbox(todo.completed)}>
            {todo.completed ? '✓' : ''}
          </button>

          <span
            style={{
              flex: 1,
              textDecoration: todo.completed ? 'line-through' : 'none',
              opacity: todo.completed ? 0.6 : 1,
              color: isDark ? '#fff' : '#000',
              fontSize: '0.9rem',
            }}
          >
            {todo.text}
          </span>

          {todo.category && <span style={styles.categoryTag}>{todo.category}</span>}

          <button onClick={() => onDelete(todo.id)} style={styles.deleteButton}>
            ×
          </button>
        </div>
      ))}

      {todos.length === 0 && (
        <p
          style={{
            color: isDark ? '#888' : '#666',
            fontStyle: 'italic',
            fontSize: '0.9rem',
          }}
        >
          No todos for this date
        </p>
      )}
    </div>
  )
}

// Advanced Filters Component
export function AdvancedFilters({
  search,
  setSearch,
  filter,
  setFilter,
  showCompleted,
  setShowCompleted,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  dateRangeFilter,
  setDateRangeFilter,
  availableCategories,
  clearFilters,
  isDark,
}) {
  const styles = getStyles(isDark)

  return (
    <div style={styles.filtersContainer}>
      <input type="text" placeholder="Search todos..." value={search} onChange={(e) => setSearch(e.target.value)} style={styles.searchInput} />

      {['all', 'active', 'completed'].map((filterType) => (
        <button key={filterType} onClick={() => setFilter(filterType)} style={styles.filterButton(filter === filterType)}>
          {filterType}
        </button>
      ))}

      <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={styles.smallInput}>
        <option value="">All Categories</option>
        {availableCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)} style={styles.smallInput}>
        <option value="">All Priorities</option>
        <option value="high">High Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="low">Low Priority</option>
      </select>

      <input
        type="date"
        value={dateRangeFilter.start}
        onChange={(e) => setDateRangeFilter((prev) => ({ ...prev, start: e.target.value }))}
        placeholder="Start date"
        style={styles.smallInput}
      />

      <input
        type="date"
        value={dateRangeFilter.end}
        onChange={(e) => setDateRangeFilter((prev) => ({ ...prev, end: e.target.value }))}
        placeholder="End date"
        style={styles.smallInput}
      />

      <button onClick={() => setShowCompleted(!showCompleted)} style={styles.toggleButton(showCompleted)}>
        {showCompleted ? '👁️ Hide Completed' : '👁️ Show Completed'}
      </button>

      <button onClick={clearFilters} style={styles.actionButton('danger')}>
        Clear Filters
      </button>
    </div>
  )
}

// Utility functions
function getPriorityColor(priority) {
  switch (priority) {
    case 'high':
      return '#ff3b30'
    case 'medium':
      return '#ff9500'
    case 'low':
      return '#34c759'
    default:
      return '#007aff'
  }
}

function getPriorityLabel(priority) {
  switch (priority) {
    case 'high':
      return '🔴 High'
    case 'medium':
      return '🟡 Medium'
    case 'low':
      return '🟢 Low'
    default:
      return ''
  }
}
