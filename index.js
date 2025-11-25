const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const sequelize = require('./config/database');
const validateUser = require('./middleware/validationMiddleware');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use routes
app.use('/api', userRoutes);
app.use('/api', ticketRoutes);

// Sample route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Sync database and start the server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Database synced successfully');
    app.listen(port, () => {
      console.log(`✅ Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️  Database sync failed, starting server without database:', err.message);
    app.listen(port, () => {
      console.log(`✅ Server is running at http://localhost:${port} (without database)`);
    });
  });

module.exports = app;