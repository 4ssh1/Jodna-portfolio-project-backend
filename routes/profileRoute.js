const express = require('express')
const profileRouter = express.Router()
const protect = require('../middlewares/protect')
const rateLimiter = require('../middlewares/rateLimiter')
const upload = require('../utils/multer')
const {getUser, updateUser, uploadProfilePicture, deleteUser} = require('../controllers/userController')

profileRouter.get('/:id', getUser)
             .patch('/:id', protect, updateUser)
             .patch('/:id/profile-pic', protect, rateLimiter ,upload.single('image'), uploadProfilePicture)
             .delete('/:id', protect, deleteUser)


module.exports = profileRouter

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: API endpoints for user profile management
 */

/**
 * @swagger
 * /api/v1/profiles/{id}:
 *   get:
 *     summary: Get user profile by user ID
 *     tags: [Profile]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID to fetch profile for
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 profilePicture:
 *                   type: string
 *                 # Add other user fields as applicable
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/profiles/{id}:
 *   patch:
 *     summary: Update user profile by ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User profile fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *               # Add other updatable fields here
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1/profiles/{id}/profile-pic:
 *   patch:
 *     summary: Upload or update profile picture
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID whose profile picture to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *             required:
 *               - image
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/profiles/{id}:
 *   delete:
 *     summary: Delete user profile by ID
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
