import axios from 'utils/axios';

// Auth API endpoints
export const authAPI = {
  // Login user
  login: (email, password) => {
    return axios.post('/api/auth/login', { email, password });
  },

  // Get current user details
  getCurrentUser: () => {
    return axios.get('/api/auth/me');
  },

  // Register new user
  register: (userData) => {
    return axios.post('/api/auth/register', userData);
  },

  // Seed roles (admin only)
  seedRoles: () => {
    return axios.post('/api/auth/seed-roles');
  }
};

export default authAPI;