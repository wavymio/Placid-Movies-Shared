const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    name: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'non-binary', 'other']
    },
    country: {
        type: String
    },
    accountCreatedAt: { 
        type: Date,
        default: Date.now 
    },
    profilePicture: {
        type: String
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const User = mongoose.model("User", userSchema)

module.exports = User