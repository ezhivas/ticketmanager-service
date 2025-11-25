const Ticket = require('../models/ticket');

// Controller function to create a new ticket
exports.createTicket = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;
    const userEmail = req.user.email; // From auth middleware
    
    const newTicket = await Ticket.create({ title, description, status, priority, createdBy: userEmail });
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller function to get all tickets
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.findAll();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to update a ticket by ID
exports.updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    const userEmail = req.user.email; // From auth middleware
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.title = title || ticket.title;
    ticket.description = description || ticket.description;
    ticket.status = status || ticket.status;
    ticket.priority = priority || ticket.priority;
    ticket.lastUpdatedBy = userEmail; // Track who updated

    await ticket.save();
    res.status(200).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Controller function to delete a ticket by ID
exports.deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    await ticket.destroy();
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 

// Controller function to get a ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.status(200).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get tickets by status
exports.getTicketsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const tickets = await Ticket.findAll({ where: { status } });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Controller function to get tickets by priority
exports.getTicketsByPriority = async (req, res) => {
  try {
    const { priority } = req.params;
    const tickets = await Ticket.findAll({ where: { priority } });

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

