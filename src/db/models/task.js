const mongoose = require("mongoose")
const taskSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255
    },
    complete: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Task = new mongoose.model("Task", taskSchema)

module.exports = Task
