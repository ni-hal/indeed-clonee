import axiosInstance from '../../config/companyAxiosConfig';

const getCompanyData = (payload) => axiosInstance
  .get(`/companies/${payload}`, {})
  .then((response) => response.data)
  .catch((err) => {
    console.log(err);
  });

export default getCompanyData;
