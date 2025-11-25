const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', userController.loginUser);
router.post('/users', validateUser, userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', authMiddleware, validateUser, userController.updateUser);
router.delete('/users/:id', authMiddleware, userController.deleteUser);

module.exports = router;

