import axiosInstance from '../../config/companyAxiosConfig';

const getCompanies = async (params) => axiosInstance('/companies', {
  method: 'GET',
  params,
});

export default getCompanies;
