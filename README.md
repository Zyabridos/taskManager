### Codeclimate

[![Maintainability](https://api.codeclimate.com/v1/badges/dd3b0c8de30f780cffa1/maintainability)](https://codeclimate.com/github/Zyabridos/taskManager/maintainability)

# Task Manager

Task Manager is a simple task management system built with **PostgreSQL** and **Fastify**. It provides basic task management functionalities, including user authentication and the ability to create, edit, and delete labels, statuses, and tasks. Tasks can also be sorted based on various criteria.

## Project Overview

This project is designed to be straightforward and accessible. It allows users to:

- Register and log in.
- Create, edit, and delete **labels**, **statuses**, and **tasks**.
- Sort tasks based on different attributes.
- View and manage tasks created by any user.

### Open Access Policy

In this project, all users have full access to all functionalities. This means that any user can:

- Create, update, and delete **any** task, label, or status.
- Edit and delete other users' tasks.

This design makes it an open-access system where all data is shared among users.

## Setting Up Environment Variables

The project uses environment variables stored in `.env` files.  
For running tests, create a `.env.test` file by copying `.env.example`:

```bash
cp .env.example .env.test
```

Then update the values in `.env.test` if necessary.

# Project Setup Locally

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

## Summary of Makefile Commands

| Command                  | Description                                    |
| ------------------------ | ---------------------------------------------- |
| `make install`           | Installs frontend and backend dependencies.    |
| `make build`             | Builds the frontend for production.            |
| `make start`             | Starts the built application.                  |
| `make dev`               | Runs backend and frontend in development mode. |
| `make setup`             | Runs prepare, install, and db-migrate.         |
| `make install-backend`   | Installs backend dependencies.                 |
| `make test-backend`      | Runs backend tests.                            |
| `make db-migrate`        | Runs latest database migrations.               |
| `make db-rollback`       | Rolls back the last database migration.        |
| `make build-backend`     | Builds the backend.                            |
| `make prepare`           | Prepares environment files.                    |
| `make start-backend`     | Starts the backend server.                     |
| `make install-frontend`  | Installs frontend dependencies.                |
| `make dev-frontend`      | Runs frontend in development mode.             |
| `make test-frontend-e2e` | Runs frontend e2e tests using Playwright.      |
