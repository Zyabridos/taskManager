# Local-comands - backend
setup:
	prepare install db-migrate

install-backend:
	cd backend && npm install

test-backend:
	cd backend && npm test -s

db-migrate:
	cd backend && npx knex migrate:latest

db-rollback:
	cd backend && npx knex migrate:rollback

build-backend:
	cd backend
	rm -rf dist
	npm run build

prepare:
	cd backend && cp -n .env.example .env || true

start-backend:
	cd backend && npm run start

# Local-comands - backend

dev-frontend:
	cd frontend && npm run dev