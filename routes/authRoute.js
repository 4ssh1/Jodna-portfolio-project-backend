const express = require('express')
const authRouter = express.Router()
const {logOutUser, loginUser, registerUser, refreshToken} = require('../controllers/authController')
const protect = require('../middlewares/protect')


authRouter.post('/refresh-token', protect, refreshToken)
          .post('/log-in', loginUser)
          .post('/sign-in', registerUser)
          .post('/log-out', logOutUser)

module.exports = authRouter

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API endpoints for user authentication 
 */

/**
 * @swagger
 * /api/v1/auth/log-in:
 *   post:
 *     summary: Log in a user
 *     tags: [User]
 *     security: []
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
 * /api/v1/auth/sign-in:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     security: []
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
 * /api/v1/auth/log-out:
 *   post:
 *     summary: Log out the authenticated user
 *     tags: [User]
 *     security: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/v1/auth/refresh-token:
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