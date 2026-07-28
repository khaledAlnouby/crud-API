const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi=require("./openapi.json");
const { pool , initializeDatabase } = require("./db");


const app = express();
const PORT = 3000;
app.use(express.json());
app.use(    "/docs", swaggerUi.serve,swaggerUi.setup(openapi) );


app.get("/", (req,res) => {
    res.send({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

app.get("/tasks", async (req,res)=>{
    try{
    const result = await pool.query("SELECT * FROM tasks");
        res.status(200).send(result.rows);
    }
    catch(error){
        console.error( error);
        res.status(500).send({error: "Database error"

        });
    }

})

app.get("/tasks/:id", async (req, res) => {
    try{
    const taskid = parseInt(req.params.id);
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1",[taskid]); 

    if (result.rows.length === 0) {
            return res.status(404).send({
                error: "Task not found"
            });
        }
           res.status(200).send(result.rows[0]);
    }catch(error){
        console.error(error);
        res.status(500).send({error: "Database error"});
    }

});

app.post("/tasks",async (req,res)=>{
    try{
 const title = req.body.title;
    if(!title ||  title.trim() === ""){
        res.status(400).send("error : Title is required");
    }
        const result = await pool.query("INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING *",[title, false]); 

    res.status(201).send(result.rows[0]);
    }
   catch(error){
    console.error(error);
    res.status(500).send({error: "Database error"});
   }
});

app.put("/tasks/:id",async (req,res)=>{
    try{
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
    const check = await pool.query("SELECT * FROM tasks WHERE id = $1",[taskid]); 
    if (check.rows.length === 0) {
        return res.status(404).send({
            error: `Task ${taskid} not found`
        });
    }

    // Update database
    const result = await pool.query("UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *",[title,done,taskid ]); 
    res.status(200).send(result.rows[0]);
}catch(error){
    console.error(error);
    res.status(500).send({error: "Database error"});
}
});

app.delete("/tasks/:id",async (req, res) => {
    try{
    const taskid = parseInt(req.params.id);

    // Check if task exists
    const check = await pool.query("SELECT * FROM tasks WHERE id = $1",[taskid]); 
    if (check.rows.length === 0) {
        return res.status(404).send({
            error: `Task ${taskid} not found`
        });
    }

    // Delete from database
    const result = await pool.query("DELETE FROM tasks WHERE id = $1",[taskid]);
    // Successful delete
    res.status(204).send();
}catch(error){
    console.error(error);
    res.status(500).send({error: "Database error"});}
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
