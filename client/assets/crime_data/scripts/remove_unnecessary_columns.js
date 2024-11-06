const fs = require('fs');
const Papa = require('papaparse');

// Function to remove columns from CSV and remove rows with Latitude = 0
function removeColumnsFromCSV() {
    return new Promise((resolve) => {
        console.log('CSV Download Completed')
        // Read the CSV file
        const csvFile = fs.readFileSync("./csv/Crime_Data.csv", 'utf8');
        const columnsToRemove = ['X', 'Y', 'Type', 'Case_Number', 'Case_NumberAlt', 'Reported_Date', 'NIBRS_Crime_Against', 'NIBRS_Group', 'NIBRS_Code', 'Offense_Category', 'Problem_Initial', 'Problem_Final', 'Address', 'Precinct', 'Neighborhood', 'Ward', 'wgsXAnon', 'wgsYAnon', 'Crime_Count', 'OBJECTID'];   // Replace with the names of columns you want to remove

        // Parse the CSV data
        const parsedData = Papa.parse(csvFile, { header: true });

        // Filter out rows with Latitude = 0
        const filteredRows = parsedData.data.filter(row => Number(row.Latitude) !== 0);

        // Filter out the columns to remove
        const filteredData = filteredRows.map(row => {
            const filteredRow = {};
            Object.keys(row).forEach(key => {
                if (!columnsToRemove.includes(key)) {
                    filteredRow[key] = row[key];
                }
            });
            return filteredRow;
        });

        // Convert the filtered data back to CSV format
        const newCsv = Papa.unparse(filteredData);

        // Write the new CSV to the output file
        fs.writeFileSync('./csv/Optimized_Crime_Data.csv', newCsv);
        console.log(`Unnecessary columns removed and rows with Latitude = 0 filtered out. New file saved as: ${'./csv/Optimized_Crime_Data.csv'}`);
        resolve()
    });
}

module.exports = removeColumnsFromCSV