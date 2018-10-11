const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = (passport) => {
    // Use PassPort Local Strategy, later on include OAuth, maybe switch over to JWT
    passport.use(new LocalStrategy((username, password, done) => {
        // Match Username
        let query = {username:username};
        User.findOne(query, (err, user) => {
            // Check to make sure no errors and user exists
            if(err) throw err;
            if(!user) return done(null, false, {message: 'No user found'});
            
            // Check for correct hashed password through bcrypt
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));

    // serialize and deserialize passport user sessions
    passport.serializeUser((user, done) => { done(null, user.id); });
    passport.deserializeUser((id, done) => { User.findById(id, (err, user) => { done(err, user); }); });
}