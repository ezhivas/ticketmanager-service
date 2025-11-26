const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const validateTicket = require('../middleware/ticketValidationMiddleware');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);

router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/:id', ticketController.getTicketById);
router.post('/tickets',  validateTicket, ticketController.createTicket);
router.put('/tickets/:id',  validateTicket, ticketController.updateTicket);
router.delete('/tickets/:id',  roleMiddleware(),ticketController.deleteTicket);

module.exports = router;


