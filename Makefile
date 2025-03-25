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
	npm run dev

lint:
	npx eslint .

test:
	npm test -s

dev:
	npm run dev
