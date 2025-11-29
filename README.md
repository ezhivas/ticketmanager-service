# Ticket Management API

REST API for managing users and tickets, built with
**Node.js**, **Express**, and **TypeScript**.\
It includes JWT authentication, Role-Based Access Control (RBAC), email
verification, and detailed ticket tracking.

------------------------------------------------------------------------

## 🚀 Features

-   **Authentication:** JWT-based auth with password hashing
    (`bcryptjs`).
-   **User Management:** Registration, login, full CRUD.
-   **Email Verification:** Automated verification emails via SendGrid
    or SMTP.
-   **Ticket Management:** CRUD, status, priority, and history tracking.
-   **Audit Trail:** Tracks ticket creator, last updater, and change
    logs.
-   **RBAC:** Admin/User roles with permission control.
-   **Validation:** Payload validation using Joi.
-   **Logging:** Request logging with user/session identification.
-   **Documentation:** Auto-generated Swagger/OpenAPI docs.
-   **Dockerized:** Ready for deployment with Docker & Docker Compose.
-   **CI/CD:** GitHub Actions for automated testing.

------------------------------------------------------------------------

## 🛠 Tech Stack

Category           Technology
  ------------------ --------------------------------------
Runtime            Node.js (v18+)
Language           TypeScript
Framework          Express.js
Database           MySQL (Dev), PostgreSQL (Prod), SQLite (Test)
ORM                Sequelize
Testing            Jest, Supertest
Containerization   Docker, Docker Compose

------------------------------------------------------------------------

## 📦 Prerequisites

-   Node.js 14+
-   npm or yarn
-   Docker & Docker Compose (optional but recommended)

------------------------------------------------------------------------

## 📥 Installation

### 1. Clone the repository

``` bash
git clone <repository-url>
cd ticketmanager-service
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure environment variables

``` bash
cp .env.example .env
```

Edit `.env` and set:

-   Database credentials\
-   JWT secret\
-   Email service credentials (required for email verification)

⚠ **Note:** The application validates several required environment variables and will exit at startup if they are missing. Ensure `.env` includes database credentials (DB_*), `JWT_SECRET` (recommended >= 10 characters), and SMTP or SendGrid settings for email functionality. For running tests locally, you can set `NODE_ENV=test` to use the in-memory test DB.

------------------------------------------------------------------------

## ▶ Running the App

### **Option 1 --- Docker (Recommended)**

Starts both API and database:

``` bash
docker-compose up --build
```

API will be available at:

    http://localhost:3000

------------------------------------------------------------------------

### **Option 2 --- Local Development**

Ensure your local DB is running and `.env` is configured.

#### Development mode (hot reload):

``` bash
npm run dev
```

#### Production mode:

``` bash
npm run build
npm start
```

------------------------------------------------------------------------

## 📚 API Documentation

Swagger UI available at:

    http://localhost:3000/api-docs/

------------------------------------------------------------------------

## 🔐 Quick Example --- Login

``` bash
curl -X POST http://localhost:3000/api/login   -H "Content-Type: application/json"   -d '{"email":"admin@gmail.com","password":"password"}'
```

Use the returned token in headers:

    Authorization: Bearer <token>

------------------------------------------------------------------------

## 🧪 Testing

Uses an isolated in-memory SQLite database.

Run all tests:

``` bash
npm test
```

Run in watch mode:

``` bash
npm run test:watch
```

------------------------------------------------------------------------

## 📁 Project Structure

    .
    ├── config/
    │   ├── database.ts
    │   ├── env.ts
    │   └── swagger.ts
    ├── controllers/
    │   ├── userController.ts
    │   └── ticketController.ts
    ├── docs/
    ├── middleware/
    │   ├── authMiddleware.ts
    │   ├── loggerMiddleware.ts
    │   ├── roleMiddleware.ts
    │   ├── validationMiddleware.ts
    │   └── ticketValidationMiddleware.ts
    ├── models/
    │   ├── user.ts
    │   └── ticket.ts
    ├── routes/
    │   ├── userRoutes.ts
    │   └── ticketRoutes.ts
    ├── tests/
    ├── utils/
    │   ├── createDefaultAdmin.ts
    │   └── emailService.ts
    ├── .env.example
    ├── docker-compose.yml
    ├── Dockerfile
    └── index.ts

------------------------------------------------------------------------

## 🔒 Security Notes

-   NEVER commit `.env`
-   Passwords are hashed with bcryptjs
-   Sensitive routes protected by RBAC
-   JWT secrets must be long and unpredictable

------------------------------------------------------------------------

## 🔮 Future Improvements

-   Password reset flow\
-   Rate limiting\
-   Refresh tokens support

------------------------------------------------------------------------

## 📜 License

MIT License\
Feel free to use, modify, and contribute!
