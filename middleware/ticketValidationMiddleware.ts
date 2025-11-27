import { Request, Response, NextFunction } from "express";
import Joi from "joi";

const ticketSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  status: Joi.string().valid('new','open', 'in_progress', 'closed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
});

const validateTicket = (req: Request, res: Response, next: NextFunction) => {
    const {error} = ticketSchema.validate(req.body);
    if (error) {
        res.status(400).json({error: error.details[0].message});
        return;
    }
    next();
}

export default validateTicket;
