// Base
const app = require("./app")
const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server is up on port ${port}...`)
})

app.get("", (req, res) => {
  res.send("<h1 style='text-align: center;'>Task Manager API</h1>")
})
