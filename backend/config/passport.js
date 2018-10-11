const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    // Local Strategy
    passport.use(new LocalStrategy((username, password, done) => {
        // Find user with inputed username
        let query = {username:username};
        User.findOne(query, (err, user) => {
            //make sure there is no error and user with specified username exists
            if(err) throw err;
            if(!user) return done(null, false, {message: 'No user found'});
            
            // Match Password using bcrypt
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if(err) throw err;

                // Correct password vs incorrect
                if(isMatch){
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));

    // Serialization and deserialization for user sessions
    passport.serializeUser((user, done) => { done(null, user.id) });
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}