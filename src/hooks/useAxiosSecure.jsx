import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';
import logger from '../utilities/logger';

// ======================================================
// AXIOS INSTANCE
// ======================================================

// create reusable secure axios instance
const axiosInstance = axios.create({
  baseURL: 'https://tech-job-portal-server-2.onrender.com',
  // sends cookies automatically with every request
  withCredentials: true,
});

const useAxiosSecure = () => {
  // get logout function from auth context
  const { signoutUser } = useContext(AuthContext);

  // router navigation
  const navigate = useNavigate();

  useEffect(() => {
    // ======================================================
    // RESPONSE INTERCEPTOR
    // ======================================================

    // runs after every response
    const interceptor = axiosInstance.interceptors.response.use(
      // ======================================================
      // SUCCESS RESPONSE
      // ======================================================

      // if request successful → just return response
      (response) => {
        return response;
      },

      // ======================================================
      // ERROR RESPONSE
      // ======================================================

      async (error) => {
        // get response status safely
        const status = error.response?.status;

        // handle unauthorized or forbidden errors
        if (status === 401 || status === 403) {
          try {
            // logout user from firebase
            await signoutUser();

            // redirect to signin page
            navigate('/signin');

            // show session expired alert
            Swal.fire({
              icon: 'warning',
              title: 'Session Expired',
              text: 'Please login again',
            });
          } catch (logoutError) {
            logger.log(logoutError);
          }
        }

        // continue throwing error
        return Promise.reject(error);
      }
    );

    // ======================================================
    // CLEANUP
    // ======================================================

    // remove interceptor when component unmounts
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [signoutUser, navigate]);

  // return secure axios instance
  return axiosInstance;
};

export default useAxiosSecure;
