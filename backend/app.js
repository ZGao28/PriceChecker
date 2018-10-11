// porting in modules and other dependencies
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongoCredentials = require('./mongoCredentials');
let db

// Express setup stuff
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Route Files
let articles = require('./routes/items');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);


MongoClient.connect(`mongodb+srv://${mongoCredentials.mongoID}:${mongoCredentials.mongoPassword}@projects-ccy41.mongodb.net/test?retryWrites=true`, { useNewUrlParser: true }, (err, client) => {
    if (err) {
        console.log('Error Connecting to Database \n'); 
        return err;
    }
    // Use db PriceCheck
    db = client.db('PriceCheck');
});


//start app
app.listen(3000, '127.0.0.1', () => {console.log('Server is up and running on PORT 3000!')});
