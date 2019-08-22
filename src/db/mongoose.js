const connectionURL = process.env.DB_CONNECTION_URL
const mongoose = require("mongoose")

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
})