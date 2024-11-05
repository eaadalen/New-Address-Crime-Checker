const puppeteer = require('puppeteer');

function get_fresh_data() {
    return new Promise((resolve) => {
        (async () => {
            // Launch a new browser instance
            const browser = await puppeteer.launch();
            const page = await browser.newPage();

            // Set the download path to the same directory as the script
            console.log(__dirname)
            let downloadPath = __dirname.replace("\scripts", "") + "\csv";
            console.log(downloadPath)
            await page._client().send('Page.setDownloadBehavior', {
                behavior: 'allow',
                downloadPath: downloadPath,
            });

            // Go to the specified URL
            await page.goto('https://opendata.minneapolismn.gov/datasets/cityoflakes::crime-data/explore?location=11.676552%2C-46.664577%2C2.34', { waitUntil: 'networkidle2' });

            // Wait for the SVG element to be available in the DOM by its ID
            await page.waitForSelector('svg#ember114', { visible: true });

            // Locate and click the SVG element
            const svgElement = await page.$('svg#ember114');
            if (svgElement) {
                await svgElement.click({ force: true });
                console.log("SVG clicked successfully.");
            } else {
                console.log("SVG not found.");
                await browser.close();
                return;
            }

            // Wait for the arcgis-hub-download-list element
            const downloadListHost = await page.waitForSelector('arcgis-hub-download-list', { visible: true });
            
            // Access the shadow root of the arcgis-hub-download-list
            const downloadListShadowRoot = await downloadListHost.evaluateHandle(host => host.shadowRoot);

            // Wait for the arcgis-hub-download-list-item elements
            const downloadItemHost = await downloadListShadowRoot.waitForSelector('arcgis-hub-download-list-item', { visible: true });

            // Access the shadow root of the arcgis-hub-download-list-item
            const downloadItemShadowRoot = await downloadItemHost.evaluateHandle(host => host.shadowRoot);

            // Now, look for the Calcite button inside the shadow root
            const csvDownloadButton = await downloadItemShadowRoot.$('calcite-button');

            if (csvDownloadButton) {
                // Click the button
                await csvDownloadButton.click({ force: true });
                console.log("CSV download button clicked.");
            } else {
                console.log("CSV download button not found.");
            }

            // Keep the browser open for a few seconds to allow time for the download
            await new Promise(resolve => setTimeout(resolve, 5000));

            // Close the browser
            await browser.close();
            resolve()
        })();
    });
}

get_fresh_data()

module.exports = get_fresh_data