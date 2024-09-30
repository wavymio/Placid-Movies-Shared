const { Server } = require('socket.io')
const http = require('http')
const express = require('express')
const socketAuth = require('../middleware/socketAuth')
const Room = require('../models/rooms')
const User = require('../models/users')
const Notification = require('../models/notifications')
const mongoose = require('mongoose')
const Message = require('../models/Messages')

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

const disconnect = async (socket, currentRoomId) => {
    console.log(`Client disconnected ${socket.id}`)
    const userId = Array.from(userSocketMap.entries())
        .find(([_, id]) => id === socket.id)?.[0]
    
    if (userId) {
        userSocketMap.delete(userId)
        const user = await User.findById(userId)

        if (currentRoomId && user) {
            await Room.updateOne(
                { _id: currentRoomId },
                { $pull: { participants: { userId } } }
            )
            io.to(currentRoomId).emit('userLeft', { user })
            currentRoomId = null
            console.log(`User ${userId} disconnected from room ${currentRoomId}`)
        }
    } else {
        console.log("User Id not found during disconnection")
    }
    socket.removeAllListeners()
}

io.on("connection", async (socket) => {
    // const userId = socket.handshake.query.userId // not safe
    const userId = socket.userId
    let currentRoomId = null 

    if (userId) {
        userSocketMap.set(userId, socket.id)
        console.log(`User connected: ${userId} with socket ID: ${socket.id}`)
    } else {
        console.log("User Id not provided during connection")
        return
    }

    const user = await User.findById(userId)

    socket.on("joinRoom", async ({ roomId }) => {
        console.log("hit")
        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const room = await Room.findById(roomId).session(session)
            const user = await User.findById(userId).session(session)

            if (!room) {
                await session.abortTransaction()
                session.endSession()
                socket.emit('errorNotification', { error: "Room doesn't exist" })
                return
            }

            if (!user) {
                await session.abortTransaction()
                session.endSession()
                socket.emit('errorNotification', { error: "User doesn't exist" })
                return
            }

            if (currentRoomId) {
                await Room.updateOne(
                    { _id: currentRoomId },
                    { $pull: { participants: { userId: userId } } }
                ).session(session)
                socket.leave(currentRoomId)
                io.to(currentRoomId).emit('userLeft', { user })
                console.log("aha")
            }

            socket.join(roomId)
            currentRoomId = roomId

            await Room.findByIdAndUpdate(roomId, {
                $addToSet: {
                    participants: {
                        userId: userId,
                    },
                },
                $pull: {
                    invitedUsers: userId,
                }
            }).session(session)

            await User.findByIdAndUpdate(userId, {
                $pull: {
                    receivedRoomInvites: { room: roomId },
                    notifications: {
                        $in: await Notification.find({
                            to: userId,
                            type: "room-invite",
                            link: `/room/${roomId}`
                        }).select('_id').session(session)
                    }
                }
            }).session(session)
    
            await Notification.deleteMany({
                to: userId,
                type: "room-invite",
                link: `/room/${roomId}`
            }).session(session)
    
            await session.commitTransaction()
            session.endSession()

            io.to(roomId).emit('userJoined', {user, room})
            // console.log(`User ${userId} joined room ${roomId}`)
            console.log("Join room emitted")
            return
        } catch (err) {
            console.log(err)
            await session.abortTransaction()
            session.endSession()
            socket.emit('errorNotification', { error: "An error occured while joining the room" })
            return
        }
    })

    socket.on("leaveRoom", async () => {
        if (currentRoomId) {
            const session = await mongoose.startSession()
            session.startTransaction()
            try {
                const user = await User.findById(userId).session(session)
                const room = await Room.findById(currentRoomId).session(session)

                if (!room || !user) {
                    await session.abortTransaction()
                    session.endSession()
                    return
                }

                await Room.updateOne(
                    { _id: currentRoomId },
                    { $pull: { participants: { userId: userId } } }
                ).session(session)

                await session.commitTransaction()
                session.endSession()

                socket.leave(currentRoomId)

                io.to(currentRoomId).emit('userLeft', { user })
                currentRoomId = null
                console.log("Leave room emitted")
                // console.log(`User ${userId} disconnected from room ${currentRoomId}`)
                return
            } catch (err) {
                console.log("Error leaving room", err)
                await session.abortTransaction()
                session.endSession()
                return
            }
        }
    })

    socket.on("markMessageAsSeen", async ({ messageId, roomId }) => {
        if (!messageId || !roomId) {
            console.error("Invalid messageId or roomId provided");
            return
        }

        const session = await mongoose.startSession()
        session.startTransaction()

        try {
            const message = await Message.findById(messageId).session(session)
            const room = await Room.findById(roomId).session(session)
            const user = await User.findById(userId).session(session)

            if (!message || !room || !user) {
                await session.abortTransaction()
                session.endSession()
                return
            }
            
            // set is faster than array operations, so for large arrays this would be better than using push
            const seenUsersSet = new Set(message.seen)

            if (!seenUsersSet.has(userId)) {
                seenUsersSet.add(userId)
                message.seen = Array.from(seenUsersSet)
            }

            const savedMessage = await message.save({ session })
            await session.commitTransaction()
            session.endSession()

            if (savedMessage) {
                io.to(roomId).emit('messageSeen', {messageId})
            }
            return
        } catch (err) {
            console.log(err)
            await session.abortTransaction()
            session.endSession()
            return
        }

    })

    socket.on("disconnect", async () => {
        await disconnect(socket, currentRoomId)
        return
    })
})

module.exports = {app, server, io, userSocketMap}