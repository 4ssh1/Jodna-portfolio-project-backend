const express = require('express')
const userRouter = express.Router()
const {logOutUser, loginUser, registerUser, getSubscribers, authorise, removeSubscribers, refreshToken, addSubscriber} = require('../controllers/authController')
const {getAllUser, viewsOfUsers} = require('../controllers/userController')
const protect = require('../middlewares/protect')

userRouter.post('/login', loginUser)
          .post('/sign-in', registerUser)
          .post('/log-out', logOutUser)
          .get('/subscribers', authorise, getSubscribers)
          .get('all-users', authorise, getAllUser)
          .get('views', viewsOfUsers)
          .post('refresh-token', refreshToken)
          .post('add-subscribers', protect, addSubscriber)

module.exports = userRouter