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
  const { signoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      // ✅ success হলে শুধু return করো
      (response) => response,

      // ❌ error হলে
      async (error) => {
        const status = error.response?.status;

        // ✅ FIX: শুধু user logged in থাকলেই logout করো
        // page load এ 401 আসলে যেন logout না হয়
        if ((status === 401 || status === 403) && user) {
          await signoutUser();

          Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
            text: 'Please login again',
          });

          navigate('/signin', { replace: true });
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [navigate, signoutUser, user]);

  return axiosInstance;
};

export default useAxiosSecure;
