const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter you name']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required']
    }
})

module.exports = mongoose.model('users', userSchema)