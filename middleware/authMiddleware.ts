import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import {Request, Response, NextFunction} from 'express';
import {UserPayload} from "../types";


const JWT_SECRET = config.jwtSecret;

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ error: 'No token provided' });
        return;
    }

    const token = authHeader!.startsWith('Bearer ') ? authHeader!.slice(7) : authHeader;

    jwt.verify(token!, JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ error: 'Failed to verify token' });
            return;
        }
        req.user = decoded as UserPayload;

        next();
    });
}

export default authMiddleware;