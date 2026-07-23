const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openapi=require("./openapi.json");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(    "/docs", swaggerUi.serve,swaggerUi.setup(openapi) );


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
        "message" : "Task created successfully"
    })
})

app.put("/tasks/:id",(req,res)=>{
    const taskid = parseInt(req.params.id); 
    const task = tasks.find(t => t.id === taskid);
    if(!task){
        res.status(404).send({ "error": `Task ${taskid} not found` });
    } 
        const title = req.body.title;
        const done = req.body.done;
        if (title === undefined && done === undefined) {
            res.status(400).send({ "error": "At least one of title or done is required" });
            return;
        }
        if(title && title.trim() !== ""){
            task.title = title;
        }
        else {
            res.status(400).send({ "error": "Title is required" });
            return;
        }
        if (done !== undefined) {
            if (typeof done !== "boolean") {
        return res.status(400).send({
            error: "Done must be true or false."
        });
    }
}
res.send(task);
})

app.delete("/tasks/:id", (req,res)=>{
    const taskid = parseInt(req.params.id); 
    const taskIndex = tasks.findIndex(t => t.id === taskid);
    if(taskIndex === -1){
    return res.status(404).send({ "error": `Task ${taskid} not found` });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();    
});

app.get("/health", (req,res) => {
    res.send({ "status": "ok" });
});

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
});
