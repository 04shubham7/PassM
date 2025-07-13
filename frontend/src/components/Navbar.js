import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiCall from '../utils/api';

function Navbar({ auth, setAuth }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    apiCall('/api/auth/logout', { method: 'POST' })
      .then(() => {
        setAuth({ authenticated: false, userId: null, email: null, checked: true });
        navigate('/signin');
      });
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow p-4 flex justify-between items-center">
      <span className="text-2xl font-bold text-blue-600 dark:text-blue-200">PassM</span>
      <div className="space-x-4 flex items-center">
        <button
          onClick={() => setDarkMode(dm => !dm)}
          className="px-3 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          aria-label="Toggle dark mode"
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
        {!auth.authenticated ? (
          <>
            <Link to="/signup" className="px-4 py-2 rounded bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-800 transition">Sign Up</Link>
            <Link to="/signin" className="px-4 py-2 rounded bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-gray-700 transition">Sign In</Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className={`px-4 py-2 rounded font-semibold transition ${location.pathname === '/dashboard' ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-gray-700'}`}
            >
              Dashboard
            </Link>
            <Link
              to="/profile"
              className={`px-4 py-2 rounded font-semibold transition ${location.pathname === '/profile' ? 'bg-blue-600 text-white' : 'bg-blue-100 dark:bg-gray-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-gray-700'}`}
            >
              Profile
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 