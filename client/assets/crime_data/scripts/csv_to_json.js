const fs = require('fs');
const Papa = require('papaparse');

// Function to convert CSV to JSON and write to a file
function csvToJson() {
  return new Promise((resolve, reject) => {
    try {

      let downloadPath = __dirname.replace("\\scripts", "") + "\\csv"; // Escape backslashes
      const fileContent = fs.readFileSync(downloadPath + "\\Optimized_Crime_Data.csv", { encoding: 'utf8' });

      // Parse CSV content
      Papa.parse(fileContent, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Clean up each row to remove undesired characters
          const records = results.data.map((row) =>
            Object.fromEntries(
              Object.entries(row).map(([key, value]) => [key.trim(), value.trim()])
            )
          );

          let downloadPath = __dirname.replace("\\scripts", "") + "\\json"; // Escape backslashes

          // Write the JSON object to a file
          fs.writeFile(downloadPath + "\\Crime_Data.json", JSON.stringify(records, null, 2), (err) => {
            if (err) {
              reject(err);
            } else {
              console.log(`CSV has been converted to JSON and saved at ../client/assets/crime_data/json/Crime_Data.json`);
              resolve();
            }
          });
        },
        error: (error) => {
          reject(error);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = csvToJson;
