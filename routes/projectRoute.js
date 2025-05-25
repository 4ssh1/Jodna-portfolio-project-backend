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
             .delete('/delete-project/:projectId', protect, deleteProject) // route for getting total likes and follows should be done
             .delete('/delete-draft/:draftId', protect, deleteDraft)
             .get('/search', filterProject)


module.exports = projectRouter

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API endpoints for managing projects and related actions
 */

/**
 * @swagger
 * /api/project/profile-picture:
 *   patch:
 *     summary: Upload or update project profile picture
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               'profile-pic':
 *                 type: string
 *                 format: binary
 *             required:
 *               - 'profile-pic'
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/project/update/{id}:
 *   patch:
 *     summary: Update project details by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Project ID
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Project fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               githubLink:
 *                 type: string
 *               liveLink:
 *                 type: string
 *               category:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               isDraft:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: User not authorised
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/project/create:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Project data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - githubLink
 *               - category
 *               - technologies
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               githubLink:
 *                 type: string
 *               liveLink:
 *                 type: string
 *               category:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               isDraft:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/project/like/{id}:
 *   post:
 *     summary: Like a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Project ID to like
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project liked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/project/bookmark/{id}:
 *   post:
 *     summary: Bookmark a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Project ID to bookmark
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project bookmarked successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/project/follow/{id}:
 *   post:
 *     summary: Follow a project owner by project ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Project ID to follow owner
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Followed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project or user not found
 */

/**
 * @swagger
 * /api/project/create-comment/{id}:
 *   post:
 *     summary: Create a comment on a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Project ID to comment on
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Comment text
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/project/update-comment/{id}:
 *   patch:
 *     summary: Update a comment by comment ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Comment ID to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated comment text
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/project/comments/{id}:
 *   get:
 *     summary: Get all comments for a project by project ID
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Project ID to get comments for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   comment:
 *                     type: string
 *                   createdBy:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Project or comments not found
 */

/**
 * @swagger
 * /api/project/projects:
 *   get:
 *     summary: Get all published projects (non-draft)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of published projects
 */

/**
 * @swagger
 * /api/project/drafts:
 *   get:
 *     summary: Get all drafts for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of draft projects
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/project/draft/{projectId}:
 *   get:
 *     summary: Get a draft project by ID for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         description: Draft project ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Draft project found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Draft project not found
 */

/**
 * @swagger
 * /api/project/project/{projectId}:
 *   get:
 *     summary: Get a published project by ID for authenticated users
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         description: Project ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project found
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/project/delete-comment/{id}:
 *   delete:
 *     summary: Delete a comment by comment ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Comment ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Comment not found
 */

/**
 * @swagger
 * /api/project/delete-project/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Project ID
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Project not found
 */

/**
 * @swagger
 * /api/project/search:
 *   get:
 *     summary: Search projects with filters
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter projects by category
 *       - in: query
 *         name: technologies
 *         schema:
 *           type: string
 *         description: Comma-separated list of technologies
 *       - in: query
 *         name: searchMany
 *         schema:
 *           type: string
 *         description: Search term for title, category, or technologies
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: Filter projects by user ID
 *     responses:
 *       200:
 *         description: List of filtered projects
 *       404:
 *         description: No projects found
 */

/**
 * @swagger
 * /api/project/all-projects:
 *   get:
 *     summary: Get all projects (including drafts and published)
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of all projects
 */


