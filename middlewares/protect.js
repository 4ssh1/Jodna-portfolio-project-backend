const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const protect = async (res, req, next)=>{
    const token = res.cookie.refreshToken

    if(!token) return res.status(404).json({
        status: "Error",
        message: "User not authorized"
    })

    const verifyUser = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findOne({_id: verifyUser.id}).select(-password)

    req.user = await User.findById(decoded._id).select('-password');

    if(!user) return res.staus(404).json({
        status: "Error",
        message: "User not found"
    })

    next()
    return res.status(200).json({
        status: "Successful",
        messsage: "User is authorized"
    }  
)


}

module.exports = protect