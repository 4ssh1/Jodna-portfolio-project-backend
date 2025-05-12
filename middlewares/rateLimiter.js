const rateLimit = require('express-rate-limit')

const uploadLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: "Too many uploads from this IP, Please try again later."
})

module.exports = uploadLimit