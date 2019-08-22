// Base
const express = require("express")
require("./db/mongoose")
const app = express()

// Routes
const UserRoutes = require("./routers/user")
const TaskRoutes = require("./routers/task")

app.use(express.json())
app.use(UserRoutes)
app.use(TaskRoutes)

module.exports = app
