import { memo } from 'react';
import { useTheme } from '../hooks/useTheme';

/**
 * Morphing search bar component that expands from an icon
 */
const SearchBar = memo(({ 
  search, 
  onSearchChange, 
  onClearSearch, 
  isExpanded, 
  onToggleExpanded 
}) => {
  const { getThemeClasses } = useTheme();

  return (
    <div className="flex justify-end">
      <div className="relative morphing-search">
        {/* Search Icon Button */}
        <button
          onClick={() => onToggleExpanded(!isExpanded)}
          className={`${getThemeClasses(
            "button"
          )} w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105 ${
            isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          aria-label="Search tasks"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        {/* Morphing Search Bar */}
        <div
          className={`absolute top-0 right-0 transition-all duration-500 ease-out z-10 ${
            isExpanded 
              ? 'w-60 xs:w-48 sm:w-80 md:w-96 opacity-100 scale-100' 
              : 'w-10 opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`${getThemeClasses(
                "input"
              )} w-full pl-12 pr-10 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
              autoFocus={isExpanded}
            />
            
            {/* Search Icon Inside Input */}
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                onToggleExpanded(false);
                onClearSearch();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;