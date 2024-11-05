//const script1 = require('./scripts/get_fresh_data.js')
const script2 = require('./scripts/remove_unnecessary_columns.js')
const script3 = require('./scripts/csv_to_json.js')
const script4 = require('./scripts/sorter.js')

async function runScripts() {
    //await script1()
    await script2()
    await script3()
    await script4()
}

runScripts().catch(console.error);