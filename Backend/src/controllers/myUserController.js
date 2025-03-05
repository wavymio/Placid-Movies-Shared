const bcrypt = require('bcryptjs')
const { v2: cloudinary } = require('cloudinary')
const User = require('../models/users')
const { userSocketMap } = require('../socket/socket')
const generateTokenAndSetCookie = require('../utils/generateToken')
const generateEmailVerificationToken = require('../utils/generateEmailVerificationToken')
const sendEmail = require('../utils/emailSender')
const uploadMedia = require('../utils/uploadMedia')
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

        if (username.length > 28) {
            return res.status(409).json({ error: "Username is too long" })    
        }

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

        const profilePicture = await uploadMedia(req.file, "image")

        user.profilePicture = profilePicture
        await user.save()
        return res.status(201).json({ success: "Update Successfull!" })
        
    } catch (err) {
        console.log(err)
        res.status(500).json({error: "Internal server error"})
    }
}

const sendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(409).json({ error: "No email available" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        const existingEmail = await User.findOne({ email })
        if (existingEmail) {
            return res.status(409).json({ error: "Email has been taken" })
        }

        const { userId } = req
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        if (user.token && (user.tokenExpiryDate > Date.now()) && (user.pendingEmail === email)) {
            return res.status(409).json({ error: "A verification email has already been sent"})
        }

        const token = generateEmailVerificationToken()
        const verificationLink = `${process.env.DOMAIN_NAME}/api/my/user/verify-email?id=${userId}&token=${token}`

        const emailBody = `
                <h3>Hello, ${user.username}!</h3>

                <p>Click <a href="${verificationLink}">here</a> to verify your email</p>
                <p>This link will expire after 5 minutes. You can request for a new link after it expires.</p>
                <p>If you didn't sign up, you can safely ignore this email.</p>
                <br>
                <p>Best regards,<br>Placid Society Team</p>`

        try {
            await sendEmail(email, 'Verify your Email', emailBody)
        } catch (err) {
            console.log('Email send error:', err)
            return res.status(409).json({ error: "Error sending verification email"})
        }

        user.token = token
        user.tokenExpiryDate = Date.now() + 300000 // expires in 5 mins(ms)
        user.pendingEmail = email 

        await user.save()

        return res.status(200).json({ success: "Email Verification sent Successfully!" })
        
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Internal server error"})
    }
}

const verifyMyEmail = async (req, res) => {
    try {
        const { id: userId, token } = req.query
        const user = await User.findById(userId)
        const domainRoute = `${process.env.FRONTEND_URL}/verification`
        if (!user) return res.redirect(`${domainRoute}/failed/no-user`)
        // if (!user) return res.status(404).json({ erorr: "User not found" })
        if (!token) return res.redirect(`${domainRoute}/failed/no-token`)
        // if (!token) return res.status(404).json({ error: "No available token" }) 
        if (user.token && (user.tokenExpiryDate < Date.now())) return res.redirect(`${domainRoute}/failed/expired-token`)
        // if (user.token && (user.tokenExpiryDate < Date.now())) return res.status(400).json({ error: "Token has Expired" })
        if (user.token !== token) return res.redirect(`${domainRoute}/failed/fishy`)
        // if (user.token !== token) return res.status(400).json({ error: "Something fishy is going on here" })

        const emailExists = await User.findOne({ email: user.pendingEmail })
        if (emailExists) return res.redirect(`${domainRoute}/failed/email-taken`)
        // if (emailExists) return res.status(400).json({ error: "Sorry this email has just been taken" })

        user.email = user.pendingEmail
        user.pendingEmail = undefined
        user.token = undefined
        user.tokenExpiryDate = undefined
        user.isVerified = true

        await user.save()
        return res.redirect(`${domainRoute}/successful`)
        // return res.status(200).json({ success: "Email Verified!" })

    } catch (err) {
        console.log(err)
        return res.redirect(`${domainRoute}/failed/internal-server-error`)
    }
}

const getUser = async (req, res) => {
    console.log("tried")
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
            .populate({
                path: "rooms",
                select: 'name coverPhoto theme'
            })
            .populate({ 
                path: "savedRooms",
                select: 'name coverPhoto theme'
            })
            .populate({
                path: "favoriteRooms",
                select: 'name coverPhoto theme'
            })

        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }

        const onlineFriends = []
        const offlineFriends = []

        user.friends.forEach((friend) => {
            if (userSocketMap.get(friend.userId._id.toString())) {
                onlineFriends.push(friend)
            } else {
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

const getUserActivity = async (req, res) => {
    try {
        const { userId } = req
        const user = await User.findById(userId)
            .select("recentRooms")
            .populate({
                path: "recentRooms.roomId",
                select: "name coverPhoto theme participants"
            })

        if (!user) {
            return res.status(200).json([])
        }
        const activity = []
        const sortedRooms = user.recentRooms.sort((a, b) => b.joinedAt - a.joinedAt)
        sortedRooms.map(room => {
            return activity.push(room.roomId)
        })

        return res.status(200).json(activity)
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server error" })
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

module.exports = {
    patchEditUsername,
    patchEditProfilePic,
    sendVerificationEmail,
    verifyMyEmail,
    loginUser,
    signupUser,
    getUser,
    getUserActivity,
    logoutUser,
}