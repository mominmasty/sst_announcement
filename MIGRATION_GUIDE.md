# SST Announcement System - Next.js Migration

This document outlines the complete migration from Vercel API routes to Next.js App Router format.

## 🚀 Migration Summary

All API routes and supporting infrastructure have been successfully converted from Vercel API format to Next.js App Router format. The migration maintains 100% functional compatibility while leveraging Next.js's modern architecture.

## 📁 New Project Structure

```
├── app/
│   └── api/
│       ├── admin/
│       │   ├── dashboard/
│       │   │   └── route.ts
│       │   └── users/
│       │       ├── route.ts
│       │       └── [id]/
│       │           ├── route.ts
│       │           ├── admin-status/
│       │           │   └── route.ts
│       │           └── role/
│       │               └── route.ts
│       ├── announcements/
│       │   ├── route.ts
│       │   └── [id]/
│       │       └── route.ts
│       └── profile/
│           └── route.ts
├── lib/
│   ├── config/
│   │   ├── config.ts
│   │   ├── db.ts
│   │   └── env.ts
│   ├── data/
│   │   ├── announcements.ts
│   │   └── users.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── domain.ts
│   │   └── rateLimit.ts
│   ├── services/
│   │   ├── clerk.ts
│   │   └── email.ts
│   ├── utils/
│   │   ├── errors.ts
│   │   ├── roleUtils.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── index.ts
│   └── schema.ts
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.example
```

## 🔄 Key Changes Made

### 1. API Route Structure
- **Before**: `api/admin/users/index.ts` (Vercel format)
- **After**: `app/api/admin/users/route.ts` (Next.js App Router)

### 2. Request/Response Handling
- **Before**: `VercelRequest` & `VercelResponse`
- **After**: `NextRequest` & `NextResponse`

### 3. HTTP Methods
- **Before**: Single handler function with method checking
- **After**: Named exports for each HTTP method (`GET`, `POST`, `PATCH`, `DELETE`, `OPTIONS`)

### 4. Query Parameters
- **Before**: `req.query.param`
- **After**: `new URL(request.url).searchParams.get('param')`

### 5. Request Body
- **Before**: `getJsonBody(req)`
- **After**: `await request.json()`

### 6. Dynamic Routes
- **Before**: `req.query.id`
- **After**: `{ params }: { params: { id: string } }`

## 🛠️ Converted API Endpoints

### Admin Routes
- ✅ `GET /api/admin/dashboard` - Admin dashboard stats
- ✅ `GET /api/admin/users` - List all users with search
- ✅ `GET /api/admin/users/[id]` - Get user by ID
- ✅ `PATCH /api/admin/users/[id]/role` - Update user role
- ✅ `PATCH /api/admin/users/[id]/admin-status` - Update admin status

### Announcement Routes
- ✅ `GET /api/announcements` - List announcements with pagination
- ✅ `POST /api/announcements` - Create new announcement
- ✅ `GET /api/announcements/[id]` - Get announcement by ID
- ✅ `PATCH /api/announcements/[id]` - Update announcement
- ✅ `DELETE /api/announcements/[id]` - Delete announcement

### User Routes
- ✅ `GET /api/profile` - Get current user profile

## 🔧 Middleware & Utilities

### Authentication Middleware
- ✅ `requireAuth()` - Authenticate requests using Clerk
- ✅ `requireAdmin()` - Require admin-level access
- ✅ `requireSuperAdmin()` - Require super admin access
- ✅ `requireAllowedDomain()` - Domain-based access control

### Rate Limiting
- ✅ IP-based rate limiting with configurable windows
- ✅ Different limits for general, auth, admin, and strict endpoints

### Error Handling
- ✅ Standardized error classes (`ApiError`, `NotFoundError`, etc.)
- ✅ Consistent error response format

### Validation
- ✅ Announcement validation with comprehensive rules
- ✅ Email and user ID validation utilities

## 🗄️ Database & Services

### Database Layer
- ✅ Drizzle ORM integration with PostgreSQL
- ✅ Connection pooling and caching
- ✅ Schema definitions with relations

### External Services
- ✅ Clerk authentication integration
- ✅ Resend email service integration
- ✅ Role-based user management

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env.local` and fill in your values:
```bash
cp .env.example .env.local
```

### 3. Database Setup
Ensure your PostgreSQL database is running and the `DATABASE_URL` is configured.

### 4. Run Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
npm start
```

## 🔍 Testing the Migration

### API Endpoint Testing
All endpoints maintain the same request/response format:

```bash
# Test user listing
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/admin/users

# Test announcement creation
curl -X POST \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test announcement","category":"tech"}' \
  http://localhost:3000/api/announcements
```

## 📋 Migration Checklist

- ✅ Convert all API routes to App Router format
- ✅ Update middleware for Next.js context
- ✅ Convert utility functions
- ✅ Update service integrations
- ✅ Create proper directory structure
- ✅ Update import paths
- ✅ Configure TypeScript and Next.js
- ✅ Create package.json with dependencies
- ✅ Document migration process

## 🔒 Security Considerations

- ✅ Rate limiting implemented
- ✅ Domain-based access control
- ✅ Role-based authorization
- ✅ Input validation and sanitization
- ✅ CORS handling for cross-origin requests

## 📈 Performance Optimizations

- ✅ Connection pooling for database
- ✅ Cached authentication clients
- ✅ Efficient query patterns
- ✅ Minimal API surface area

## 🐛 Troubleshooting

### Common Issues

1. **Import Path Errors**: Ensure all imports use the new `@/lib/` path structure
2. **Environment Variables**: Make sure all required env vars are set in `.env.local`
3. **Database Connection**: Verify PostgreSQL is running and accessible
4. **Clerk Configuration**: Ensure Clerk secret key is properly configured

### Debug Mode
Enable detailed logging by setting `NODE_ENV=development` in your environment.

## 🔄 Rollback Plan

If needed, the original Vercel API routes are preserved in the source repository and can be restored by:

1. Reverting to the original `api/` directory structure
2. Updating import paths back to the original format
3. Restoring the original `vercel.json` configuration

## 📞 Support

For issues or questions regarding this migration:
1. Check the troubleshooting section above
2. Review the original codebase for reference
3. Consult Next.js App Router documentation
4. Contact the development team

---

**Migration completed successfully! 🎉**

All functionality has been preserved while modernizing the codebase to use Next.js App Router architecture.
