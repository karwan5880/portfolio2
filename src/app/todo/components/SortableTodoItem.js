import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '../hooks/useTheme';
import TodoItem from './TodoItem';

const SortableTodoItem = ({ todo, onUpdate, onDelete, onToggleComplete, onViewTodo, isDragEnabled = true }) => {
  const { getThemeClasses } = useTheme();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: todo.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${getThemeClasses('card')} border p-3 mb-2 ${isDragging ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors p-2 -m-1"
          style={{ touchAction: 'none' }}
          title="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <TodoItem 
            todo={todo} 
            onToggleComplete={onToggleComplete}
            onViewTodo={onViewTodo}
          />
        </div>
      </div>
    </div>
  );
};

export default SortableTodoItem;