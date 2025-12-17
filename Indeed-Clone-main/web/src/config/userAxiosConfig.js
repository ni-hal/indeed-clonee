import axios from 'axios';
import toast from 'react-hot-toast';
import { getCookie } from 'react-use-cookie';

const userAxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3008', // User service port
  headers: {
    'Content-Type': 'application/json',
  },
});

userAxiosInstance.interceptors.request.use((config) => {
  const token = getCookie('token');
  if (token) {
    // eslint-disable-next-line no-param-reassign
    config.headers.Authorization = token;
  }
  return config;
});

userAxiosInstance.interceptors.response.use(
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

export default userAxiosInstance;
