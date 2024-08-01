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
    badge: {
        type: String,
        enum: ['Noob', 'Amateur', 'Pro', 'Legend']
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
    age: {
        type: Number
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
    }],
    rooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    savedRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    favoriteRooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    }],
    verified: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User