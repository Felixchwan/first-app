# TaskFlow Realtime

🔗 **Live Demo:** https://first-app-bay-seven.vercel.app/
⚡ **Built with:** React • Supabase • Vite • Vercel

TaskFlow Realtime is a full-stack task management app built with React, Vite, Supabase, and Vercel.

It supports user authentication, realtime task synchronization across tabs, due dates, overdue indicators, filtering, editing, and production-ready deployment.

## Features

- User authentication with Supabase Auth
- Secure multi-user data access with Row Level Security (RLS)
- Realtime task synchronization across browser tabs
- Create, edit, complete, and delete tasks
- Due dates with overdue and due-today indicators
- Task filtering (all, active, completed)
- Dark mode with persistence
- Stats dashboard with completion metrics
- Loading and error handling for async actions
- Production deployment with Vercel

## Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend / Cloud
- Supabase Auth
- Supabase Postgres
- Supabase Realtime
- Row Level Security (RLS)

### Deployment
- Vercel

## Architecture

The app follows a layered structure:

- `pages/` → page-level UI
- `components/` → reusable UI pieces
- `hooks/` → custom React hooks for stateful logic
- `services/` → database interaction layer
- `lib/` → Supabase client setup

### Current flow

`Dashboard UI → useTasks hook → tasksService → Supabase`

This separation keeps UI, business logic, and data access cleanly organized.

## Screenshots

_Add screenshots here later._

## Local Setup

1. Clone the repository
2. Install dependencies

```bash
<<<<<<< HEAD
npm install
=======
npm install
npm run dev

## Live Demo
https://first-app-bay-seven.vercel.app
>>>>>>> e722f74deff112583c8beceece9503875beb1534
