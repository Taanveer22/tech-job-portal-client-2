import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Swal from 'sweetalert2';
import useAxiosSecure from '../hooks/useAxiosSecure';

const AdminViewApplications = () => {
  const [viewApps, setViewApps] = useState([]);
  const { jobId } = useParams();
  const axiosSecure = useAxiosSecure();

  const handleUpdateStatus = (e, id) => {
    const data = { status: e.target.value };

    axiosSecure
      .patch(`/applications/admin/status/${id}`, data)
      .then((res) => {
        if (res.data.modifiedCount > 0) {
          Swal.fire('Job status updated successfully');
        }
      })
      // ✅ error handle করো
      .catch((err) => {
        console.log(err.response?.data);
        Swal.fire('Failed to update status');
      });
  };

  useEffect(() => {
    // ✅ jobId না থাকলে call করো না
    if (!jobId) return;

    axiosSecure
      .get(`/applications/admin/view/${jobId}`)
      .then((res) => {
        setViewApps(res.data);
      })
      // ✅ error handle করো
      .catch((err) => {
        console.log(err.response?.data);
      });
  }, [jobId]); // ✅ axiosSecure dependency সরিয়ে দাও

  return (
    <div>
      <h1 className="text-2xl font-semibold text-center mb-4">
        Total applied candidates: {viewApps.length}
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
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
