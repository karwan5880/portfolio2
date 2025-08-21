import { useTheme } from '../hooks/useTheme';
import { formatDate, isOverdue, isDueSoon } from '../utils/dateUtils';
import { CATEGORY_COLORS } from '../utils/constants';
import { getDueDateStyle, getCategoryColorSafe } from '../utils/styleUtils';

const TodoItem = ({ todo, onToggleComplete, onViewTodo }) => {
  const { getThemeClasses } = useTheme();

  const handleContentClick = () => {
    onViewTodo(todo);
  };

  const handleCheckmarkClick = (e) => {
    e.stopPropagation();
    onToggleComplete(todo.id);
  };

  const dueDateStyle = getDueDateStyle(todo.dueDate, todo.completed, getThemeClasses);

  return (
    <div className="flex items-center gap-3">
      {/* Main content - clickable to view */}
      <div 
        onClick={handleContentClick}
        className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors p-2 -m-2 rounded overflow-hidden"
      >
        <div className="flex items-center gap-2 min-w-0">
          <h3 className={`font-medium truncate flex-1 ${getThemeClasses('text')}`}>
            {todo.title}
          </h3>
          
          {/* Completed tag */}
          {todo.completed && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex-shrink-0">
              ✨ Done
            </span>
          )}
          
          {/* Category badge */}
          <span className={`inline-block w-2 h-2 rounded-full ${getCategoryColorSafe(todo.category, CATEGORY_COLORS).bg} flex-shrink-0`}></span>
          
          {/* Due date or flexible label */}
          {!todo.completed && (
            <span className={`text-xs flex-shrink-0 whitespace-nowrap ${
              todo.dueDate ? dueDateStyle : 'text-gray-400 dark:text-gray-500'
            }`}>
              {todo.dueDate ? (
                <>
                  {formatDate(todo.dueDate)}
                  {isOverdue(todo.dueDate) && ' (Overdue)'}
                  {isDueSoon(todo.dueDate) && ' (Due Soon)'}
                </>
              ) : (
                'Flexible'
              )}
            </span>
          )}
        </div>
      </div>
      
      {/* Completion status icon - clickable to toggle */}
      <div 
        onClick={handleCheckmarkClick}
        className="flex-shrink-0 cursor-pointer p-1 -m-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {todo.completed ? (
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ) : (
          <div className="w-5 h-5 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-green-400 transition-colors">
            <svg className="w-3 h-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoItem;