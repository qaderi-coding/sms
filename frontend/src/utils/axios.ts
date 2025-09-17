import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const axiosServices = axios.create({ baseURL: 'http://127.0.0.1:8000' });

// ==============================|| AXIOS - FOR API CALLS ||============================== //

axiosServices.interceptors.request.use(
  async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    const accessToken = localStorage.getItem('serviceToken');
    if (accessToken && config.headers) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosServices.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && !window.location.href.includes('/login')) {
      localStorage.removeItem('serviceToken');
      window.location.pathname = '/login';
    }
    return Promise.reject((error.response && error.response.data) || 'Wrong Services');
  }
);

export default axiosServices;