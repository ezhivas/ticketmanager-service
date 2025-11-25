const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connection successful'))
  .catch((err) => console.error('Database connection failed:', err));

module.exports = sequelize;
