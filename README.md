# React Laravel Starter Template

This repository provides a basic setup for a full-stack application with working authentication routes.

## Features
- Laravel-based backend for authentication and API routes
- React frontend with TypeScript and Vite
- Docker Compose for easy containerized development

## Getting Started

### Prerequisites
- Docker installed
- Node.js and npm

### Running the Backend
Use Docker to spin up the backend services:
```bash
docker compose up
```

### Running the Frontend
Go to the React frontend directory and run:
```bash
cd react-frontend
npm install
npm run dev
```

You can then access the frontend at the displayed local address, and the backend will be available via Docker on its mapped port.

