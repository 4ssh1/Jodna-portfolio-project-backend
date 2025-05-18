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
             .patch('/update/:id', protect, updateProject)
             .post('/create', protect, createProject)
             .post('/like/:id', protect, likePortfolio)
             .post('/bookmark/:id', protect, bookMarkPortfolio)
             .post('/follow/:id', protect, followPortfolio)
             .post('/create-comment/:id', protect, createComment)
             .patch('/update-comment/:id', protect, updateComment)
             .get('/comments/:id', getComments)
             .get('/projects', getPublishedProjects)
             .get('/drafts', protect, getDrafts)
             .get('/draft/:projectId', protect, getDraft)
             .get('/project/:projectId', protect, getProject)
             .delete('/delete-comment/:id', protect, deleteComment)
             .delete('/delete-project/:projectId', protect, deleteProject) // last two routes needs to nbe checked and also route for getting total likes and follows should be done
             .delete('/delete-draft/:projectId', protect, deleteDraft)
             .get('/search', filterProject)


module.exports = projectRouter
