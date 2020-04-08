const AWS = require("aws-sdk")

AWS.config.update({
  region: "us-east-2",
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
})

const table = "email-subscribers"
const docClient = new AWS.DynamoDB.DocumentClient()

console.log(process.env.AWS_ACCESS_KEY)

exports.handler = async (event, context, callback) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" }
  }
  const { body } = JSON.parse(event)
  console.log("WOOOO: ", body)
  const params = {
    TableName: table,
    Item: {
      email: body.email,
    },
    ConditionExpression: "attribute_not_exists(email)",
  }
  try {
    const results = await docClient.put(params).promise()
    const response = {
      statusCode: 200,
      body: JSON.stringify(results),
    }
    return callback(null, response)
  } catch (err) {
    const response = {
      statusCode: 400,
      body: JSON.stringify({ err }),
    }
    return callback(null, response)
  }
}
