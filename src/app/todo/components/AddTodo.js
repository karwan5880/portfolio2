import { useState } from "react";
import MobileDatePicker from './MobileDatePicker';
import '../styles/mobile-datepicker.css';
import { CATEGORIES, CATEGORY_COLORS } from "../utils/constants";
import { useTheme } from "../hooks/useTheme";
import { formatDateToLocalString, parseDateFromLocalString } from "../utils/dateFormatUtils";

const AddTodo = ({ onAddTodo, onCancel }) => {
  const { getThemeClasses } = useTheme();
  
  // Default: No due date (flexible)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "", // Empty = no due date = flexible
    category: CATEGORIES.PERSONAL,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const todoData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null
    };
    
    onAddTodo(todoData);
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className={`${getThemeClasses('card')} border rounded-lg p-6 shadow-lg`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${getThemeClasses('text')}`}>Add New Task</h2>
        <button
          onClick={handleCancel}
          className={`p-2 ${getThemeClasses('textMuted')} hover:${getThemeClasses('text')} transition-colors`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className={`block text-sm font-medium ${getThemeClasses('textSecondary')} mb-2`}>
            Task Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="What needs to be done?"
            className={`w-full px-4 py-3 ${getThemeClasses('input')} border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 ${
              errors.title ? 'border-red-500' : ''
            }`}
            autoFocus
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className={`block text-sm font-medium ${getThemeClasses('textSecondary')} mb-2`}>
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            placeholder="Add more details (optional)..."
            className={`w-full px-4 py-3 ${getThemeClasses('input')} border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 resize-none`}
          />
        </div>

        {/* Due Date and Category - Side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Due Date */}
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary')} mb-2`}>
              Due Date
            </label>
            <MobileDatePicker
              selected={parseDateFromLocalString(formData.dueDate)}
              onSelect={(date) => {
                try {
                  setFormData(prev => ({
                    ...prev,
                    dueDate: date ? formatDateToLocalString(date) : ''
                  }));
                } catch (error) {
                  console.warn('Error setting date:', error);
                }
              }}
              placeholder="Click to select due date"
              minDate={new Date()}
            />
          </div>

          {/* Category - Radio Buttons */}
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary')} mb-2`}>
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
            {Object.values(CATEGORIES).map(category => (
              <label
                key={category}
                className={`flex items-center justify-center p-3 rounded-lg cursor-pointer transition-all hover:scale-105 ${
                  formData.category === category
                    ? `${CATEGORY_COLORS[category].bg} text-white border-2 ${CATEGORY_COLORS[category].border}`
                    : `${getThemeClasses('buttonSecondary')} border-2 border-transparent hover:border-gray-300`
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={formData.category === category}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span className="text-sm font-medium">{category}</span>
              </label>
            ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className={`flex-1 px-6 py-3 ${getThemeClasses('buttonSecondary')} rounded-lg font-medium transition-colors`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!formData.title.trim()}
            className={`flex-1 px-6 py-3 ${getThemeClasses('button')} rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            Add Task
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTodo;