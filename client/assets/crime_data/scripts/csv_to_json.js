const fs = require('fs');
const { parse } = require('csv-parse');
const inputFilePath = '../csv/Optimized_Crime_Data.csv';
const outputFilePath = '../json/Crime_Data.json';

// Function to convert CSV to JSON and write to a file
function csvToJson(filePath, outputFilePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath, { encoding: 'utf8' }) // Set encoding to UTF-8
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
        fs.writeFile(outputFilePath, JSON.stringify(records, null, 2), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(`JSON file has been created at ${outputFilePath}`);
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

csvToJson(inputFilePath, outputFilePath)
  .then((message) => {
    console.log(message);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

module.exports = csvToJson