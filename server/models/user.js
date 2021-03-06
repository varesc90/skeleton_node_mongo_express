const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');


var UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required:true,
        minlength:1,
        trim:true,
        unique:true,
        validate:{
            validator: validator.isEmail,
            message:`{VALUE} is not a valid email address`
        }
    },
    password:{
        type: String,
        required: true,
        minlength:6,
    },
    tokens: [{
        access: {
            type: String,
            required: true,

        },
        token:{
            type: String,
            required: true,
        }
    }]
});


UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email'])
}

//instance method

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = "auth";
    var token = jwt.sign({_id:user._id.toString(), access},process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{token,access}]);

    return user.save().then(()=>{
        return token;
    });



}

UserSchema.pre('save',function(next){
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }

});


//Model method

UserSchema.statics.findByToken = function (token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token,process.env.JWT_SECRET);
    }catch(e){
        // return new Promise((resolve,reject) => {
        //     reject();
        // });
        return Promise.reject('test');
    }

    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}

UserSchema.statics.findByCredentials = function (email,password) {
    var User = this;
    return User.findOne({email}).then((user)=>{

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    return resolve(user);
                }

                return reject('invalid credential');
            });
        });

    });
}

UserSchema.methods.removeToken = function (token) {
    var user = this;
    return user.update({
        $pull: {
            tokens:{ token }
        }
    });

}


var User = mongoose.model('User',UserSchema);

module.exports = {User};