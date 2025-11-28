import {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import {config} from "../config/env";
import {sendVerificationEmail} from "../utils/emailService";
import sequelize from "../config/database";


const JWT_SECRET = config.jwtSecret;

export const createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    const t = await sequelize.transaction();

    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        }, { transaction: t });

        const verificationToken = jwt.sign(
            { id: newUser.id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const isEmailSent = await sendVerificationEmail(newUser.email, verificationToken);

        if (!isEmailSent) {
            await t.rollback();

            res.status(500).json({
                error: 'Failed to send verification email. User registration cancelled. Please try again later.'
            });
            return;
        }

        await t.commit();

        res.status(201).json({
            message: 'User created. Please verify your email inbox',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        await t.rollback();
        next(error);
    }
};


export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { token } = req.query;

        if (!token) {
            res.status(400).json({ error: 'Token is missing' });
            return;
        }

        const decoded = jwt.verify(token as string, config.jwtSecret) as { id: number };

        const user = await User.findByPk(decoded.id);

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (user.isVerified) {
            res.status(200).send('Email is already verified. You can login.');
            return;
        }

        user.isVerified = true;
        await user.save();

        res.status(200).send(`
            <h1>Email verified successfully!</h1>
            <p>You can now close this tab and login to the application.</p>
        `);


    } catch (error) {
        res.status(400).send('Invalid or expired verification token.');
        next(error);
    }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({error: 'User not found'});
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {id} = req.params;
        const {username, email, password} = req.body;
        const user = await User.findByPk(id);

        if (!user) {
            res.status(404).json({error: 'User not found'});
            return;
        }

        user!.username = username || user!.username;
        user!.email = email || user!.email;

        if (password) {
            user!.password = await bcrypt.hash(password, 10);
        }

        await user!.save();

        await user!.reload({
            attributes: {exclude: ['password']}
        });

        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
        next(error);
    }
};

export const deleteAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // delete all non-admin users
        await User.destroy({
            where: {
                role: 'user'
            }
        });
        res.status(200).json({message: 'All users deleted successfully'});
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if (!user) {
            res.status(404).json({error: 'No user with this email'});
            return;
        }

        if (!user.isVerified) {
            res.status(403).json({error: 'Please verify your email first'});
            return;
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
        next(error);
    }
};