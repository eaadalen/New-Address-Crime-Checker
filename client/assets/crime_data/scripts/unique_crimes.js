let unique_crimes = {}
let i = 1

const fs = require('fs');

// Read the JSON file
fs.readFile('sorted_crime_data.json', 'utf8', (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  try {
    // Parse the JSON data
    const jsonData = JSON.parse(data);

    // Access data
    jsonData.forEach((element) => {
      if (element.Offense in unique_crimes) {
        // do nothing
      }
      else {
        unique_crimes[element.Offense.toString()] = i
        i++
      }
    })

  } catch (err) {
    console.error("Error parsing JSON string:", err);
  }

  console.log(unique_crimes)
});