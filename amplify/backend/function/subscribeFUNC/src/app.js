const AWS = require("aws-sdk")

AWS.config.update({ region: process.env.TABLE_REGION })

const dynamodb = new AWS.DynamoDB.DocumentClient()

let tableName = "subscribers"
if (process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + "-" + process.env.ENV
}

const userIdPresent = false // TODO: update in case is required to use that definition

const path = "/subscribe"
const UNAUTH = "UNAUTH"

// declare a new express app
var app = express()
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

app.post(path, function(req, res) {
  if (userIdPresent) {
    req.body["userId"] =
      req.apiGateway.event.requestContext.identity.cognitoIdentityId || UNAUTH
  }

  let putItemParams = {
    TableName: tableName,
    Item: req.body,
    ConditionExpression: "attribute_not_exists(email)",
  }
  dynamodb.put(putItemParams, (err, data) => {
    if (err) {
      res.statusCode = 500
      res.json({ error: err, url: req.url, body: req.body })
    } else {
      res.json({ success: "post call succeed!", url: req.url, data: data })
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
