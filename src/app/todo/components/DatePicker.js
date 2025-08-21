import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { useTheme } from '../hooks/useTheme';
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({ 
  selected, 
  onChange, 
  placeholder = "Select date",
  className = "",
  ...props 
}) => {
  const { getThemeClasses } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <style jsx global>{`
        /* Custom DatePicker Styling */
        .react-datepicker-wrapper {
          width: 100% !important;
        }
        
        .react-datepicker__input-container {
          width: 100% !important;
        }
        
        .react-datepicker__input-container input {
          width: 100% !important;
          box-sizing: border-box !important;
        }

        .react-datepicker {
          font-family: inherit;
          border: 1px solid ${getThemeClasses("card").includes("bg-gray-800") ? "#4b5563" : "#d1d5db"};
          border-radius: 8px;
          background: ${getThemeClasses("card").includes("bg-gray-800") ? "#1f2937" : "#ffffff"};
          color: ${getThemeClasses("text").includes("text-white") ? "#f3f4f6" : "#1f2937"};
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .react-datepicker__header {
          background: ${getThemeClasses("card").includes("bg-gray-800") ? "#374151" : "#f9fafb"};
          border-bottom: 1px solid ${getThemeClasses("card").includes("bg-gray-800") ? "#4b5563" : "#e5e7eb"};
          border-radius: 8px 8px 0 0;
        }

        .react-datepicker__current-month {
          color: ${getThemeClasses("text").includes("text-white") ? "#f3f4f6" : "#1f2937"};
          font-weight: 600;
        }

        .react-datepicker__day-name {
          color: ${getThemeClasses("text").includes("text-white") ? "#d1d5db" : "#6b7280"};
          font-weight: 600;
        }

        .react-datepicker__day {
          color: ${getThemeClasses("text").includes("text-white") ? "#f3f4f6" : "#1f2937"};
          border-radius: 6px;
          transition: all 0.2s ease;
        }

        .react-datepicker__day:hover {
          background: ${getThemeClasses("card").includes("bg-gray-800") ? "#4b5563" : "#f3f4f6"};
          border-radius: 6px;
        }

        .react-datepicker__day--selected {
          background: #3b82f6 !important;
          color: white !important;
          border-radius: 6px;
        }

        .react-datepicker__day--today {
          background: ${getThemeClasses("card").includes("bg-gray-800") ? "#059669" : "#10b981"};
          color: white;
          border-radius: 6px;
          font-weight: 600;
        }

        .react-datepicker__day--outside-month {
          color: ${getThemeClasses("text").includes("text-white") ? "#6b7280" : "#9ca3af"};
        }

        .react-datepicker__navigation {
          top: 12px;
        }

        .react-datepicker__navigation--previous {
          border-right-color: ${getThemeClasses("text").includes("text-white") ? "#f3f4f6" : "#1f2937"};
        }

        .react-datepicker__navigation--next {
          border-left-color: ${getThemeClasses("text").includes("text-white") ? "#f3f4f6" : "#1f2937"};
        }

        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
      
      <DatePicker
        selected={selected}
        onChange={onChange}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        className={`w-full px-3 py-2 ${getThemeClasses('input')} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${className}`}
        calendarClassName="custom-datepicker"
        showPopperArrow={false}
        {...props}
      />
    </div>
  );
};

export default CustomDatePicker;