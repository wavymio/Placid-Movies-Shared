const { Server } = require('socket.io')
const http = require('http')
const express = require('express')
const socketAuth = require('../middleware/socketAuth')

const app = express()

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
        credentials: true
    }
})

// SocketIo Middleware
io.use(socketAuth)

const userSocketMap = new Map()

const disconnect = (socket) => {
    console.log(`Client disconnected ${socket.id}`)
    for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
            userSocketMap.delete(userId)
            break
        } 
    } 
} 

io.on("connection", (socket) => {
    // const userId = socket.handshake.query.userId // not safe
    const userId = socket.userId

    if (userId) {
        userSocketMap.set(userId, socket.id)
        console.log(`User connected: ${userId} with socket ID: ${socket.id}`)
    } else {
        console.log("User Id not provided during connection")
    }

    socket.on("disconnect", () => disconnect(socket))
})

module.exports = {app, server, io, userSocketMap}