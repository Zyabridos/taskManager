setup:
	prepare install db-migrate

install: 
	npm ci

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
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-backend:
	npm start -- --watch --verbose-watch --ignore-watch='node_modules .git .sqlite'

start-frontend:
	npx webpack --watch --progress

lint:
	npx eslint .

test:
	npm test -- --runInBand

a:
	node server/startServer.js --watch

t:
	npx jest __tests__/tasks.test.js 