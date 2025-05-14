const express = require('express')
const profileRouter = express.Router()
const {protect} = require('../middlewares/protect')
const {getUser, updateUser, uploadProfilePicture, deleteUser} = require('../controllers/userController')

profileRouter.get('/me/:id', getUser)
             .patch('/update/:id', protect, updateUser)
             .patch('/upload-pic/:id', protect, uploadProfilePicture)
             .delete('/delete/:id', protect, deleteUser)


module.exports = profileRouter