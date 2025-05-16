const express = require('express')
const projectRouter = express.Router()
const protect = require('../middlewares/protect')
const rateLimiter = require('../middlewares/rateLimiter')
const { likePortfolio, bookMarkPortfolio, followPortfolio, createComment, 
    getComments, updateComment, deleteComment } = require('../controllers/engagementController')
const { uploadProjectPicture, createProject, getDrafts, deleteDraft, getDraft, getProject,
    getPublishedProjects, filterProject, updateProject, deleteProject} = require('../controllers/projectController')
const upload = require('../utils/multer')

projectRouter.patch('/profile-picture', protect, rateLimiter ,upload.single('profile-pic'),uploadProjectPicture)
             .post('/create', protect, createProject)
             .delete('/delete/:id', protect, deleteProject)
             .delete('/delete-draft/:id', protect, deleteDraft)
             .get('/projects', getPublishedProjects)
             .get('/search', filterProject)
             .patch('update/:id', protect, updateProject)
             .get('/drafts', protect, getDrafts)
             .post('/like/:id', protect, likePortfolio)
             .post('/bookmark/:id', protect, bookMarkPortfolio)
             .post('/follow/:id', protect, followPortfolio)
             .post('/create-comment/:id', protect, createComment)
             .get('/comment', getComments)
             .patch('/update-comment/:id', protect, updateComment)
             .delete('/delete-comment/:id', protect, deleteComment)
             .get('/draft/:id', protect, getDraft)
             .get('/project/:id', protect, getProject)


module.exports = projectRouter
