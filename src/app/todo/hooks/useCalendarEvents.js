import { useMemo, useCallback } from 'react';
import moment from 'moment';
import { isOverdue } from '../utils/dateUtils';

/**
 * Custom hook for transforming todos into FullCalendar events
 */
export const useCalendarEvents = (todos) => {
  // Filter todos with valid due dates
  const todosWithDates = useMemo(() => 
    todos.filter(todo => todo && todo.dueDate && todo.id),
    [todos]
  );

  // Category color mapping
  const getCategoryColor = useCallback((category) => {
    const colorMap = {
      Work: "#ea580c",
      Personal: "#3b82f6", 
      Urgent: "#dc2626",
    };
    return colorMap[category] || "#6366f1";
  }, []);

  // Smart time assignment based on todo content
  const getSmartTime = useCallback((todo) => {
    const dueDate = moment(todo.dueDate);

    // If todo already has specific time, use it
    if (todo.dueTime || dueDate.hour() !== 0 || dueDate.minute() !== 0) {
      return {
        start: dueDate.toDate(),
        end: dueDate.clone().add(1, "hour").toDate(),
        allDay: false,
      };
    }

    const title = todo.title.toLowerCase();
    const category = todo.category.toLowerCase();

    // Morning tasks (8-9 AM)
    if (
      title.includes("morning") ||
      title.includes("breakfast") ||
      title.includes("workout") ||
      title.includes("exercise")
    ) {
      return {
        start: dueDate.clone().hour(8).minute(0).toDate(),
        end: dueDate.clone().hour(9).minute(0).toDate(),
        allDay: false,
      };
    }

    // Work tasks (9 AM - 5 PM)
    if (
      category === "work" ||
      title.includes("meeting") ||
      title.includes("call") ||
      title.includes("presentation")
    ) {
      const hour = title.includes("meeting") || title.includes("call") ? 10 : 9;
      const duration = title.includes("meeting") || title.includes("call") ? 1 : 2;
      return {
        start: dueDate.clone().hour(hour).minute(0).toDate(),
        end: dueDate.clone().hour(hour + duration).minute(0).toDate(),
        allDay: false,
      };
    }

    // Evening tasks (6-7 PM)
    if (
      title.includes("evening") ||
      title.includes("dinner") ||
      title.includes("family") ||
      title.includes("relax")
    ) {
      return {
        start: dueDate.clone().hour(18).minute(0).toDate(),
        end: dueDate.clone().hour(19).minute(0).toDate(),
        allDay: false,
      };
    }

    // Urgent tasks - current time or next available slot
    if (category === "urgent") {
      const now = moment();
      const urgentTime = dueDate.isSame(now, "day")
        ? now.clone().add(30, "minutes")
        : dueDate.clone().hour(9).minute(0);
      return {
        start: urgentTime.toDate(),
        end: urgentTime.clone().add(1, "hour").toDate(),
        allDay: false,
      };
    }

    // Default: 2-3 PM
    return {
      start: dueDate.clone().hour(14).minute(0).toDate(),
      end: dueDate.clone().hour(15).minute(0).toDate(),
      allDay: false,
    };
  }, []);

  // Color brightness adjustment utility
  const adjustColorBrightness = useCallback((hex, percent) => {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }, []);

  // Transform todos into FullCalendar events
  const events = useMemo(() => 
    todosWithDates
      .filter(todo => todo && todo.id)
      .map(todo => {
        const color = getCategoryColor(todo.category);
        const isTaskOverdue = isOverdue(todo.dueDate) && !todo.completed;
        const timeInfo = getSmartTime(todo);

        const gradientStart = todo.completed ? "#10b981" : color;
        const gradientEnd = todo.completed
          ? "#059669"
          : adjustColorBrightness(color, -20);

        const isAllDay = todo.allDay !== false;

        return {
          id: todo.id,
          title: todo.completed ? `✓ ${todo.title}` : todo.title,
          start: isAllDay ? todo.dueDate : timeInfo.start,
          end: isAllDay ? undefined : timeInfo.end,
          allDay: isAllDay,
          backgroundColor: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)`,
          borderColor: gradientEnd,
          textColor: "#ffffff",
          extendedProps: {
            todo: todo,
            isOverdue: isTaskOverdue,
            category: todo.category,
            completed: todo.completed,
            duration: isAllDay
              ? null
              : moment(timeInfo.end).diff(moment(timeInfo.start), "minutes"),
            smartTime: timeInfo,
          },
          classNames: [
            "custom-event",
            ...(isTaskOverdue ? ["overdue-event"] : []),
            ...(todo.completed ? ["completed-event"] : []),
            `category-${todo.category.toLowerCase()}`,
            ...(isAllDay ? ["all-day-event"] : ["timed-event"]),
          ],
        };
      }),
    [todosWithDates, getCategoryColor, getSmartTime, adjustColorBrightness]
  );

  return {
    events,
    todosWithDates,
    getCategoryColor,
  };
};