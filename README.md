# Miro Clone

Monorepo with Angular frontend, Go backend, and PostgreSQL database scripts.

## Structure
- `frontend/`: Angular app
- `backend/`: Go API + WebSocket server
- `database/`: SQL schema, migrations, and seeds
- `my-custom-widget/`: Example external widget package

## Quick start
1. Copy `.env.example` to `.env` and adjust values.
2. Start full stack with Docker:
   - `docker-compose up --build`
3. Frontend: [http://localhost:4200](http://localhost:4200)
4. Backend health: [http://localhost:8080/health](http://localhost:8080/health)

## Local dev without Docker
- Frontend: `cd frontend && npm install && npm start`
- Backend: `cd backend && go mod download && go run cmd/server/main.go`
- DB: create `miro_clone` database and run `database/schema.sql`
