# PassM - Secure Password Manager

A full-stack password manager application with React frontend and Node.js/Express backend using MongoDB.

## Features

- 🔐 Secure password storage with encryption
- 📧 Email-based OTP verification for sensitive operations
- 🌙 Dark mode support
- 📱 Responsive design
- 🔄 Auto-logout on browser close/disconnect
- 👤 User profile management
- 🔍 Password search functionality

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with HTTP-only cookies
- **Email**: Nodemailer with Gmail SMTP

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secure_jwt_secret_key_here

# Email Configuration (use Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here

# Encryption Key (generate a strong random string)
ENCRYPTION_KEY=your_super_secure_encryption_key_here

# Environment
NODE_ENV=production

# Port
PORT=5000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with:

```env
# Backend API URL
REACT_APP_API_URL=https://your-backend-url.railway.app

# Environment
REACT_APP_NODE_ENV=production
```

## Deployment Instructions

### Railway Deployment (Recommended)

#### Backend Deployment
1. **Go to [Railway](https://railway.app/)**
2. **Create New Project** → "Deploy from GitHub repo"
3. **Select your PassM repository**
4. **Create New Service** → "GitHub Repo"
5. **Set Root Directory to**: `backend`
6. **Choose Builder**: Nixpacks (recommended) or Railpack
7. **Add Environment Variables**:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ENCRYPTION_KEY=your_encryption_key
   NODE_ENV=production
   NPM_CONFIG_PRODUCTION=false
   NPM_CONFIG_CACHE=/tmp/.npm
   NPM_CONFIG_AUDIT=false
   NPM_CONFIG_FUND=false
   ```
8. **Deploy and get your backend URL**

#### Frontend Deployment
1. **In the same Railway project, create another service**
2. **Set Root Directory to**: `frontend`
3. **Choose Builder**: Nixpacks
4. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-service-name.railway.app
   REACT_APP_ENVIRONMENT=production
   ```
5. **Deploy and get your frontend URL**

### Alternative: Vercel + Railway

#### Backend on Railway
Follow the backend deployment steps above.

#### Frontend on Vercel
1. **Go to [Vercel](https://vercel.com/)**
2. **Import your GitHub repository**
3. **Set Root Directory to**: `frontend`
4. **Add Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   REACT_APP_ENVIRONMENT=production
   ```
5. **Deploy**

## Security Notes

⚠️ **Important Security Considerations:**

1. **MongoDB Connection**: Never commit your MongoDB connection string to version control. Use environment variables.

2. **JWT Secret**: Generate a strong, random JWT secret for production.

3. **Encryption Key**: Use a strong encryption key for password encryption.

4. **Email Credentials**: Use Gmail App Passwords, not your regular password.

5. **Environment Variables**: Always use environment variables for sensitive data.

## Local Development

### Backend
```bash
cd PassM/backend
npm install
npm start
```

### Frontend
```bash
cd PassM/frontend
npm install
npm start
```

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/send-otp` - Send OTP for 2FA
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/passwords` - Get user passwords
- `POST /api/passwords` - Create new password
- `PUT /api/passwords/:id` - Update password
- `DELETE /api/passwords/:id` - Delete password

## Troubleshooting

### Common Railway Issues

1. **"Cannot find module 'express'"**
   - Ensure you're using Nixpacks or Railpack builder
   - Add the environment variables listed above
   - Check Railway logs for specific errors

2. **Build Failures**
   - Verify all dependencies are in package.json
   - Check Node.js version compatibility
   - Review Railway deployment logs

3. **CORS Errors**
   - Update backend CORS configuration with your frontend URL
   - Ensure environment variables are set correctly

For detailed troubleshooting, see `RAILWAY_FIX_GUIDE.md`.

## License

This project is licensed under the MIT License. 