import { use, useEffect, useState } from 'react';
import { Link } from 'react-router';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';

const AdminPostedJobs = () => {
  const { user } = use(AuthContext);
  // console.log(user);
  const [postedJobs, setPostedJobs] = useState([]);
  const axiosSecure = useAxiosSecure();

  const handleDeletePostedJob = (id) => {
    // console.log(id);
    axiosSecure.delete(`/jobs/delete/${id}`).then((res) => {
      // console.log(res.data);
      if (res.data.deletedCount > 0) {
        const remainingJobs = postedJobs.filter((jobItem) => jobItem._id !== id);
        setPostedJobs(remainingJobs);
        Swal.fire('Job deleted successfully');
      }
    });
  };

  useEffect(() => {
    //✅ gmail issue step 3(read)
    const userEmail = user?.email || user?.providerData?.[0]?.email;
    if (!userEmail) return;
    axiosSecure.get(`/jobs?email=${userEmail}`).then((res) => setPostedJobs(res.data));
  }, [user, axiosSecure]);
  //   console.log(postedJobs);

  return (
    <div className="mb-8 lg:mb-16">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Total Posted Jobs : {postedJobs.length}
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Serial</th>
              <th>Job Title</th>
              <th>Deadline</th>
              <th>Action</th>
              <th>Count Applications</th>
              <th>View Applications</th>
            </tr>
          </thead>
          <tbody>
            {postedJobs.map((jobItem, index) => (
              <tr key={jobItem._id}>
                <th>{index + 1}</th>
                <td>{jobItem?.title}</td>
                <td>{jobItem?.applicationDeadline}</td>
                <td>
                  <button
                    onClick={() => handleDeletePostedJob(jobItem._id)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
                <td>{jobItem?.applicationCount}</td>
                <td>
                  <Link to={`/adminViewApplications/${jobItem._id}`}>
                    <button className="btn btn-sm btn-link">click to view</button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPostedJobs;
