install: 
		npm ci

a:
		node server/startServer.js --watch

p:
		npx prettier --write .

build:
		npm run build

start:
		npm start

t:
		npm test -s

fr:
		cd frontend; npm run dev

start-frontend:
		cd frontend; npm run dev

start-backend:
		node server/startServer.js --watch

develop:
		make start-backend & make start-frontend

dev:
		make start-backend & make start-frontend