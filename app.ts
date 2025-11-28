import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import userRoutes from './routes/userRoutes';
import ticketRoutes from './routes/ticketRoutes';
import loggerMiddleware from './middleware/loggerMiddleware';
import swaggerSpec from './config/swagger';

const app = express();

app.use(express.json());
app.use(loggerMiddleware);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', userRoutes);
app.use('/api', ticketRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Server is up and running...');
});

app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Твой глобальный обработчик ошибок
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error('🔥 Error caught:', err);
    if (err instanceof Error) {
        res.status(500).json({ error: err.message });
        return;
    }
    res.status(500).json({ error: 'Unknown internal server error' });
});

export default app;