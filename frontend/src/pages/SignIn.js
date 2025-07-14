import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiCall from '../utils/api';
import DebugInfo from '../components/DebugInfo';

function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}
function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

const SignIn = ({ setAuth }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const testApiConnection = async () => {
    try {
      const res = await apiCall('/api/test');
      const data = await res.json();
      console.log('API Test Response:', data);
      setMessage('API connection successful! Check console for details.');
    } catch (err) {
      console.error('API Test Error:', err);
      setError('API connection failed. Check console for details.');
    }
  };

  const testMobileCompatibility = async () => {
    try {
      const res = await apiCall('/api/mobile-test');
      const data = await res.json();
      console.log('Mobile Test Response:', data);
      setMessage(`Mobile test: ${data.isMobile ? 'Mobile detected' : 'Desktop detected'}. Check console for details.`);
    } catch (err) {
      console.error('Mobile Test Error:', err);
      setError('Mobile test failed. Check console for details.');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    // Validation
    if (!validateEmail(form.email)) {
      setError('Invalid email format');
      setIsLoading(false);
      return;
    }
    if (!validatePassword(form.password)) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting to sign in with:', { email: form.email, password: form.password ? '[HIDDEN]' : 'empty' });
      
      const res = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      console.log('Response status:', res.status);
      console.log('Response headers:', Object.fromEntries(res.headers.entries()));

      const data = await res.json();
      console.log('Response data:', data);

      if (res.ok && data.message) {
        setMessage('Sign in successful! Redirecting...');
        
        // Store token in localStorage as fallback for mobile
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          console.log('Token stored in localStorage as fallback');
        }
        
        setAuth({ authenticated: true, userId: data.userId, email: form.email, checked: true });
        
        // Add a small delay to show success message before redirecting
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError(data.error || 'Sign in failed. Please check your credentials and try again.');
      }
    } catch (err) {
      console.error('Sign in error:', err);
      setError('Network error. Please check your internet connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 p-4 relative">
      {/* Animated background blobs */}
      <div className="bg-animated">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6 animate-slide-up z-10">
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-700 dark:text-blue-200 mb-4 text-center">Sign In</h2>
        
        {!isOnline && (
          <div className="text-red-600 dark:text-red-400 text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
            You are currently offline. Please check your internet connection.
          </div>
        )}
        
        <div className="space-y-4">
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black dark:text-blue-100 dark:bg-gray-900 dark:border-gray-700 transition"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
          />
          
          <input 
            name="password" 
            type="password" 
            placeholder="Password (min 8 chars)" 
            value={form.password} 
            onChange={handleChange} 
            required 
            className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black dark:text-blue-100 dark:bg-gray-900 dark:border-gray-700 transition"
            autoComplete="current-password"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-3 rounded-xl transition-all shadow-lg font-semibold text-lg ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        
        {error && (
          <div className="text-red-600 dark:text-red-400 mt-2 text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}
        
        {message && (
          <div className="text-green-600 dark:text-green-400 mt-2 text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            {message}
          </div>
        )}
        
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600 dark:text-blue-400 hover:underline">
            Sign up here
          </a>
        </div>
        
        {/* Debug buttons for testing */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={testApiConnection}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-all text-sm"
          >
            Test API Connection
          </button>
          <button
            type="button"
            onClick={testMobileCompatibility}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-all text-sm"
          >
            Test Mobile Compatibility
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default SignIn; 