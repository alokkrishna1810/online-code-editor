# Email Service Setup Guide

This guide will help you configure a **FREE** email service for CodeCollab's authentication system.

## 🎉 FREE Email Services (No Credit Card Required)

### 1. Mailgun (Recommended - 5,000 emails/month FREE)

**Setup Steps:**
1. Sign up at [Mailgun](https://www.mailgun.com) (free account)
2. Verify your email and add your domain (or use their sandbox domain)
3. Go to "Sending" → "Domains" → Get SMTP credentials
4. Set the following environment variables in `.env.local`:

```env
# Mailgun Configuration (FREE)
EMAIL_SERVICE=mailgun
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@yourdomain.mailgun.org
EMAIL_PASS=your-mailgun-smtp-password
```

**Why Mailgun?**
- ✅ 5,000 emails/month FREE
- ✅ Excellent deliverability
- ✅ Professional SMTP service
- ✅ Easy domain setup

### 2. Resend (3,000 emails/month FREE)

**Setup Steps:**
1. Sign up at [Resend](https://resend.com) (free account)
2. Verify your email
3. Get your API key from the dashboard
4. Set the following environment variables:

```env
# Resend Configuration (FREE)
EMAIL_SERVICE=resend
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=resend
EMAIL_PASS=your-resend-api-key
```

**Why Resend?**
- ✅ 3,000 emails/month FREE
- ✅ Modern API-first approach
- ✅ Great developer experience
- ✅ Good deliverability

### 3. Brevo (formerly Sendinblue) (300 emails/day FREE)

**Setup Steps:**
1. Sign up at [Brevo](https://www.brevo.com) (free account)
2. Verify your email
3. Go to "SMTP & API" → "SMTP"
4. Set the following environment variables:

```env
# Brevo Configuration (FREE)
EMAIL_SERVICE=brevo
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-brevo-email@domain.com
EMAIL_PASS=your-brevo-smtp-key
```

**Why Brevo?**
- ✅ 300 emails/day FREE
- ✅ Good for small applications
- ✅ Marketing automation included
- ✅ Easy to upgrade

### 4. Postmark (100 emails/month FREE - Testing)

**Setup Steps:**
1. Sign up at [Postmark](https://postmarkapp.com) (free account)
2. Verify your email
3. Create a server and get SMTP credentials
4. Set the following environment variables:

```env
# Postmark Configuration (FREE for testing)
EMAIL_SERVICE=postmark
EMAIL_HOST=smtp.postmarkapp.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-postmark-smtp-token
EMAIL_PASS=your-postmark-smtp-token
```

**Why Postmark?**
- ✅ 100 emails/month FREE
- ✅ Excellent deliverability
- ✅ Great for testing
- ✅ Professional service

## 🚀 Quick Start (Mailgun)

For the fastest setup, use Mailgun:

1. **Sign up:** https://www.mailgun.com
2. **Use their sandbox domain** (no domain setup needed)
3. **Add this to your `.env.local`:**

```env
EMAIL_SERVICE=mailgun
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@sandbox.YOUR_SANDBOX_ID.mailgun.org
EMAIL_PASS=YOUR_SANDBOX_SMTP_PASSWORD
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Test it:** Run your app and try the "Forgot Password" feature!

## 📧 Paid Options (if you need more emails)

### SendGrid (100 emails/day FREE)
```env
EMAIL_SERVICE=sendgrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### AWS SES (62,000 emails/month FREE)
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-ses-smtp-username
EMAIL_PASS=your-ses-smtp-password
```

## Environment Variables

Add these to your `.env.local` file:

```env
# Email Configuration
EMAIL_SERVICE=sendgrid
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key

# Application URL (for email links)
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## Testing Email Functionality

1. Start your development server: `npm run dev`
2. Go to `/auth` page
3. Try the "Forgot Password" functionality
4. Check your email for the reset link

## Email Templates

The system includes professional HTML email templates for:
- Password Reset
- Email Verification

Templates are responsive and include both HTML and plain text versions.

## Troubleshooting

**Common Issues:**

1. **"Email sending failed" error**
   - Check your API key/credentials
   - Verify SMTP settings
   - Check your email service dashboard for errors

2. **Emails going to spam**
   - Set up SPF/DKIM records for your domain
   - Use a reputable email service
   - Avoid spam trigger words in content

3. **Rate limiting errors**
   - The system includes built-in rate limiting (3 requests/hour)
   - Wait before retrying or contact support

## Production Deployment

For production:
1. Use SendGrid or AWS SES
2. Set `NEXT_PUBLIC_APP_URL` to your production domain
3. Configure proper monitoring
4. Set up email analytics

## Security Notes

- Reset tokens expire in 10 minutes
- Rate limiting prevents abuse
- Emails don't reveal if an account exists (security feature)
- All email links are HTTPS in production
