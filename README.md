### Hexlet tests and linter status:

[![Actions Status](https://github.com/Zyabridos/backend-project-6/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Zyabridos/backend-project-6/actions)

# Task Manager

Task Manager is a task management system. It allows users to create tasks, assign them to team members, and update their statuses. To use the system, registration and authentication are required.

## Project Overview

This project is a work in progress, and I'm actively developing it. New features and improvements are being added regularly. Currently, it includes basic task management functionalities with user authentication.

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

| Command               | Description                                        |
|-------------------    |----------------------------------------------------|
| `make install`        | Installs dependencies using `npm ci`.              |           
| `make build`          | Builds the frontend for production.                |
| `make start`          | Starts the built application.                      |
