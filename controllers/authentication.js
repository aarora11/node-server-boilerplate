const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');




//sub is short for subject
//iat - issued at time

function tokenForUser(user){
  
  const timestamp = new Date().getTime();

    return jwt.encode({
        sub : user.id,
        iat : timestamp

    }, config.secret);
}

exports.signin = function(req,res,next){
    //User has already had email and password auth'd' we need to respond to req with token
    res.send({token : tokenForUser(req.user)});
}


exports.signup = function(req, res, next){

    // res.send({success : 'true'});
   
    const email = req.body.email;
    const password = req.body.password;
    //see if the user with the given eamil exists

    if(!email || !password){
        return res.status(422).send({error: 'you must provide a username and password'});
    }

User.findOne({email : email}, function(error, existingUser){

    //if yes return error
    if(error){
        return next(error);
    }

    if(existingUser){
        return res.status(422).send({error: 'Email is in use'});
    }


    //if the user with email doesn't exist-- create and save
    const user  = new User({
        email : email,
        password : password
    });

    user.save(function(err){
        if(err){
            return next(err);
        }

    //respond to request using the created username
         res.json({token : tokenForUser(user)});

    });
});

}