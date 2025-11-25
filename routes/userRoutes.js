const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validateUser = require('../middleware/validationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/login', userController.loginUser);
router.post('/users', validateUser, userController.createUser);
router.get('/users', authMiddleware, roleMiddleware(), userController.getAllUsers);
router.get('/users/:id', authMiddleware, roleMiddleware(), userController.getUserById);
router.put('/users/:id', authMiddleware, roleMiddleware(), validateUser, userController.updateUser);
router.delete('/users/:id', authMiddleware, roleMiddleware(), userController.deleteUser);

module.exports = router;

