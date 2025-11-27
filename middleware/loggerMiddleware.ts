import { Request, Response, NextFunction } from 'express';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const date = new Date();

        const userEmail = req.user?.email || 'anonymous';

        console.log(
            `[${date.toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms) - ${userEmail}`
        );
    });

    next();
};

export default loggerMiddleware;
