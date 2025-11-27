import express from 'express';

import {createTicket, getTicketById, getAllTickets, getTicketByStatus, deleteTicket, getTicketByPriority, updateTicket} from '../controllers/ticketController';

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

router.get('/tickets/priority/:priority', roleMiddleware(), getTicketByPriority);
router.get('/tickets/status/:status', roleMiddleware(), getTicketByStatus);

export default router;
