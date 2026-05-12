import { use, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const AdminPostedJobs = () => {
  const { user } = use(AuthContext);
  const [postedJobs, setPostedJobs] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/jobs?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setPostedJobs(data));
  }, [user?.email]);
  //   console.log(postedJobs);

  return (
    <div className="mb-8 lg:mb-16">
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Serial</th>
              <th>Job Title</th>
              <th>Application Deadline</th>
              <th>Application Count</th>
            </tr>
          </thead>
          <tbody>
            {postedJobs.map((jobItem, index) => (
              <tr key={jobItem._id}>
                <th>{index + 1}</th>
                <td>{jobItem.title}</td>
                <td>{jobItem.applicationDeadline}</td>
                <td>Blue</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPostedJobs;
