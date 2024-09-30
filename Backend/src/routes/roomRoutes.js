const express = require('express')
const router = express.Router()
const verifyToken = require('../middleware/verifyToken')
const roomController = require('../controllers/roomController')

router.get('/:roomId', verifyToken, roomController.getRoom)
router.patch('/join', verifyToken, roomController.joinRoom)

module.exports = router