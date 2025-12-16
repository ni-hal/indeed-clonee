import { getCookie } from 'react-use-cookie';
import axiosInstance from '../../config/companyAxiosConfig';

const token = getCookie('token');

const postCompany = async (body) => axiosInstance.post('/companies', body, {
  headers: {
    Authorization: token,
  },
});

export default postCompany;
