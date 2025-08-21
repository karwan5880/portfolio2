import { memo } from 'react';
import { useTheme } from '../hooks/useTheme';

const ViewToggle = memo(({ currentView, onViewChange }) => {
  const { getThemeClasses } = useTheme();

  const toggleView = () => {
    onViewChange(currentView === 'list' ? 'calendar' : 'list');
  };

  return (
    <button
      onClick={toggleView}
      className={`${getThemeClasses(
        "button"
      )} w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105`}
      aria-label={`Switch to ${currentView === 'list' ? 'calendar' : 'list'} view`}
    >
      {currentView === 'list' ? (
        // Show calendar icon when in list view (click to go to calendar)
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ) : (
        // Show list icon when in calendar view (click to go to list)
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
      )}
    </button>
  );
});

ViewToggle.displayName = 'ViewToggle';

export default ViewToggle;