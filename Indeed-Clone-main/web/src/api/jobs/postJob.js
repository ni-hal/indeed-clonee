import axiosInstance from '../../config/companyAxiosConfig';

const postJob = (payload, companyID) => axiosInstance
  .post(`/companies/${companyID}/jobs`, payload)
  .then((response) => response);

export default postJob;
