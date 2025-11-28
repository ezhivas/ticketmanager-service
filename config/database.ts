import { Sequelize, Dialect } from 'sequelize';
import { config } from './env';

const isTest = process.env.NODE_ENV === 'test';

let sequelize: Sequelize;

if (isTest) {
    // retain SQLite in memory for testing
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
    });
} else {
    // Development moved to MySQL
    sequelize = new Sequelize(
        config.database.name,
        config.database.user,
        config.database.password,
        {
            host: config.database.host,
            dialect: (config.database.dialect as Dialect) || 'mysql', // Використовуємо значення з конфігу
            logging: false,
            // SSL connection
            dialectOptions: config.database.dialect === 'postgres' ? {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            } : {}
        }
    );
}

export default sequelize;