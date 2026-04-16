# MoneyWise

MoneyWise is a full-stack expense tracking application built with the MERN stack.  
It supports user authentication, category management, and transaction tracking with filters.

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, React Query, Tailwind CSS
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- Auth: JWT with bcrypt password hashing

## Project Structure

- `frontend`: React application and UI components
- `backend`: Express API, authentication, business logic, and models

## Core Flow

1. User registers with `username`, `email`, and `password`.
2. Backend hashes the password with bcrypt and stores the user.
3. User logs in and receives a signed JWT token.
4. Frontend stores user info in local storage.
5. Protected API calls include `Authorization: Bearer <token>`.
6. Backend middleware verifies JWT and attaches `req.user`.
7. Controllers use `req.user` to scope data to the logged-in user.

## API Overview

### User Routes

- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `GET /api/v1/users/profile` (protected)
- `PUT /api/v1/users/change-password` (protected)
- `PUT /api/v1/users/update-profile` (protected)

### Category Routes

- `POST /api/v1/categories/create` (protected)
- `GET /api/v1/categories/lists` (protected)
- `PUT /api/v1/categories/update/:categoryId` (protected)
- `DELETE /api/v1/categories/delete/:id` (protected)

### Transaction Routes

- `POST /api/v1/transactions/create` (protected)
- `GET /api/v1/transactions/lists` (protected)
- `PUT /api/v1/transactions/update/:id` (protected)
- `DELETE /api/v1/transactions/delete/:id` (protected)

## Database Schema

### User

- `username`: String, required, unique
- `email`: String, required, unique
- `password`: String, required (bcrypt hash)
- `timestamps`: createdAt, updatedAt

### Category

- `user`: ObjectId ref `User`, required
- `name`: String, required, default `Uncategorized`
- `type`: String enum `income | expense`, required
- `timestamps`: createdAt, updatedAt

### Transaction

- `user`: ObjectId ref `User`, required
- `type`: String enum `income | expense`, required
- `category`: String, required, default `Uncategorized`
- `amount`: Number, required
- `date`: Date, default now
- `description`: String, optional
- `timestamps`: createdAt, updatedAt

## Environment Variables

Create `backend/.env`:


## Run Locally

### Backend

```bash
cd backend
npm install
node app.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Tradeoff: NoSQL vs SQL

This project uses MongoDB because:

- Data model is simple and can evolve quickly during product iteration.
- Nested and flexible JSON-like documents map well to JavaScript objects.
- Development speed is high for rapid prototyping and portfolio projects.

Tradeoffs compared to SQL:

- We lose strong relational constraints and native multi-table joins.
- Complex analytics queries are typically easier in SQL systems.
- Data consistency rules often need to be enforced in application logic.

In production, teams choose based on workload: SQL for strong relational/transaction-heavy systems, NoSQL for flexibility and fast iteration where schema changes are frequent.
