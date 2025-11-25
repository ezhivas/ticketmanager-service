const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ticket = sequelize.define('Ticket', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'in_progress', 'closed'),
    defaultValue: 'open',
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'unknown',
    comment: 'Email of the user who created this ticket',
  },
  lastUpdatedBy: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
    comment: 'Email of the user who last updated this ticket',
  },
});

module.exports = Ticket;    

