import userAxiosInstance from '../../config/userAxiosConfig';

const getUser = async (params) => userAxiosInstance.get(`/users/${params}`, {});

export default getUser;
