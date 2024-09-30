const mongoose= require('mongoose')
const { io, userSocketMap } = require('../socket/socket')
const Room = require('../models/rooms')

const getRoom = async (req, res) => {
    try {
        const { roomId } = req.params
        let room
        try {
            room = await Room.findById(roomId)
            .populate({
                path: 'participants.userId',
                select: 'username profilePicture'
            })
            .populate('video')
            .populate('invitedUsers')
            .populate({
                path: 'owner',
                select: 'username profilePicture'
            })
            .populate({
                path: 'admins',
                select: 'username profilePicture'
            })
            .populate('conversation')

            if (!room) {
                return res.status(404).json({ error: "Room not found" })
            }
        } catch (err) {
            return res.status(404).json({ error: "Room not found" })
        }

        res.status(200).json(room)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" })
    }
}

const joinRoom = async (req, res) => {
    try {
        let currentRoomId = null
        const { userId } = req

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal server error" })
    }
}

const rejectRoomInvite = async (req, res) => {
    try {
        const userSendingId = req.userId
        const roomReceivingId = req.body.to

        const session = await mongoose.startSession()
        session.startTransaction()


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = {
    joinRoom,
    getRoom
}