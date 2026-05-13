import { use, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const MyApplications = () => {
  const [apps, setApps] = useState([]);

  const { user } = use(AuthContext);
  useEffect(() => {
    fetch(`http://localhost:5000/applications/me?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setApps(data));
  }, [user?.email]);

  return (
    <div className="mb-8 lg:mb-16">
      <h1 className="text-2xl font-semibold text-center mb-4">
        Total applications : {apps.length}
      </h1>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Company Name</th>
              <th>Job Title</th>
              <th>Job Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((appItem) => (
              <tr key={appItem?._id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={appItem?.company_logo} alt="Avatar Tailwind CSS Component" />
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
                  <button className="btn btn-error btn-xs">Delete</button>
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
