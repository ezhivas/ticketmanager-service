import {Request, Response, NextFunction} from 'express';

const roleMiddleware = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        try{
            // const user = (req as any).user;
            const userRole = (req as any).user?.role;
            if(!userRole || userRole !== 'admin') {
                res.status(401).send('Access denied');
                return;
            }
            next();
        } catch (error: any){
            res.status(500).json({error: error.message});
        }
    };
};
export default roleMiddleware;