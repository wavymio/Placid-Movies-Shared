const User = require("../models/users")

const getUser = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select("-password")

        if (!user) {
            return res.status(400).json({ error: "User not found" })
        }
        
        return res.status(200).json(user)
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

module.exports = {
    getUser
}