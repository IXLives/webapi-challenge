const express = require("express")
const cors = require("cors")

const ProjectRouter = require("./projects/project-router")

const server = express()

server.use(express.json())
server.use(cors())

server.get("/", (req, res) => {
    res.send("💀Node Sprint💀")
})

server.use("/api/projects", ProjectRouter)

module.exports = server