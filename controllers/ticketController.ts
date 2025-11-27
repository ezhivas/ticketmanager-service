import {Request, Response} from 'express';
import Ticket, {TicketHistoryItem} from '../models/ticket';
import {Op} from 'sequelize';

export const createTicket = async (req: Request, res: Response) => {
    try {
        const {title, description, status, priority} = req.body;
        const userEmail = req.user?.email || 'unknown';

        const newTicket = await Ticket.create({
            title,
            description,
            status,
            priority,
            createdBy: userEmail,
        });

        res.status(201).json(newTicket);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const getAllTickets = async (req: Request, res: Response) => {
    try {
        const tickets = await Ticket.findAll();
        res.status(200).json(tickets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};


export const updateTicket = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const {title, description, status, priority} = req.body;
        const userEmail = req.user?.email || 'unknown';

        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            res.status(404).json({error: 'Ticket not found'});
            return;
        }

        const historyItem: TicketHistoryItem = {
            title: ticket.title,
            description: ticket.description,
            status: ticket.status,
            priority: ticket.priority,
            updatedBy: ticket.lastUpdatedBy,
            archivedAt: new Date()
        };

        const currentHistory = ticket.previousState || [];
        ticket.previousState = [...currentHistory, historyItem];

        ticket.title = title || ticket.title;
        ticket.description = description || ticket.description;
        ticket.status = status || ticket.status;
        ticket.priority = priority || ticket.priority;

        ticket.lastUpdatedBy = userEmail;

        await ticket.save();
        res.status(200).json(ticket);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({error: 'Ticket Not Found'});
        }

        await ticket.destroy();
        res.status(200).json({message: 'Ticket Deleted'});
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const getTicketById = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({error: 'Ticket Not Found'});
        }
        res.status(200).json(ticket);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const getTicketByStatus = async (req: Request, res: Response) => {
    try {
        const {status} = req.params;
        const tickets = await Ticket.findAll({where: {status: status}});
        res.status(200).json(tickets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const getTicketByPriority = async (req: Request, res: Response) => {
    try {
        const {priority} = req.params;
        const tickets = await Ticket.findAll({where: {priority: priority}});
        res.status(200).json(tickets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
};

export const getTicketByText = async (req: Request, res: Response) => {
    try {
        const {text} = req.body;
        const tickets = await Ticket.findAll({
            where: {
                [Op.or]: [{
                    title: {
                        [Op.like]: `%${text}%`
                    },
                    description: {
                        [Op.like]: `%${text}%`,
                    }
                }]
            }
        });
        res.status(201).json(tickets);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            // if unknown type
            res.status(500).json({ error: 'Unknown error occurred' });
        }
    }
}
