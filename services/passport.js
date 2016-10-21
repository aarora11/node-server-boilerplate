const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');


const localOptions = { usernameField : 'email'};
//create local Strategy
const localLogin = new LocalStrategy(localOptions, function(email,password,done){

    // Verify username passwprd other wise call done with false
     
    User.findOne({email: email}, function(err, user){
        if(err){
            return done(err);
        }
        if(!user){
            return done(null,false);
        }
        //compare passwords
        user.comparePassword(password, function(err, isMatch){
            if(err){
                return done(err);
            }
            if(!isMatch){
                return done(null, false);
            }
            return done(null, user);
        });
    });
});



//Setup options for JwtStategy
const jwtOptions={
    jwtFromRequest : ExtractJwt.fromHeader('authorization'),
    secretOrKey : config.secret
};

// Create JWT Strategy 
const jwtLogin = new JwtStategy(jwtOptions, function(payload, done){
    // See if the user ID exists in the db call done -- if it doesnt exist then call done without user

User.findById(payload.sub, function(err, user){
    if(err){
        return done(err, false);
    }

    if(user){
        done(null, user);
    } else {
        done(null, false);
    }
});

});

// Tell passport to use it
passport.use(jwtLogin);
passport.use(localLogin);
