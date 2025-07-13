# PassM Backend Deployment Guide

Since Render and Railway are having issues, here are alternative deployment options:

## 🚀 Quick Deploy Options

### 1. **Vercel** (Recommended - Easiest)
**Pros:** Free tier, excellent Node.js support, automatic deployments
**Cons:** Serverless functions have cold starts

#### Steps:
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to backend: `cd PassM/backend`
3. Run: `vercel`
4. Follow prompts and set environment variables:
   ```
   MONGODB_URI=mongodb+srv://shubham1230101130:tBc3kiQrDkXdq7nk@cluster0.tbrbsay.mongodb.net/PassM
   JWT_SECRET=tmkc_dusre_ke_password_me_jo_intrested_hai
   EMAIL_USER=shubham040711@gmail.com
   EMAIL_PASS=qnvd ptfq gskt myag
   ENCRYPTION_KEY=6d858b93519029034b41c5f24212d293a4b503cf3a7c738858d8f3b8e047da87
   ```
   

### 2. **Netlify Functions** (Serverless)
**Pros:** Free tier, good for APIs
**Cons:** Need to restructure as functions

#### Steps:
1. Create `functions/api.js` with your Express app
2. Deploy via Netlify CLI or GitHub integration
3. Set environment variables in Netlify dashboard

### 3. **Heroku** (Traditional)
**Pros:** Reliable, good free tier (with credit card)
**Cons:** Requires credit card for free tier

#### Steps:
1. Install Heroku CLI
2. Run: `heroku create passm-backend`
3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="your_mongo_uri"
   heroku config:set JWT_SECRET="your_jwt_secret"
   # ... other env vars
   ```
4. Deploy: `git push heroku main`

### 4. **DigitalOcean App Platform**
**Pros:** Reliable, good performance
**Cons:** Paid service (starts at $5/month)

#### Steps:
1. Connect GitHub repo to DigitalOcean
2. Use the `.do/app.yaml` configuration
3. Set environment variables in dashboard

## 🔧 Environment Variables Setup

For all platforms, you need these environment variables:

```bash
MONGODB_URI=mongodb+srv://shubham1230101130:tBc3kiQrDkXdq7nk@cluster0.tbrbsay.mongodb.net/PassM
JWT_SECRET=tmkc_dusre_ke_password_me_jo_intrested_hai
EMAIL_USER=shubham040711@gmail.com
EMAIL_PASS=qnvd ptfq gskt myag
ENCRYPTION_KEY=6d858b93519029034b41c5f24212d293a4b503cf3a7c738858d8f3b8e047da87
NODE_ENV=production
PORT=5000
```

## 🚨 Troubleshooting Common Issues

### Port Issues
- Most platforms use `process.env.PORT` (already configured)
- Vercel uses port 3000 by default

### CORS Issues
- Update frontend API calls to use new backend URL
- Ensure CORS is properly configured (already done)

### MongoDB Connection
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Check if connection string is correct

## 📝 Recommended Approach

1. **Start with Vercel** - easiest setup, good free tier
2. If you need more control, try **Heroku**
3. For production, consider **DigitalOcean App Platform**

## 🔄 After Deployment

1. Update frontend API base URL
2. Test all endpoints
3. Update CORS settings if needed
4. Monitor logs for any issues

## 💡 Tips

- Always test locally first: `npm start`
- Use environment variables, never hardcode secrets
- Monitor your application logs after deployment
- Set up automatic deployments from GitHub 