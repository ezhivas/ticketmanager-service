import { Request, Response } from 'express';
import Ticket, { TicketHistoryItem } from '../models/ticket';

interface AuthRequest extends Request {
    user?:{
        id: number;
        email: string;
        role: string;
    }
}

export const createTicket = async (req: AuthRequest, res: Response) => {
    try{
        const { title, description, status, priority} = req.body;
        const userEmail = req.user?.email || 'unknown';

        const newTicket = await Ticket.create({
            title,
            description,
            status,
            priority,
            createdBy: userEmail,
        });

        res.status(201).json(newTicket);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllTickets = async(req: Request, res: Response) => {
    try{
        const tickets = await Ticket.findAll();
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(404).json({ error: error.message });
    }
};




export const updateTicket = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, status, priority } = req.body;
        const userEmail = req.user?.email || 'unknown';

        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            res.status(404).json({ error: 'Ticket not found' });
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
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteTicket = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket Not Found' });
        }

        await Ticket.destroy();
        res.status(200).json({ message: 'Ticket Deleted' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const  getTicketById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const ticket = await Ticket.findByPk(id);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket Not Found' });
        }
        res.status(200).json(ticket);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTicketByStatus = async (req: Request, res: Response) => {
    try {
        const { status } = req.params;
        const tickets = await Ticket.findAll({where: {status: status as any} });
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getTicketByPriority = async (req: Request, res: Response) => {
    try {
        const { priority } = req.params;
        const tickets = await Ticket.findAll({where: {status: priority as any} });
        res.status(200).json(tickets);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
