import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import FullCalendar from '@fullcalendar/react'
import { memo } from 'react'

/**
 * Simplified FullCalendar component - Month view only
 */
const CalendarCore = memo(({ calendarRef, events, onEventClick, onDateClick }) => {
  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={false} // We use custom header
      events={events}
      eventClick={onEventClick}
      dateClick={onDateClick}
      // Display settings
      height="100%"
      dayMaxEvents={3}
      eventDisplay="block"
      displayEventTime={false}
      // Interaction settings
      selectable={false}
      editable={false}
      // Simple formatting
      dayHeaderFormat={{ weekday: 'short' }}
      eventTimeFormat={{
        hour: 'numeric',
        minute: '2-digit',
        meridiem: 'short',
      }}
    />
  )
})

CalendarCore.displayName = 'CalendarCore'

export default CalendarCore
