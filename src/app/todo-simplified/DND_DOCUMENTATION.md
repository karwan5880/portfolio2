# Drag and Drop Documentation

## 🎯 Critical Rules for Working DnD

### ✅ WHAT WORKS

1. **SortableContext items MUST match rendered items**

   ```javascript
   // ✅ CORRECT
   <SortableContext items={paginatedTodos.map(todo => todo.id)}>
     {paginatedTodos.map(todo => <SortableItem key={todo.id} id={todo.id} ... />)}
   </SortableContext>
   ```

2. **Simple drag handler logic**

   ```javascript
   // ✅ CORRECT - Find actual positions in main array
   const actualOldIndex = allTodos.findIndex((todo) => todo.id === active.id)
   const actualNewIndex = allTodos.findIndex((todo) => todo.id === over.id)
   ```

3. **One-time sorting operations**
   ```javascript
   // ✅ CORRECT - Sort modifies the base array once
   const sortTodos = (sortBy, order) => {
     const sorted = [...allTodos].sort(/* sorting logic */)
     setAllTodos(sorted)
   }
   ```

### ❌ WHAT BREAKS DnD

1. **Array mismatch between SortableContext and rendered items**

   ```javascript
   // ❌ WRONG - Different arrays!
   <SortableContext items={allTodos.map(todo => todo.id)}>
     {paginatedTodos.map(todo => <SortableItem ... />)}
   </SortableContext>
   ```

2. **Persistent sorting state that conflicts with drag**

   ```javascript
   // ❌ WRONG - Sorting state conflicts with drag positions
   const filteredTodos = allTodos.filter(...).sort(...)
   // Then trying to drag within this sorted view breaks position mapping
   ```

3. **Complex drag handlers that lose track of positions**
   ```javascript
   // ❌ WRONG - Too complex, loses position mapping
   const handleDragEnd = (event) => {
     // Complex logic that tries to map between multiple arrays
     // Often fails when pagination/filtering is involved
   }
   ```

## 🔧 Current Working Implementation

### Architecture

- **Base Array**: `allTodos` - The source of truth
- **Display Array**: `paginatedTodos` - What user sees (filtered + paginated)
- **Drag Context**: Uses `paginatedTodos` IDs only
- **Drag Handler**: Maps back to `allTodos` positions

### Key Components

1. **SortableContext Setup**

   ```javascript
   <SortableContext items={paginatedTodos.map(todo => todo.id)}>
   ```

2. **Drag Handler**

   ```javascript
   function handleDragEnd(event) {
     const { active, over } = event
     if (!over || active.id === over.id) return

     // Find actual indices in allTodos
     const actualOldIndex = allTodos.findIndex((todo) => todo.id === active.id)
     const actualNewIndex = allTodos.findIndex((todo) => todo.id === over.id)

     // Simple reorder
     const result = [...allTodos]
     const [removed] = result.splice(actualOldIndex, 1)
     result.splice(actualNewIndex, 0, removed)
     setAllTodos(result)
   }
   ```

3. **One-Time Sorting**
   ```javascript
   const sortTodos = (sortBy, sortOrder) => {
     const sorted = [...allTodos].sort(/* logic */)
     setAllTodos(sorted) // Modifies base array once
   }
   ```

## 🚨 Common Pitfalls

### 1. The Array Mismatch Trap

- **Problem**: SortableContext has different items than what's rendered
- **Solution**: Always use the same array for both
- **Example**: If showing `paginatedTodos`, use `paginatedTodos.map(t => t.id)` for SortableContext

### 2. The Persistent Sort Trap

- **Problem**: Sorting in render creates moving targets for drag
- **Solution**: Sort the base array once, then drag works on current order
- **Example**: Use sort buttons that modify `allTodos`, not computed sorting

### 3. The Complex Handler Trap

- **Problem**: Trying to handle all edge cases in drag handler
- **Solution**: Keep drag handler simple, map to base array positions
- **Example**: Always find positions in `allTodos`, not in filtered arrays

## 🎯 Testing Checklist

Before adding new features, test:

1. **Basic drag**: Can you drag items up and down?
2. **Pagination drag**: Does drag work across different pages?
3. **Filter + drag**: Does drag work when items are filtered?
4. **Sort + drag**: After sorting, does drag still work?
5. **Edge cases**: First item, last item, single item

## 🔮 Future Considerations

### Safe to Add:

- ✅ More filtering options (they don't affect drag)
- ✅ More one-time sorting options
- ✅ Bulk operations (they modify base array)
- ✅ Visual enhancements to drag handles

### Dangerous to Add:

- ❌ Real-time sorting (creates moving targets)
- ❌ Complex nested drag contexts
- ❌ Drag between different filtered views
- ❌ Conditional drag enabling/disabling

## 📝 Maintenance Notes

- **Always test drag after any array manipulation changes**
- **Keep the drag handler as simple as possible**
- **Document any new array operations and their impact on drag**
- **When in doubt, test with pagination + filtering + drag together**

---

_Last Updated: January 2025_ _Working Implementation: One-time sorting + Always-enabled drag_
