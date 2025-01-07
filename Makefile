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