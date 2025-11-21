# 📅 Scheduler Setup Guide

## Problem Fixed ✅

The scheduler wasn't working because there were **no API endpoints or cron jobs** to trigger the scheduler functions. The scheduler logic existed but was never called!

## Solution Implemented

### 1. Created Scheduler API Endpoints

- **`/api/scheduler`** (POST) - Main endpoint that processes both scheduled announcements and expired emergency announcements

**Note**: Manual trigger and test endpoints were removed to stay within Vercel's free tier limit of 12 serverless functions.

### 2. Added Vercel Cron Job

**Uses only 1 cron job** (perfect for free tier limit of 12):

```json
{
  "crons": [
    {
      "path": "/api/scheduler",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This runs every 5 minutes and processes:
- ✅ Scheduled announcements that are due
- ✅ Emergency announcements that have expired

## How It Works

### Scheduled Announcements
1. When you create an announcement with a future `scheduled_at` date:
   - Status is set to `'scheduled'`
   - `isActive` is set to `false`
   - Announcement is hidden from users

2. Every 5 minutes, the cron job checks for announcements where:
   - `scheduledAt` <= current time
   - `status` = `'scheduled'`
   - `sendEmail` = `true`
   - `emailSent` = `false`

3. When found, it:
   - Updates status to `'active'`
   - Sets `isActive` to `true`
   - Sends email notifications
   - Marks `emailSent` as `true`

### Emergency Announcements
1. Emergency announcements with `priorityUntil` date are automatically expired when the time passes
2. Status changes from `'urgent'` to `'expired'`
3. `isActive` is set to `false`

## Testing the Scheduler

### Testing the Scheduler

**Direct API Call (Recommended for Testing)**
```bash
# Call the main scheduler endpoint (requires CRON_SECRET)
curl -X POST "http://localhost:8787/api/scheduler" \
  -H "x-cron-secret: YOUR_CRON_SECRET"
```

## Environment Variables Required

Make sure these are set in `frontend/api/.env`:

```env
# Required for cron job authentication
CRON_SECRET=your_random_secret_here

# Required for email functionality
RESEND_API_KEY=re_your_resend_key_here

# Database connection
DATABASE_URL=your_postgres_url_here
```

## Deployment Notes

### Vercel Free Tier Optimization
- ✅ Uses only **1 cron job** (out of 12 allowed)
- ✅ Runs every 5 minutes (good balance of responsiveness vs. resource usage)
- ✅ Combines both scheduled and expired processing in one endpoint

### Production Deployment
1. Deploy to Vercel: `vercel --prod`
2. Cron jobs will automatically start working
3. Check Vercel dashboard → Functions → Crons to monitor

## Troubleshooting

### If Announcements Still Don't Get Scheduled:

1. **Check the test endpoint:**
   ```bash
   curl -X GET "https://your-app.vercel.app/api/scheduler/test" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **Verify cron job is running:**
   - Go to Vercel Dashboard → Your Project → Functions → Crons
   - Check execution logs

3. **Check environment variables:**
   - Ensure `CRON_SECRET` is set
   - Ensure `RESEND_API_KEY` is set (for email)
   - Ensure `DATABASE_URL` is correct

4. **Manual trigger test:**
   ```bash
   curl -X POST "https://your-app.vercel.app/api/scheduler/manual-trigger" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## Next Steps

1. **Deploy the changes:** `vercel --prod`
2. **Test with a scheduled announcement:**
   - Create an announcement scheduled 2-3 minutes in the future
   - Wait for the cron job to process it
   - Check if it becomes active and sends emails

3. **Monitor in production:**
   - Check Vercel function logs
   - Verify emails are being sent
   - Confirm announcements are becoming active

The scheduler should now work perfectly! 🎉
