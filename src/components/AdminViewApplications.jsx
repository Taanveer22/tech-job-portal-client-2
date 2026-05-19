import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../hooks/useAxiosSecure';

const AdminViewApplications = () => {
  const [viewApps, setViewApps] = useState([]);
  // console.log(viewApps);
  const { jobId } = useParams();
  // console.log(jobId);
  const axiosSecure = useAxiosSecure();

  const handleUpdateStatus = (e, id) => {
    // console.log(e.target.value, id);
    const data = {
      status: e.target.value,
    };
    axiosSecure.patch(`/applications/admin/status/${id}`, data).then((res) => {
      // console.log(res.data);
      if (res.data.modifiedCount > 0) {
        Swal.fire('Job status updated successfully');
      }
    });
  };

  useEffect(() => {
    axiosSecure.get(`/applications/admin/view/${jobId}`).then((res) => {
      // console.log(res.data);
      setViewApps(res.data);
    });
  }, [jobId, axiosSecure]);

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
                <td>
                  <select
                    onChange={(e) => handleUpdateStatus(e, appItem._id)}
                    defaultValue={appItem?.status || 'Update Status'}
                    className="select"
                  >
                    <option>Hired</option>
                    <option>Rejected</option>
                    <option>Under Review</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminViewApplications;
