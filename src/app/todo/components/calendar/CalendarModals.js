import { memo } from 'react';
import moment from 'moment';
import { useTheme } from '../../hooks/useTheme';
import { isOverdue } from '../../utils/dateUtils';
import TodoModal from '../TodoModal';
import AddTodoQuick from '../AddTodoQuick';

/**
 * All calendar-related modals in one component
 */
const CalendarModals = memo(({
  // Todo detail modal
  selectedTodo,
  onCloseTodoModal,
  onUpdate,
  onDelete,
  onToggleComplete,
  
  // Add todo modal
  showAddModal,
  selectedDate,
  onCloseAddModal,
  onAddTodo,
  
  // Date todos modal
  showDateTodos,
  selectedDateTodos,
  onCloseDateTodos,
  onSelectTodo,
  getCategoryColor,
}) => {
  const { getThemeClasses } = useTheme();

  return (
    <>
      {/* Todo Detail Modal */}
      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          onClose={onCloseTodoModal}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      )}

      {/* Add Todo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <AddTodoQuick
              selectedDate={selectedDate}
              onAddTodo={(todoData) => {
                onAddTodo(todoData);
                onCloseAddModal();
              }}
              onCancel={onCloseAddModal}
            />
          </div>
        </div>
      )}

      {/* Date Todos Modal */}
      {showDateTodos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className={`${getThemeClasses("card")} rounded-xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden`}>
            
            {/* Modal Header */}
            <div className={`p-6 border-b ${getThemeClasses("card")}`}>
              <div className="flex items-center justify-between">
                <h3 className={`text-lg font-semibold ${getThemeClasses("text")}`}>
                  Tasks for {selectedDate && moment(selectedDate).format("MMMM D, YYYY")}
                </h3>
                <button
                  onClick={onCloseDateTodos}
                  className={`p-2 ${getThemeClasses("textMuted")} hover:${getThemeClasses("text")} transition-colors`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-96 space-y-3">
              {selectedDateTodos
                .filter((todo) => todo && todo.id)
                .map((todo) => {
                  const color = getCategoryColor(todo.category);
                  return (
                    <div
                      key={todo.id}
                      className={`p-3 rounded-lg border-l-4 ${getThemeClasses("card")} hover:shadow-md transition-shadow cursor-pointer`}
                      style={{ borderLeftColor: color }}
                      onClick={() => {
                        onSelectTodo(todo);
                        onCloseDateTodos();
                      }}
                    >
                      {/* Todo Header */}
                      <div className="flex items-center justify-between">
                        <h4 className={`font-medium ${getThemeClasses("text")} ${todo.completed ? "line-through" : ""}`}>
                          {todo.title}
                        </h4>
                        {todo.completed && (
                          <span className="text-green-500 text-sm">✓</span>
                        )}
                      </div>
                      
                      {/* Todo Description */}
                      {todo.description && (
                        <p className={`text-sm ${getThemeClasses("textMuted")} mt-1 ${todo.completed ? "line-through" : ""}`}>
                          {todo.description}
                        </p>
                      )}
                      
                      {/* Todo Footer */}
                      <div className="flex items-center justify-between mt-2">
                        <span 
                          className="text-xs px-2 py-1 rounded-full text-white" 
                          style={{ backgroundColor: color }}
                        >
                          {todo.category}
                        </span>
                        {isOverdue(todo.dueDate) && !todo.completed && (
                          <span className="text-red-500 text-xs font-medium">Overdue</span>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

CalendarModals.displayName = 'CalendarModals';

export default CalendarModals;