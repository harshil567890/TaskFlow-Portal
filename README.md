# Scalable REST API + Frontend (JavaScript)

Production-ready internship assignment project with secure authentication, role-based access, and a React UI for API interaction.

## Tech Stack

- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- Frontend: React + Vite
- Validation/Security: express-validator, helmet, rate-limit, mongo-sanitize
- API Docs: Swagger + Postman collection
- Testing: Jest + Supertest
- Deployment: Docker + docker-compose

## Features

- User registration and login with hashed passwords
- JWT-based authentication
- Role-based authorization (`user`, `admin`)
- Full CRUD for `tasks`
- API versioning (`/api/v1`)
- Input validation and centralized error handling
- Swagger docs and Postman collection
- Admin-only endpoint (`GET /api/v1/admin/users`)
- Frontend with:
  - Register/Login
  - Protected dashboard
  - Task CRUD operations
  - API success/error messages

## Project Structure

```text
pro7/
  backend/
  frontend/
  docker-compose.yml
```

## Local Setup

1. Install all dependencies:

```bash
npm run install:all
```

2. Create env files:
- `backend/.env` from `backend/.env.example`
- `frontend/.env` from `frontend/.env.example`

3. Start MongoDB locally and run:

```bash
npm run dev
```

4. Open:
- Frontend: `http://127.0.0.1:5174`
- Backend API: `http://localhost:5000/api/v1`
- Swagger: `http://localhost:5000/api-docs`

## Scripts

### Root

- `npm run dev` - Run backend + frontend
- `npm run test` - Run backend tests
- `npm run build` - Build frontend

### Backend

- `npm run dev --prefix backend`
- `npm run test --prefix backend`
- `npm run create-admin --prefix backend -- "Admin Name" admin@example.com SecurePass123`

### Frontend

- `npm run dev --prefix frontend`
- `npm run build --prefix frontend`

## API Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (protected)
- `POST /api/v1/tasks` (protected)
- `GET /api/v1/tasks` (protected)
- `GET /api/v1/tasks/:id` (protected)
- `PATCH /api/v1/tasks/:id` (protected)
- `DELETE /api/v1/tasks/:id` (protected)
- `GET /api/v1/admin/users` (admin only)

## Docker Deployment

```bash
docker compose up --build
```

- Frontend: `http://localhost:8080`
- Backend: `http://localhost:5000`

## Security Notes

- No real secrets are committed in this repository.
- `.env` files are ignored via `.gitignore`.
- Production requires `JWT_SECRET` (app throws error if missing in production).
- Rotate secrets before client deployment.

## Pre-Push Checklist

- `npm run test`
- `npm run build`
- Confirm `.env` files are not staged
- Confirm no private keys/tokens in commits
