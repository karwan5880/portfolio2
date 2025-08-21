import { v4 as uuidv4 } from 'uuid';
import { CATEGORIES } from './constants';

// Create a new todo with default values
export const createTodo = (todoData) => {
  const now = new Date();
  return {
    id: uuidv4(),
    title: todoData.title || '',
    description: todoData.description || '',
    completed: false,
    dueDate: todoData.dueDate || null,
    category: todoData.category || CATEGORIES.PERSONAL,
    createdAt: now,
    updatedAt: now,
    order: todoData.order || Date.now()
  };
};

// Update a todo with new data
export const updateTodo = (existingTodo, updates) => {
  return {
    ...existingTodo,
    ...updates,
    updatedAt: new Date()
  };
};

// Filter todos based on search and filters
export const filterTodos = (todos, filters) => {
  return todos.filter(todo => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        todo.title.toLowerCase().includes(searchLower) ||
        todo.description.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (filters.status === 'completed' && !todo.completed) return false;
    if (filters.status === 'incomplete' && todo.completed) return false;

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(todo.category)) {
      return false;
    }

    return true;
  });
};

// Sort todos based on sort criteria
export const sortTodos = (todos, sortBy, sortOrder) => {
  return [...todos].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate) : new Date(0);
        bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
        break;
      case 'createdAt':
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
      default:
        aValue = a.order;
        bValue = b.order;
    }

    if (sortOrder === 'desc') {
      return bValue > aValue ? 1 : -1;
    }
    return aValue > bValue ? 1 : -1;
  });
};

// Paginate todos
export const paginateTodos = (todos, currentPage, itemsPerPage) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return todos.slice(startIndex, endIndex);
};