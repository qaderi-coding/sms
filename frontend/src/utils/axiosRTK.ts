import axios from 'axios';
import axiosServices from './axios';

const axiosRTKInstance = axios.create({
    ...axiosServices.defaults, // Extend the base Axios config
    timeout: 10000 // Example: Add a timeout specific to RTK Query
});

// Optionally, add new interceptors specific to RTK Query (if needed)
axiosRTKInstance.interceptors.request.use((config) => {
    console.log('RTK Query Axios Request:', config);
    return config;
});

// Export the new instance
export default axiosRTKInstance;
