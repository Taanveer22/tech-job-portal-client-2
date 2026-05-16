import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import JobCard from './JobCard';

const HotJobs = () => {
  const [jobs, setJobs] = useState([]);

  const handleDeleteJob = (id) => {
    // console.log(id);
    fetch(`http://localhost:5000/jobs/delete/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.deletedCount > 0) {
          const remainingJobs = jobs.filter((jobItem) => jobItem._id !== id);
          setJobs(remainingJobs);
          Swal.fire('Job deleted successfully');
        }
      });
  };

  useEffect(() => {
    fetch(`http://localhost:5000/jobs`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setJobs(data);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center mb-4">Hot Jobs </h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {jobs.map((jobItem) => (
          <JobCard jobItem={jobItem} key={jobItem._id} handleDeleteJob={handleDeleteJob}></JobCard>
        ))}
      </div>
    </div>
  );
};

export default HotJobs;
