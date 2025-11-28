import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
    PORT: Joi.number().default(3000),
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

    DB_HOST: Joi.string().default('localhost'),
    DB_USER: Joi.string().required(),
    DB_PASS: Joi.string().required(),

    JWT_SECRET: Joi.string().required().min(10).message('JWT_SECRET is required and must be at least 10 chars'),

    EMAIL: Joi.string().email().required(),
    PASSWORD: Joi.string().min(6).required(),
    USERNAME: Joi.string().required(),

    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
})
    .unknown() // Разрешаем другие переменные в process.env, которые мы не описали
    .required();

const { error, value: envVars } = envSchema.validate(process.env, {
    abortEarly: false,
});

if (error) {
    console.error('\x1b[31m%s\x1b[0m', 'Invalid environment variables:');
    error.details.forEach((detail) => {
        console.error(`   - ${detail.message}`);
    });

    process.exit(1);
}

export const config = {
    port: envVars.PORT,
    nodeEnv: envVars.NODE_ENV,
    jwtSecret: envVars.JWT_SECRET as string,
    database: {
        host: envVars.DB_HOST,
        user: envVars.DB_USER,
        password: envVars.DB_PASS,
    },
    admin: {
        email: envVars.EMAIL,
        password: envVars.PASSWORD,
        username: envVars.USERNAME
    },
    smtp: {
        host: envVars.SMTP_HOST,
        port: envVars.SMTP_PORT,
        pass: envVars.SMTP_PASS,
        user: envVars.SMTP_USER,
    }
};