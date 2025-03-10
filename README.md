### Hexlet tests and linter status:

[![Actions Status](https://github.com/Zyabridos/backend-project-6/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Zyabridos/backend-project-6/actions)

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
- Manage all users, including creating and deleting them.

This design makes it an open-access system where all data is shared among users.

## Setting Up Environment Variables

The project uses environment variables stored in `.env` files.
For running tests, create a `.env.test` file by copying `.env.test.example`:

```bash
cp .env.test.example .env.test
```

Then update the values in .env.test if necessary.

# Deployed version

[Deployed project](https://taskmanager-tnpn.onrender.com/)
You can Sign in by creating an account

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

This will run `npm ci` to install dependencies.

## Building the Project

Run:

```bash
make build
```

This will:

1. Remove the existing `dist` directory.
2. Build the frontend using `npm run build`.

## Start the Project

To start the built app, run:

```bash
make start
```

This command will launch the app. By default, the app should be accessible at [http://127.0.0.1:3000](http://127.0.0.1:3000). If you cannot access the app, check the terminal output for the correct URL or any errors related to the server startup.

## Summary of Makefile Commands

| Command        | Description                           |
| -------------- | ------------------------------------- |
| `make install` | Installs dependencies using `npm ci`. |
| `make build`   | Builds the frontend for production.   |
| `make start`   | Starts the built application.         |
