const cheerio = require('cheerio');
const http = require('http');
const https = require('https');

/**
 * The basic scraper class, this makes the template for scrapers for diffrent websites and handles actions like loading the
 * page content and whatnot
 */
class BasicScraper {

    /**
     * Loads a webpage with a basic get request for parsing
     * 
     * @param {string} url - The url to load the data from
     * 
     * @returns {Promise<string>} - Returns a promise with the body of the webpage
     */
    loadPage(url) {
        return new Promise((res, rej) => {

            let regex = /(.*?):\/\/(.*?)\/(.*)/;
            let urlParts = regex.exec(url);

            // Set port based off transfer method
            let method;
            let port;
            if (urlParts[1] == 'http') {
                port = 80
                method = http;
            } else if (urlParts[1] == 'https') {
                port = 443;
                method = https;
            } else {
                rej(`Method must be http or https, detected method was ${urlParts[1]}`);
            }

            var options = {
                host: urlParts[2],
                port: port,
                path: urlParts[3],
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36',
                }
            };
            let req = method.get(url, function (resp) {

                // Buffer the body entirely for processing as a whole.
                let bodyChunks = [];
                resp.on('data', function (chunk) {
                    // Add streamed chunks to an array
                    bodyChunks.push(chunk);
                }).on('end', function () {
                    // Parse the chunks into the document body
                    let body = Buffer.concat(bodyChunks);
                    res(body);
                })
            });

            // Request failed for some reason, return the error
            req.on('error', function (e) {
                rej(e.message);
            });
        });
    }
}

let a = new BasicScraper();

let page = a.loadPage('https://www.amazon.ca/Sony-MDRZX110-Over-Ear-Headphones-Black/dp/B00NJ2M33I')
    .then((page) => {
        console.log(page.toString());
    });

module.exports.default = BasicScraper;