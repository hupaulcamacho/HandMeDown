import axios from 'axios';

// Create a configured axios instance
const api = axios.create({
  // Railway deployment URL
  baseURL: 'https://handmedown-production.up.railway.app',
  // Keep credentials for maintaining sessions
  withCredentials: true,
  // Timeout after 30 seconds
  timeout: 30000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any request modifications here, like authentication headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle response errors
    console.error('API Error:', error);
    
    // Handle specific error status codes if needed
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('Unauthorized - you might need to login');
          break;
        case 404:
          console.log('Resource not found');
          break;
        case 500:
          console.log('Server error');
          break;
        default:
          console.log(`Error with status code: ${error.response.status}`);
      }
    } else if (error.request) {
      console.log('Network error - no response received');
    }
    
    return Promise.reject(error);
  }
);

export default api;

