const { body, validationResult } = require('express-validator')

const handleValidationErrors = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    next()
}

const validateMyUserRequest = [
    body("username").isString().notEmpty().withMessage("Username must be a string"),
    body("password").isString().notEmpty().withMessage("Password must be a string"),
    handleValidationErrors,
]

module.exports = {
    validateMyUserRequest
}