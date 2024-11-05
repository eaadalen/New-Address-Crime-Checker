const fs = require('fs');
const { parse } = require('csv-parse');
const inputFilePath = '../csv/Optimized_Crime_Data.csv';
const outputFilePath = '../json/Crime_Data.json';

// Function to convert CSV to JSON and write to a file
function csvToJson() {
  console.log('csv_to_json')
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream('../csv/Optimized_Crime_Data.csv', { encoding: 'utf8' }) // Set encoding to UTF-8
      .pipe(parse({ columns: true, skip_empty_lines: true }))
      .on('data', (row) => {
        // Clean up each row to remove undesired characters
        const cleanRow = Object.fromEntries(
          Object.entries(row).map(([key, value]) => [key.trim(), value.trim()])
        );
        records.push(cleanRow);
      })
      .on('end', () => {
        // Write the JSON object to a file
        fs.writeFile('../json/Crime_Data.json', JSON.stringify(records, null, 2), (err) => {
          if (err) {
            console.log(err)
            reject(err);
          } else {
            resolve(`JSON file has been created at ${'../json/Crime_Data.json'}`);
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

module.exports = csvToJson