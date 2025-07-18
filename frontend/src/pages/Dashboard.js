import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordList from '../components/PasswordList';
import PasswordForm from '../components/PasswordForm';
import TwoFAVerify from './TwoFAVerify';
import apiCall from '../utils/api';

const Dashboard = () => {
  const [passwords, setPasswords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editPassword, setEditPassword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewPassword, setViewPassword] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'view' | 'edit' | 'delete'
  const [pendingPw, setPendingPw] = useState(null); // password object or id
  const [otpError, setOtpError] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' });
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, title: '' });
  const navigate = useNavigate();
  const [darkMode] = useState(() => {
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

  // Focus management for modals
  const modalRef = useRef();
  useEffect(() => {
    if (showModal || showOtpModal || viewPassword) {
      setTimeout(() => {
        if (modalRef.current) modalRef.current.focus();
      }, 0);
    }
  }, [showModal, showOtpModal, viewPassword]);

  useEffect(() => {
    // Check authentication
    apiCall('/api/auth/check')
      .then(res => res.json())
      .then(data => {
        if (!data.authenticated) navigate('/signin');
        else fetchPasswords();
      })
      .catch(() => navigate('/signin'));

    // Auto-logout on tab close or browser close
    const handleLogoutEvent = () => {
      apiCall('/api/auth/logout', { method: 'POST' });
    };
    window.addEventListener('beforeunload', handleLogoutEvent);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        handleLogoutEvent();
      }
    });
    // Periodic session check
    const interval = setInterval(() => {
      apiCall('/api/auth/check')
        .then(res => res.json())
        .then(data => {
          if (!data.authenticated) navigate('/signin');
        });
    }, 60000); // every 60 seconds
    return () => {
      window.removeEventListener('beforeunload', handleLogoutEvent);
      document.removeEventListener('visibilitychange', handleLogoutEvent);
      clearInterval(interval);
    };
  }, [navigate]);

  const fetchPasswords = () => {
    apiCall('/api/passwords')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPasswords(data);
        } else {
          setPasswords([]); // fallback to empty array on error
        }
        setLoading(false);
      })
      .catch(() => {
        setPasswords([]); // fallback to empty array on fetch error
        setLoading(false);
      });
  };

  const handleAdd = () => {
    setEditPassword(null);
    setShowModal(true);
  };

  const handleEdit = (pw) => {
    setPendingAction('edit');
    setPendingPw(pw);
    sendOtp();
    setShowOtpModal(true);
  };

  const handleDelete = (id) => {
    apiCall(`/api/passwords/${id}`, {
      method: 'DELETE',
    })
      .then(() => setPasswords(passwords.filter(pw => pw._id !== id)));
  };

  const handleSave = async (form) => {
    // Save (add or update) via API
    const method = editPassword ? 'PUT' : 'POST';
    const url = editPassword ? `/api/passwords/${editPassword._id}` : '/api/passwords';
    try {
      await apiCall(url, {
        method,
        body: JSON.stringify(form),
      });
      setShowModal(false);
      setEditPassword(null);
      fetchPasswords();
      showToast('Password saved successfully');
    } catch {
      showToast('Error saving password', 'error');
    }
  };

  const handleView = (pw) => {
    apiCall(`/api/passwords/${pw._id}`)
      .then(res => res.json())
      .then(data => {
        if (data.twofaRequired) {
          setPendingAction('view');
          setPendingPw(pw);
          sendOtp();
          setShowOtpModal(true);
        } else {
          setViewPassword(data.password);
        }
      });
  };

  const handleOtpSubmit = (otp) => {
    setOtpError('');
    apiCall('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ otp }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === 'OTP verified' && data.token) {
          // Store the 2FA JWT token for 2FA-protected requests
          localStorage.setItem('authToken', data.token);
          if (pendingAction === 'view') {
            apiCall(`/api/passwords/${pendingPw._id}`)
              .then(res => res.json())
              .then(data => {
                setViewPassword(data.password);
                setShowOtpModal(false);
                setPendingPw(null);
                setPendingAction(null);
                showToast('OTP verified successfully');
              });
          } else if (pendingAction === 'edit') {
            setEditPassword(pendingPw);
            setShowModal(true);
            setShowOtpModal(false);
            setPendingPw(null);
            setPendingAction(null);
          } else if (pendingAction === 'delete') {
            apiCall(`/api/passwords/${pendingPw.id}`, {
              method: 'DELETE',
            })
              .then(() => {
                setPasswords(passwords.filter(pw => pw._id !== pendingPw.id));
                setShowOtpModal(false);
                setPendingPw(null);
                setPendingAction(null);
                showToast('Password deleted successfully');
              });
          }
        } else {
          setOtpError(data.error || 'Invalid OTP');
          showToast('OTP verification failed', 'error');
        }
      });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 2500);
  };

  const handleCopy = () => {
    if (viewPassword) {
      navigator.clipboard.writeText(viewPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const filteredPasswords = Array.isArray(passwords)
    ? passwords.filter(pw =>
        pw.title.toLowerCase().includes(search.toLowerCase()) ||
        (pw.username && pw.username.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const handleDeleteRequest = (id, title) => {
    setPendingAction('delete');
    setPendingPw({ id, title });
    sendOtp();
    setShowOtpModal(true);
  };
  const handleDeleteConfirm = () => {
    handleDelete(deleteConfirm.id);
    setDeleteConfirm({ open: false, id: null, title: '' });
  };
  const handleDeleteCancel = () => {
    setDeleteConfirm({ open: false, id: null, title: '' });
  };

  // Helper to send OTP (email only)
  const sendOtp = async () => {
    setOtpError('');
    await apiCall('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({}),
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loader"></span> Loading...</div>;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 p-8 relative font-sans transition-colors duration-500`}>
      {/* Animated background blobs */}
      <div className="bg-animated">
        <div className="blob blob1"></div>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
      </div>
      {/* Top right controls */}
      {toast.message && (
        <div aria-live="polite" className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow text-white z-50 transition-all duration-500 ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-600'} animate-fade-in-out`}>{toast.message}</div>
      )}
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-gray-800 rounded-2xl shadow-xl p-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">Your Passwords</h2>
        </div>
        <input
          type="text"
          placeholder="Search passwords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-6 w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black dark:text-blue-100"
        />
        <PasswordList passwords={filteredPasswords} onView={handleView} onEdit={handleEdit} onDelete={handleDeleteRequest} />
        <button onClick={handleAdd} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg font-semibold text-lg">Add Password</button>
      </div>
      {/* Modal Animations */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div ref={modalRef} tabIndex={-1} className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-slide-up" aria-label="Password Modal">
            <h3 className="text-2xl font-bold mb-6">{editPassword ? 'Edit' : 'Add'} Password</h3>
            <PasswordForm initial={editPassword || {}} onSubmit={handleSave} submitLabel={editPassword ? 'Update' : 'Add'} />
            <button onClick={() => setShowModal(false)} className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </div>
      )}
      {showOtpModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-slide-up" aria-label="OTP Modal">
            <h3 className="text-2xl font-bold mb-6">Enter OTP</h3>
            <TwoFAVerify onSubmit={handleOtpSubmit} error={otpError} />
            <button onClick={() => setShowOtpModal(false)} className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
          </div>
        </div>
      )}
      {viewPassword && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div ref={modalRef} tabIndex={-1} className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-slide-up" aria-label="Password Reveal Modal">
            <h3 className="text-2xl font-bold mb-6">Password</h3>
            <div className="text-2xl font-mono mb-6">{viewPassword}</div>
            <button onClick={handleCopy} className="mb-6 w-full bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition">{copied ? 'Copied!' : 'Copy to Clipboard'}</button>
            <button onClick={() => setViewPassword(null)} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">Close</button>
          </div>
        </div>
      )}
      {deleteConfirm.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 animate-fade-in" role="dialog" aria-modal="true">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center animate-slide-up">
            <h3 className="text-2xl font-bold mb-6">Delete Password</h3>
            <p>Are you sure you want to delete the password for <span className="font-semibold">{deleteConfirm.title}</span>?</p>
            <div className="flex gap-4 mt-8">
              <button onClick={handleDeleteConfirm} className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">Delete</button>
              <button onClick={handleDeleteCancel} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 