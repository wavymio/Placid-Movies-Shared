const express = require('express')
const router = express.Router()
const myUserController = require('../controllers/myUserController')
const { validateMyUserRequest } = require('../middleware/formValidation')
const verifyToken = require('../middleware/verifyToken')

router.get('/validate', verifyToken, myUserController.validateUser)
router.post('/login', validateMyUserRequest, myUserController.loginUser)
router.post('/signup', validateMyUserRequest, myUserController.signupUser)
router.get('/logout', verifyToken, myUserController.logoutUser)

module.exports = router