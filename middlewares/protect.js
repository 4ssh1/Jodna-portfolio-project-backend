const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const protect = async (req, res, next)=>{
    const token = req.cookies.refreshToken
    if(!token) return res.status(404).json({
        status: "Error",
        message: "User not authorized"
    })

    const verifyUser = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findOne({_id: verifyUser.id}).select("-password")

    if(!user){
        return res.status(404).json({
            status: "Error",
            message: "User not found"
        })
    }

    req.user = user

next()

}

module.exports = protect