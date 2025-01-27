setup:
	prepare install db-migrate

install: 
	npm ci

db-migrate:
	npx knex migrate:latest

build:
	npm run build

prepare:
	cp -n .env.example .env || true

start:
	heroku local -f Procfile.dev

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

t:
	npm test -s

fr:
	cd frontend; npm run dev

make db:
	npx knex migrate:latest