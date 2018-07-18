const firebase = require('firebase');
const gcpCreds = require('./gcpSecret.js');
const { spawn } = require('child_process');
const pageScrape = spawn('python', ['./pagescrape.py']);

const FIREBASE_CONFIG = gcpCreds.firebaseConfig;
firebase.initializeApp(FIREBASE_CONFIG);




