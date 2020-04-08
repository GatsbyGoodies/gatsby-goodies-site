const emailValidator = require("email-validator")
const AWS = require("aws-sdk")

AWS.config.update({
  region: "us-east-2",
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
})

const table = "email-subscribers"
const docClient = new AWS.DynamoDB.DocumentClient()

exports.handler = function(event, context, callback) {
  if (event.httpMethod !== "POST") {
    console.log("METHOD NOT ALLOWED")
    return callback(null, {
      statusCode: 405,
      body: JSON.stringify({ msg: "Method not allowed" }),
    })
  }
  const body = JSON.parse(event.body)
  const email = body.email
  console.log("EMAIL: ", email)
  const isValidEmail = emailValidator.validate(email)
  if (!isValidEmail) {
    console.log("NOT VALID EMAIL: ")
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({ msg: "Not a valid email address" }),
    })
  }
  const params = {
    TableName: table,
    Item: {
      email,
    },
    ConditionExpression: "attribute_not_exists(email)",
  }

  docClient.put(params, function(err, data) {
    if (err) {
      let response
      if (err.code === "ConditionalCheckFailedException") {
        console.log("EMAIL TAKEN")
        response = {
          statusCode: 400,
          body: JSON.stringify({
            msg: "This email has already been subscribed",
          }),
        }
      } else {
        console.log("ERR: ", err)
        response = {
          statusCode: 400,
          body: JSON.stringify({
            msg: "There was an error subscribing this email address",
          }),
        }
      }
      return callback(null, response)
    } else {
      console.log("NICE: ", data)
      const response = {
        statusCode: 200,
        body: JSON.stringify({ msg: "Thanks for subscribing!" }),
      }
      return callback(null, response)
    }
  })
}
