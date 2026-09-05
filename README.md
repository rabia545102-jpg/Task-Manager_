# Task Manager — MERN Stack Major Project

A production-style full-stack task management application built with MongoDB, Express.js, React.js, and Node.js. Each user gets a secure, private workspace for managing personal tasks with JWT authentication, full CRUD, filtering, searching, sorting, and a live stats dashboard.

## Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | React (Vite), React Router, Tailwind CSS, Axios, react-hot-toast |
| Backend    | Node.js, Express.js, express-validator        |
| Database   | MongoDB with Mongoose ODM                     |
| Auth       | JWT (jsonwebtoken) + bcryptjs password hashing |

## Folder Structure

```
task-manager/
├── backend/
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # User.js, Task.js (Mongoose schemas)
│   ├── middleware/              # auth.js, validate.js, errorHandler.js
│   ├── controllers/             # authController.js, taskController.js
│   ├── routes/                  # authRoutes.js, taskRoutes.js
│   ├── app.js                   # Express app (middleware + routes)
│   ├── server.js                # Entry point
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/          # Navbar, TaskCard, TaskList, TaskToolbar, TaskFormModal, StatsBar, FormInput, ProtectedRoute
    │   ├── pages/                # Login, Register, Dashboard
    │   ├── context/AuthContext.jsx
    │   ├── services/            # api.js, authService.js, taskService.js
    │   └── utils/validators.js
    └── .env.example
```

## Features

**Authentication & Authorization**
- Register (name, email, password) with unique email validation
- Passwords hashed with bcrypt (never stored or returned in plain text)
- Login issues a JWT; sent on every request as `Authorization: Bearer <token>`
- Protected routes on both frontend (route guard) and backend (auth middleware)
- Users can only ever read/update/delete their own tasks (enforced at the query level with `user: req.user._id`)

**Task Management**
- Create, read (all + single), update, delete
- Toggle completed/pending
- Bulk-delete all completed tasks
- Filter: All / Pending / Completed
- Search: title or description (case-insensitive)
- Sort: Newest, Oldest, Priority, Due Date
- Stats dashboard: Total, Completed, Pending, Overdue (computed server-side)

**Frontend UX**
- Responsive, mobile-friendly layout (Tailwind)
- Client-side + server-side validation with inline error messages
- Toast notifications for every action (success/error)
- Priority-colored task cards, overdue highlighting
- Skeleton loading states during API calls

## Local Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI (MongoDB Atlas or local), JWT_SECRET, CLIENT_ORIGIN
npm run dev
```
Backend runs on `http://localhost:5000` by default. Health check: `GET /api/health`.

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL
npm run dev
```
Frontend runs on `http://localhost:5173` by default.

## API Reference

### Auth — `/api/auth`
| Method | Endpoint         | Description                     | Protected |
|--------|------------------|----------------------------------|-----------|
| POST   | `/register`      | Create account                   | No        |
| POST   | `/login`         | Log in, returns JWT              | No        |
| POST   | `/logout`        | Logout (client discards token)   | Yes       |
| GET    | `/me`            | Get current user                 | Yes       |

### Tasks — `/api/tasks` (all routes require `Authorization: Bearer <token>`)
| Method | Endpoint             | Description                                   |
|--------|-----------------------|------------------------------------------------|
| GET    | `/`                   | List tasks — query: `status`, `search`, `sortBy` |
| POST   | `/`                   | Create a task                                  |
| GET    | `/stats`              | Total / Completed / Pending / Overdue counts   |
| GET    | `/:id`                | Get single task by ID                          |
| PUT    | `/:id`                | Update a task                                  |
| PATCH  | `/:id/toggle`         | Toggle completed/pending                       |
| DELETE | `/:id`                | Delete a single task                           |
| DELETE | `/completed/all`      | Delete all completed tasks                     |

## Deployment

### GitHub Pages (frontend only)
This repo is pre-configured for GitHub Pages at `/Task-Manager-/` (see `base` in `vite.config.js`). Steps:
```bash
cd frontend
npm install
npm run build
npm run deploy
```
`npm run deploy` runs `gh-pages -d dist`, which pushes the built `dist/` folder to a `gh-pages` branch. In your repo's Settings → Pages, set the source to the `gh-pages` branch. The site will be live at `https://<username>.github.io/Task-Manager-/` within a minute or two.

**Important:** GitHub Pages only serves static files — it cannot run the Express backend or connect to MongoDB. Deploy the backend separately (see below), then before running `npm run build`, set `VITE_API_BASE_URL` in `frontend/.env` to that backend's live URL (e.g. `https://your-backend.onrender.com/api`). Otherwise the deployed site will load but every API call (login, tasks, etc.) will fail.

### Vercel / Netlify / Render / Railway
- **Frontend** → Vercel or Netlify. Set build command `npm run build`, output directory `dist`, and env var `VITE_API_BASE_URL` pointing to your deployed backend's `/api` path.
- **Backend** → Render or Railway. Set start command `node server.js`, and env vars `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGIN` (your deployed frontend URL).
- **Database** → MongoDB Atlas. Whitelist your backend host's IP (or `0.0.0.0/0` for simplicity during development) and use the SRV connection string in `MONGO_URI`.

## Security Notes
- Passwords are hashed with bcrypt (10 salt rounds) and excluded from all API responses.
- JWTs are signed with a server-side secret and verified on every protected request.
- All task queries are scoped by `user: req.user._id`, so no user can read or modify another user's data even if they guess a task ID.
- Centralized error-handling middleware avoids leaking stack traces in production (`NODE_ENV=production`).
