const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const validateTicket = require('../middleware/ticketValidationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

// Route to get all tickets (no auth required)
router.get('/tickets', authMiddleware, ticketController.getAllTickets);

// Route to get a ticket by ID (no auth required)
router.get('/tickets/:id', authMiddleware, ticketController.getTicketById);

// Route to create a new ticket (auth required)
router.post('/tickets', authMiddleware, validateTicket, ticketController.createTicket);

// Route to update a ticket by ID (auth required)
router.put('/tickets/:id', authMiddleware, validateTicket, ticketController.updateTicket);

// Route to delete a ticket by ID (auth required)
router.delete('/tickets/:id', authMiddleware, ticketController.deleteTicket);

module.exports = router;


