// porting in modules and other dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoCredentials = require('./config/mongoCredentials');
const mongoose = require('mongoose');
const passport = require('passport');

// Express setup stuff
const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Route Files
//let items = require('./routes/items');
let users = require('./routes/users');
//app.use('/items', items);
app.use('/users', users);


require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});



// Connect mongoose
mongoose.connect(`mongodb+srv://${mongoCredentials.mongoID}:${mongoCredentials.mongoPassword}@projects-ccy41.mongodb.net/pricecheck?retryWrites=true`, { useNewUrlParser: true });
let db = mongoose.connection;


// Check connection
db.once('open', () => {
    console.log('Successfully Connected to MongoDB');
});

// Check for DB errors
db.on('error', (err) => {
    console.log(err);
});




//start app
app.listen(3000, '127.0.0.1', () => {console.log('Server is up and running on PORT 3000!')});
