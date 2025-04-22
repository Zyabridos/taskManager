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

docker-test-frontend:
	docker-compose run --rm frontend-test

# Local-comands - common
install:
	npm install

build:
	make build-frontend

start:
	make start-backend & make start-frontend

test-all:
	make test-e2e && make test-backend

dev:
	make start-backend & cd frontend && npm run dev

setup:
	make prepare && make install && make db-migrate

format:
	make format-backend && make format-frontend

lint:
	make lint-backend && make lint-frontend

# Local-comands - backend
test-backend:
	cd backend && npm test -s

db-migrate:
	cd backend && NODE_ENV=$(ENV) npx knex migrate:latest

db-rollback:
	cd backend && NODE_ENV=$(ENV) npx knex migrate:rollback

prepare:
	cd backend && cp -n .env.example .env || true

start-backend:
	cd backend && npm run start

lint-backend:
	cd backend && npm run lint

format-backend:
	cd backend && npx prettier --write .

# Local-comands - frontend
build-frontend:
	cd frontend && npm run build

start-frontend:
	cd frontend && npm run start

dev-frontend:
	cd frontend && npm run dev

test-e2e:
	cd frontend && npx playwright test

test-e2e-ci:
	make db-rollback ENV=testCI && make db-migrate ENV=testCI && cd frontend && npx playwright test

lint-frontend:
	cd frontend && npm run lint

format-frontend:
	cd frontend && npm run format
