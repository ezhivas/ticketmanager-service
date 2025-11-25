const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Route to login (no auth required)
router.post('/login', userController.loginUser);

// Route to create a new user (no auth required for registration)
router.post('/users', validateUser, userController.createUser);

// Route to get all users (no auth required)
router.get('/users', userController.getAllUsers);

// Route to get a user by ID (no auth required)
router.get('/users/:id', userController.getUserById);

// Route to update a user by ID (auth required)
router.put('/users/:id', authMiddleware, validateUser, userController.updateUser);

// Route to delete a user by ID (auth required)
router.delete('/users/:id', authMiddleware, userController.deleteUser);

module.exports = router;

