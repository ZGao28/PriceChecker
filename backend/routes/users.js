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
router.post('/register', (req, res) => {

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
            // generate salt
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err){
                        console.log(err);
                    }
                    // set new user password to hash
                    newUser.password = hash;
                    newUser.save((err) => {
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

// POST request for login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect:'/',
      failureRedirect:'/users/login'
    })(req, res, next);
});
  

// GET request for user registration
router.get('/register', (req, res)=> { res.render('register') });

// GET request for login page
router.get('/login', (req, res) => { res.render('login') });


// GET request for logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/users/login');
});
  
module.exports = router;
