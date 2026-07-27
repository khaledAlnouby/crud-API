const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi=require("./openapi.json");
const Database = require("better-sqlite3");
const { initializeDatabase } = require("./db");


const app = express();
const PORT = 3000;
app.use(express.json());
app.use(    "/docs", swaggerUi.serve,swaggerUi.setup(openapi) );

const db = new Database("tasks.db");

// Create tasks table
db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY,
        title TEXT,
        done Boolean
    )
`);
const count = db
    .prepare("SELECT COUNT(*) AS count FROM tasks")
    .get();


if (count.count === 0) {

    const insert = db.prepare(`
        INSERT INTO tasks (title, done)
        VALUES (?, ?)
    `);

    insert.run("Task 1", 1);
    insert.run("Task 2", 0);
    insert.run("Task 3", 0);
    }

app.get("/", (req,res) => {
    res.send({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

app.get("/tasks", (req,res)=>{
const tasks = db
        .prepare("SELECT * FROM tasks")
        .all();

    res.send(tasks);})

app.get("/tasks/:id", (req, res) => {

    const taskid = parseInt(req.params.id);

    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(taskid);

    if (task) {
        res.send(task);
    } else {
        res.status(404).send({
            error: `Task ${taskid} not found`
        });
    }

});

app.post("/tasks", (req,res)=>{
    const title = req.body.title;
    if(!title ||  title.trim() === ""){
        res.status(400).send("error : Title is required");
    }
     const task = db
        .prepare("insert into tasks (title,done) values (?,?)")
        .run(title, 0);
    
        const newTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(task.lastInsertRowid);

    res.status(201).send(newTask);
})

app.put("/tasks/:id",(req,res)=>{
  const taskid = parseInt(req.params.id);

    const title = req.body.title;
    const done = req.body.done;

    // Validate body
    if (title === undefined || done === undefined) {
        return res.status(400).send({
            error: "Both title and done are required"
        });
    }

    if (typeof title !== "string" || title.trim() === "") {
        return res.status(400).send({
            error: "Title is required"
        });
    }

    if (typeof done !== "boolean") {
        return res.status(400).send({
            error: "Done must be true or false"
        });
    }

    // Check if task exists
    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(taskid);

    if (!task) {
        return res.status(404).send({
            error: `Task ${taskid} not found`
        });
    }

    // Update database
    db.prepare(`
        UPDATE tasks
        SET title = ?, done = ?
        WHERE id = ?
    `).run(title, done ? 1 : 0, taskid);

    // Return updated task
    const updatedTask = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(taskid);

    res.status(200).send(updatedTask);
});

app.delete("/tasks/:id", (req, res) => {
    const taskid = parseInt(req.params.id);

    // Check if task exists
    const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(taskid);

    if (!task) {
        return res.status(404).send({
            error: `Task ${taskid} not found`
        });
    }

    // Delete from database
    db.prepare("DELETE FROM tasks WHERE id = ?")
        .run(taskid);

    // Successful delete
    res.status(204).send();
});

app.get("/health", (req,res) => {
    res.send({ "status": "ok" });
});

app.listen(PORT, async () => {
    try {
        await initializeDatabase();
        console.log(`server is running on ${PORT}`);
    } catch (error) {
        console.error("Database initialization failed:", error);
    }
});
