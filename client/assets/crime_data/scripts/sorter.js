const crime_data = require('../json/Crime_Data.json');
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

    fs.writeFile('../json/sorted_crime_data.json', jsonString, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
      } else {
        console.log('File has been written successfully');
      }
    });
  });
}

sorter()

module.exports = sorter