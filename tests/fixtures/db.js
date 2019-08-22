const token = require("jsonwebtoken")
const mongoose = require("mongoose")
const Task = require("../../src/db/models/task")
const User = require("../../src/db/models/user")

const userId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userId,
  name: "Jimmy Tester",
  email: "jimmy@tester.com",
  password: "test1234",
  tokens: [
    {
      token: token.sign({ _id: userId }, process.env.WEB_TOKEN_SECRET)
    }
  ]
}

const configureDB = async () => {
  await User.deleteMany()
  await Task.deleteMany()
  await new User(userOne).save()
  for (let i = 0; i < 10; i++) {
    let task = {}
    task.title = `Test Task ${i}`
    task.description = `This is task ${i}`
    task.complete = i > 5
    task.owner = userId
    await new Task(task).save()
  }
}

module.exports = {
  userId,
  userOne,
  configureDB
}
