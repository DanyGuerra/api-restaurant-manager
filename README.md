# API Restaurant Manager

A robust Backend API built with **NestJS** for managing multi-tenant restaurant operations. This system handles businesses, users, products, orders, and role-based access control.

## 🚀 Features

- **Multi-tenancy**: Manage multiple businesses/restaurants.
- **User Management**: Role-based access control (Owner, Admin, Waiter).
- **Product Catalog**: Manage product groups, options, and modifiers.
- **Order Monitoring**: Real-time order tracking and management.
- **Security**: JWT Authentication and HttpOnly cookies for session management.

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL (via TypeORM)
- **Language**: TypeScript

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following configuration:

```env
# Application
PORT=3000
HOST_FRONTEND=http://localhost:5173
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=restaurant_db

# Security
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_jwt_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
API_KEY=api_key

# Mail
MAIL_HOST=smtp.example.com
MAIL_USER=user@example.com
MAIL_PASSWORD=topsecret
MAIL_FROM=noreply@example.com
```

## 📦 Installation

```bash
$ npm install
```

## ▶️ Running the app

```bash
# development
$ npm run start

# watch mode (recommended for dev)
$ npm run start:dev

# production mode
$ npm run start:prod
```

This will run:

- **API**: http://localhost:3000
- **Postgres**: port 5432

## 🧪 Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 📂 Project Structure

- `src/modules/auth`: Authentication logic (Login, Signup, Guards).
- `src/modules/business`: Business/Restaurant profile management.
- `src/modules/orders`: Order processing and history.
- `src/modules/products`: Product catalog and menu items.
- `src/modules/users`: User profile and administration.

## 📄 License

This project is [MIT licensed](LICENSE).
