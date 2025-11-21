# Legacy Backend (Express)

This document preserves everything you need to know about the deprecated Express backend that lived under `backend/`. The codebase now runs entirely on Vercel-style serverless functions in `frontend/api`, so this backend should only be referenced for historical context or, if ever needed, for disaster-recovery.

## High-level architecture

- **Framework:** Express 5 with `express-session`, Passport.js (Google OAuth), and custom middleware for rate limiting, domain allow-listing, and admin auth.
- **Database:** PostgreSQL accessed via Drizzle ORM + `pg` connection pool (configured in `backend/src/config/db.ts` and `db/schema.ts`).
- **Auth:** Passport Google OAuth (`backend/src/config/passport.ts`) issued JWTs using `utils/jwt.ts`, mixed cookie + token auth and enforced scaler.com domains.
- **Announcements domain:** REST routes in `api/announcement.ts` (CRUD, schedule/reminder) plus email notifications via Resend (`services/email.ts`) and a cron-like scheduler (`services/scheduler.ts`).
- **Admin utilities:** `routes/admin.ts` handled user management, limits, dashboard summaries, and exposed config metadata.
- **Analytics:** `routes/analytics.ts` stored engagement events in `announcementEngagements` and served aggregate stats.

## Directory map

```
backend/
  src/
    index.ts               # Express bootstrap, middleware wiring, scheduler start
    config/                # env loader, db pool, passport config
    routes/                # auth.ts, admin.ts, analytics.ts (announcements lived under api/)
    api/announcement.ts    # Announcement CRUD + schedule/reminder/email hooks
    api/user.ts            # User fetch/update helpers shared by routes
    middleware/            # adminAuth, domainAuth, roleAuth, rateLimiter, error handlers
    services/              # email.ts, scheduler.ts
    utils/                 # env validation, errors, jwt helpers, validation
    db/schema.ts           # Drizzle table definitions (users, announcements, engagements)
    setup/                 # Database init/migration scripts, role seeding
```

## Environment variables

Key variables the legacy server expected (see `backend/src/utils/env.ts`):

- `DATABASE_URL` – Postgres connection string
- `SESSION_SECRET` – Session + fallback JWT secret
- `JWT_SECRET` – Optional dedicated JWT signing key
- `FRONTEND_URL`, `BACKEND_URL` – CORS and auth callback origins
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`
- `DEPLOYMENT` (local | production)

## Running the legacy backend

```powershell
cd backend
npm install
cp .env.example .env  # ensure the vars above are filled
npm run dev           # or npm run start
```

The server listened on `PORT` (default 8080) and exposed:

- `GET /` – health
- `GET /debug` – session snapshot
- `GET /profile` – current user (requires session/JWT)
- `POST /auth/google` + callback via Passport (Google OAuth)
- `/api/announcements` – CRUD, schedule, reminder (admin-protected except GET)
- `/api/admin/...` – user management, dashboard, limits, config (admin or superadmin)
- `/api/analytics/track|stats` – engagement logging + aggregates

The scheduler (`services/scheduler.ts`) ran every minute via `node-cron` to activate scheduled announcements and send pending emails.

## Migration status

- All non-auth functionality (announcements, admin utilities, analytics, scheduler/email helpers) has been ported to serverless functions under `frontend/api`.
- Auth is being reimplemented with Clerk; once complete, the `backend/` directory can be deleted entirely.
- Keep this file committed so future contributors understand what existed before the serverless + Clerk stack.
