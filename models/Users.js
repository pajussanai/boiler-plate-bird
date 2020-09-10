const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//use webToken
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, // remove space in email address
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0 // if role is not defined default is 0 
    },
    image: String,
    token: {
        type: String // manage of expiration
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){
    //비밀번호 암호화 시킴
    // 스키마가 넘어가기전 먼저 처리하는 부분
    var user = this; //this는 위 전체 스키마를 의미
    if(user.isModified('password')){  //비밀번호 변경될때만 암호화하게 설정
        
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        }) 
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    //plainPassword 123123213 암호화된 비번 $fnwieflsadkvjlvajseil
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) {
            return cb(err)
        }
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    //jsonWebToken을 이용하여 토큰 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save(function(err, user){
        if(err){
            return cb(err)
        } 
        cb(null, user)
    })
}


const User = mongoose.model('User', userSchema) // model name is User, put userSchema in the Model

module.exports = {User} // the model can be used in anywhere as using 'exports'
