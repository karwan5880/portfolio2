// Data model constants and types
export const CATEGORIES = {
  WORK: "Work",
  PERSONAL: "Personal",
  URGENT: "Urgent",
};

export const CATEGORY_COLORS = {
  [CATEGORIES.WORK]: {
    bg: "bg-orange-600",
    border: "border-gray-300",
    text: "text-orange-600",
  },
  [CATEGORIES.PERSONAL]: {
    bg: "bg-emerald-600",
    border: "border-gray-300",
    text: "text-emerald-600",
  },
  [CATEGORIES.URGENT]: {
    bg: "bg-red-600",
    border: "border-gray-300",
    text: "text-red-600",
  },
};

export const FILTER_STATUS = {
  ALL: "all",
  COMPLETED: "completed",
  INCOMPLETE: "incomplete",
};

export const SORT_OPTIONS = {
  DUE_DATE: "dueDate",
  CREATED_AT: "createdAt",
};

export const SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
};

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15, 20];

export const LOCAL_STORAGE_KEY = "advanced-todo-app-data";
