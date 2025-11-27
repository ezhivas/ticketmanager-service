import {Request, Response} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';


const JWT_SECRET = (process.env.JWT_SECRET) as string;

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });
        res.status(201).json(newUser);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({error: 'User not found'});
            return; // Тут у тебя было правильно!
        }
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const {username, email, password} = req.body;
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({error: 'User not found'});
            return; // FIX: Обязательно выходим, иначе код ниже упадет!
        }

        user!.username = username || user!.username;
        user!.email = email || user!.email;

        if (password) {
            user!.password = await bcrypt.hash(password, 10);
        }

        await user!.save();
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({error: 'User not found'});
            return; // FIX: Добавлен return
        }

        await user!.destroy();
        res.status(200).json({message: 'User deleted successfully'});
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const deleteAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        // FIX: Используем User (класс), а не user (переменную, которой нет)
        await User.destroy({where: {}});
        res.status(200).json({message: 'All users deleted successfully'});
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            res.status(404).json({error: 'No user with this email'});
            return; // FIX: Добавлен return
        }

        const isPasswordValid = await bcrypt.compare(password, user!.password);

        if (!isPasswordValid) {
            res.status(401).json({error: 'Invalid password'});
            return; // FIX: Добавлен return
        }

        const token = jwt.sign(
            {id: user!.id, email: user!.email, username: user!.username, role: user!.role},
            JWT_SECRET,
            {expiresIn: '24h'}
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {id: user!.id, email: user!.email, role: user!.role}
        });

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};