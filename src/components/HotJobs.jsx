import { useState } from 'react';
import { useEffect } from 'react';
import JobCard from './JobCard';

const HotJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data));
  });

  return (
    <div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {jobs.map((jobItem) => (
          <JobCard jobItem={jobItem} key={jobItem._id}></JobCard>
        ))}
      </div>
    </div>
  );
};

export default HotJobs;
