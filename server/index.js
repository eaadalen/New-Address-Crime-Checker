const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const Models = require('./models.js')
const cors = require('cors')
const port = process.env.PORT || 4242
const crime_data = require('../client/assets/crime_data/json/sorted_crime_data.json');

let allowedOrigins = ['http://localhost:1234','https://safemove.netlify.app/']

app.use(cors({
  origin: 'http://localhost:1234'
  //origin: 'https://safemove.netlify.app'
}))

// Greeting message
app.get('/', bodyParser.json(), (req, res) => {
  res.send("Hello")
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
      return
    }
  }

})

// Get coordinates of address (on backend for improved loading speed)
app.post('/coordinates', bodyParser.json(), (req, res) => {
  let countUp = req.body.midIndex
  let countDown = req.body.midIndex
  let latitude_markers = []
  while (true) {
    try {
      if (crime_data[countUp].Latitude - crime_data[req.body.midIndex].Latitude < 0.0057968) { // 0.0057968 change in latitude is equal to 0.4 miles
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
      if (crime_data[req.body.midIndex].Latitude - crime_data[countDown].Latitude < 0.0057968) { // 0.0057968 change in latitude is equal to 0.4 miles
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
      if (Math.abs(latitude_markers[index].Longitude - req.body.longitude) < 0.007312) { // 0.007312 change in longitude is equal to 0.4 miles
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

// error handling
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.send('Something broke!')
})

/*const refresh_crime_data = require('../client/assets/crime_data/refresh_crime_data.js')

const cron = require('node-cron');

// Update crime data every day at midnight (00:00)
cron.schedule('0 0 * * *', () => {
  console.log('Updating crime data');
  refresh_crime_data()
});*/

// listen for requests
app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port)
})

//app.listen(4242, () => console.log('Running on port 4242'))