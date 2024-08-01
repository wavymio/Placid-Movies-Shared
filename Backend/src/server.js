const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv/config.js')
const path = require('path')
const cookieParser = require('cookie-parser')
const {v2: cloudinary} = require('cloudinary')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})
const app = express()

// Route Importation
const myUserRoutes = require('./routes/myUserRoutes') 
const searchRoutes = require('./routes/searchRoutes') 
const userRoutes = require('./routes/userRoutes')

// Database Connection
const connectToMongodb = require('./db/conncet')

// Middleware Setup
app.use(express.static(path.join(__dirname, '../../Frontend/dist')))
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

// Router Setup
app.use('/api/my/user', myUserRoutes)
app.use('/api/search', searchRoutes)
app.use('/api/user', userRoutes)
app.get('/health', async (req, res) => {
    res.status(200).json({ message: "I am healthy" })
})
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../Frontend/dist/index.html"))
})

app.listen(8080, () => {
    connectToMongodb()
    console.log("App Connected Successfully on Port 8080")
})