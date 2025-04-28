const express = require('express')
const userRouter = express.Router()
const {logOutUser, loginUser, registerUser} = require('../controllers/authController')

userRouter.post('/login', loginUser)
          .post('/sign-in', registerUser)
          .post('/log-out', logOutUser)

module.exports = userRouter