const express = require('express')
const router = express.Router()
const myUserController = require('../controllers/myUserController')
const { validateMyUserRequest, validateMyPatchEditRequest } = require('../middleware/formValidation')
const verifyToken = require('../middleware/verifyToken')
const upload = require('../middleware/multerParse')


router.get('/', verifyToken, myUserController.getUser)
router.get('/activity', verifyToken, myUserController.getUserActivity)
router.post('/login', validateMyUserRequest, myUserController.loginUser)
router.post('/signup', validateMyUserRequest, myUserController.signupUser)
router.patch('/edit/username', verifyToken, validateMyPatchEditRequest, myUserController.patchEditUsername)
router.patch('/edit/profile-picture', verifyToken, upload.single("profilePicture"), myUserController.patchEditProfilePic)
router.get('/logout', verifyToken, myUserController.logoutUser)

module.exports = router