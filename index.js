const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const sequelize = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const createDefaultAdmin = require("./utils/createDefaultAdmin");


// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(loggerMiddleware);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use routes
app.use('/api', userRoutes);
app.use('/api', ticketRoutes);

// Health route
app.get('/', (req, res) => {
  res.send('Server is up and running...');
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
  .then(async () => {
      console.log('✅ Database synced successfully');

      await createDefaultAdmin();

      app.listen(port, () => {
          console.log(`✅ Server is running at http://localhost:${port}`);
      });
  })
  .catch((err) => {
    console.warn('❌️  Database sync failed, terminating...', err.message);
    process.exit(1);
  });

module.exports = app;