const bcrypt = require('bcryptjs')
const { v2: cloudinary } = require('cloudinary')
const User = require('../models/users')
const { userSocketMap } = require('../socket/socket')
const generateTokenAndSetCookie = require('../utils/generateToken')
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10)

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body

        const user = await User.findOne({ username })
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || '')
        
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({error: "Incorrect username or password"})
        }

        generateTokenAndSetCookie(user._id, user.username, res)

        return res.status(200).json({success: "Login Successful!"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const signupUser = async (req, res) => {
    try {
        const { username, password } = req.body
        createdUser = await User.findOne({ username })

        if (createdUser) {
            return res.status(409).json({error: "Username already exists"})
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = new User({
            username,
            password: hashedPassword
        })
        
        if (!newUser) {
            return res.status(400).json({ error: "Error Creating User"})
        }

        await newUser.save()
        generateTokenAndSetCookie(newUser._id, newUser.username, res)
        return res.status(201).json({ username: newUser.username, success: "Signup successful" })

    } catch (err) {
        console.log(err)
        res.status(500).json({error: "Internal server error"})
    }
}

const patchEditUsername = async (req, res) => {
    try {
        const { username } = req.body

        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const usernameExists= await User.findOne({ username })

        if (usernameExists) {
            return res.status(409).json({error: "Username already exists"})
        }

        user.username = username
        await user.save()
        return res.status(201).json({ success: "Update Successfull!" })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "Internal server error"})
    }
}

const patchEditProfilePic = async (req, res) => {
    try {
        const user = await User.findById(req.userId)

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const profilePicture = await uploadImage(req.file)

        user.profilePicture = profilePicture
        await user.save()
        return res.status(201).json({ success: "Update Successfull!" })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "Internal server error"})
    }
}

const getUser = async (req, res) => {
    try {
        const { userId } = req
        const user = await User.findById(userId)
            .select("-password")
            .populate({
                path: 'friends.userId',
                select: 'username profilePicture',
            })
            .populate({
                path: 'notifications',
                populate: {
                    path: 'from',
                    select: 'username profilePicture'
                },
                options: { sort: { date: -1 } }
            })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const onlineFriends = []
        const offlineFriends = []

        user.friends.forEach((friend) => {
            console.log(userSocketMap)
            if (userSocketMap.get(friend.userId._id.toString())) {
                console.log("on")
                onlineFriends.push(friend)
            } else {
                console.log("off")
                offlineFriends.push(friend)
            }
        })

        const updatedUser = {
            ...user.toObject(),
            onlineFriends,
            offlineFriends
        }

        return res.status(200).json( updatedUser )
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
} 

const logoutUser = async (req, res) => {
    try {
        res.clearCookie("jwt")
        return res.status(200).json({success: "Logged out successfully"})
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const uploadImage = async (file) => {
    const image = file
    const base64Image = Buffer.from(image.buffer).toString("base64")
    const dataURI = `data:${image.mimetype};base64,${base64Image}`

    const uploadResponse = await cloudinary.uploader.upload(dataURI)
    return uploadResponse.url
}

module.exports = {
    patchEditUsername,
    patchEditProfilePic,
    loginUser,
    signupUser,
    getUser,
    logoutUser,
}