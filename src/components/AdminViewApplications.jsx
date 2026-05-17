import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

const AdminViewApplications = () => {
  const [viewApps, setViewApps] = useState([]);
  // console.log(viewApps);
  const { jobId } = useParams();
  // console.log(jobId);

  useEffect(() => {
    fetch(`http://localhost:5000/applications/admin/view/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        setViewApps(data);
      });
  }, [jobId]);
  return (
    <div>
      <h1 className="text-2xl font-semibold text-center mb-4">
        Total applied candiates : {viewApps.length}
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Serial</th>
              <th>applicant_email</th>
              <th>job_id</th>
              <th>status</th>
            </tr>
          </thead>
          <tbody>
            {viewApps.map((appItem, index) => (
              <tr key={appItem._id}>
                <th>{index + 1}</th>
                <td>{appItem.applicant_email}</td>
                <td>{appItem.job_id}</td>
                <td>hired</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminViewApplications;
