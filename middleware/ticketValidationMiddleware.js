const Joi = require('joi');

const ticketSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).required(),
  status: Joi.string().valid('open', 'in_progress', 'closed'),
  priority: Joi.string().valid('low', 'medium', 'high'),
});

const validateTicket = (req, res, next) => {
  const { error } = ticketSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = validateTicket;
