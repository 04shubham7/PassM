# 🚀 Complete PassM Deployment Guide

This guide will help you deploy both your backend and frontend, and connect them properly.

## 📋 Prerequisites

- GitHub account with your PassM repository
- Node.js installed locally
- Git installed

---

## 🔧 Step 1: Deploy Backend to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Navigate to backend directory**:
   ```bash
   cd PassM/backend
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Set up and deploy? → **Yes**
   - Which scope? → **Select your account**
   - Link to existing project? → **No**
   - Project name? → **passm-backend** (or press Enter)
   - Directory? → **./** (current directory)
   - Override settings? → **No**

5. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project in [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your project → Settings → Environment Variables
   - Add these variables:
   ```
   MONGODB_URI=mongodb+srv://shubham1230101130:tBc3kiQrDkXdq7nk@cluster0.tbrbsay.mongodb.net/PassM
   JWT_SECRET=tmkc_dusre_ke_password_me_jo_intrested_hai
   EMAIL_USER=shubham040711@gmail.com
   EMAIL_PASS=qnvd ptfq gskt myag
   ENCRYPTION_KEY=6d858b93519029034b41c5f24212d293a4b503cf3a7c738858d8f3b8e047da87
   NODE_ENV=production
   ```

6. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

### Option B: Deploy via GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `04shubham7/PassM`
4. Set Root Directory to: `backend`
5. Add environment variables (same as above)
6. Deploy

**Your backend URL will be**: `https://passm-backend-xxxx.vercel.app`

---

## 🎨 Step 2: Deploy Frontend to Vercel

### Option A: Deploy via Vercel CLI

1. **Navigate to frontend directory**:
   ```bash
   cd PassM/frontend
   ```

2. **Update API URL** in environment:
   ```bash
   # Create .env file
   echo "REACT_APP_API_URL=https://your-backend-url.vercel.app" > .env
   echo "REACT_APP_NODE_ENV=production" >> .env
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel --prod
   ```

4. **Follow the prompts**:
   - Set up and deploy? → **Yes**
   - Which scope? → **Select your account**
   - Link to existing project? → **No**
   - Project name? → **passm-frontend** (or press Enter)
   - Directory? → **./** (current directory)
   - Override settings? → **No**

### Option B: Deploy via GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `04shubham7/PassM`
4. Set Root Directory to: `frontend`
5. Add environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.vercel.app
   REACT_APP_NODE_ENV=production
   ```
6. Deploy

**Your frontend URL will be**: `https://passm-frontend-xxxx.vercel.app`

---

## 🔗 Step 3: Connect Frontend to Backend

### Update Frontend Environment Variables

1. **In your frontend Vercel project**:
   - Go to Settings → Environment Variables
   - Update `REACT_APP_API_URL` to your actual backend URL
   - Redeploy the frontend

### Update Backend CORS Settings

Your backend already has CORS configured, but you might need to update it for production:

```javascript
// In server.js, update CORS if needed:
app.use(cors({ 
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:3000'], 
  credentials: true 
}));
```

---

## 🧪 Step 4: Test Your Deployment

### Test Backend
1. Visit your backend URL: `https://your-backend-url.vercel.app`
2. You should see: "PassM API is running"

### Test Frontend
1. Visit your frontend URL: `https://your-frontend-url.vercel.app`
2. Try to sign up/sign in
3. Test all features

### Test API Endpoints
```bash
# Test backend health
curl https://your-backend-url.vercel.app

# Test signup
curl -X POST https://your-backend-url.vercel.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","phone":"1234567890"}'
```

---

## 🔄 Step 5: Set Up Automatic Deployments

### GitHub Integration (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy to Vercel"
   git push origin main
   ```

2. **Vercel will automatically deploy** on every push to main branch

### Manual Deployments

- **Backend**: `cd backend && vercel --prod`
- **Frontend**: `cd frontend && vercel --prod`

---

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Update backend CORS with your frontend URL
   - Ensure `credentials: 'include'` is set in frontend

2. **Environment Variables Not Working**:
   - Check Vercel dashboard for correct variable names
   - Redeploy after adding variables

3. **MongoDB Connection Issues**:
   - Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
   - Check connection string in environment variables

4. **Build Failures**:
   - Check Vercel build logs
   - Ensure all dependencies are in package.json

### Debug Commands

```bash
# Check backend locally
cd backend && npm start

# Check frontend locally
cd frontend && npm start

# Check Vercel deployment status
vercel ls
```

---

## 📱 Final URLs

After deployment, you'll have:

- **Backend**: `https://passm-backend-xxxx.vercel.app`
- **Frontend**: `https://passm-frontend-xxxx.vercel.app`

## 🎉 Success!

Your PassM application is now deployed and connected! Users can access your password manager at your frontend URL.

---

## 🔧 Alternative Platforms

If Vercel doesn't work, try:

1. **Netlify** (Frontend) + **Railway** (Backend)
2. **Vercel** (Frontend) + **Heroku** (Backend)
3. **GitHub Pages** (Frontend) + **DigitalOcean** (Backend)

See `DEPLOYMENT_GUIDE.md` for detailed instructions on other platforms. 