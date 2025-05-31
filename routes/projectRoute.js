const express = require('express')
const projectRouter = express.Router()
const protect = require('../middlewares/protect')
const rateLimiter = require('../middlewares/rateLimiter')
const { likePortfolio, bookMarkPortfolio, followPortfolio, createComment, getComments, updateComment, deleteComment, getBookmarks, 
    getFollowers, getFollowing, getLikes } = require('../controllers/engagementController')
const { uploadProjectPicture, createProject, getDrafts, deleteDraft, getDraft, getProject,
    getPublishedProjects, filterProject, updateProject, deleteProject} = require('../controllers/projectController')
const upload = require('../utils/multer')

projectRouter.patch('/project-pictures', protect, rateLimiter ,upload.single('profile-pic'),uploadProjectPicture)
             .patch('/:id/updates', protect, updateProject)
             .patch('/:id/comments', protect, updateComment)
             .get('/:id/comments', getComments)
             .get('/', getPublishedProjects)
             .get('/:id', protect, getProject)
             .get('/drafts', protect, getDrafts)
             .get('/:id/drafts', protect, getDraft)
             .get('/search', filterProject)
             .get('/:id/likes', getLikes)
             .get('/:id/bookmarks', getBookmarks)
             .get('/:id/follows', getFollowing)
             .get('/:id/followers', getFollowers)
             .post('/', protect, createProject)
             .post('/:id/likes', protect, likePortfolio)
             .post('/:id/bookmarks', protect, bookMarkPortfolio)
             .post('/:id/follows', protect, followPortfolio)
             .post('/:id/comments', protect, createComment)
             .delete('/:id/comments', protect, deleteComment)
             .delete('/:id/projects', protect, deleteProject) 
             .delete('/:id/drafts', protect, deleteDraft)


module.exports = projectRouter

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: API endpoints for managing projects and related actions
 */

/**
 * @swagger
 * /api/v1/projects/project-pictures:
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
 *               profile-pic:
 *                 type: string
 *                 format: binary
 *             required:
 *               - profile-pic
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/projects/{id}/updates:
 *   patch:
 *     summary: Update project details by projectID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
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
 */

/**
 * @swagger
 * /api/v1/projects/{id}/comments:
 *   patch:
 *     summary: Update a comment by commentID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
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
 */

/**
 * @swagger
 * /api/v1/projects/{id}/comments:
 *   get:
 *     summary: Get comments for a project by projectID
 *     tags: [Projects]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 */

/**
 * @swagger
 * /api/v1/projects:
 *   get:
 *     summary: Get all published projects
 *     security: []
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of published projects
 */

/**
 * @swagger
 * /api/v1/projects/{id}:
 *   get:
 *     summary: Get project by user ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 */

/**
 * @swagger
 * /api/v1/projects/drafts:
 *   get:
 *     summary: Get drafts
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Drafts retrieved
 */

/**
 * @swagger
 * /api/v1/projects/{id}/drafts:
 *   get:
 *     summary: Get draft by user ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Draft retrieved
 */

/**
 * @swagger
 * /api/v1/projects/search:
 *   get:
 *     security: []
 *     summary: Search projects
 *     tags: [Projects]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: technologies
 *         schema:
 *           type: string
 *       - in: query
 *         name: searchMany
 *         schema:
 *           type: string
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Filtered projects
 */

/**
 * @swagger
 * /api/v1/projects/{id}/likes:
 *   get:
 *     security: []
 *     summary: Get all likes by projectID
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of likes
 */

/**
 * @swagger
 * /api/v1/projects/{id}/bookmarks:
 *   get:
 *     security: []
 *     summary: Get all bookmarks by projectID
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of bookmarks
 */

/**
 * @swagger
 * /api/v1/projects/{id}/follows:
 *   get:
 *     security: []
 *     summary: Get all followed users using userID
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of followed users
 */

/**
 * @swagger
 * /api/v1/projects/{id}/followers:
 *   get:
 *     security: []
 *     summary: Get all followers using userID
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: List of followers
 */

/**
 * @swagger
 * /api/v1/projects:
 *   post:
 *     summary: Create project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
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
 *         description: Project created
 */

/**
 * @swagger
 * /api/v1/projects/{id}/likes:
 *   post:
 *     summary: Like a project, id is projectID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liked successfully
 */

/**
 * @swagger
 * /api/v1/projects/{id}/bookmarks:
 *   post:
 *     summary: Bookmark a project with projectID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmarked successfully
 */

/**
 * @swagger
 * /api/v1/projects/{id}/follows:
 *   post:
 *     summary: Follow a project with projectID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Followed successfully
 */

/**
 * @swagger
 * /api/v1/projects/{id}/comments:
 *   post:
 *     summary: Comment on portfolio with portfolioID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
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
 *         description: Comment added
 */

/**
 * @swagger
 * /api/v1/projects/{id}/comments:
 *   delete:
 *     summary: Delete comment with commentID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted
 */

/**
 * @swagger
 * /api/v1/projects/{id}/projects:
 *   delete:
 *     summary: Delete project with projectID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 */

/**
 * @swagger
 * /api/v1/projects/{id}/drafts:
 *   delete:
 *     summary: Delete draft project with draftID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Draft deleted
 */


