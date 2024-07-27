const User = require("../models/users")

const searchUsernameAndRooms = async (req, res) => {
    try {
        const { searchInput } = req.body

        const pattern = new RegExp(searchInput.split('').join('.*'), 'i')
        const users = await User.find({ username: { $regex: pattern } }).select("-password").limit(6)
        
        if (users.length === 0) {
            return res.status(200).json([])
        }

        return res.status(200).json(users)

    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    searchUsernameAndRooms
}