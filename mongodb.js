// const {
//   MongoClient,
//   ObjectID
// } = require("mongodb")

// const connectionURL = process.env.DB_CONNECTION_URL
// const databaseName = process.env.DB_NAME

// MongoClient.connect(
//   connectionURL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   },
//   (error, client) => {
//     const db = error ?
//       console.log("Unable to connect to database!") :
//       client.db(databaseName)
//   }
// )
