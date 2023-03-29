import Auth from '@/services/auth';
import axios from 'axios';
import { endpointUrl } from '../utils/general';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async function (config: any) {
    const token = Auth.getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  },
);

export default axiosInstance;
