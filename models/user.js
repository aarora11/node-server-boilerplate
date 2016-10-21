//bcrypt
const bcrypt = require('bcrypt-nodejs');

//mongoose needs this to know the format of request

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Define the model
const userSchema = new Schema({
    email : { type : String, unique : true, lowercase : true },
    password : String
});

//onsave hook encrypt password
//#1 before saving model encrypt password -- run this function
userSchema.pre('save', function(next){
    //getting access to user model
    const user = this;
    //generate a salt then call callback function
    bcrypt.genSalt(10, function(err,salt){
     
        if(err) {
            return next(err);
        }
//hash password using salt
        bcrypt.hash(user.password,salt,null, function(err,hash){
            if(err) {
            return next(err);
        }
        
        user.password = hash;
        next();
        });
    });
});


userSchema.methods.comparePassword = function(candidatePassword, callback){

    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err){ 
            return callback(err);
        }
        callback(null, isMatch);
    });

}


// Create the model class
const ModelClass = mongoose.model('user', userSchema);


//Export the model
module.exports = ModelClass;