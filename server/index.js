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
const crime_data = require('../client/assets/crime_data/json/sorted_crime_data.json');


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

// Get coordinates of address (on backend for improved loading speed)
app.post('/coordinates', bodyParser.json(), (req, res) => {
  let countUp = req.body.midIndex
  let countDown = req.body.midIndex
  let latitude_markers = []
  while (true) {
    try {
      if (crime_data[countUp].Latitude - crime_data[req.body.midIndex].Latitude < 0.003623) { // 0.003623 change in latitude is equal to 0.25 miles
        latitude_markers.push(crime_data[countUp])
        countUp++
      }
      else {
        break
      }
    }
    catch {
      // skip to next
    }
  }
  while (true) {
    try {
      if (crime_data[req.body.midIndex].Latitude - crime_data[countDown].Latitude < 0.003623) { // 0.003623 change in latitude is equal to 0.25 miles
        latitude_markers.push(crime_data[countDown])
        countDown--
      }
      else {
        break
      }
    }
    catch {
      // skip to next
    }
  }

  let index = 0
  let longitude_markers = []
  while (index < latitude_markers.length) {
    index++
    try {
      if (Math.abs(latitude_markers[index].Longitude - req.body.longitude) < 0.00457) { // 0.00457 change in longitude is equal to 0.25 miles
        longitude_markers.push(latitude_markers[index])
        index++
      }
    }
    catch {
      // skip
    }
  }

  res.send(longitude_markers)
})

// Binary search through data (on backend for improved loading speed)
app.post('/binarysearch', bodyParser.json(), (req, res) => {
  let low = 0;
  let high = crime_data.length - 1;

  while (true) {
    const midIndex = Math.floor((low + high) / 2);
    const midItem = crime_data[midIndex];

    if (midItem.Latitude < req.body.latitude) {
      low = midIndex + 1; // Search in the right half
    } else {
      high = midIndex - 1; // Search in the left half
    }

    if (low > high) {
      res.send(String(midIndex))
    }
  }

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