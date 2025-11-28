import { config } from './config/env';
import app from './app';
import sequelize from './config/database';
import createDefaultAdmin from "./utils/createDefaultAdmin";

const port = config.port;

sequelize.sync({ alter: true })
    .then(async () => {
        console.log('Database synced successfully');
        await createDefaultAdmin();
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.warn('Database sync failed, terminating...', err);
        process.exit(1);
    });