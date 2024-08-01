const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: true
    },
    description: { 
        type: String 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    createdAt: {
        type: Date, 
        default: Date.now 
    }
})

const Room = mongoose.model('Room', roomSchema)
