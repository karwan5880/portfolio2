import { useState, useEffect } from 'react';
import MobileDatePicker from './MobileDatePicker';
import '../styles/mobile-datepicker.css';
import { useTheme } from '../hooks/useTheme';
import { formatDate, formatDateForInput, isOverdue, isDueSoon } from '../utils/dateUtils';
import { formatDateToLocalString, parseDateFromLocalString } from '../utils/dateFormatUtils';
import { CATEGORIES, CATEGORY_COLORS } from '../utils/constants';
import { getDueDateStyle, getCategoryColorSafe } from '../utils/styleUtils';
import { safeGet } from '../utils/safetyUtils';

const TodoModal = ({ todo, onClose, onUpdate, onDelete, onToggleComplete }) => {
  const { getThemeClasses } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [localTodo, setLocalTodo] = useState(todo);
  const [formData, setFormData] = useState({
    title: todo.title,
    description: todo.description || '',
    dueDate: todo.dueDate ? formatDateForInput(todo.dueDate) : '',
    category: todo.category
  });

  // Update local todo when the prop changes
  useEffect(() => {
    setLocalTodo(todo);
  }, [todo]);

  const handleToggleComplete = () => {
    // Update local state immediately for instant UI feedback
    setLocalTodo(prev => ({ ...prev, completed: !prev.completed }));
    // Call the parent handler
    onToggleComplete(todo.id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    
    const updates = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      dueDate: formData.dueDate ? new Date(formData.dueDate) : null,
      category: formData.category
    };
    
    onUpdate(todo.id, updates);
    setIsEditing(false);
    // Update local todo state to reflect changes immediately
    setLocalTodo(prev => ({ ...prev, ...updates }));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(todo.id);
      onClose();
    }
  };

  const dueDateStyle = getDueDateStyle(localTodo.dueDate, localTodo.completed, getThemeClasses);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${getThemeClasses('card')} border rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className={`text-xl font-bold ${getThemeClasses('text')}`}>Task Details</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${getThemeClasses('buttonSecondary')} hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {isEditing ? (
            /* Edit Mode */
            <>
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('text')} mb-2`}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 ${getThemeClasses('input')} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('text')} mb-2`}>
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 ${getThemeClasses('input')} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('text')} mb-2`}>
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

                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('text')} mb-2`}>
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 ${getThemeClasses('input')} border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    {Object.values(CATEGORIES).map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          ) : (
            /* View Mode */
            <>
              <div>
                <div className="flex items-center gap-3">
                  <h3 className={`text-lg font-semibold ${getThemeClasses('text')}`}>
                    {localTodo.title}
                  </h3>
                  {localTodo.completed && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      ✨ Done
                    </span>
                  )}
                </div>
              </div>

              {localTodo.description && (
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('textSecondary')} mb-1`}>
                    Description
                  </label>
                  <p className={getThemeClasses('textSecondary')}>
                    {localTodo.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('textSecondary')} mb-1`}>
                    Category
                  </label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${getCategoryColorSafe(localTodo.category, CATEGORY_COLORS).bg}`}>
                    {localTodo.category}
                  </span>
                </div>

                {localTodo.dueDate && (
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary')} mb-1`}>
                      Due Date
                    </label>
                    <span className={`text-sm ${dueDateStyle}`}>
                      {formatDate(localTodo.dueDate)}
                      {isOverdue(localTodo.dueDate) && !localTodo.completed && ' (Overdue)'}
                      {isDueSoon(localTodo.dueDate) && !localTodo.completed && ' (Due Soon)'}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary')} mb-1`}>
                  Status
                </label>
                <button
                  onClick={handleToggleComplete}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    localTodo.completed
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : `${getThemeClasses('buttonSecondary')} hover:bg-green-500 hover:text-white`
                  }`}
                >
                  {localTodo.completed ? '✓ Completed' : 'Mark Complete'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className={`flex-1 px-4 py-2 ${getThemeClasses('buttonSecondary')} rounded-lg font-medium transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.title.trim()}
                className={`flex-1 px-4 py-2 ${getThemeClasses('button')} rounded-lg font-medium transition-colors disabled:opacity-50`}
              >
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-2 ${getThemeClasses('buttonSecondary')} rounded-lg font-medium transition-colors`}
              >
                Close
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className={`px-4 py-2 ${getThemeClasses('button')} rounded-lg font-medium transition-colors`}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoModal;