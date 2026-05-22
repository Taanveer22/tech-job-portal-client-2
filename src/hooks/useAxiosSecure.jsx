import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

import AuthContext from '../context/AuthContext';

const axiosInstance = axios.create({
  // baseURL: 'http://localhost:5000',
  baseURL: 'https://tech-job-portal-server-2.onrender.com',
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { signoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      // If request is successful, just return response
      (response) => {
        return response;
      },

      // If there is an error
      async (error) => {
        const status = error.response?.status;

        // If unauthorized or forbidden
        if (status === 401 || status === 403) {
          await signoutUser();

          Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
          });

          navigate('/signin', { replace: true });
        }

        // still return error so we can handle it elsewhere if needed
        return Promise.reject(error);
      }
    );

    // cleanup interceptor when component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate, signoutUser]);

  return axiosInstance;
};

export default useAxiosSecure;
