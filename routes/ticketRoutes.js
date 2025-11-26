const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const validateTicket = require('../middleware/ticketValidationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/:id', ticketController.getTicketById);
router.post('/tickets', authMiddleware, validateTicket, ticketController.createTicket);
router.put('/tickets/:id', authMiddleware, validateTicket, ticketController.updateTicket);
router.delete('/tickets/:id', authMiddleware, roleMiddleware(),ticketController.deleteTicket);

module.exports = router;


