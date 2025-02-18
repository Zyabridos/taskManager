setup:
	prepare install db-migrate

install: 
	npm install

db-migrate:
	npx knex migrate:latest

build:
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
	npm test -s


a:
	node server/startServer.js --watch

p:
	npx prettier --write .

u:
	npx jest __tests__/users.test.js
