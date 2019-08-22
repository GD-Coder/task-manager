const express = require("express")
const router = new express.Router()
const Task = require("../db/models/task")
const auth = require("../middleware/auth")

// Create Tasks
router.post("/task", auth, async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id })
  try {
    await task.save()
    res.status(201).send(task)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Get user tasks
router.get("/tasks", auth, async (req, res) => {
  const match = {}
  const sort = {}
  if (req.query.complete) {
    match.complete = req.query.complete === "true"
  }
  if (req.query.sortBy) {
    query = req.query.sortBy.split(":")
    sort[query[0]] = query[1] === "desc" ? -1 : 1
  }
  try {
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate()
    res.send(req.user.tasks)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Find tasks by value
router.get("/task/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    task ? res.send(task) : res.status(404).send()
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// Update task by ID
router.patch("/task/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["title", "complete", "description"]
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  )
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates..." })
  }
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    if (!task) return res.status(404).send()
    updates.forEach(update => (task[update] = req.body[update]))
    await task.save()
    res.send(task)
  } catch (error) {
    return res.status(400).send(error.message)
  }
})

// Delete task by ID
router.delete("/task/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })
    task ? res.send(task) : res.status(404).send()
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
