# NEBS Test Project

This is a full-stack web application for managing notices, built with a modern tech stack.

## Tech Stack

- **Frontend:** Next.js 16 (React 19), TailwindCSS, Shadcn/UI, Redux Toolkit
- **Backend:** NestJS, Drizzle ORM
- **Database:** PostgreSQL

## Features

- **Notice Management:** Create, Read, Update, and Delete notices.
- **Dynamic Filtering:** Filter by Department, Status (Draft/Published), and Search by Title/Employee.
- **Pagination:** Efficient server-side pagination.
- **Status Toggling:** Quickly publish or unpublish notices.

## Setup & Running

### Option 1: Docker (Recommended)

1.  Ensure you have Docker and Docker Compose installed.
2.  Run the application:
    ```bash
    docker-compose up --build
    ```
3.  Access the application:
    - **Frontend:** `http://localhost:3000`
    - **Backend API:** `http://localhost:4000`
    - **Swagger Docs:** `http://localhost:4000/api` (if enabled)

### Option 2: Manual Setup

#### Prerequisites

- Node.js (v18+)
- PostgreSQL Database

#### Backend

1.  Navigate to `backend/`:
    ```bash
    cd backend
    npm install
    ```
2.  Configure `.env` file (copy from example if available, or set `DATABASE_URL`).
3.  Run migrations (if applicable) and start server:
    ```bash
    npm run db:push
    npm run start:dev
    ```

#### Frontend

1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    npm install
    ```
2.  Start development server:
    ```bash
    npm run dev
    ```

## Project Structure

- `/frontend`: Next.js application source code.
- `/backend`: NestJS API source code.
- `docker-compose.yml`: Orchestration for app and database services.
