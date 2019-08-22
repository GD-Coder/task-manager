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

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is up on port ${port}...`)
})

app.get("", (req, res) => {
  res.send("<h1>Hello!</h1>")
})
