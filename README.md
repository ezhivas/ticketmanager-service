# Ticket Management API

A Node.js/Express API for managing users and tickets with JWT authentication.

## Features

- ✅ User authentication with JWT
- ✅ Password hashing with bcryptjs
- ✅ User management (CRUD operations)
- ✅ Ticket management (CRUD operations)
- ✅ Track ticket creator and last updater
- ✅ Input validation with Joi
- ✅ SQLite database
- ✅ Protected routes (POST, PUT, DELETE require authentication)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sandbox
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=3000
JWT_SECRET=your_secure_secret_key
DB_HOST=localhost
DB_USER=admin
DB_PASS=password123
```

## Running the App

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start at `http://localhost:3000`

## API Routes

### Authentication
- `POST /api/login` - Login and get JWT token

### Users (Public GET, Protected POST/PUT/DELETE)
- `POST /api/users` - Create a new user (register)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (requires auth)
- `DELETE /api/users/:id` - Delete user (requires auth)

### Tickets (Public GET, Protected POST/PUT/DELETE)
- `POST /api/tickets` - Create a ticket (requires auth)
- `GET /api/tickets` - Get all tickets
- `GET /api/tickets/:id` - Get ticket by ID
- `PUT /api/tickets/:id` - Update ticket (requires auth)
- `DELETE /api/tickets/:id` - Delete ticket (requires auth)

## Authentication

To access protected endpoints, include the JWT token in the Authorization header:

```bash
Authorization: Bearer <your_jwt_token>
```

### Example: Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "john",
    "email": "user@example.com"
  }
}
```

### Example: Create Ticket (with auth)
```bash
curl -X POST http://localhost:3000/api/tickets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Bug Fix",
    "description": "Fix login bug",
    "priority": "high"
  }'
```

## Database

- **Type**: SQLite
- **File**: `database.sqlite` (auto-created)
- **Auto-sync**: Enabled (creates tables on startup)

## Project Structure

```
.
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── userController.js    # User business logic
│   └── ticketController.js  # Ticket business logic
├── middleware/
│   ├── authMiddleware.js        # JWT verification
│   ├── validationMiddleware.js  # User validation
│   └── ticketValidationMiddleware.js  # Ticket validation
├── models/
│   ├── user.js              # User model
│   └── ticket.js            # Ticket model
├── routes/
│   ├── userRoutes.js        # User routes
│   └── ticketRoutes.js      # Ticket routes
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies
└── index.js                 # Entry point
```

## Technologies Used

- **Express.js** - Web framework
- **Sequelize** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **dotenv** - Environment configuration

## Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds)
- JWT tokens expire after 24 hours
- Never commit `.env` file (it contains secrets)
- Protected routes require valid JWT token
- Use HTTPS in production

## Future Improvements

- Add email verification
- Add password reset functionality
- Add role-based access control (RBAC)
- Add rate limiting
- Add request logging
- Add API documentation (Swagger)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
