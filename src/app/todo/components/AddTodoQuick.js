import { useState } from "react";
import { CATEGORIES } from "../utils/constants";
import { useTheme } from "../hooks/useTheme";

const AddTodoQuick = ({ selectedDate, onAddTodo, onCancel }) => {
  const { getThemeClasses } = useTheme();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: selectedDate ? selectedDate.toISOString().split('T')[0] : "",
    category: CATEGORIES.PERSONAL,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    onAddTodo({
      ...formData,
      dueDate: formData.dueDate || null
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`${getThemeClasses('card')} w-full max-w-md rounded-lg shadow-xl`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${getThemeClasses('text')}`}>
              Quick Add Task
            </h2>
            <button
              onClick={onCancel}
              className={`${getThemeClasses('textMuted')} hover:${getThemeClasses('text')} transition-colors`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedDate && (
            <div className={`text-sm ${getThemeClasses('textMuted')} mb-4 p-2 rounded ${getThemeClasses('cardSecondary')}`}>
              📅 Due: {formatDate(selectedDate)}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className={`${getThemeClasses('input')} w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                autoFocus
              />
            </div>

            <div>
              <textarea
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className={`${getThemeClasses('input')} w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
                rows={2}
              />
            </div>

            <div>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className={`${getThemeClasses('input')} w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value={CATEGORIES.PERSONAL}>Personal</option>
                <option value={CATEGORIES.WORK}>Work</option>
                <option value={CATEGORIES.URGENT}>Urgent</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onCancel}
                className={`${getThemeClasses('buttonSecondary')} flex-1 px-4 py-2 rounded-lg transition-colors`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!formData.title.trim()}
                className={`${getThemeClasses('button')} flex-1 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTodoQuick;