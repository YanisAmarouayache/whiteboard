.PHONY: install frontend backend up down build test

install:
	cd frontend && npm install
	cd backend && go mod download

frontend:
	cd frontend && npm start

backend:
	cd backend && go run cmd/server/main.go

up:
	docker-compose up --build

down:
	docker-compose down

build:
	cd frontend && npm run build
	cd backend && go build -o server cmd/server/main.go

test:
	cd backend && go test ./...
