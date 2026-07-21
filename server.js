const express = require("express");

const app = express();
const PORT = 3000;
app.use(express.json());


const tasks = [
    { id: 1, title: "Task 1", done: "TRUE " },
    { id: 2, title: "Task 2", done: "FALSE" },
    { id: 3, title: "Task 3", done: "FALSE" }
];

app.get("/", (req,res) => {
    res.send({ "name": "Task API", "version": "1.0", "endpoints": ["/tasks"] });
});

app.get("/tasks", (req,res)=>{
    res.send (tasks);
})

app.get("/tasks/:id", (req,res)=>{{
    const taskid = parseInt(req.params.id); 
    const task = tasks.find(t => t.id === taskid);
    if (task) {
        res.send(task);
    } else {
        res.status(404).send({ "error": `Task ${taskid} not found` });
    }
}})

app.get("/health", (req,res) => {
    res.send({ "status": "ok" });
});

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
