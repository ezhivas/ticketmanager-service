import {Request, Response, NextFunction} from 'express';

const roleMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            // const user = (req as any).user;
            const userRole = req.user?.role;
            if(!userRole || userRole !== 'admin') {
                res.status(401).send('Access denied');
                return;
            }
            next();
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                // if unknown type
                res.status(500).json({ error: 'Unknown error occurred' });
            }
        }
    };
};
export default roleMiddleware;