import request from 'supertest';
import app from '../app';
import sequelize from '../config/database';
import User from '../models/user';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// DB init
beforeAll(async () => {
    await sequelize.sync({ force: true });
});

// close connection
afterAll(async () => {
    await sequelize.close();
});

describe('Users API', () => {

    let token: string;

    beforeEach(async () => {

        await User.destroy({ where: {} });

        // default admin
        const defaultUser = await User.create({
            username: 'admin',
            email: 'admin@gmail.com',
            password: 'hashedpassword123',
            role: 'admin'
        });


        token = jwt.sign(
            { id: defaultUser.id, email: defaultUser.email, role: defaultUser.role },
            config.jwtSecret,
            { expiresIn: '1h' }
        );
    });

    it('should create a new user with user access', async () => {

        const res = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'User User',
                email: 'useruser@gmail.com',
                password: 'password',
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.username).toEqual('User User');
        expect(res.body.email).toEqual('useruser@gmail.com');

        expect(res.body).not.toHaveProperty('password');
    });

});