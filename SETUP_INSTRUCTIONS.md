# Setup Instructions

## Environment Variables Setup

Create a `.env.local` file in your project root with the following content:

```bash
# Clerk Authentication Keys
# Get these from https://dashboard.clerk.com/last-active?path=api-keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Database Configuration
DATABASE_URL=your_database_url_here

# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## How to get Clerk Keys:

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Sign in to your account (or create one if you don't have it)
3. Navigate to **API Keys** section
4. Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
5. Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

## After setting up environment variables:

1. Restart your development server: `npm run dev`
2. Your application should now work without the Clerk authentication errors

## Issues Fixed:

- ✅ Missing Clerk publishable key error
- ✅ Next.js 15 compatibility with Clerk headers() usage
- ✅ Missing dependencies for shadcn/ui components
