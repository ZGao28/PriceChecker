const gcpCreds = require('./gcpSecret');
const GOOGLE_SEARCH_KEY = gcpCreds.customSearchKey;
const GOOGLE_SEARCH_ENGINE_ID = gcpCreds.customSearchEngineID;

const {google} = require('googleapis');
const customsearch = google.customsearch('v1');

async function search(query) {
    let results = await customsearch.cse.list({
        cx: GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        auth: GOOGLE_SEARCH_KEY
    });

    return results.data;
}

module.exports.search = search;



