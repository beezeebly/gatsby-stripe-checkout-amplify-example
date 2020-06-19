/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/

// Stripe parameters
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET

var express = require("express")
var bodyParser = require("body-parser")
var awsServerlessExpressMiddleware = require("aws-serverless-express/middleware")

// declare a new express app
var app = express()
// Add raw body to req params for Stripe signature check
app.use(
  bodyParser.json({
    verify: function (req, res, buf) {
      req.rawBody = buf.toString()
    },
  })
)
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  next()
})

app.post("/webhook", async function (req, res) {
  // Check Stripe signature
  const sig = req.headers["stripe-signature"]
  let event
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret)
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  switch (event.type) {
    case "checkout.session.completed":
      console.log(
        `Payment checkout session for ${req.body.data.object.client_reference_id} was successful!`
      )

      break
    default:
      // Unexpected event type
      return res.status(400).end()
  }

  // Return a response to acknowledge receipt of the event
  res.json({ received: true })
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
