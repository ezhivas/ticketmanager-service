import {Request, Response, NextFunction} from 'express';

const roleMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            const userRole = req.user?.role;
            if(!userRole || userRole !== 'admin') {
                res.status(403).send('Access denied');
                return;
            }
            next();
        } catch (error) {
            next(error);
        }
    };
};
export default roleMiddleware;