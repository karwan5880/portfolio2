import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useTheme } from "../hooks/useTheme";
import { formatDateForDisplay } from "../utils/dateFormatUtils";

const MobileDatePicker = ({
  selected,
  onSelect,
  placeholder = "Select date",
  minDate = new Date(),
  className = "",
  disabled = false,
}) => {
  const { getThemeClasses } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateSelect = (date) => {
    onSelect(date);
    setIsOpen(false);
  };

  const formatDisplayDate = (date) => {
    if (!date) return placeholder;
    return formatDateForDisplay(date);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div className="relative">
      {/* Input Display */}
      <div
        onClick={() => !disabled && setIsOpen(true)}
        className={`
          w-full px-3 py-3 ${getThemeClasses("input")} border rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 
          text-sm cursor-pointer flex items-center justify-between
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
      >
        <span
          className={
            selected ? getThemeClasses("text") : getThemeClasses("textMuted")
          }
        >
          {formatDisplayDate(selected)}
        </span>
        <div className="flex items-center gap-2">
          {selected && !disabled && (
            <button
              onClick={handleClear}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${getThemeClasses(
                "textMuted"
              )}`}
              type="button"
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
          )}
          <svg
            className={`w-4 h-4 ${getThemeClasses("textMuted")}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Mobile-Friendly Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`${getThemeClasses(
              "card"
            )} rounded-lg shadow-xl max-w-sm w-full h-[520px] overflow-hidden flex flex-col relative`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3
                className={`text-lg font-semibold ${getThemeClasses("text")}`}
              >
                Select Date
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className={`p-2 rounded-lg ${getThemeClasses(
                  "buttonSecondary"
                )} hover:bg-gray-100 dark:hover:bg-gray-700`}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Calendar */}
            <div className="p-0 h-96 flex flex-col">
              {/* Custom Header with Navigation */}
              <div className="flex items-center justify-between mb-1 px-11 pt-4">
                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1
                      )
                    )
                  }
                  className={`h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 ${getThemeClasses(
                    "buttonSecondary"
                  )} rounded-md flex items-center justify-center transition-opacity`}
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <h4
                  className={`text-lg font-semibold ${getThemeClasses("text")}`}
                >
                  {currentMonth.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h4>

                <button
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1
                      )
                    )
                  }
                  className={`h-8 w-8 bg-transparent p-0 opacity-70 hover:opacity-100 ${getThemeClasses(
                    "buttonSecondary"
                  )} rounded-md flex items-center justify-center transition-opacity`}
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <DayPicker
                mode="single"
                selected={selected}
                onSelect={handleDateSelect}
                disabled={{ before: minDate }}
                showOutsideDays
                className="mobile-day-picker"
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                hideNavigation
                classNames={{
                  months:
                    "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "", // Remove extra spacing
                  caption: "hidden", // Hide the default caption
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell:
                    "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-1",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: `h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${getThemeClasses(
                    "text"
                  )}`,
                  day_selected:
                    "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600",
                  day_today:
                    "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-100",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled:
                    "text-muted-foreground opacity-50 cursor-not-allowed",
                  day_range_middle:
                    "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 flex gap-3 p-4 border-t bg-inherit">
              <button
                onClick={() => setIsOpen(false)}
                className={`flex-1 px-4 py-2 ${getThemeClasses(
                  "buttonSecondary"
                )} rounded-lg font-medium transition-colors`}
              >
                Cancel
              </button>
              {selected && (
                <button
                  onClick={() => handleDateSelect(null)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileDatePicker;
