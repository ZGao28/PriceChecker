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
    email: joi.string().email().required(),
    password: joi.string().required() 
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
        email: body.email,
        password: body.password
    });

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
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
