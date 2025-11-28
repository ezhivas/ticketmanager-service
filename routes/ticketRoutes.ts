import express from 'express';

import {createTicket, getTicketById, getAllTickets, deleteTicket, updateTicket, getTicketByText} from '../controllers/ticketController';

import validateTicket from '../middleware/ticketValidationMiddleware';
import authMiddleware from '../middleware/authMiddleware';
import roleMiddleware  from '../middleware/roleMiddleware';

const router = express.Router();

router.use(authMiddleware);

router.get('/tickets', getAllTickets);
router.get('/tickets/:id', getTicketById);

router.post('/tickets', validateTicket, createTicket);
router.put('/tickets/:id', validateTicket, updateTicket);
router.delete('/tickets/:id', roleMiddleware(), deleteTicket);

router.post('/tickets/find', roleMiddleware(), getTicketByText);

export default router;
