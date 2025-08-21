'use client'

import { useEffect, useState } from 'react'

// Simple, fast todo app - no heavy dependencies
export default function SimpleTodoApp() {
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [filter, setFilter] = useState('all') // all, active, completed

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('simple-todos')
    if (saved) {
      setTodos(JSON.parse(saved))
    }
  }, [])

  // Save to localStorage when todos change
  useEffect(() => {
    localStorage.setItem('simple-todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ])
      setNewTodo('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Simple Todo App</h1>

        {/* Add Todo */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && addTodo()} placeholder="Add a new todo..." className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500" />
            <button onClick={addTodo} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors">
              Add
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-4 mb-6 text-sm">
          <span>Total: {stats.total}</span>
          <span>Active: {stats.active}</span>
          <span>Completed: {stats.completed}</span>
        </div>

        {/* Filters */}
        <div className="flex justify-center gap-2 mb-6">
          {['all', 'active', 'completed'].map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg capitalize transition-colors ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <div key={todo.id} className={`flex items-center gap-3 p-3 bg-gray-800 rounded-lg ${todo.completed ? 'opacity-60' : ''}`}>
              <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo.id)} className="w-5 h-5" />
              <span className={`flex-1 ${todo.completed ? 'line-through' : ''}`}>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)} className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors">
                Delete
              </button>
            </div>
          ))}
        </div>

        {filteredTodos.length === 0 && <div className="text-center text-gray-400 mt-8">{filter === 'all' ? 'No todos yet' : `No ${filter} todos`}</div>}
      </div>
    </div>
  )
}
