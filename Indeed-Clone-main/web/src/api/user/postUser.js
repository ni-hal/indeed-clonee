import userAxiosInstance from '../../config/userAxiosConfig';

const postUser = (payload) => userAxiosInstance
  .post('/users', payload, {})
  .then((response) => response)
  .catch((err) => {
    console.log(err);
  });

export default postUser;
