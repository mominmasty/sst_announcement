# 🎓 SST Announcement System - Serverless Architecture

A modern, full-stack announcement management system for SCALER School of Technology, featuring **Clerk authentication**, **serverless architecture**, **real-time announcements**, and comprehensive **analytics dashboard**.

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## 🎯 Overview

The SST Announcement System is a **serverless full-stack web application** built for managing college announcements efficiently. It features a modern React frontend with SCALER branding, Clerk authentication for secure access control, and Vercel serverless functions for the backend API.

### Why This Project?

- **Centralized Announcements**: Single source of truth for all college communications
- **Role-Based Access**: User, Admin, and Superadmin roles with granular permissions
- **Analytics Driven**: Track engagement metrics and user interactions
- **Modern Stack**: Built with latest technologies and best practices
- **Domain Restricted**: Only `@scaler.com` and `@sst.scaler.com` emails allowed

### Key Migration from Express to Serverless

This project was recently migrated from a traditional Express backend to a serverless architecture:

| Before (Express)          | After (Serverless)                |
| ------------------------- | --------------------------------- |
| `backend/src/index.ts`    | `frontend/api/**/*.ts`            |
| Port 8080                 | Port 8787                         |
| Google OAuth              | Clerk Authentication              |
| Express routes            | Vercel serverless functions       |
| `npm run dev` in backend/ | `npm run dev:vercel` in frontend/ |
| Passport.js sessions      | JWT tokens                        |

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Clerk Authentication** - Modern, secure authentication with JWT tokens
- **Domain Restriction** - Only `@scaler.com` and `@sst.scaler.com` emails allowed
- **Role-Based Access Control** - Three roles: User, Admin, Superadmin
- **Session Management** - Persistent sessions with secure cookies

### 📢 Announcement Management
- **CRUD Operations** - Create, read, update, delete announcements (Admin)
- **Category System** - Organize by College, Tech Events, Workshops, Academic, Sports, Emergency
- **Scheduling** - Schedule announcements for future publication
- **Expiry Management** - Set expiry dates with visual indicators
- **Rich Content** - Support for detailed descriptions and metadata
- **Email Notifications** - Send announcements via email (Resend integration)

### 🔍 Search & Discovery
- **Full-Text Search** - Search by title and description
- **Category Filters** - Filter announcements by category
- **Sorting Options** - Sort by date, views, or engagement
- **Pagination** - Efficient data loading for large datasets

### 📊 Analytics & Insights
- **User Analytics** - Track active users and growth
- **Engagement Tracking** - Monitor views, clicks, and dismissals
- **Top Announcements** - View most viewed/engaged announcements
- **Real-time Stats** - Live dashboard with key metrics
- **User Management** - Admin panel for user and role management

### 🎨 Modern UI/UX
- **SCALER Branding** - Professional design with college branding
- **Dark Theme** - Modern dark mode with gradient backgrounds
- **Glassmorphism** - Frosted glass effects on cards and modals
- **Responsive Design** - Mobile-first responsive layout
- **Smooth Animations** - Transitions, hover effects, and micro-interactions
- **Loading States** - Skeleton loaders and loading indicators
- **Toast Notifications** - Real-time feedback for user actions

---

## 🏗️ Architecture

### Technology Stack

#### Frontend
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite 7** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Clerk React** - Authentication components
- **Lucide Icons** - Modern icon library

#### Backend (Serverless)
- **Vercel Functions** - Serverless compute platform
- **TypeScript** - Type-safe API development
- **PostgreSQL** - Robust relational database
- **Drizzle ORM** - Type-safe database queries
- **Clerk Backend** - JWT verification and user management
- **Resend** - Email delivery service

#### Infrastructure
- **Vercel** - Hosting and serverless functions
- **Render** - PostgreSQL database hosting
- **Clerk** - Authentication service

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
│                   (localhost:3000)                           │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                  React Frontend (Vite)                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Login (Clerk)        - Announcements              │  │
│  │  - Dashboard            - Analytics                  │  │
│  │  - Admin Panel          - User Management            │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ JWT Bearer Token
                        ▼
