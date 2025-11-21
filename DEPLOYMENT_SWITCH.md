# 🚀 Easy Deployment Switcher

## Quick Switch Between Local and Production

### Backend (Node.js)

**Option 1: Environment Variable (Recommended)**
Create a `.env` file in the `backend/` folder:

```env
DEPLOYMENT=local
```

To switch to production:

```env
DEPLOYMENT=production
```

**Option 2: Direct Override**
You can also override specific URLs:

```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8080
GOOGLE_CALLBACK_URL=http://localhost:8080/auth/google/callback
```

### Frontend (React/Vite)

**Option 1: Environment Variable (Recommended)**
Create a `.env` file in the `frontend/` folder:

```env
VITE_DEPLOYMENT=local
```

To switch to production:

```env
VITE_DEPLOYMENT=production
```

**Option 2: Direct Override**
You can also override the backend URL:

```env
VITE_BACKEND_URL=http://localhost:8080
```

## Default Behavior

- **If no `.env` file exists**: Defaults to **LOCAL** development

  - Frontend: `http://localhost:3000`
  - Backend: `http://localhost:8080`
  - Callback: `http://localhost:8080/auth/google/callback`

- **If `DEPLOYMENT=production`**: Uses production URLs
  - Frontend: `https://sst-announcement.vercel.app`
  - Backend: `https://sst-announcement.onrender.com`
  - Callback: `https://sst-announcement.onrender.com/auth/google/callback`

## Configuration Files

The configuration is centralized in:

- Backend: `backend/src/config/config.ts`
- Frontend: `frontend/src/config/config.ts`

You can modify these files if you need to change the production URLs.
