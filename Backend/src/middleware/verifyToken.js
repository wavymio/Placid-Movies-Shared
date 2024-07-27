const jwt = require('jsonwebtoken')
const jwtSecret = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    try {
        const jwtToken = req.cookies.jwt
        
        if (!jwtToken) {
            return res.status(401).json({ error: "Unauthorized" })
        }

        const decoded = jwt.verify(jwtToken, jwtSecret)

        if (!decoded) {
            return res.status(401).json({ error: "Invalid Token" })
        }

        req.userId = decoded.userId
        next()
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: "Internal Server Error"})
    }
}

module.exports = verifyToken