# Task Tracker

A simple task management app with a React frontend. The frontend is built and ready — it needs a backend API and database to function.

## Frontend

React + TypeScript + Vite app located in `frontend/`.

### Setup

```bash
cd frontend
npm install
npm run dev    # starts dev server on http://localhost:5173
npm run build  # production build
```

### Features

- Task list with filtering by status (todo, in progress, done)
- Create new tasks with title, description, and priority
- Task detail view with inline status and priority editing
- Delete tasks

### API Contract

The frontend expects a REST API at `http://localhost:3001/api/` (proxied via Vite in dev). The following endpoints are used:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Task Schema

```json
{
  "id": 1,
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | done",
  "priority": "low | medium | high",
  "created_at": "ISO 8601 timestamp",
  "updated_at": "ISO 8601 timestamp"
}
```

#### POST /api/tasks

```json
{
  "title": "string (required)",
  "description": "string",
  "priority": "low | medium | high"
}
```

New tasks should default to `status: "todo"`.

#### PATCH /api/tasks/:id

All fields optional:
```json
{
  "title": "string",
  "description": "string",
  "status": "todo | in_progress | done",
  "priority": "low | medium | high"
}
```

## Backend (not yet implemented)

The backend needs to:
1. Serve the API endpoints listed above
2. Use a database (SQLite recommended) for persistence
3. Run on port 3001
4. Return JSON responses matching the schema above
