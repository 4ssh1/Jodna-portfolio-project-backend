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

/**
 * @swagger
 * tags:
 *   name: User
 *   description: API endpoints for user authentication and management
 */

/**
 * @swagger
 * /api/user/log-in:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     requestBody:
 *       description: User login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully with token
 *       400:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/user/sign-in:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       description: User registration details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/user/log-out:
 *   post:
 *     summary: Log out the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/views/{id}:
 *   get:
 *     summary: Get the number of views for a user profile
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User ID to get views count
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Views count retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 views:
 *                   type: integer
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/user/refresh-token:
 *   post:
 *     summary: Refresh JWT token for authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/add-subscribers:
 *   post:
 *     summary: Add a subscriber to the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Subscriber details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscriberId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subscriber added successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/remove-subscriber/{id}:
 *   delete:
 *     summary: Remove a subscriber by subscriber ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Subscriber ID to remove
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscriber removed successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Subscriber not found
 */

/**
 * @swagger
 * /api/user/subscribers:
 *   get:
 *     summary: Get subscribers of the authorized user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscribers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   subscriberId:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/user/all-users:
 *   get:
 *     summary: Get all users (admin or authorized users only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       401:
 *         description: Unauthorized
 */
