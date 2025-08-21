import { memo } from 'react';
import { useTheme } from '../hooks/useTheme';
import ViewToggle from './ViewToggle';
import SearchBar from './SearchBar';
import HeaderMenu from './HeaderMenu';

/**
 * Main application header with navigation and controls
 */
const AppHeader = memo(({ 
  // View state
  currentView, 
  onViewChange,
  
  // Search state
  search,
  onSearchChange,
  onClearSearch,
  isSearchExpanded,
  onToggleSearchExpanded,
  
  // Todo data and actions
  todos,
  onImportTodos,
  
  // Filter state
  showCompleted,
  showIncomplete,
  onToggleCompleted,
  onToggleIncomplete,
  
  // Other actions
  onSortByDueDate,
  onClearAll,
  onShowAddTodo,
  
  // Pagination
  itemsPerPage,
  onItemsPerPageChange
}) => {
  const { getThemeClasses } = useTheme();

  return (
    <header className={`${getThemeClasses("header")} border-b flex-shrink-0`}>
      <div className="px-4 py-3 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Left side - View Toggle */}
          <div className="flex items-center">
            <ViewToggle 
              currentView={currentView} 
              onViewChange={onViewChange} 
            />
          </div>

          {/* Right side - Search, Add, Menu */}
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <SearchBar
              search={search}
              onSearchChange={onSearchChange}
              onClearSearch={onClearSearch}
              isExpanded={isSearchExpanded}
              onToggleExpanded={onToggleSearchExpanded}
            />

            {/* Add Button */}
            <div className="flex-shrink-0">
              <button
                onClick={onShowAddTodo}
                className={`${getThemeClasses(
                  "button"
                )} w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:scale-105`}
                aria-label="Add new task"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {/* Menu Button */}
            <div className="flex-shrink-0">
              <HeaderMenu
                todos={todos}
                onImport={onImportTodos}
                showCompleted={showCompleted}
                showIncomplete={showIncomplete}
                onToggleCompleted={onToggleCompleted}
                onToggleIncomplete={onToggleIncomplete}
                onSortByDueDate={onSortByDueDate}
                onClearAll={onClearAll}
                itemsPerPage={itemsPerPage}
                onItemsPerPageChange={onItemsPerPageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

AppHeader.displayName = 'AppHeader';

export default AppHeader;