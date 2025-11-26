const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Management API',
      version: '1.0.0',
      description: 'A REST API for managing users and tickets with JWT authentication',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['username', 'email', 'password'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID',
            },
            username: {
              type: 'string',
              description: 'Username (3-30 characters)',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              description: 'User password (minimum 6 characters)',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Ticket: {
          type: 'object',
          required: ['title', 'description'],
          properties: {
            id: {
              type: 'integer',
              description: 'Ticket ID',
            },
            title: {
              type: 'string',
              description: 'Ticket title (3-100 characters)',
            },
            description: {
              type: 'string',
              description: 'Ticket description (minimum 10 characters)',
            },
            status: {
              type: 'string',
              enum: ['open', 'in_progress', 'closed'],
              default: 'open',
              description: 'Ticket status',
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              default: 'medium',
              description: 'Ticket priority',
            },
            createdBy: {
              type: 'string',
              description: 'Email of the user who created the ticket',
            },
            lastUpdatedBy: {
              type: 'string',
              description: 'Email of the user who last updated the ticket',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email',
            },
            password: {
              type: 'string',
              description: 'User password',
            },
          },
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Login successful',
            },
            token: {
              type: 'string',
              description: 'JWT token',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },
      },
    },
  },
  apis: [
    './docs/*.js', //to allow seeing all doc files
  ],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
