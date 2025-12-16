import axiosInstance from '../../config/companyAxiosConfig';

const getJobByCompanyID = async (companyID, params) => axiosInstance.get(`/companies/${companyID}/jobs`, {
  params,
});

export default getJobByCompanyID;
