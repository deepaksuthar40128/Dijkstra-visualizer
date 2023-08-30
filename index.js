const express = require("express");
const path = require("path");
const os = require("os");

var bodyParser = require('body-parser');
const { Worker, isMainThread, parentPort } = require('worker_threads');


const app = express();
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 50000 }))
app.use(express.static(path.join(__dirname, 'static')));
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/a.html');
})
app.get("/cpus", (req, res) => {
    res.send(os.cpus());
})
app.post("/solver", async (req, res) => {
    if (isMainThread) {
        const worker = new Worker(__dirname + '/worker.js');
        worker.postMessage(req.body);
        worker.on("message", (msg) => {
            res.send(msg);
        })
    }
})

app.listen(80);