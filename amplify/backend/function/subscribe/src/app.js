const AWS = require("aws-sdk")
const emailValidator = require("email-validator")
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware")
const bodyParser = require("body-parser")
const express = require("express")
const discord = require("./discord")

AWS.config.update({ region: process.env.TABLE_REGION })

const dynamodb = new AWS.DynamoDB.DocumentClient()
const path = "/subscribe"
let tableName = "subscribers"
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV
}

const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

// HTTP post method for insert object
app.post(path, function(req, res) {
  const { email } = req.body
  const isValidEmail = emailValidator.validate(email)
  if (!isValidEmail) {
    res.json({ type: "INVALID_EMAIL" })
  }
  let putItemParams = {
    TableName: tableName,
    Item: { email },
    ConditionExpression: "attribute_not_exists(email)",
  }
  dynamodb.put(putItemParams, async (err, data) => {
    if (err) {
      res.statusCode = 500
      if (err.code === "ConditionalCheckFailedException") {
        res.json({ type: "EMAIL_EXISTS" })
      }
      res.json({ type: "ERROR" })
    } else {
      await discord.sendWebhook(email)
      res.json({ type: "SUCCESS" })
    }
  })
})

app.listen(3000, function() {
  console.log("App started")
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
