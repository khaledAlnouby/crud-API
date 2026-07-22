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

app.post("/tasks", (req,res)=>{
    const title = req.body.title;
    if(!title ||  title.trim() === ""){
        res.status(400).send("error : Title is required");
    }
    tasks.push(
        {
            id : tasks.length +1 , 
            title : title,
            done : "FALSE"
        }
    )
    res.status(201).send({
        "nessage " : "Task created successfully"
    })
})

app.get("/health", (req,res) => {
    res.send({ "status": "ok" });
});

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
