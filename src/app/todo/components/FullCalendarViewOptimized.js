import { useTheme } from '../hooks/useTheme'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import moment from 'moment'
import { memo, useCallback, useRef, useState } from 'react'

import AddTodoQuick from './AddTodoQuick'
import TodoModal from './TodoModal'

const FullCalendarViewOptimized = memo(({ todos, onUpdate, onDelete, onToggleComplete, onAddTodo }) => {
  const { getThemeClasses } = useTheme()
  const calendarRef = useRef(null)

  // Simple state
  const [selectedTodo, setSelectedTodo] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)

  // Convert todos to calendar events
  const events = todos
    .filter((todo) => todo.dueDate)
    .map((todo) => ({
      id: todo.id,
      title: todo.title,
      date: moment(todo.dueDate).format('YYYY-MM-DD'),
      backgroundColor: todo.completed ? '#10b981' : '#3b82f6',
      borderColor: todo.completed ? '#059669' : '#2563eb',
      extendedProps: { todo },
    }))

  // Event handlers
  const handleEventClick = useCallback((clickInfo) => {
    const todo = clickInfo.event.extendedProps?.todo
    if (todo) {
      setSelectedTodo(todo)
    }
  }, [])

  const handleDateClick = useCallback((dateClickInfo) => {
    setSelectedDate(dateClickInfo.date)
    setShowAddModal(true)
  }, [])

  const handleAddTodo = useCallback(
    (todoData) => {
      onAddTodo({
        ...todoData,
        dueDate: selectedDate,
      })
      setShowAddModal(false)
      setSelectedDate(null)
    },
    [onAddTodo, selectedDate]
  )

  return (
    <div className="h-full relative">
      <div className={`h-full ${getThemeClasses('card')} rounded-xl p-4`}>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          eventClick={handleEventClick}
          dateClick={handleDateClick}
          height="100%"
          dayMaxEvents={3}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: '',
          }}
          buttonText={{
            today: 'Today',
          }}
        />
      </div>

      {/* Simple Modals */}
      {selectedTodo && <TodoModal todo={selectedTodo} onClose={() => setSelectedTodo(null)} onUpdate={onUpdate} onDelete={onDelete} onToggleComplete={onToggleComplete} />}

      {showAddModal && (
        <AddTodoQuick
          onClose={() => {
            setShowAddModal(false)
            setSelectedDate(null)
          }}
          onAdd={handleAddTodo}
          initialDate={selectedDate}
        />
      )}
    </div>
  )
})

FullCalendarViewOptimized.displayName = 'FullCalendarViewOptimized'

export default FullCalendarViewOptimized
