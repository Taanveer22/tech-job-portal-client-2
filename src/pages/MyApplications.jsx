import { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';
import logger from '../utilities/logger';

const MyApplications = () => {
  const [myApps, setMyApps] = useState([]);
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // ======================================================
  // DELETE APPLICATION
  // ======================================================

  const handleDeleteApplication = (id) => {
    axiosSecure.delete(`/applications/me/delete/${id}`).then((res) => {
      if (res.data.deletedCount > 0) {
        const remaining = myApps.filter((appItem) => appItem._id !== id);

        setMyApps(remaining);

        Swal.fire('Application deleted done');
      }
    });
  };

  // ======================================================
  // FETCH APPLICATIONS
  // ======================================================

  useEffect(() => {
    const userEmail = user?.email || user?.providerData?.[0]?.email;

    if (!userEmail) return;

    axiosSecure
      .get(`/applications/me?email=${userEmail}`, {
        withCredentials: true,
      })
      .then((res) => setMyApps(res.data))
      .catch((err) => logger.log(err.response?.data || err.message));
  }, [user, axiosSecure]);

  return (
    <div className="mb-8 lg:mb-16">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Total applications : {myApps.length}
      </h1>

      <div className="overflow-x-auto">
        <table className="table">
          {/* HEAD */}
          <thead>
            <tr>
              <th>
                <input type="checkbox" className="checkbox" />
              </th>
              <th>Company Name</th>
              <th>Job Title</th>
              <th>Job Type</th>
              <th>Action</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {myApps.map((appItem) => (
              <tr key={appItem._id}>
                <th>
                  <input type="checkbox" className="checkbox" />
                </th>

                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={appItem?.company_logo} alt="company" />
                      </div>
                    </div>

                    <div>
                      <div className="font-bold">{appItem?.company}</div>

                      <div className="text-sm opacity-50">{appItem?.location}</div>
                    </div>
                  </div>
                </td>

                <td>{appItem?.title}</td>

                <td>{appItem?.jobType}</td>

                <th>
                  <button
                    onClick={() => handleDeleteApplication(appItem._id)}
                    className="btn btn-error btn-xs"
                  >
                    Delete
                  </button>
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApplications;
