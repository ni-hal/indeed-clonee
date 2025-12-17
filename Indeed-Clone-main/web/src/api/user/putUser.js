import { getCookie } from 'react-use-cookie';
import userAxiosInstance from '../../config/userAxiosConfig';

const token = getCookie('token');
const putUser = async (body, userID) => userAxiosInstance.put(
  `/users/${userID}`,
  body,
  {
    headers: {
      Authorization: token,
    },
  },
).then((response) => response);

export default putUser;
