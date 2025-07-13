import React, { useState } from 'react';

function validateTitle(title) {
  return typeof title === 'string' && title.trim().length > 0;
}
function validatePassword(password) {
  return typeof password === 'string' && password.length >= 8;
}
function getPasswordStrength(password) {
  if (!password) return { label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: 'text-red-600' };
  if (score === 2) return { label: 'Medium', color: 'text-yellow-600' };
  if (score >= 3) return { label: 'Strong', color: 'text-green-600' };
  return { label: '', color: '' };
}

const PasswordForm = ({ initial = {}, onSubmit, submitLabel = 'Save', onResult }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    username: initial.username || '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const strength = getPasswordStrength(form.password);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!validateTitle(form.title)) return setError('Title is required');
    if (!validatePassword(form.password)) return setError('Password must be at least 8 characters');
    setLoading(true);
    try {
      await onSubmit(form);
      if (onResult) onResult('Password saved successfully', 'success');
    } catch (err) {
      setError('Error saving password');
      if (onResult) onResult('Error saving password', 'error');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" type="text" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded text-black dark:text-blue-100" />
      <input name="username" type="text" placeholder="Username" value={form.username} onChange={handleChange} className="w-full p-2 border rounded text-black dark:text-blue-100" />
      <input name="password" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={handleChange} required className="w-full p-2 border rounded text-black dark:text-blue-100" />
      {form.password && <div className={`text-sm ${strength.color}`}>Strength: {strength.label}</div>}
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center" disabled={loading}>{loading ? <span className="loader mr-2"></span> : null}{loading ? 'Saving...' : submitLabel}</button>
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  );
};

export default PasswordForm; 