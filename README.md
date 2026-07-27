# Task API

A simple REST API built using **Node.js**, **Express.js**, and **PostgreSQL** for managing tasks.

The API supports full CRUD operations:

* **Create** new tasks
* **Read** tasks
* **Update** existing tasks
* **Delete** tasks

The project uses **PostgreSQL** as the database. PostgreSQL runs inside a **Docker container**, allowing the database to run as a separate service while keeping its data persistent using a Docker volume.

---

# Installation and Running

## 1. Install dependencies

Run:

```bash
npm install
```

This installs all required Node.js packages.

## 2. Start PostgreSQL with Docker

Make sure Docker Desktop is running, then run:

```bash
docker run --name taskdb -e POSTGRES_PASSWORD=dev -e POSTGRES_DB=tasks -p 5432:5432 -v taskdata:/var/lib/postgresql/data -d postgres:17
```

This command:

* Runs PostgreSQL 17
* Creates a container named `taskdb`
* Creates a PostgreSQL database named `tasks`
* Sets the PostgreSQL password to `dev`
* Maps PostgreSQL to port `5432`
* Creates a persistent Docker volume named `taskdata`

Check that the container is running:

```bash
docker ps
```

## 3. Start the API

Run:

```bash
npm start
```

The server will start on:

```text
http://localhost:3000
```

Swagger documentation is available at:

```text
http://localhost:3000/docs
```

---

# PostgreSQL Database

Unlike SQLite, PostgreSQL runs as a separate database server.

The PostgreSQL server is running inside Docker:

```text
Docker Container
     │
     ├── Name: taskdb
     ├── Database: tasks
     ├── User: postgres
     ├── Password: dev
     └── Port: 5432
```

The database can be accessed from the terminal using:

```bash
docker exec -it taskdb psql -U postgres -d tasks
```

Once connected, the PostgreSQL prompt appears:

```text
tasks=#
```

At Stage 0, running:

```sql
\dt
```

returns:

```text
Did not find any relations.
```

This is expected because the tables are created in a later stage.

---

# Why PostgreSQL?

PostgreSQL was chosen because it is a full relational database server that is suitable for real backend applications.

Using Docker makes PostgreSQL easier to install and run without manually installing and configuring the database server on the host machine.

The Docker volume:

```text
taskdata
```

keeps PostgreSQL's data persistent, so the data survives when the PostgreSQL container is stopped and started again.

---

# Docker Volume

The database uses a named Docker volume:

```text
taskdata
```

The volume is mounted at:

```text
/var/lib/postgresql/data
```

This means the database data is stored outside the container itself.

The container can therefore be stopped or recreated without automatically losing the database data.

---



The `.gitignore` file contains:

```gitignore
node_modules/
.env
```



---

# API Endpoints

| Method | Endpoint     | Description               |
| ------ | ------------ | ------------------------- |
| GET    | `/tasks`     | Get all tasks             |
| GET    | `/tasks/:id` | Get a specific task by ID |
| POST   | `/tasks`     | Create a new task         |
| PUT    | `/tasks/:id` | Update an existing task   |
| DELETE | `/tasks/:id` | Delete a task             |
| GET    | `/health`    | Check API health          |

---

# Task Object Structure

A task has the following structure:

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
    "done": false
  },
  {
    "id": 3,
    "title": "Task 3",
    "done": false
  }
]
```

---

## 2. Get a Task by ID

Request:

```bash
curl -i http://localhost:3000/tasks/1
```

Example response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": 1,
  "title": "Task 1",
  "done": false
}
```

If the task does not exist, the API returns:

```http
HTTP/1.1 404 Not Found
```

---

## 3. Create a New Task

Request:

```bash
curl -i -X POST http://localhost:3000/tasks \
-H "Content-Type: application/json" \
-d '{"title":"Buy milk"}'
```

Example response:

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

The ID is assigned automatically by PostgreSQL.

---

## 4. Update a Task

Request:

```bash
curl -i -X PUT http://localhost:3000/tasks/2 \
-H "Content-Type: application/json" \
-d '{"title":"Study Node.js","done":true}'
```

Example response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "id": 2,
  "title": "Study Node.js",
  "done": true
}
```

---

## 5. Delete a Task

Request:

```bash
curl -i -X DELETE http://localhost:3000/tasks/2
```

Successful response:

```http
HTTP/1.1 204 No Content
```

The response has an empty body.

---

## 6. Health Check

Request:

```bash
curl -i http://localhost:3000/health
```

Response:

```json
{
  "status": "ok"
}
```

---

# PostgreSQL Command-Line Access

PostgreSQL can be opened directly from the Docker container using:

```bash
docker exec -it taskdb psql -U postgres -d tasks
```

Inside `psql`, the following command lists all database tables:

```sql
\dt
```

To exit:

```sql
\q
```

---

# Swagger UI Documentation

Swagger UI provides interactive documentation for the API.

It allows the API endpoints to be tested directly from the browser using the **Try it out** button.

Open:

```text
http://localhost:3000/docs
```

![Swagger UI](swagger-screenshot.png)

---

# Project Structure

```text
crud API/
│
├── server.js
├── openapi.json
├── README.md
├── swagger-screenshot.png
├── .gitignore
├── package.json
└── package-lock.json
```

The `.gitignore` file contains:

```gitignore
node_modules/
.env
```

---

# Docker Setup

The PostgreSQL container can be checked with:

```bash
docker ps
```

The PostgreSQL database can be accessed with:

```bash
docker exec -it taskdb psql -U postgres -d tasks
```

The database runs on:

```text
Host: localhost
Port: 5432
Database: tasks
Username: postgres
```

---

# Technologies Used

* Node.js
* Express.js
* PostgreSQL
* Docker
* better-sqlite3 (previous SQLite stage)
* Swagger UI Express
* OpenAPI 3.0

---

# Stage 0 Checkpoint

The Stage 0 PostgreSQL setup was completed successfully.

The following command opens the PostgreSQL database:

```bash
docker exec -it taskdb psql -U postgres -d tasks
```

Running:

```sql
\dt
```

returns:

```text
Did not find any relations.
```

This is expected at this stage because no tables have been created yet.

The PostgreSQL container is running on:

```text
localhost:5432
```

The Docker volume `taskdata` provides persistent database storage.
