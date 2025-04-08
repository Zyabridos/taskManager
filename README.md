### 📊 Code Quality

[![Maintainability](https://api.codeclimate.com/v1/badges/dd3b0c8de30f780cffa1/maintainability)](https://codeclimate.com/github/Zyabridos/taskManager/maintainability)  
[![Lint](https://github.com/Zyabridos/taskManager/actions/workflows/my-lint.yml/badge.svg)](https://github.com/Zyabridos/taskManager/actions/workflows/my-lint.yml)

### 🧪 Tests

[![Backend Tests](https://github.com/Zyabridos/taskManager/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/Zyabridos/taskManager/actions/workflows/backend-tests.yml)  
[![E2E Tests](https://github.com/Zyabridos/taskManager/actions/workflows/playwright-e2e-tests.yml/badge.svg)](https://github.com/Zyabridos/taskManager/actions/workflows/playwright-e2e-tests.yml)


# 🗂️ Task Manager
Task Manager is a fullstack task management application built with **Next.js** for the frontend, **Fastify** for the backend, **PostgreSQL** as the database, and styled with **TailwindCSS**. It features user authentication, CRUD operations for tasks, labels, and statuses, and dynamic sorting capabilities.

## 📌 Project Overview

This project is designed to be straightforward and accessible. It allows users to:

- 🧾 Register and log in.
- 🏷️ Create, edit, and delete **labels**, **statuses**, and **tasks**.
- 🔃 Sort tasks based on different attributes.
- 👀 View and manage tasks created by any user.
- 👤 Edit and delete their own user profile.

### 🔐 Access Policy

This project follows a mostly open-access approach:

- ✅ All users can create, update, and delete any task, label, or status.
- 🔒 Only the logged-in user can edit or delete their own profile.
- 🚫 Attempts to edit or delete other users will result in an access denied error.

This policy promotes openness for task management while protecting user profiles.

### 🔄 Entity Relationship Rules

To preserve data integrity, the following restrictions are enforced:

- ✅ Labels can be deleted even if they are assigned to tasks.
- ❌ Statuses cannot be deleted if at least one task is using them.
- ❌ Users cannot delete their own profile if they have any associated tasks.

These rules help prevent accidental data loss while maintaining flexibility for label management.

# 🐳 Docker Usage
You can also run the app inside a Docker container. This is especially useful for testing or deploying in a consistent environment.

### Build Docker Image
```bash
make docker-build
```
This builds the Docker image and tags it as chat-frontend.

### Start Docker Container
```bash
make docker-start
```
Runs the container and exposes the app on [http://localhost:3000](http://localhost:3000)

### Stop Docker Container
```bash
make docker-stop
```
Stops and removes the container.

### Clean Up Docker Resources
```bash
make docker-clean
```
Stops and removes the container and image, and prunes volumes.

## Setting Up Environment Variables

The project uses environment variables stored in `.env` files.  
For running tests, create a `.env.test` file by copying `.env.example`:

```bash
cp .env.example .env.test
```

Then update the values in `.env.test` if necessary.

# 💻 Project Setup Locally

This project uses a `Makefile` to simplify common development tasks. Below are the steps for installation, development, and building the project.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (with npm)
- [Make](https://www.gnu.org/software/make/)

## Installation

To install project dependencies, run:

```bash
make install
```

This will install dependencies for both backend and frontend.

## 🛠️ Build the Project

To build the frontend for production:

```bash
make build
```

To start the built app:

```bash
make start
```

By default:

- Frontend is available at: [http://localhost:5001](http://localhost:5001)
- Backend API runs at: [http://localhost:3000](http://localhost:3000)

## Run in development mode

```bash
make dev
```

## 📘 Summary of Makefile Commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `make build`             | Builds the frontend for production.            |
| `make start`             | Starts the built application.                  |
| `make dev`               | Runs backend and frontend in development mode. |
| `make setup`             | Runs prepare, install, and db-migrate.         |
| `make prepare`           | Prepares environment files.                    |
| `make db-migrate`        | Runs latest database migrations.               |
| `make db-rollback`       | Rolls back the last database migration.        |
| `make test-backend`      | Runs backend tests.                            |
| `make test-frontend-e2e` | Runs frontend e2e tests using Playwright.      |
