import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../utils/api';

function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}
function validatePhone(phone) {
  return !phone || /^\+?[0-9]{10,15}$/.test(phone);
}

const SignUp = ({ setAuth }) => {
  const [form, setForm] = useState({ email: '', phone: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!validateEmail(form.email)) return setError('Invalid email format');
    if (!validatePassword(form.password)) return setError('Password must be at least 8 characters');
    if (!validatePhone(form.phone)) return setError('Invalid phone number');
    setLoading(true);
    try {
      const res = await apiCall('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setAuth({ authenticated: true, userId: data.userId, email: form.email, checked: true });
        setMessage('Sign up successful! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setError(data.error || 'Sign up failed');
      }
    } catch (err) {
      setError('Sign up failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 p-6 relative">
      {/* Animated background blobs */}
      <div className="bg-animated">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6 animate-slide-up z-10">
        <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-4 text-center">Sign Up</h2>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black dark:text-blue-100 dark:bg-gray-900 dark:border-gray-700 transition" />
        <input name="phone" type="text" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black dark:text-blue-100 dark:bg-gray-900 dark:border-gray-700 transition" />
        <input name="password" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={handleChange} required className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black dark:text-blue-100 dark:bg-gray-900 dark:border-gray-700 transition" />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg font-semibold text-lg">Sign Up</button>
        {error && <div className="text-red-600 dark:text-red-400 mt-2 text-center">{error}</div>}
        {message && <div className="text-green-600 dark:text-green-400 mt-2 text-center">{message}</div>}
      </form>
    </div>
  );
};

export default SignUp; 