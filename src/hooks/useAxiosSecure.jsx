import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';
import logger from '../utilities/logger';

// axios instance (used for all secure API calls)
const axiosInstance = axios.create({
  baseURL: 'https://tech-job-portal-server-2.onrender.com',
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { signoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // add response interceptor
    const interceptor = axiosInstance.interceptors.response.use(
      // if request is successful → just return response
      (res) => res,

      // if request has error → handle it here
      async (error) => {
        const status = error.response?.status;

        // ONLY handle unauthorized / forbidden errors
        if (status === 401 || status === 403) {
          try {
            await signoutUser(); // logout user
            Swal.fire('Session expired');
            navigate('/signin'); // redirect to login page
          } catch (error) {
            logger.log(error);
            Swal.fire('Logout failed');
          }
        }

        return Promise.reject(error);
      }
    );

    // cleanup interceptor when component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [signoutUser, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
