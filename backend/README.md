# Backend API

Node.js + Express + SQLite backend for the Task Tracker.

## Setup

```bash
npm install
npm start
```

The server runs on `http://localhost:3001`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get a single task |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

## Task Schema

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

## Example Requests

### Create a task
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"My task","description":"Details","priority":"high"}'
```

### Update a task
```bash
curl -X PATCH http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

### Delete a task
```bash
curl -X DELETE http://localhost:3001/api/tasks/1
```
