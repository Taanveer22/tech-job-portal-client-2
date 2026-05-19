import { useEffect, useState } from 'react';
import useAxiosSecure from '../hooks/useAxiosSecure';
import JobCard from './JobCard';

const HotJobs = () => {
  const [jobs, setJobs] = useState([]);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get(`/jobs`).then((res) => {
      // console.log(res.data);
      setJobs(res.data);
    });
  }, [axiosSecure]);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-4">Hot Jobs </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {jobs.map((jobItem) => (
          <JobCard jobItem={jobItem} key={jobItem._id}></JobCard>
        ))}
      </div>
    </div>
  );
};

export default HotJobs;
