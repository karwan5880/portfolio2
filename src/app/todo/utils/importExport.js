import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import { createTodo } from './todoUtils';
import { CATEGORIES } from './constants';

// Validate and normalize imported todo data
const validateTodoData = (row, rowIndex) => {
  const errors = [];
  const warnings = [];

  // Required fields
  if (!row.title || typeof row.title !== 'string' || !row.title.trim()) {
    errors.push(`Row ${rowIndex + 1}: Title is required`);
  }

  // Validate category
  if (row.category && !Object.values(CATEGORIES).includes(row.category)) {
    warnings.push(`Row ${rowIndex + 1}: Invalid category "${row.category}", defaulting to Personal`);
    row.category = CATEGORIES.PERSONAL;
  }

  // Validate due date
  if (row.dueDate) {
    const date = new Date(row.dueDate);
    if (isNaN(date.getTime())) {
      warnings.push(`Row ${rowIndex + 1}: Invalid due date "${row.dueDate}", ignoring`);
      row.dueDate = null;
    } else {
      row.dueDate = date;
    }
  }

  // Validate completed status
  if (row.completed !== undefined) {
    if (typeof row.completed === 'string') {
      row.completed = row.completed.toLowerCase() === 'true' || row.completed === '1';
    } else {
      row.completed = Boolean(row.completed);
    }
  }

  return { errors, warnings, data: row };
};

// Parse CSV file
export const parseCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => {
        // Normalize header names
        const headerMap = {
          'title': 'title',
          'task': 'title',
          'name': 'title',
          'description': 'description',
          'desc': 'description',
          'details': 'description',
          'due date': 'dueDate',
          'duedate': 'dueDate',
          'due': 'dueDate',
          'date': 'dueDate',
          'category': 'category',
          'type': 'category',
          'completed': 'completed',
          'done': 'completed',
          'status': 'completed'
        };
        return headerMap[header.toLowerCase()] || header;
      },
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          return;
        }
        resolve(results.data);
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      }
    });
  });
};

// Parse Excel file
export const parseExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with header row
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: ''
        });
        
        if (jsonData.length < 2) {
          reject(new Error('Excel file must contain at least a header row and one data row'));
          return;
        }
        
        // Get headers and normalize them
        const headers = jsonData[0].map(header => {
          const headerMap = {
            'title': 'title',
            'task': 'title',
            'name': 'title',
            'description': 'description',
            'desc': 'description',
            'details': 'description',
            'due date': 'dueDate',
            'duedate': 'dueDate',
            'due': 'dueDate',
            'date': 'dueDate',
            'category': 'category',
            'type': 'category',
            'completed': 'completed',
            'done': 'completed',
            'status': 'completed'
          };
          return headerMap[header.toLowerCase()] || header;
        });
        
        // Convert rows to objects
        const rows = jsonData.slice(1).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index] || '';
          });
          return obj;
        });
        
        resolve(rows);
      } catch (error) {
        reject(new Error(`Failed to parse Excel file: ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read Excel file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// Process imported data
export const processImportData = async (file) => {
  const fileExtension = file.name.split('.').pop().toLowerCase();
  let rawData;
  
  try {
    if (fileExtension === 'csv') {
      rawData = await parseCSV(file);
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      rawData = await parseExcel(file);
    } else {
      throw new Error('Unsupported file format. Please use CSV or Excel files.');
    }
    
    const results = {
      valid: [],
      invalid: [],
      warnings: []
    };
    
    rawData.forEach((row, index) => {
      const validation = validateTodoData(row, index);
      
      if (validation.errors.length > 0) {
        results.invalid.push({
          row: index + 1,
          data: row,
          errors: validation.errors
        });
      } else {
        // Create todo object with validated data
        const todoData = {
          title: validation.data.title.trim(),
          description: validation.data.description ? validation.data.description.trim() : '',
          dueDate: validation.data.dueDate || null,
          category: validation.data.category || CATEGORIES.PERSONAL,
          completed: validation.data.completed || false
        };
        
        results.valid.push(createTodo(todoData));
      }
      
      if (validation.warnings.length > 0) {
        results.warnings.push(...validation.warnings);
      }
    });
    
    return results;
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
};

// Export todos to Excel
export const exportToExcel = (todos, filename = 'todos') => {
  try {
    // Prepare data for export
    const exportData = todos.map(todo => ({
      'Title': todo.title,
      'Description': todo.description,
      'Category': todo.category,
      'Due Date': todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : '',
      'Completed': todo.completed ? 'Yes' : 'No',
      'Created Date': new Date(todo.createdAt).toLocaleDateString(),
      'Updated Date': new Date(todo.updatedAt).toLocaleDateString()
    }));
    
    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    
    // Set column widths
    const columnWidths = [
      { wch: 30 }, // Title
      { wch: 50 }, // Description
      { wch: 12 }, // Category
      { wch: 12 }, // Due Date
      { wch: 10 }, // Completed
      { wch: 12 }, // Created Date
      { wch: 12 }  // Updated Date
    ];
    worksheet['!cols'] = columnWidths;
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Todos');
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Download file
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `${filename}_${timestamp}.xlsx`);
    
    return true;
  } catch (error) {
    throw new Error(`Export failed: ${error.message}`);
  }
};

// Create sample CSV template
export const downloadSampleTemplate = () => {
  const sampleData = [
    {
      'Title': 'Complete project proposal',
      'Description': 'Finish the Q1 project proposal document',
      'Category': 'Work',
      'Due Date': '2025-02-15',
      'Completed': 'No'
    },
    {
      'Title': 'Buy groceries',
      'Description': 'Milk, bread, eggs, and vegetables',
      'Category': 'Personal',
      'Due Date': '2025-02-10',
      'Completed': 'No'
    },
    {
      'Title': 'Fix critical bug',
      'Description': 'Address the login issue reported by users',
      'Category': 'Urgent',
      'Due Date': '2025-02-08',
      'Completed': 'Yes'
    }
  ];
  
  const csv = Papa.unparse(sampleData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'todo_template.csv');
};