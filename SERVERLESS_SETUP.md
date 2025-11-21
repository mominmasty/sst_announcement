# 🔧 Serverless Setup Instructions

## The Problem

You were trying to run the **old Express backend** (`backend/src/index.ts`) which downloads as a file because there's no server running. Your application has been migrated to a **serverless architecture** using Vercel serverless functions.

## The Solution

### Your New Architecture:

- **Frontend**: React app (port 3000) - Handles UI
- **Backend API**: Vercel serverless functions (port 8787) - Located in `frontend/api/`
- **Authentication**: Clerk (not Google OAuth anymore)

### Step-by-Step Setup:

#### 1. Install Vercel CLI (if not already installed)

```bash
npm install -g vercel
```

#### 2. Configure Environment Variables

**Frontend `.env`** (already done ✓):

```env
VITE_DEPLOYMENT=local
VITE_BACKEND_URL=http://localhost:8787
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aGFwcHktZ2VsZGluZy03OS5jbGVyay5hY2NvdW50cy5kZXYk
```

**API `.env`** (at `frontend/api/.env` - already created ✓):

```env
DATABASE_URL=postgresql://sst_database_user:zefoqA6HXo616kXZMyWl8BXlkQBPIqx2@dpg-d3t8nve3jp1c738js3l0-a.oregon-postgres.render.com/sst_database
SESSION_SECRET=testsessionsecret
CLERK_SECRET_KEY=sk_test_YOUR_CLERK_SECRET_KEY_HERE
CRON_SECRET=replace_me_with_random_string
DEPLOYMENT=local
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8787
```

#### 3. Get Your Clerk Secret Key

⚠️ **IMPORTANT**: You need to get your Clerk Secret Key from https://clerk.com

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to "API Keys"
4. Copy the **Secret Key** (starts with `sk_test_...`)
5. Replace `sk_test_YOUR_CLERK_SECRET_KEY_HERE` in `frontend/api/.env`

#### 4. Start the Application

**Option A: Use the new startup script (Recommended)**

```bash
start_serverless.bat
```

**Option B: Manual start**

```bash
# Terminal 1 - Start Vercel Dev Server (API on port 8787)
cd frontend
npm run dev:vercel

# Terminal 2 - Start React App (UI on port 3000)
cd frontend
npm run dev
```

### What Changed?

| Old (Express)             | New (Serverless)                  |
| ------------------------- | --------------------------------- |
| `backend/src/index.ts`    | `frontend/api/**/*.ts`            |
| Port 8080                 | Port 8787                         |
| Google OAuth              | Clerk Authentication              |
| Express routes            | Vercel serverless functions       |
| `npm run dev` in backend/ | `npm run dev:vercel` in frontend/ |

### Key Files:

- **API Routes**: `frontend/api/`

  - `index.ts` - Health check
  - `profile.ts` - User profile
  - `announcements/` - Announcement endpoints
  - `admin/` - Admin endpoints
  - `analytics/` - Analytics endpoints

- **Configuration**:
  - `vercel.json` - Vercel deployment config (created ✓)
  - `frontend/api/.env` - API environment variables (created ✓)
  - `frontend/.env` - Frontend environment variables (already exists ✓)

### Testing the Setup:

1. Visit http://localhost:3000 - Should show your React app
2. Visit http://localhost:8787/api - Should return JSON with API info
3. Visit http://localhost:8787/api/profile - Should require authentication

### Troubleshooting:

**CORS errors persist?**

- Make sure Vercel dev is running on port 8787
- Check `frontend/api/_lib/config/config.ts` has correct URLs (fixed ✓)

**Authentication not working?**

- Verify Clerk publishable key in `frontend/.env`
- Verify Clerk secret key in `frontend/api/.env`
- Make sure you're logged in through Clerk (not Google OAuth)

**API routes not found?**

- Ensure you're running `npm run dev:vercel` (not `npm run dev` for the API)
- Check Vercel CLI is installed globally

### DO NOT USE:

- ❌ `backend/` directory (old Express code)
- ❌ `start_app.bat` (starts old Express backend)
- ❌ Google OAuth (replaced by Clerk)
- ❌ Port 8080 (use 8787)

### USE INSTEAD:

- ✅ `frontend/api/` directory (serverless functions)
- ✅ `start_serverless.bat` (starts Vercel dev)
- ✅ Clerk authentication
- ✅ Port 8787

---

**Next Step**: Run `start_serverless.bat` and update your Clerk Secret Key!
