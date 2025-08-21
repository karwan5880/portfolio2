import { memo } from 'react';
import AddTodo from './AddTodo';
import TodoModal from './TodoModal';
import Toast from './Toast';

/**
 * Component that renders all app modals and overlays
 */
const AppModals = memo(({
  showAddTodo,
  onCloseAddTodo,
  selectedTodo,
  onCloseSelectedTodo,
  toast,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
  onToggleComplete,
  onHideToast,
  showTaskCreated
}) => {
  return (
    <>
      {/* Add Todo Modal */}
      {showAddTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <AddTodo
              onAddTodo={(todo) => {
                onAddTodo(todo);
                onCloseAddTodo();
                showTaskCreated();
              }}
              onCancel={onCloseAddTodo}
            />
          </div>
        </div>
      )}

      {/* Todo Detail Modal */}
      {selectedTodo && (
        <TodoModal
          todo={selectedTodo}
          onClose={onCloseSelectedTodo}
          onUpdate={onUpdateTodo}
          onDelete={onDeleteTodo}
          onToggleComplete={onToggleComplete}
        />
      )}

      {/* Toast Notifications */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={onHideToast}
      />
    </>
  );
});

AppModals.displayName = 'AppModals';

export default AppModals;