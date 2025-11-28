import express from 'express';

import {
    login,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    deleteAllUsers,
    verifyEmail
} from '../controllers/userController';



import validateUser from '../middleware/validationMiddleware';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware from '../middleware/roleMiddleware';

const router = express.Router();

router.post('/login', login);
router.get('/verify-email', verifyEmail);

router.use(authMiddleware);

router.post('/users', validateUser, createUser);
router.get('/users', roleMiddleware(), getAllUsers);
router.get('/users/:id', roleMiddleware(), getUserById);
router.put('/users/:id', roleMiddleware(), validateUser, updateUser);
router.delete('/users/:id', roleMiddleware(), deleteUser);
router.delete('/users/all', roleMiddleware(), deleteAllUsers);

export default router;