┌─────────────────────────────────────────────────────────────┐
│          Vercel Serverless Functions (API)                  │
│                 (localhost:8787)                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/profile           /api/announcements           │  │
│  │  /api/admin/*           /api/analytics/*             │  │
│  │  - Clerk JWT Verify     - Domain Validation          │  │
│  │  - CORS Handling        - Role Authorization         │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
  ┌─────────┐    ┌──────────┐    ┌──────────┐
  │  Clerk  │    │PostgreSQL│    │  Resend  │
  │   API   │    │ Database │    │   Email  │
  └─────────┘    └──────────┘    └──────────┘
```

### Serverless Benefits

1. **Zero Server Management** - No need to manage, patch, or scale servers
2. **Cost Effective** - Pay only for actual usage, zero cost when idle
3. **Auto Scaling** - Automatically handles traffic spikes
4. **Global Distribution** - Edge functions for lowest latency
5. **Quick Deployments** - Deploy in seconds with Git push
6. **Environment Isolation** - Each function runs in isolated environment

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher ([Download](https://nodejs.org/))
- **PostgreSQL** database ([Render](https://render.com/) recommended)
- **Clerk Account** ([Sign up free](https://clerk.com/))
- **Vercel CLI** (for local serverless development)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/mominmasty/sst_announcement.git
cd sst_announcement
```

#### 2. Install Vercel CLI

```bash
npm install -g vercel
```

#### 3. Set Up Environment Variables

**Frontend `.env`** (at `frontend/.env`):

```env
VITE_DEPLOYMENT=local
VITE_BACKEND_URL=http://localhost:8787
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_CLERK_KEY_HERE
```

**API `.env`** (at `frontend/api/.env`):

```env
# Database
DATABASE_URL=postgresql://user:password@host/database

# Authentication
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_HERE

# Server Config
SESSION_SECRET=your_random_secret_key
CRON_SECRET=your_cron_secret
DEPLOYMENT=local
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8787

# Email (Optional - for email notifications)
RESEND_API_KEY=re_YOUR_RESEND_KEY
```

#### 4. Get Your Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Copy **Publishable Key** → `VITE_CLERK_PUBLISHABLE_KEY`
4. Copy **Secret Key** → `CLERK_SECRET_KEY`
5. Configure allowed email domains in Clerk Dashboard:
   - Add `scaler.com` to allowed domains
   - Add `sst.scaler.com` to allowed domains

#### 5. Install Dependencies

```bash
cd frontend
npm install
```

#### 6. Database Setup

Run the migration to rename `google_id` to `clerk_id` (if migrating from old system):

```bash
cd frontend
node run-migration.js
```

Verify the database schema:

```bash
node check-enum.js
```

#### 7. Start the Application

**Option A: Use Startup Script (Recommended)**

```bash
# Windows
start_serverless.bat

# Mac/Linux (create start_serverless.sh)
#!/bin/bash
cd frontend
npm run dev:vercel &
npm run dev
```

**Option B: Manual Start**

```bash
# Terminal 1 - Vercel Dev Server (API on port 8787)
cd frontend
vercel dev --listen 8787

# Terminal 2 - React App (UI on port 3000)
cd frontend
npm run dev
```

#### 8. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8787/api
- **API Health**: http://localhost:8787/api (should return JSON)
- **Profile Endpoint**: http://localhost:8787/api/profile (requires auth)

---

## 📁 Project Structure

```
sst_announcement/
├── frontend/                      # React frontend + Serverless API
│   ├── api/                       # 🚀 Vercel Serverless Functions
│   │   ├── _lib/                  # Shared API utilities
│   │   │   ├── config/            # Database, env, Clerk config
│   │   │   │   ├── db.ts          # Database connection
│   │   │   │   ├── env.ts         # Environment validation
│   │   │   │   └── passport.ts    # Legacy (not used)
│   │   │   ├── data/              # Data access layer
│   │   │   │   └── users.ts       # User CRUD operations
│   │   │   ├── middleware/        # Middleware functions
│   │   │   │   ├── auth.ts        # Authentication middleware
│   │   │   │   ├── domainAuth.ts  # Domain validation
│   │   │   │   ├── rateLimiter.ts # Rate limiting
│   │   │   │   └── roleAuth.ts    # Role authorization
│   │   │   ├── services/          # Business logic
│   │   │   │   ├── clerk.ts       # Clerk JWT verification
│   │   │   │   ├── email.ts       # Email service (Resend)
│   │   │   │   └── scheduler.ts   # Cron jobs
│   │   │   ├── types/             # TypeScript types
│   │   │   │   ├── index.ts       # Shared types
│   │   │   │   └── express.d.ts   # Type extensions
│   │   │   ├── utils/             # Helper functions
│   │   │   │   ├── corsHelper.ts  # CORS utilities
│   │   │   │   ├── errors.ts      # Error classes
│   │   │   │   ├── http.ts        # HTTP helpers
│   │   │   │   ├── jwt.ts         # JWT utilities
│   │   │   │   └── validation.ts  # Input validation
│   │   │   ├── migrations/        # Database migrations
│   │   │   │   └── rename-google-id-to-clerk-id.sql
│   │   │   └── schema.ts          # Drizzle ORM schema
│   │   ├── admin/                 # Admin endpoints
│   │   │   ├── dashboard.ts       # Admin dashboard data
│   │   │   ├── limits.ts          # Rate limiting config
│   │   │   └── users/             
│   │   │       └── [id].ts        # User management by ID
│   │   ├── analytics/             # Analytics endpoints
│   │   │   ├── stats.ts           # Analytics statistics
│   │   │   └── track.ts           # Event tracking
│   │   ├── announcements/         # Announcement endpoints
│   │   │   ├── [id].ts            # Single announcement CRUD
│   │   │   ├── index.ts           # List/create announcements
│   │   │   ├── reminder.ts        # Reminder management
│   │   │   └── schedule.ts        # Scheduled announcements
│   │   ├── tasks/                 # Background jobs
│   │   │   └── process-scheduled.ts
│   │   ├── debug.ts               # Debug endpoint
│   │   ├── index.ts               # API root
│   │   └── profile.ts             # User profile
│   ├── src/                       # React application
│   │   ├── components/            # React components
│   │   │   ├── announcements/     # Announcement UI
│   │   │   ├── common/            # Shared components
│   │   │   ├── dashboard/         # Dashboard UI
│   │   │   ├── filters/           # Filter components
│   │   │   ├── modals/            # Modal dialogs
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   └── Layout.tsx         # Main layout
│   │   ├── contexts/              # React contexts
│   │   │   └── AppUserContext.tsx # User state
│   │   ├── services/              # API service layer
│   │   │   └── api.ts             # API client
│   │   ├── pages/                 # Page components
│   │   │   ├── Dashboard.tsx      # Main dashboard
│   │   │   ├── AllAnnouncements.tsx
│   │   │   └── Login.tsx          # Login page
│   │   ├── config/                # Frontend config
│   │   ├── constants/             # Constants
│   │   ├── hooks/                 # Custom hooks
│   │   ├── utils/                 # Utilities
│   │   ├── styles/                # CSS files
│   │   └── main.tsx               # Entry point
│   ├── package.json               # Dependencies
│   ├── vercel.json                # Vercel configuration
│   ├── vite.config.ts             # Vite config
│   ├── run-migration.js           # Database migration script
│   └── check-enum.js              # Database verification script
├── backend/                       # ⚠️ LEGACY Express backend
│   └── ...                        # (NOT USED - kept for reference)
├── start_serverless.bat           # Windows startup script
├── SERVERLESS_SETUP.md            # Serverless setup guide
├── DEPLOYMENT_SWITCH.md           # Deployment configuration
└── README.md                      # Original README
```

### Important Files

#### Core API Files
- **`frontend/api/index.ts`** - API root, health check
- **`frontend/api/profile.ts`** - User profile endpoint
- **`frontend/api/_lib/services/clerk.ts`** - Clerk authentication logic
- **`frontend/api/_lib/middleware/auth.ts`** - JWT verification middleware
- **`frontend/api/_lib/config/db.ts`** - Database connection pooling

#### Configuration Files
- **`frontend/vercel.json`** - Vercel serverless function config
- **`frontend/api/.env`** - API environment variables
- **`frontend/.env`** - Frontend environment variables

#### Migration Scripts
- **`frontend/run-migration.js`** - Migrates google_id → clerk_id
- **`frontend/check-enum.js`** - Verifies database enum values

---

## 🔧 Configuration

### Environment Variables

#### Frontend Environment (`frontend/.env`)

| Variable                       | Description                  | Example                      | Required |
| ------------------------------ | ---------------------------- | ---------------------------- | -------- |
| `VITE_DEPLOYMENT`              | Deployment mode              | `local` or `production`      | Yes      |
| `VITE_BACKEND_URL`             | API base URL                 | `http://localhost:8787`      | Yes      |
| `VITE_CLERK_PUBLISHABLE_KEY`   | Clerk publishable key        | `pk_test_...`                | Yes      |

#### API Environment (`frontend/api/.env`)

| Variable          | Description              | Example                                      | Required |
| ----------------- | ------------------------ | -------------------------------------------- | -------- |
| `DATABASE_URL`    | PostgreSQL connection    | `postgresql://user:pass@host/db`             | Yes      |
| `CLERK_SECRET_KEY`| Clerk secret key         | `sk_test_...`                                | Yes      |
| `SESSION_SECRET`  | Session encryption key   | Random 32+ char string                       | Yes      |
| `DEPLOYMENT`      | Deployment mode          | `local` or `production`                      | Yes      |
| `FRONTEND_URL`    | Frontend URL             | `http://localhost:3000`                      | Yes      |
| `BACKEND_URL`     | Backend URL              | `http://localhost:8787`                      | Yes      |
| `RESEND_API_KEY`  | Email service key        | `re_...`                                     | No       |
| `CRON_SECRET`     | Cron job secret          | Random string                                | Yes      |

### Database Schema

#### Users Table
```typescript
{
  id: number (primary key)
  clerk_id: string (unique, not null)
  email: string (unique, not null)
  username: string | null
  role: 'user' | 'admin' | 'superadmin'
  created_at: timestamp
  last_login: timestamp
}
```

#### Announcements Table
```typescript
{
  id: number (primary key)
  title: string
  description: string
  category: string
  author_id: number (foreign key → users.id)
  created_at: timestamp
  updated_at: timestamp
  expiry_date: timestamp | null
  scheduled_at: timestamp | null
  reminder_time: timestamp | null
  is_active: boolean
  status: string
  views_count: number
  clicks_count: number
  send_email: boolean
  email_sent: boolean
}
```

#### Announcement Engagements Table
```typescript
{
  id: number (primary key)
  announcement_id: number (foreign key → announcements.id)
  user_id: number | null (foreign key → users.id)
  event_type: 'view' | 'click' | 'dismiss'
  created_at: timestamp
}
```

---

## 💻 Development

### Scripts

**Frontend:**
```bash
npm run dev              # Start Vite dev server (port 3000)
npm run dev:vercel       # Start Vercel dev server (port 8787)
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Development Workflow

1. **Start Both Servers**
   ```bash
   # Terminal 1 - API
   cd frontend
   npm run dev:vercel
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

2. **Make Changes**
   - Frontend changes hot-reload automatically
   - API changes require Vercel dev server restart (Ctrl+C, then restart)

3. **Test API Endpoints**
   ```bash
   # Health check
   curl http://localhost:8787/api
   
   # Get profile (requires auth token)
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8787/api/profile
   ```

4. **Check Database**
   ```bash
   cd frontend
   node check-enum.js
   ```

### Adding New API Endpoints

1. Create new file in `frontend/api/` (e.g., `my-endpoint.ts`)
2. Export default handler function:
   ```typescript
   import { VercelRequest, VercelResponse } from '@vercel/node';
   import { handleCorsPreflight, setCorsHeadersLocal } from './_lib/utils/corsHelper.js';
   import { requireAuth } from './_lib/middleware/auth.js';
   import { sendJson, sendError } from './_lib/utils/http.js';

   export default async function handler(req: VercelRequest, res: VercelResponse) {
     if (handleCorsPreflight(req, res)) return;
     setCorsHeadersLocal(res);

     try {
       const user = await requireAuth(req);
       
       // Your logic here
       
       return sendJson(res, { message: 'Success', user });
     } catch (error) {
       return sendError(res, error);
     }
   }
   ```
3. Access at `http://localhost:8787/api/my-endpoint`

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: React + TypeScript rules
- **Imports**: Use `.js` extension for all relative imports in `api/` folder
- **Naming**: 
  - Components: `PascalCase`
  - Files: `camelCase` (utilities), `PascalCase` (components)
  - Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`

---

## 🚀 Deployment

### Production Checklist

- [ ] Update environment variables to production values
- [ ] Set `DEPLOYMENT=production` in both `.env` files
- [ ] Configure Clerk production instance
- [ ] Set up production PostgreSQL database
- [ ] Add production domain to Clerk allowed domains
- [ ] Test authentication flow
- [ ] Verify CORS settings
- [ ] Run database migrations

### Deploy to Vercel

#### Option 1: Vercel CLI

```bash
cd frontend
vercel --prod
```

#### Option 2: GitHub Integration

1. Connect repo to Vercel
2. Configure environment variables in Vercel dashboard
3. Every push to `main` branch auto-deploys

### Environment Variables in Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

**Frontend:**
- `VITE_DEPLOYMENT=production`
- `VITE_BACKEND_URL=https://your-project.vercel.app`
- `VITE_CLERK_PUBLISHABLE_KEY=pk_live_...`

**API** (auto-available to serverless functions):
- `DATABASE_URL=postgresql://...`
- `CLERK_SECRET_KEY=sk_live_...`
- `SESSION_SECRET=...`
- `DEPLOYMENT=production`
- `FRONTEND_URL=https://your-project.vercel.app`
- `BACKEND_URL=https://your-project.vercel.app`

### Post-Deployment

1. Test authentication: Login with `@scaler.com` email
2. Verify API endpoints work
3. Check database connections
4. Test admin functions
5. Monitor Vercel logs for errors

---

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:8787`
- **Production**: `https://your-project.vercel.app`

### Authentication

All authenticated endpoints require JWT token:
```
Authorization: Bearer <jwt_token>
```

Get token from Clerk after login (stored in `__session` cookie).

### Endpoints

#### Public

**GET `/api`**
```json
{
  "message": "SST Announcement API",
  "status": "healthy",
  "version": "2.0.0"
}
```

#### Authenticated

**GET `/api/profile`**

Returns current user profile.

**Response:**
```json
{
  "id": 1,
  "clerk_id": "user_abc123",
  "email": "user@scaler.com",
  "username": "John Doe",
  "role": "user",
  "is_admin": false,
  "created_at": "2025-01-01T00:00:00Z",
  "last_login": "2025-01-20T12:00:00Z"
}
```

**GET `/api/announcements`**

List all announcements with optional filters.

**Query Params:**
- `category`: Filter by category
- `limit`: Results per page (default: 50)
- `offset`: Pagination offset

**POST `/api/announcements/:id/engagement`**

Track user engagement (view, click, dismiss).

**Body:**
```json
{
  "event_type": "view"
}
```

#### Admin Only

**POST `/api/announcements`**

Create announcement.

**PATCH `/api/announcements/:id`**

Update announcement.

**DELETE `/api/announcements/:id`**

Delete announcement.

**GET `/api/admin/users`**

List all users.

**PATCH `/api/admin/users/:id/role`**

Update user role (Superadmin only).

**GET `/api/analytics/stats`**

Get analytics dashboard data.

---

## 🔐 Security

### Authentication Flow

1. User logs in via Clerk UI
2. Clerk generates JWT token
3. Frontend stores token in cookie
4. Each API request includes token in `Authorization` header
5. API verifies token with Clerk secret key
6. Domain validation checks email domain
7. Role authorization checks user permissions

### Security Measures

- **JWT Verification**: Every request verified with Clerk
- **Domain Whitelisting**: Only `@scaler.com` and `@sst.scaler.com`
- **HTTPS Enforcement**: Production uses HTTPS only
- **CORS Protection**: Restricted to known origins
- **Rate Limiting**: Prevents abuse
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: React auto-escaping
- **Environment Secrets**: Never committed to Git

---

## 🐛 Troubleshooting

### CORS Errors

**Problem:** `Access-Control-Allow-Origin` header missing

**Solution:**
```bash
# Check backend URL
cat frontend/.env | grep VITE_BACKEND_URL

# Ensure Vercel dev is running on 8787
ps aux | grep vercel

# Restart Vercel dev
cd frontend
vercel dev --listen 8787
```

### Authentication Failed

**Problem:** Login works but profile API returns 401

**Solution:**
1. Check Clerk keys in `.env` files
2. Verify domain in Clerk dashboard
3. Clear browser cookies
4. Check token in DevTools → Application → Cookies

### Database Connection Error

**Problem:** 500 error with database message

**Solution:**
```bash
# Test connection
psql postgresql://user:pass@host/db

# Check enum values
cd frontend
node check-enum.js

# Run migration if needed
node run-migration.js
```

### TypeScript Errors

**Problem:** Build fails with module not found

**Solution:**
- Ensure all imports in `api/_lib/` use `.js` extension
- Run `npm install` in frontend folder
- Check `tsconfig.json` configuration

### Vercel Dev Not Starting

**Problem:** Vercel CLI not found or fails

**Solution:**
```bash
# Install globally
npm install -g vercel

# Check version
vercel --version

# Login
vercel login

# Try starting again
cd frontend
vercel dev --listen 8787
```

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/my-feature`
3. Make changes and test locally
4. Commit: `git commit -m 'Add my feature'`
5. Push: `git push origin feature/my-feature`
6. Open Pull Request

### Development Guidelines

- Write TypeScript with strict mode
- Add JSDoc comments for complex functions
- Test API endpoints before committing
- Update documentation for new features
- Follow existing code style

---

## 📄 License

ISC License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **SCALER School of Technology** - Project requirements
- **Clerk** - Authentication platform
- **Vercel** - Serverless infrastructure
- **shadcn/ui** - Component library
- **Drizzle ORM** - Type-safe database queries

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/mominmasty/sst_announcement/issues)
- **Docs**: [SERVERLESS_SETUP.md](SERVERLESS_SETUP.md)
- **Contact**: SCALER SST IT Team

---

**Built with ❤️ for SCALER School of Technology**

*Last Updated: November 20, 2025*
