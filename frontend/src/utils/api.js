// API utility for making requests to the backend
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://passm.onrender.com';

export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  // Always get the latest token from localStorage
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    defaultOptions.headers.Authorization = `Bearer ${authToken}`;
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  console.log('API Call:', {
    url,
    method: finalOptions.method || 'GET',
    hasBody: !!finalOptions.body,
    hasAuthToken: !!authToken,
    userAgent: navigator.userAgent,
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  });

  try {
    const response = await fetch(url, finalOptions);
    
    console.log('API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries()),
      cookies: document.cookie
    });

    // Handle network errors
    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
    }

    return response;
  } catch (error) {
    console.error('API call failed:', {
      error: error.message,
      url,
      userAgent: navigator.userAgent,
      isOnline: navigator.onLine,
      timestamp: new Date().toISOString()
    });
    
    // Provide more specific error messages for mobile users
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network connection failed. Please check your internet connection and try again.');
    }
    
    throw error;
  }
};

export default apiCall; 