import axios from 'axios';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

import AuthContext from '../context/AuthContext';
import logger from '../utilities/logger';

// ======================================================
// AXIOS INSTANCE
// ======================================================

// reusable secure axios instance
const axiosInstance = axios.create({
  baseURL: 'https://tech-job-portal-server-2.onrender.com',

  // IMPORTANT:
  // send cookies automatically
  withCredentials: true,
});

const useAxiosSecure = () => {
  // get auth data
  const { signoutUser, loading } = useContext(AuthContext);

  // navigation
  const navigate = useNavigate();

  useEffect(() => {
    // ======================================================
    // RESPONSE INTERCEPTOR
    // ======================================================

    const interceptor = axiosInstance.interceptors.response.use(
      // ======================================================
      // SUCCESS RESPONSE
      // ======================================================

      (response) => {
        return response;
      },

      // ======================================================
      // ERROR RESPONSE
      // ======================================================

      async (error) => {
        // get response status safely
        const status = error.response?.status;

        // ======================================================
        // FIX FOR IMMEDIATE SESSION EXPIRED AFTER LOGIN
        // ======================================================

        /**
         * VERY IMPORTANT:
         *
         * During initial login:
         *
         * 1. Firebase logs in
         * 2. JWT cookie request still processing
         * 3. Protected API may fire early
         * 4. Backend returns 401
         * 5. User gets logged out immediately
         *
         * So:
         * NEVER auto logout while auth loading is true
         */

        if ((status === 401 || status === 403) && !loading) {
          try {
            logger.log('Session expired');

            // logout firebase + backend
            await signoutUser();

            // redirect user
            navigate('/signin');

            // show alert
            Swal.fire({
              icon: 'warning',
              title: 'Session Expired',
              text: 'Please login again',
            });
          } catch (logoutError) {
            logger.log(logoutError);
          }
        }

        // continue error
        return Promise.reject(error);
      }
    );

    // ======================================================
    // CLEANUP
    // ======================================================

    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };
  }, [signoutUser, navigate, loading]);

  // ======================================================
  // RETURN INSTANCE
  // ======================================================

  return axiosInstance;
};

export default useAxiosSecure;
