const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next)=>{
    try {
        
        const token = req.cookies.refreshToken
    
        if(!token) return res.status(401).json({
            status: "Error",
            message: "User not authorized"
        })
    
        const verifyUser = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findOne({_id: verifyUser.id}).select("-password")
        soc
    
        if(!user){
            return res.status(404).json({
                status: "Error",
                message: "User not found"
            })
        }
    
        req.user = user
    
    next()
    } catch (error) {
        return res.status(401).json({
            status: "Error",
            message: "Invalid or expired token"
        })    
    }

}

module.exports = protect