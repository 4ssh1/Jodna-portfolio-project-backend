const express = require('express')
const userRouter = express.Router()
const {logOutUser, loginUser, registerUser, getSubscribers, authorise, removeSubscribers, refreshToken, addSubscriber} = require('../controllers/authController')
const {getAllUser, viewsOfUser} = require('../controllers/userController')
const protect = require('../middlewares/protect')

userRouter.post('/log-in', loginUser)
          .post('/sign-in', registerUser)
          .post('/log-out', logOutUser)
          .get('/views/:id', viewsOfUser)
          .post('/refresh-token', protect, refreshToken)
          .post('/add-subscribers', protect, addSubscriber)
          .delete('/remove-subscriber/:id', protect, removeSubscribers)
          .get('/subscribers', authorise, getSubscribers) // check this with authorised user
          .get('/all-users', authorise, getAllUser)

module.exports = userRouter