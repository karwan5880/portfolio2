import { memo } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import SortableTodoItem from "./SortableTodoItem";

const DraggableTodoList = memo(
  ({
    todos,
    onUpdate,
    onDelete,
    onToggleComplete,
    onReorder,
    onViewTodo,
    isDragEnabled = true,
  }) => {
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      }),
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 200,
          tolerance: 5,
        },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const handleDragEnd = (event) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const oldIndex = todos.findIndex((todo) => todo.id === active.id);
        const newIndex = todos.findIndex((todo) => todo.id === over.id);
        const newTodos = arrayMove(todos, oldIndex, newIndex);
        onReorder(newTodos);
      }
    };

    if (todos.length === 0) {
      return <div>No todos</div>;
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext
          items={todos.map((todo) => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          <div>
            {todos.map((todo) => (
              <SortableTodoItem
                key={todo.id}
                todo={todo}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
                onViewTodo={onViewTodo}
                isDragEnabled={isDragEnabled}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }
);

DraggableTodoList.displayName = "DraggableTodoList";

export default DraggableTodoList;
