const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv/config.js')
const cookieParser = require('cookie-parser')
const path = require('path')
const app = express()

// Route Importation
const myUserRoutes = require('./routes/myUserRoutes') 
const mySearchRoutes = require('./routes/searchRoutes') 

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
app.use('/api/search', mySearchRoutes)
app.get('/health', async (req, res) => {
    res.status(200).json({ message: "I am healthy" })
})

app.listen(8080, () => {
    connectToMongodb()
    console.log("App Connected Successfully on Port 8080")
})