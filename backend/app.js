//Google credentials
const firebase = require('firebase');
const gcpCreds = require('./gcpSecret.js');

//Process for calling python scrape script
const { spawn } = require('child_process');
const pageScrape = spawn('python', ['./pagescrape.py']);

//Google search function
const { search } = require('./itemsearch'); 

const FIREBASE_CONFIG = gcpCreds.firebaseConfig;
firebase.initializeApp(FIREBASE_CONFIG);

console.log(search('cars'));




