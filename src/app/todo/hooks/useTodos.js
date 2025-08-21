import { useState, useEffect, useCallback } from "react";
import { createTodo, updateTodo } from "../utils/todoUtils";
import { loadFromStorage, saveToStorage } from "../utils/storage";
import { safeFilter, safeMap } from "../utils/safetyUtils";

export const useTodos = () => {
  // Initialize with empty array for SSR compatibility
  const [todos, setTodos] = useState([]);

  // Load from localStorage once on client-side mount
  useEffect(() => {
    const stored = loadFromStorage();
    const loadedTodos = stored.todos || [];

    // Ensure all todos have an order property
    const todosWithOrder = loadedTodos.map((todo, index) => ({
      ...todo,
      order: todo.order !== undefined ? todo.order : index,
    }));

    setTodos(todosWithOrder);
  }, []);

  // Save to localStorage whenever todos change
  useEffect(() => {
    if (typeof window !== "undefined") {
      saveToStorage({ todos });
    }
  }, [todos]);

  // CRUD Operations
  const addTodo = useCallback((todoData) => {
    setTodos((prevTodos) => {
      // Find the minimum order value and subtract 1 to ensure new todo is first
      const minOrder =
        prevTodos.length > 0
          ? Math.min(...prevTodos.map((todo) => todo.order || 0))
          : 0;

      const newTodo = createTodo({
        ...todoData,
        order: minOrder - 1, // Always smaller than existing orders
      });

      return [newTodo, ...prevTodos];
    });
  }, []);

  const updateTodoById = useCallback((id, updates) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? updateTodo(todo, updates) : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id) => {
    setTodos((prevTodos) => safeFilter(prevTodos, (todo) => todo.id !== id));
  }, []);

  const toggleTodoComplete = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? updateTodo(todo, { completed: !todo.completed }) : todo
      )
    );
  }, []);

  const importTodos = useCallback((importedTodos) => {
    if (Array.isArray(importedTodos)) {
      // Validate and sanitize imported todos using safe utilities
      const validTodos = safeMap(
        safeFilter(
          importedTodos,
          (todo) => todo && typeof todo === "object" && todo.title
        ),
        (todo, index) => ({
          ...todo,
          id: todo.id || Date.now() + Math.random(), // Ensure unique ID
          createdAt: todo.createdAt || new Date(),
          completed: Boolean(todo.completed),
          dueDate: todo.dueDate ? new Date(todo.dueDate) : null,
          order: todo.order !== undefined ? todo.order : index, // Assign order based on CSV position
        })
      );

      setTodos(validTodos);
    }
  }, []);

  const reorderTodos = useCallback((newTodos) => {
    const todosWithUpdatedOrder = newTodos.map((todo, index) => ({
      ...todo,
      order: index,
      updatedAt: new Date(),
    }));
    setTodos(todosWithUpdatedOrder);
  }, []);

  const clearAllTodos = useCallback(() => {
    setTodos([]);
  }, []);

  return {
    todos,
    addTodo,
    updateTodo: updateTodoById,
    deleteTodo,
    toggleTodoComplete,
    importTodos,
    reorderTodos,
    clearAllTodos,
  };
};
