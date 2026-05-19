import axios from 'axios';

const axiosInstane = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

const useAxiosSecure = () => {
  return axiosInstane;
};

export default useAxiosSecure;
