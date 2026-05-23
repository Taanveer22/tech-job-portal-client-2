import axios from 'axios';
import { useEffect, useState } from 'react';
import BASE_URL from '../api/baseUrl';
import JobCard from './JobCard';

const HotJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // ✅ /jobs public route — axiosSecure দরকার নেই
    // এটাই মূল সমস্যা ছিলো
    // axiosSecure দিয়ে call হলে → 401 → logout হয়ে যেতো
    axios.get(`${BASE_URL}/jobs`).then((res) => {
      setJobs(res.data);
    });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-4">Hot Jobs</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {jobs.map((jobItem) => (
          <JobCard jobItem={jobItem} key={jobItem._id} />
        ))}
      </div>
    </div>
  );
};

export default HotJobs;
