import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../utils/api';

function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function validatePhone(phone) {
  return !phone || /^\+?[0-9]{10,15}$/.test(phone);
}

const Profile = () => {
  const [form, setForm] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwMessage, setPwMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiCall('/api/auth/profile')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
          setLoading(false);
          if (data.error.toLowerCase().includes('token')) {
            navigate('/signin');
          }
        } else {
          setForm({ email: data.email, phone: data.phone || '' });
          setLoading(false);
        }
      });
  }, [navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!validateEmail(form.email)) return setError('Invalid email format');
    if (!validatePhone(form.phone)) return setError('Invalid phone number');
    try {
      const res = await apiCall('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Profile updated successfully!');
      } else {
        setError(data.error || 'Update failed');
      }
    } catch {
      setError('Update failed');
    }
  };

  const handlePwChange = e => setPwForm({ ...pwForm, [e.target.name]: e.target.value });

  const handlePwSubmit = async e => {
    e.preventDefault();
    setPwError('');
    setPwMessage('');
    if (!pwForm.currentPassword || !pwForm.newPassword) return setPwError('Both fields are required');
    if (pwForm.newPassword.length < 8) return setPwError('New password must be at least 8 characters');
    try {
      const res = await apiCall('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify(pwForm),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMessage('Password changed successfully!');
        setPwForm({ currentPassword: '', newPassword: '' });
      } else {
        setPwError(data.error || 'Change failed');
      }
    } catch {
      setPwError('Change failed');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-blue-50 dark:bg-gray-900 transition-colors duration-500">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 p-6 relative">
      {/* Animated background blobs */}
      <div className="bg-animated">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-stretch justify-center z-10">
        <form onSubmit={handleSubmit} className="flex-1 bg-white/90 dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 animate-slide-up">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-4 text-center">Profile</h2>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 text-black dark:text-blue-100 dark:border-gray-700 transition" />
          <input name="phone" type="text" placeholder="Phone (optional)" value={form.phone} onChange={handleChange} className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 text-black dark:text-blue-100 dark:border-gray-700 transition" />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg font-semibold text-lg">Update Profile</button>
          {error && <div className="text-red-600 dark:text-red-400 mt-2 text-center">{error}</div>}
          {message && <div className="text-green-600 dark:text-green-400 mt-2 text-center">{message}</div>}
        </form>
        <form onSubmit={handlePwSubmit} className="flex-1 bg-white/90 dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 animate-slide-up">
          <h2 className="text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-4 text-center">Change Password</h2>
          <input name="currentPassword" type="password" placeholder="Current Password" value={pwForm.currentPassword} onChange={handlePwChange} required className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 text-black dark:text-blue-100 dark:border-gray-700 transition" autoComplete="current-password" />
          <input name="newPassword" type="password" placeholder="New Password (min 8 chars)" value={pwForm.newPassword} onChange={handlePwChange} required className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 text-black dark:text-blue-100 dark:border-gray-700 transition" autoComplete="new-password" />
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg font-semibold text-lg">Change Password</button>
          {pwError && <div className="text-red-600 dark:text-red-400 mt-2 text-center">{pwError}</div>}
          {pwMessage && <div className="text-green-600 dark:text-green-400 mt-2 text-center">{pwMessage}</div>}
        </form>
      </div>
    </div>
  );
};

export default Profile; 