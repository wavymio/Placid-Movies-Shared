const express = require('express')
const searchController = require('../controllers/searchController')
const router = express.Router()

router.post('/', searchController.searchUsernameAndRooms)

module.exports = router