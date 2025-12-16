import axios from 'axios';
import toast from 'react-hot-toast';
import { getCookie } from 'react-use-cookie';

const companyAxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8002', // Company service port
  headers: {
    'Content-Type': 'application/json',
  },
});

companyAxiosInstance.interceptors.request.use((config) => {
  const token = getCookie('token');
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = token;
  }
  return config;
});

companyAxiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (!err.response) {
      toast.error('Network error!');
    }
    if (err && err.response && err.response.status === 401) {
      toast.error('Unauthorized request!');
      return;
    }
    if (err && err.response && err.response.status === 403) {
      toast.error('Forbidden request!');
      return;
    }
    if (err && err.response && err.response.data && err.response.data.message) {
      if (typeof (err.response.data.message) === 'string') {
        toast.error(err.response.data.message);
      }
    }
  },
);

export default companyAxiosInstance;
