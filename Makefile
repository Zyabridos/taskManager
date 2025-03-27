setup:
	npm run prepare
	npm ci
	npx knex migrate:latest

install:
	npm ci

db-migrate:
	npx knex migrate:latest

db-rollback:
	npx knex migrate:rollback

build:
	cd backend
	rm -rf dist
	npm run build

prepare:
	cp -n .env.example .env || true

start:
	npm start

start-backend:
	cd backend && npm run start

frontend-dev:
	cd frontend && npm run dev

dev:
	make start-backend && make frontend-dev

lint:
	npx eslint .

test:
	npm test -s
