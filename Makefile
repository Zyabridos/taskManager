install: 
		npm ci

a:
		node server/index.js --watch

p:
		npx prettier --write .

build:
		npm run build

start:
		npm start