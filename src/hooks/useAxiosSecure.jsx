import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';

const axiosInstance = axios.create({
  baseURL: 'https://tech-job-portal-server-2.onrender.com',
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { signoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Add a response interceptor
    const resInterceptor = axiosInstance.interceptors.response.use(
      // 1st function success
      (res) => {
        return res;
      },
      // 2nd function error
      (error) => {
        // console.log('FULL ERROR OBJECT:', error);
        // console.log('STATUS:', error.response?.status);
        // console.log('DATA:', error.response?.data);
        // console.log('MESSAGE:', error.message);
        // console.log('URL:', error.config?.url);

        // unauthorized or forbidden
        if (error.response?.status === 401 || error.response?.status === 403) {
          signoutUser()
            .then(() => {
              navigate('/signin');
              Swal.fire('Sign out done');
            })
            .catch(() => {
              Swal.fire('Sign out failed');
            });
        }
        return Promise.reject(error);
      }
    );

    // cleanup interceptor
    return () => {
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [signoutUser, navigate]);

  return axiosInstance;
};

export default useAxiosSecure;
