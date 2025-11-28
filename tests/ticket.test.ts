import request from 'supertest';
import app from '../app';
import sequelize from '../config/database';
import User from '../models/user';
import Ticket from '../models/ticket';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// DB sync
beforeAll(async () => {
    await sequelize.sync({ force: true });
});

// close DB connection after all
afterAll(async () => {
    await sequelize.close();
});

describe('Tickets API', () => {
    let token: string;
    let userEmail: string;
    let firstTicketId: number;


    beforeEach(async () => {

        await Ticket.destroy({ where: {} });
        await User.destroy({ where: {} });

        // Create test user
        const user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword123', // Хеш тут не важен, мы генерим токен вручную
            role: 'user'
        });

        userEmail = user.email;

        // Create token
        token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            config.jwtSecret,
            { expiresIn: '1h' }
        );

        //create tickets
        const tickets = await Ticket.bulkCreate([
            {
                title: 'First Ticket',
                description: 'Description 1',
                status: 'new',
                priority: 'low',
                createdBy: 'test@example.com'
            },
            {
                title: 'Second Ticket',
                description: 'Description 2',
                status: 'new',
                priority: 'high',
                createdBy: 'test@example.com'
            }
        ]);
        firstTicketId = tickets[0].id;
    });



    it('should create a new ticket', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .set('Authorization', `Bearer ${token}`) // Передаем токен
            .send({
                title: 'Test Ticket',
                description: 'This is a test description',
                status: 'open',
                priority: 'medium'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toEqual('Test Ticket');
        expect(res.body.createdBy).toEqual('test@example.com'); // Проверка, что подставился email из токена
    });

    it('should fail if description is missing', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Ticket',
                // description пропущен
            });

        expect(res.statusCode).toEqual(400); // Ошибка валидации Joi
        expect(res.body.error).toContain('"description" is required');
    });

    it('should fail without token', async () => {
        const res = await request(app)
            .post('/api/tickets')
            .send({
                title: 'Test Ticket',
                description: 'Desc'
            });

        expect(res.statusCode).toEqual(401);
    });

    it('should get all tickets', async () => {
        const res = await request(app)
            .get('/api/tickets')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(2);
    });

    it('should update ticket', async () => {
        const updateRes = await request(app)
            .put(`/api/tickets/${firstTicketId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Test Ticket Updated',
                description: 'Updated ticket description',
                priority: 'low',
                status: 'in_progress',
            });
        expect(updateRes.statusCode).toEqual(200);

        const getRes = await request(app)
            .get(`/api/tickets/${firstTicketId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(getRes.statusCode).toEqual(200);
        expect(getRes.body.lastUpdatedBy).toEqual(userEmail);
    });

    it('should deny delete ticket for non-admin user', async () => {

        const regularUser = await User.create({
            username: 'simple_user',
            email: 'simple@example.com',
            password: 'password123',
            role: 'user'
        });

        const userToken = jwt.sign(
            { id: regularUser.id, email: regularUser.email, role: regularUser.role },
            config.jwtSecret,
            { expiresIn: '1h' }
        );


        const ticket = await Ticket.findOne();
        if (!ticket) throw new Error('No tickets found in DB for test');

        const res = await request(app)
            .delete(`/api/tickets/${ticket.id}`)
            .set('Authorization', `Bearer ${userToken}`);

        expect(res.statusCode).toEqual(403);

        const ticketStillExists = await Ticket.findByPk(ticket.id);
        expect(ticketStillExists).not.toBeNull();
    });
});