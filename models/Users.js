const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema) // model name is User, put userSchema in the Model

module.exports = {User} // the model can be used in anywhere as using 'exports'
