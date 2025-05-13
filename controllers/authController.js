const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const Project = require('../models/projectModel')
const {genAccessToken, genRefreshToken} = require('../middlewares/token')
const Subscriber = require('../models/subscriberModel')
const sendEmail = require('../utils/emailService');

const registerUser = async (req, res)=>{
    try {
        const {firstname, lastname, email, password} = req.body

        const user = new User({
            firstname, lastname, email, password
        })

        user.fullname = `${firstname} ${lastname}`

        const _user = await user.save()  // without the _user variable i would be able to use user in the respective places as it alters user

        await Project.create({ user: _user._id });

        const accessToken = genAccessToken(_user)
        const refreshToken = genRefreshToken(_user)

        _user.password = undefined

            return res.status(200).cookie('refreshToken', refreshToken, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 7 * 24 * 60 * 60 * 1000
                }).json({
                    status: "Successful",
                    message: "User registered successfully",
                    data: {
                        _user, accessToken, refreshToken
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

        if(!user) return res.status(404).json({
            status: "Error",
            message: "Email or password does not exist"
        })

        const passwordCheck = await user.isValidatePassword(password)
        if(!passwordCheck) return res.status(404).json({
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
            message: "User logged in successfully",
            data:{
                user,
                genAccessToken,
                refreshToken
            }
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

        if(!validToken) return res.status(404).json({
            status: "Error",
            message: "Invalid token or token has expired"
        })

        res.status(200).clearCookie('refreshToken', {
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
            message: "User not logged out",
            error: error.message
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
            data:{
                subscribers
            }
        })
        
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            message: "User not subscribed",
            error: error.message
        })
    }
}

const removeSubscribers = async (req, res) => {
    try {
        const {subscriberId} = req.params

        const subscriber = await Subscriber.findById(subscriberId)

        if(!subscriber){
            return res.status(404).json({
                status: "Error",
                message: "Subscriber not found"
            })
        }

        await Subscriber.deleteOne({
            _id: subscriberId
        })

        res.status(200).json({
            status: "Successsful",
            message: "Subcriber removed successfully",
            data: {
                subscriber
            }
        })
        
    } catch (error) {
         return res.status(500).json({
            status: "Error",
            message: "Error removing subscribers",
            error: error.message
        })
    }
}

const refreshToken = async (req, res)=>{
    try {
        const token = req.cookies.refreshToken
        if (!token) return res.status(401).json({
            status: "Error",
            message: "Not authorized"
        })

        const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(payload.id)
        if (!user) return res.status(403).json({
            status: "Error",
            message: "User not found"
        })

        const accessToken = genAccessToken(user)
        const refreshToken = genRefreshToken(user)

        res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({ accessToken });

    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired refresh token' });
 
    }
}

const addSubscriber = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Already subscribed' });
    }

    const subscriber = await Subscriber.create({ email });

    // Send welcome email
    await sendEmail(
      email,
      'Thanks for Subscribing!',
      `<h2>Welcome!</h2><p>You’re now subscribed to our updates 🎉</p>`
    );

    res.status(201).json({
      status: "Successful",
      message: 'Subscribed successfully, email sent!',
      data: {
        subscriber
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
}

const authorise = async (req, res, next) => {
    const user = req.user;
    if(user.role !== "admin"){
        return res.status(401).json({
            status: "failed",
            message: "you are not authorised"
        })
    }
    next()
}

module.exports = {registerUser, loginUser, logOutUser, getSubscribers, removeSubscribers, refreshToken, addSubscriber, authorise}

