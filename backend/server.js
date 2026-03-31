const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173']
}));
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'tasks.db');
const db = new Database(dbPath);

// Create tasks table
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    status TEXT DEFAULT 'todo' CHECK(status IN ('todo', 'in_progress', 'done')),
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  )
`);

// Helper to get ISO timestamp
function nowISO() {
  return new Date().toISOString();
}

// GET /api/tasks - Return all tasks
app.get('/api/tasks', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks ORDER BY id ASC').all();
  res.json({ tasks });
});

// GET /api/tasks/:id - Return single task
app.get('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, description, priority } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const status = 'todo';
  const created_at = nowISO();
  const updated_at = nowISO();
  
  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, status, priority, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    title.trim(),
    description?.trim() || '',
    status,
    priority || 'medium',
    created_at,
    updated_at
  );
  
  const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(newTask);
});

// PATCH /api/tasks/:id - Update a task
app.patch('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority } = req.body;
  
  // Check if task exists
  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!existing) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  // Build update query dynamically
  const updates = [];
  const values = [];
  
  if (title !== undefined) {
    updates.push('title = ?');
    values.push(title.trim());
  }
  if (description !== undefined) {
    updates.push('description = ?');
    values.push(description.trim());
  }
  if (status !== undefined) {
    updates.push('status = ?');
    values.push(status);
  }
  if (priority !== undefined) {
    updates.push('priority = ?');
    values.push(priority);
  }
  
  if (updates.length > 0) {
    updates.push('updated_at = ?');
    values.push(nowISO());
    values.push(id);
    
    db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
  }
  
  const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  res.json(updatedTask);
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
  res.status(204).send();
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Database: ${dbPath}`);
});
