import { useState } from "react";
import { useTheme } from "../hooks/useTheme";
import ThemeSelector from "./ThemeSelector";

const HeaderMenu = ({ 
  todos, 
  onImport, 
  showCompleted,
  showIncomplete,
  onToggleCompleted,
  onToggleIncomplete,
  onSortByDueDate,
  onClearAll,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  const { getThemeClasses } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const handleExport = () => {
    // Convert todos to CSV format
    const headers = [
      "Title",
      "Description",
      "Category",
      "Due Date",
      "Completed",
      "Created At",
    ];
    const csvContent = [
      headers.join(","),
      ...todos.map((todo) =>
        [
          `"${todo.title.replace(/"/g, '""')}"`,
          `"${(todo.description || "").replace(/"/g, '""')}"`,
          todo.category,
          todo.dueDate
            ? new Date(todo.dueDate).toISOString().split("T")[0]
            : "",
          todo.completed ? "Yes" : "No",
          new Date(todo.createdAt).toISOString().split("T")[0],
        ].join(",")
      ),
    ].join("\n");

    const dataBlob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `todos-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const csvContent = e.target.result;
          const lines = csvContent.split("\n");
          const headers = lines[0].split(",");

          const importedTodos = lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line, index) => {
              const values = line
                .split(",")
                .map((val) => val.replace(/^"|"$/g, "").replace(/""/g, '"'));
              return {
                id: Date.now() + index,
                title: values[0] || `Imported Task ${index + 1}`,
                description: values[1] || "",
                category: values[2] || "Personal",
                dueDate: values[3] ? new Date(values[3]) : null,
                completed: values[4] === "Yes",
                createdAt: values[5] ? new Date(values[5]) : new Date(),
              };
            });

          onImport(importedTodos);
          setShowMenu(false);
        } catch (error) {
          alert("Invalid CSV format. Please select a valid CSV file.");
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setShowMenu(!showMenu)}
        className={`${getThemeClasses(
          "buttonSecondary"
        )} w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:scale-105`}
        title="Menu"
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
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <div
          className={`absolute right-0 mt-2 w-48 ${getThemeClasses(
            "card"
          )} border rounded-lg shadow-lg z-10`}
        >
          <button
            onClick={handleExport}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Tasks
          </button>

          <label className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 cursor-pointer">
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
              />
            </svg>
            Import Tasks
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>

          <div className="border-t my-1"></div>

          {/* Filter */}
          <div className="px-4 py-2">
            <span className="text-sm font-medium block mb-2">Filter</span>
            <div className="flex gap-1">
              <button
                onClick={() => onToggleIncomplete(!showIncomplete)}
                className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                  showIncomplete 
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:from-orange-600 hover:to-orange-700 border-2 border-orange-400'
                    : `${getThemeClasses('buttonSecondary')} hover:bg-orange-100 dark:hover:bg-orange-900/20 border-2 border-transparent`
                }`}
              >
                📝 Incomplete
              </button>
              <button
                onClick={() => onToggleCompleted(!showCompleted)}
                className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all duration-200 transform hover:scale-105 ${
                  showCompleted 
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:from-green-600 hover:to-green-700 border-2 border-green-400'
                    : `${getThemeClasses('buttonSecondary')} hover:bg-green-100 dark:hover:bg-green-900/20 border-2 border-transparent`
                }`}
              >
                ✅ Complete
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Toggle to show/hide • Both on = show all
            </p>
          </div>

          {/* Sort Actions */}
          <div className="px-4 py-2">
            <span className="text-sm font-medium block mb-2">Sort by Due Date</span>
            <div className="flex gap-1">
              <button
                onClick={() => onSortByDueDate('asc')}
                className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${getThemeClasses('buttonSecondary')} hover:${getThemeClasses('button')}`}
              >
                Earliest ↑
              </button>
              <button
                onClick={() => onSortByDueDate('desc')}
                className={`flex-1 px-2 py-1 rounded text-xs transition-colors ${getThemeClasses('buttonSecondary')} hover:${getThemeClasses('button')}`}
              >
                Latest ↓
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              One-time sort • Drag to customize after
            </p>
          </div>

          {/* Tasks Per Page Slider */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Tasks Per Page</span>
              <span className="text-xs text-gray-500 font-mono">{itemsPerPage}</span>
            </div>
            
            {/* Slider */}
            <div className="space-y-3">
              <input
                type="range"
                min="5"
                max={Math.max(todos.length, 50)}
                step="1"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((itemsPerPage - 5) / (Math.max(todos.length, 50) - 5)) * 100}%, #e5e7eb ${((itemsPerPage - 5) / (Math.max(todos.length, 50) - 5)) * 100}%, #e5e7eb 100%)`
                }}
              />
              
              {/* Quick preset buttons */}
              <div className="flex gap-1 justify-between">
                <button
                  onClick={() => onItemsPerPageChange(10)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    itemsPerPage === 10 
                      ? getThemeClasses('button')
                      : getThemeClasses('buttonSecondary')
                  }`}
                >
                  10
                </button>
                <button
                  onClick={() => onItemsPerPageChange(20)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    itemsPerPage === 20 
                      ? getThemeClasses('button')
                      : getThemeClasses('buttonSecondary')
                  }`}
                >
                  20
                </button>
                <button
                  onClick={() => onItemsPerPageChange(Math.min(todos.length, 50))}
                  className={`px-2 py-1 rounded text-xs transition-colors ${getThemeClasses('buttonSecondary')}`}
                  title={`Show all ${todos.length} tasks`}
                >
                  All
                </button>
              </div>
              
              <div className="flex justify-between text-xs text-gray-400">
                <span>5</span>
                <span>{Math.max(todos.length, 50)}</span>
              </div>
            </div>
          </div>

          <div className="border-t my-1"></div>

          {/* Clear All */}
          <div className="px-4 py-2">
            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete all ${todos.length} todos? This cannot be undone.`)) {
                  onClearAll();
                  setShowMenu(false);
                }
              }}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 rounded"
              disabled={todos.length === 0}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All ({todos.length})
            </button>
          </div>
          
          <div className="border-t my-1"></div>
          
          {/* Theme Selector in Menu */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Theme</span>
              <ThemeSelector />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderMenu;
