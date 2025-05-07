const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const {genAccessToken, genRefreshToken} = require('../middlewares/token')
const Subscriber = require('../models/subscriberModel')

const registerUser = async (req, res)=>{
    try {
        const {firstname, lastname, email, password, role} = req.body

        const user = new User({
            firstname, lastname, email, password, role 
        })

        user.fullname = `${firstname} ${lastname}`
        const _user = await user.save()

        if(!_user) return res.status(400).json({
            status: "Error",
            message: "Enter all credentials"
        })

        const accessToken = genAccessToken(user)
        const refreshToken = genRefreshToken(user)

        user.password = undefined

            return res.status(200).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                }).Userjson({
                    status: "Successful",
                    message: "User registered successfully",
                    data: {
                        user, accessToken, refreshToken
                    }
                })
            
    } catch (err) {
        return res.status(500).json({
            status: "Error",
            message: "User not registered, try again",
            error: err.message
        })
    }
}

const loginUser = async (req, res)=>{
    try {
        const {email, password} = req.body
        const user = await User.findOne({email}).select('-password')

        if(!user) return res.status(400).json({
            status: "Error",
            message: "Email or password does not exist"
        })

        const passwordCheck = await user.isValidatePassword(password)
        if(!passwordCheck) return res.status(400).json({
            status: "Error",
            message: "Invalid Email or password"
        })

        const genAccessToken = genAccessToken(user)
        const refreshToken = genRefreshToken(user)

        return  res.status(200).cookie('refreshToken', refreshToken,{
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === "production"
        }).json({
            status: "Successful",
            message: "User logged in successfully"
        })
        
    } catch (err) {
        return  res.status(500).json({
            status: "Error",
            message: "User not logged in",
            error: err.message
        })
    }
}

const logOutUser = (req, res)=>{
    const token = res.cookie.refreshToken
    if(!token) return res.status(401).json({
        status: "Error",
        message: "No token"
    })

    try {
        const validToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)

        if(!validToken) return res.status(200).json({
            status: "Error",
            message: "Invalid token or token has expired"
        })

        return  res.status(200).clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        }).json({
            status: "Successful",
            message: `User ${validToken.id}  logged out successfully`,
        })
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "User not logged out"
        })
    }

}

const getSubscribers = async (req, res) => {
    try {
        const {email} = req.body
        if(!email){
            return res.status(404).json({
                status: "Error",
                message: "Email is required"
            })
        }

        const subscribers = Subscriber.create({email})

        return res.status(201).json({
            status: "Success",
            message: "User suscribed successfully",
            subscribers
        })
        
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "Server-error",
            err: error.message
        })
    }
}

module.exports = {registerUser, loginUser, logOutUser, getSubscribers}

// 