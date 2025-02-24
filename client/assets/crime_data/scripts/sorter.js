let downloadPath = __dirname.replace("scripts", "") + "json"; // Escape backslashes

const crime_data = require(downloadPath + '/Crime_Data.json');
const fs = require('fs');

const quicksort = (arr, key) => {
  if (arr.length <= 1) {
    return arr;
  }

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][key] < pivot[key]) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quicksort(left, key), pivot, ...quicksort(right, key)];
};

function sorter() {
  return new Promise((resolve) => {

    const sortedData = quicksort(crime_data, 'Latitude');
    const jsonString = JSON.stringify(sortedData, null, 2);

    let downloadPath = __dirname.replace("\\scripts", "") + "\\json"; // Escape backslashes

    fs.writeFile(downloadPath + '\\sorted_crime_data.json', jsonString, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('JSON Object has been sorted according to Latitude and saved at ../client/assets/crime_data/json/sorted_crime_data.json');
      }
    });

    resolve()
  });
}

module.exports = sorter