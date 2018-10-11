// import required modules, bcrypt for encryption, passport for auth
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const joi = require('joi');

// import in user model
let User = require('../models/user');

// Define user schemas - could later use joigoose, but just use joi and mongoose seperately for now
const userSchema = joi.object().keys({
    username: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    currency: joi.string().required() 
});

// POST request for user registration
router.post('/register', function(req, res){

    // validate request
    let validated = joi.validate(req.body, userSchema);
    if (validated.error != null) {
        throw new Error(validated.error.message);
    }
    let body = validated.value;

    //create new user object
    let newUser = new User({
        username: body.username,
        email: body.email,
        password: body.password,
        currency: body.currency
    });

    let query = {username:body.username};
    User.findOne(query, (err, user) => {
        //make sure there is no error and user with specified username exists
        if (!user) {
            bcrypt.genSalt(10, function(err, salt){
                bcrypt.hash(newUser.password, salt, function(err, hash){
                    if(err){
                        console.log(err);
                    }
                    newUser.password = hash;
                    newUser.save(function(err){
                        if(err){
                            console.log(err);
                            return;
                        } else {
                            res.redirect('/users/login');
                        }
                    });
                });
            });
        } else {
            res.send('\n Username already exists! \n');
        }
    });
});

// POST request for user login
router.post('/login', 
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/' + req.user.username);
});

// GET request for login page
router.get('/login', (req, res) => { res.render('login') });
  
module.exports = router;
