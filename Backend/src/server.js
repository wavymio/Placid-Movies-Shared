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
const { app, server } = require('./socket/socket')

// Route Importation
const myUserRoutes = require('./routes/myUserRoutes') 
const myNotificatonRoutes = require('./routes/myNotificationRoutes') 
const searchRoutes = require('./routes/searchRoutes') 
const userRoutes = require('./routes/userRoutes')

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
app.use('/api/search', searchRoutes)
app.use('/api/user', userRoutes)
app.get('/health', async (req, res) => {
    res.status(200).json({ message: "I am healthy" })
})
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"))
})

server.listen(8080, async () => {
    await connectToMongodb()
    console.log("App Connected Successfully on Port 8080")
})