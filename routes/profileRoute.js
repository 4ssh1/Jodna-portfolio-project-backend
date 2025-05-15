const express = require('express')
const profileRouter = express.Router()
const protect = require('../middlewares/protect')
const rateLimiter = require('../middlewares/rateLimiter')
const upload = require('../utils/multer')
const {getUser, updateUser, uploadProfilePicture, deleteUser} = require('../controllers/userController')

profileRouter.get('/me/:id', getUser)
             .patch('/update/:id', protect, updateUser)
             .patch('/upload-pic/:id', protect, rateLimiter ,upload.single('image'), uploadProfilePicture)
             .delete('/delete/:id', protect, deleteUser)


module.exports = profileRouter