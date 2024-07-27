const mongoose = require('mongoose')

const connectToMongodb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
        console.log("Connected to database!")
    } catch (err) {
        console.log("Error connecting to database", err)
    }
}

module.exports = connectToMongodb