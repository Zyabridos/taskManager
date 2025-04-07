# Docker-commands
docker-build:
	docker compose build

docker-start:
	docker compose up -d

docker-stop:
	docker compose down

docker-clean:
	docker compose down --volumes --remove-orphans
	docker image prune -f
	docker volume prune -f

docker-restart:
	make docker-stop
	make docker-build
	make docker-start

# Local-comands - common
install:
	make install-backend && make install-frontend

build:
	make build-frontend

start:
	make start-backend & make start-frontend

dev:
	make start-backend & cd frontend && npm run dev

setup:
	make prepare && make install && make db-migrate

format:
	make format-backend && make format-frontend

lint:
	make lint-backend && make lint-frontend

# Local-comands - backend
install-backend:
	cd backend && npm install

test-backend:
	cd backend && npm test -s

db-migrate:
	cd backend && npx knex migrate:latest

db-rollback:
	cd backend && npx knex migrate:rollback

build-backend:
	cd backend
	rm -rf dist
	npm run build

prepare:
	cd backend && cp -n .env.example .env || true

start-backend:
	cd backend && npm run start

lint-backend:
	cd backend && npm run lint

format-backend:
	cd backend && npx prettier --write .

# Local-comands - frontend
install-frontend:
	cd frontend && npm ci

build-frontend:
	cd frontend && npm run build

start-frontend:
	cd frontend && npm run start

dev-frontend:
	cd frontend && npm run dev

test-frontend-e2e:
	cd frontend && npx playwright test

lint-frontend:
	cd frontend && npm run lint

format-frontend:
	cd frontend && npm run format