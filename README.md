# Task API

A simple REST API built using **Node.js** and **Express.js** for managing tasks.

The API supports full CRUD operations:

- **Create** new tasks
- **Read** tasks
- **Update** existing tasks
- **Delete** tasks

The project uses an **in-memory array** as a temporary data store and includes **Swagger UI** documentation for testing all endpoints directly from the browser.

---

# Installation and Running

## 1. Install dependencies

Run:

```bash
npm install
```

This installs all required packages, including:

- Express.js
- Swagger UI Express

---

## 2. Start the server

Run:

```bash
node server.js
```

The server will start on:

```
http://localhost:3000
```

Swagger documentation is available at:

```
http://localhost:3000/docs
```

---

# API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a specific task by ID |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

---

# Task Object Structure

Each task has the following format:

```json
{
  "id": 1,
  "title": "Learn Express.js",
  "done": false
}
```

---

# API Examples

## 1. Get All Tasks

Request:

```bash
curl -i http://localhost:3000/tasks
```

Example response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
[
  {
    "id": 1,
    "title": "Task 1",
    "done": false
  },
  {
    "id": 2,
    "title": "Task 2",
    "done": true
  }
]
```

---

## 2. Create a New Task

Request:

```bash
curl -i -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Buy milk"}'
```

Response:

```http
HTTP/1.1 201 Created
Content-Type: application/json
```

```json
{
  "id": 4,
  "title": "Buy milk",
  "done": false
}
```

---

## 3. Update a Task

Request:

```bash
curl -i -X PUT http://localhost:3000/tasks/2 \
-H "Content-Type: application/json" \
-d '{"title":"Study Node.js","done":true}'
```

Response:

```json
{
  "id": 2,
  "title": "Study Node.js",
  "done": true
}
```

---

## 4. Delete a Task

Request:

```bash
curl -i -X DELETE http://localhost:3000/tasks/2
```

Response:

```json
{
  "message": "Task deleted successfully"
}
```

---

# Swagger UI Documentation

Swagger UI provides interactive documentation for the API.

It allows testing endpoints using the **Try it out** button without using curl or Postman.

Open:

```
http://localhost:3000/docs
```



---

# Project Structure

```
crud API/
│
├── server.js              # Express server and API routes
├── openapi.json           # Swagger/OpenAPI documentation
├── README.md              # Project documentation
├── swagger-screenshot.png # Swagger UI screenshot
├── package.json
└── package-lock.json
```

---

# Technologies Used

- Node.js
- Express.js
- Swagger UI Express
- OpenAPI 3.0

---
