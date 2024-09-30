const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv/config.js')
const cookieParser = require('cookie-parser')
const path = require('path')
const {v2: cloudinary} = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const { app, server, io, userSocketMap } = require('./socket/socket')
const Room = require('./models/rooms')

// Route Importation
const myUserRoutes = require('./routes/myUserRoutes')
const myNotificatonRoutes = require('./routes/myNotificationRoutes')
const myVideoRoutes = require('./routes/myVideoRoutes')
const myRoomRoutes = require('./routes/myRoomRoutes')
const roomRoutes = require('./routes/roomRoutes')
const searchRoutes = require('./routes/searchRoutes') 
const userRoutes = require('./routes/userRoutes')
const conversationRoutes = require('./routes/conversationRoutes')

// Database Connection
const connectToMongodb = require('./db/conncet')

// Path Join
app.use(express.static(path.join(__dirname, '../../Frontend/dist')))

// Middleware Setup
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Router Setup
app.use('/api/my/user', myUserRoutes)
app.use('/api/my/notifications', myNotificatonRoutes)
app.use('/api/my/videos', myVideoRoutes)
app.use('/api/my/room', myRoomRoutes)
app.use('/api/room', roomRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/user', userRoutes)
app.use('/api/conversation', conversationRoutes)
app.get('/health', async (req, res) => {
    res.status(200).json({ message: "I am healthy" })
})
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"))
})

const cleanupOnShutdown = async () => {
    console.log("Server shutting down, disconnecting clients...")

    // Handle all active socket connections
    for (let [userId, socketId] of userSocketMap) {
        const userSocket = io.sockets.sockets.get(socketId)
        if (userSocket) {
            const currentRoomId = Object.keys(userSocket.rooms)[1] // Get the current room
            if (currentRoomId) {
                await Room.updateOne(
                    { _id: currentRoomId },
                    { $pull: { participants: { userId } } }
                )
                io.to(currentRoomId).emit('userLeft', { userId })
            }
        }
    }

    // Close the server
    server.close(() => {
        console.log("Server shut down gracefully.")
        process.exit(0)
    })
}

// Listen for shutdown signals
process.on('SIGINT', cleanupOnShutdown)
process.on('SIGTERM', cleanupOnShutdown)


server.listen(8080, async () => {
    await connectToMongodb()
    console.log("App Connected Successfully on Port 8080")
})