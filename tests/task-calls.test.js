const request = require("supertest")
const app = require("../src/app.js")
const Task = require("../src/db/models/task")
const { userId, userOne, configureDB } = require("./fixtures/db")

beforeEach(configureDB)

test("Should create a task for authenticated user", async () => {
  await request(app)
    .post("/task")
    .set("Authorization", `${userOne.tokens[0].token}`)
    .send({
      title: "Task Creation",
      description: "Users can create tasks!",
      complete: null
    })
    .expect(201)
})
