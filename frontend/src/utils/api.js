// API utility for making requests to the backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  return fetch(url, finalOptions);
};

export default apiCall; 