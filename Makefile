setup: prepare install db-migrate

install:
	npm install

db-migrate:
	npx knex migrate:latest

db-rollback:
	npx knex migrate:rollback

build:
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
