import { config } from './config/env';


import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import sequelize from './config/database';

import userRoutes from './routes/userRoutes';
import ticketRoutes from './routes/ticketRoutes';
import loggerMiddleware from './middleware/loggerMiddleware';
import createDefaultAdmin from "./utils/createDefaultAdmin";

import swaggerSpec from './config/swagger';

const app = express();
const port = config.port;

app.use(express.json());

app.use(loggerMiddleware);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Use routes
app.use('/api', userRoutes);
app.use('/api', ticketRoutes);

// Health route
app.get('/', (req: Request, res: Response) => {
    res.send('Server is up and running...');
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error('Expected error :', err);
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
        return;
    }
    res.status(500).json({ error: 'Internal server error' });
});

sequelize.sync({ alter: true })
    .then(async () => {
        console.log('Database synced successfully');

        await createDefaultAdmin();

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.warn('Database sync failed, terminating...', err.message);
        process.exit(1);
    });

//export default app;