import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import TwoFAVerify from './pages/TwoFAVerify';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import apiCall from './utils/api';

function Landing() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold text-blue-700 dark:text-blue-200 mb-4">Secure Password Manager</h1>
      <p className="text-lg md:text-2xl text-blue-900 dark:text-blue-100 mb-8 max-w-xl">
        Store, manage, and protect your passwords with industry-leading security. Sign up to get started!
      </p>
      <a href="/signup" className="px-8 py-3 rounded bg-blue-600 dark:bg-blue-800 text-white text-lg font-semibold shadow hover:bg-blue-700 dark:hover:bg-blue-900 transition">Get Started</a>
    </main>
  );
}

function App() {
  const [auth, setAuth] = useState({ authenticated: false, userId: null, email: null, checked: false });

  useEffect(() => {
    apiCall('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setAuth({ authenticated: true, userId: data.userId, email: data.email, checked: true });
        } else {
          // Check if we have a token in localStorage as fallback
          const authToken = localStorage.getItem('authToken');
          if (authToken) {
            console.log('Found token in localStorage, attempting to validate...');
            // Try to validate the token by making a request to a protected endpoint
            apiCall('/api/auth/profile')
              .then(profileRes => profileRes.json())
              .then(profileData => {
                if (profileData.email) {
                  setAuth({ authenticated: true, userId: profileData.userId, email: profileData.email, checked: true });
                } else {
                  localStorage.removeItem('authToken');
                  setAuth({ authenticated: false, userId: null, email: null, checked: true });
                }
              })
              .catch(() => {
                localStorage.removeItem('authToken');
                setAuth({ authenticated: false, userId: null, email: null, checked: true });
              });
          } else {
            setAuth({ authenticated: false, userId: null, email: null, checked: true });
          }
        }
      })
      .catch(() => setAuth({ authenticated: false, userId: null, email: null, checked: true }));
  }, []);

  return (
    <Router>
      <div className="min-h-screen">
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex flex-col">
          <Navbar auth={auth} setAuth={setAuth} />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signup" element={<SignUp setAuth={setAuth} />} />
            <Route path="/signin" element={<SignIn setAuth={setAuth} />} />
            <Route path="/dashboard" element={<Dashboard setAuth={setAuth} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/2fa" element={<TwoFAVerify />} />
          </Routes>
          <footer className="bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-200 text-center p-4 shadow-inner">
            &copy; {new Date().getFullYear()} <a href="https://www.linkedin.com/in/04shubham07" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-500 dark:hover:text-blue-300 transition">04shubham07</a>. All rights reserved.
          </footer>
        </div>
    </div>
    </Router>
  );
}

export default App;
