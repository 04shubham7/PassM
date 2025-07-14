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

For detailed troubleshooting, see `RAILWAY_FIX_GUIDE.md`.

## License

This project is licensed under the MIT License. 
