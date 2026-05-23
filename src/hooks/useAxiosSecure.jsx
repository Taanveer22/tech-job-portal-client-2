import axios from 'axios';
import { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

import AuthContext from '../context/AuthContext';

// ======================================================
// AXIOS INSTANCE
// component এর বাইরে রাখা হয়েছে — প্রতি render এ নতুন instance হবে না
// ======================================================
const axiosInstance = axios.create({
  // const BASE_URL = `http://localhost:5000`;
  baseURL: 'https://tech-job-portal-server-2.onrender.com',
  withCredentials: true, // cookie পাঠানোর জন্য
});

const useAxiosSecure = () => {
  const { signoutUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  // ======================================================
  // BUG 2 FIX — useRef দিয়ে সবসময় latest user রাখো
  // useEffect এর closure এ user পুরনো value ধরে রাখে (stale closure)
  // ref সবসময় current value দেয়
  // ======================================================
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.response.use(
      // ✅ success হলে শুধু return করো
      (response) => {
        return response;
      },

      // ❌ error হলে
      async (error) => {
        // ======================================================
        // BUG 1 FIX — Network guard
        // Render free tier ঘুম থেকে উঠলে বা network error হলে
        // error.response থাকে না — তখন status check করলে crash হয়
        // ======================================================
        if (!error.response) {
          return Promise.reject(error);
        }

        const status = error.response.status;

        // ======================================================
        // BUG 2 FIX — userRef.current ব্যবহার করো, user না
        // user ব্যবহার করলে: signOut এর পরেও পুরনো user value থাকে
        // userRef.current সবসময় latest value দেয়
        // ======================================================
        if ((status === 401 || status === 403) && userRef.current) {
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

    // cleanup — component unmount হলে interceptor সরিয়ে দাও
    return () => {
      axiosInstance.interceptors.response.eject(interceptor);
    };

    // ======================================================
    // BUG 2 FIX — dependency array থেকে user সরানো হয়েছে
    // আগে user ছিল → signOut এর পর user=null → effect আবার run হতো
    // এখন ref ব্যবহার করায় user dependency লাগে না
    // ======================================================
  }, [navigate, signoutUser]);

  return axiosInstance;
};

export default useAxiosSecure;
