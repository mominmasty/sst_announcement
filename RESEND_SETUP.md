# Resend Email Setup Guide

## 🚀 Quick Setup

### 1. Get Your Resend API Key

1. **Go to [Resend Dashboard](https://resend.com/api-keys)**
2. **Sign up/Login** to your Resend account
3. **Create a new API Key**:
   - Click "Create API Key"
   - Name it (e.g., "SST Announcement System")
   - Select permissions (Full Access recommended)
   - Copy the API key (starts with `re_`)

### 2. Set Up Domain (Optional but Recommended)

1. **Go to [Resend Domains](https://resend.com/domains)**
2. **Add your domain** (e.g., `yourdomain.com`)
3. **Verify DNS records** as instructed
4. **Use your domain email** (e.g., `noreply@yourdomain.com`)

### 3. Add Environment Variables

Add these to your `.env` file:

```bash
# Resend Email Configuration
RESEND_API_KEY=re_your_actual_api_key_here
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

**If you don't have a custom domain, you can use:**
```bash
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 4. Restart Your Server

```bash
npm run dev
```

## 🧪 Test Email Functionality

### Method 1: Create an Announcement with Email

1. **Go to your dashboard**
2. **Create a new announcement**
3. **Check "Send Email Notification"**
4. **Submit the announcement**
5. **Check the response** for email status

### Method 2: API Test

```bash
curl -X POST http://localhost:3000/api/announcements \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "title": "Test Email Announcement",
    "description": "Testing email functionality",
    "category": "college",
    "send_email": true
  }'
```

## 🔧 Troubleshooting

### Common Issues:

1. **"Email service is not configured"**
   - Check if `RESEND_API_KEY` is set in your `.env` file
   - Restart your development server

2. **"Invalid API key"**
   - Verify your API key is correct and starts with `re_`
   - Check if the key has proper permissions

3. **"Domain not verified"**
   - Use `onboarding@resend.dev` for testing
   - Or verify your custom domain in Resend dashboard

4. **"No recipients specified"**
   - Make sure you have users in your database
   - Check if users have valid email addresses

### Debug Mode:

Check your server console for detailed error messages when sending emails.

## 📧 Email Features

- ✅ **HTML Email Templates** - Beautiful, responsive emails
- ✅ **Automatic Recipients** - Sends to all registered users
- ✅ **Category-based Styling** - Different colors for different categories
- ✅ **Scheduled Announcements** - Emails sent when announcements go live
- ✅ **Emergency Alerts** - Special styling for urgent announcements

## 🎯 Production Setup

For production, make sure to:

1. **Use a custom domain** for better deliverability
2. **Set up SPF, DKIM, and DMARC** records
3. **Monitor email analytics** in Resend dashboard
4. **Set appropriate rate limits** for email sending

## 📊 Current Status

- ✅ Resend package installed (v4.8.0)
- ✅ Email service configured
- ✅ API integration working
- ⚠️ **Need to add environment variables**
