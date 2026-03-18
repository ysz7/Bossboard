# BossBoard

A full-stack business management platform for small companies. Manage your team, tasks, work hours, and company finances in one place.

## Features

- **Authentication** — JWT-based login and registration
- **Team Members** — Full employee CRUD with status, bio, and avatar initials
- **Tasks** — Task board with status/priority management, bulk actions, and assignment
- **Work Hours** — Daily work log per employee with monthly reports and print support
- **Finance** — Income, expense, and salary tracking with receipt printing and balance stats
- **Dashboard** — At-a-glance overview of team and task statistics

## Tech Stack

### Backend
- **NestJS** — Modular monolith with Clean Architecture (domain / application / infrastructure / presentation)
- **Prisma** — ORM with PostgreSQL
- **Passport + JWT** — Authentication
- **class-validator** — DTO validation

### Frontend
- **React 19** + **TypeScript**
- **Vite** — Build tool
- **TanStack Query** — Server state management
- **React Router v7** — Client-side routing
- **shadcn/ui** (base-ui) + **Tailwind CSS v4** — UI components and styling
- **Feature Slice Design (FSD)** — Frontend architecture

## Project Structure

```
BossBoard/
├── backend/          # NestJS API
│   ├── prisma/       # Schema and migrations
│   └── src/
│       ├── modules/
│       │   ├── auth/
│       │   ├── employees/
│       │   ├── tasks/
│       │   ├── finance/
│       │   └── dashboard/
│       └── prisma/   # Prisma service
└── frontend/         # React SPA
    └── src/
        ├── app/      # Router, providers
        ├── pages/    # Route-level components
        ├── features/ # User-facing features
        ├── entities/ # Domain models and API clients
        ├── widgets/  # Composite UI blocks (Sidebar)
        └── shared/   # Axios instance, utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend

# Install dependencies
npm install

# Copy env file and fill in your values
cp .env.example .env

# Run database migrations
npx prisma migrate deploy

# Start in development mode
npm run start:dev
```

The API will be available at `http://localhost:3000`.

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get current user |
| GET/POST | `/employees` | List / create employees |
| PATCH/DELETE | `/employees/:id` | Update / delete employee |
| GET/POST | `/employees/:id/worklogs` | Get / add work logs |
| DELETE | `/employees/:id/worklogs/:logId` | Delete work log |
| GET/POST | `/tasks` | List / create tasks |
| PATCH | `/tasks/:id/status` | Update task status |
| PATCH | `/tasks/:id/priority` | Update task priority |
| DELETE | `/tasks/:id` | Delete task |
| GET | `/finance` | List transactions |
| POST | `/finance` | Create transaction |
| DELETE | `/finance/:id` | Delete transaction |
| GET | `/finance/stats` | Income / expense totals |
| GET | `/dashboard/stats` | Dashboard summary |

## Environment Variables

See `backend/.env.example` for required variables.

## License

MIT
