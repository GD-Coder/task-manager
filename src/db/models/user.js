const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const Task = require("../models/task")

const userSchema = new mongoose.Schema({
  avatar: {
    type: Buffer
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.toLowerCase().includes("password")) {
        throw new Error(
          'Password is invalid... Please provide password that does not contain the word "password".'
        )
      }
    }
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowecase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error(
          "Email is invalid... please provide a valid email address (e.g. username@company.com)"
        )
      }
    }
  },
  age: {
    type: Number,
    default: 0,
    validate(value) {
      if (value < 0) {
        throw new Error("Age must be a positive number...")
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true,
  softDeletes: true
})

// Hash plaintext passwords
userSchema.pre("save", async function (next) {
  const user = this
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})

// Authenticate the user
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({
    email
  })
  if (!user) {
    throw new Error("Unable to log in...")
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error("Unable to log in...")
  }
  return user
}

// Generate athentication token
userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({
      _id: this._id.toString()
    },
    "thisismynewjsonwebtoken", {
      expiresIn: "30 days"
    }
  )
  this.tokens = this.tokens.concat({
    token
  })
  await this.save()
  return token
}

// Set publicy viewable user object
userSchema.methods.toJSON = function () {
  let publicUser = this.toObject()
  delete publicUser.password
  delete publicUser.tokens
  delete publicUser.avatar
  return publicUser
}

// Attach tasks to user
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
})

// Remove tasks when user is removed
userSchema.pre("remove", async function (next) {
  const user = this
  await Task.deleteMany({
    owner: user._id
  })
  next()
})

const User = mongoose.model("User", userSchema)

module.exports = User