//const stripe = require("stripe")(process.env.STRIPE_LIVE_KEY)
const stripe = require("stripe")(process.env.STRIPE_TEST_KEY)
const express = require('express')
const app = express()
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Models = require('./models.js')
const cors = require('cors')
const port = process.env.PORT || 4242
let username = null

let allowedOrigins = ['http://localhost:1234', 'https://music-stats.netlify.app']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = "The CORS policy for this application doesn't allow access from origin " + origin
      return callback(new Error(message), false)
    }
    return callback(null, true)
  }
}))

const userExpletives = Models.userExpletives
//const server_url = 'https://music-stats-eka-950e8c2d4bef.herokuapp.com'
//const client_url = 'https://music-stats.netlify.app'
const server_url = 'http://localhost:4242'
const client_url = 'http://localhost:1234'

//mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true })

// Stripe fulfill order
const fulfillOrder = () => {
  console.log('order fulfilled')
  fetch(
    server_url + "/" + username + "/grantaccess",
    {
        method: "PUT"
    }
  )
}

// Stripe payment session
app.post('/:username/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        //price: 'price_1PXVR6RqV1d02JQjw9EHAzZw',  // test priceID 
        price: 'price_1PXmWbRqV1d02JQj6bIUnmQV',  // live priceID
        quantity: 1
      },
    ],
    mode: 'payment',
    success_url: client_url + '/spotify',
    cancel_url: client_url + '/payment',
    automatic_tax: {enabled: true},
  })

  username = req.params.username
  res.redirect(303, session.url)
})

// Stripe detect successful payment session
app.post('/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const payload = request.body
  const sig = request.headers['stripe-signature']
  let event
  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret)
  } catch (err) {
    console.log('error: ' + err)
    return response.status(400).send('')
  }
  // Handle the checkout.session.completed event
  if ((event.type === 'checkout.session.completed') || (event.type === 'payment_intent.succeeded')) {
    fulfillOrder()
  }
  response.status(200).end()
})

// Greeting message
app.get('/', bodyParser.json(), (req, res) => {
  res.send("Hello")
})

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// listen for requests
/*app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port)
})*/

app.listen(4242, () => console.log('Running on port 4242'))