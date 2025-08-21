import { useTheme } from '../../hooks/useTheme'
import { memo } from 'react'

/**
 * Simplified calendar header - Month view only
 */
const CalendarHeader = memo(({ calendarTitle, onToday, onPrevious, onNext }) => {
  const { getThemeClasses } = useTheme()

  return (
    <div className="mb-4 flex justify-between items-center">
      {/* Left - Navigation */}
      <div className="flex gap-2">
        <button onClick={onPrevious} className={`px-3 py-2 ${getThemeClasses('buttonSecondary')} rounded-lg text-sm font-medium hover:scale-105 transition-all duration-200`}>
          ←
        </button>
        <button onClick={onNext} className={`px-3 py-2 ${getThemeClasses('buttonSecondary')} rounded-lg text-sm font-medium hover:scale-105 transition-all duration-200`}>
          →
        </button>
      </div>

      {/* Center - Calendar Title */}
      <div className="flex-1 text-center">
        <h2 className={`text-lg font-semibold ${getThemeClasses('text')}`}>{calendarTitle}</h2>
      </div>

      {/* Right - Today button */}
      <div>
        <button onClick={onToday} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200">
          Today
        </button>
      </div>
    </div>
  )
})

CalendarHeader.displayName = 'CalendarHeader'

export default CalendarHeader
