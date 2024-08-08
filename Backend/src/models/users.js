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
        type: String 
    },
    name: { 
        type: String 
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
    verified: { 
        type: Boolean, 
        default: false 
    },
    friends: [{ 
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        dateAdded: { 
            type: Date, 
            default: Date.now 
        }
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
    notifications: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Notification' 
    }],
    sentFriendRequests: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    receivedFriendRequests: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
})


userSchema.index({ username: 1 }) 
userSchema.index({ email: 1 }) 
userSchema.index({ sentFriendRequests: 1 }) 
userSchema.index({ receivedFriendRequests: 1 }) 
userSchema.index({ friends: 1 }) 
userSchema.index({ rooms: 1 }) 
userSchema.index({ savedRooms: 1 }) 
userSchema.index({ favoriteRooms: 1 })

const User = mongoose.model("User", userSchema)
module.exports = User
