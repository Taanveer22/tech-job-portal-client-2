import { use, useEffect, useState } from 'react';
import AuthContext from '../context/AuthContext';

const UsersApplications = () => {
  const [candidates, setCandidates] = useState([]);

  const { user } = use(AuthContext);
  useEffect(() => {
    fetch(`http://localhost:5000/applications?email=${user?.email}`)
      .then((res) => res.json())
      .then((data) => setCandidates(data));
  }, [user?.email]);

  return (
    <div className="mb-8 lg:mb-16">
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
            {candidates.map((candidateItem) => (
              <tr>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={candidateItem?.company_logo}
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{candidateItem?.company}</div>
                      <div className="text-sm opacity-50">
                        {candidateItem?.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td>{candidateItem?.title}</td>
                <td>{candidateItem?.jobType}</td>
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

export default UsersApplications;
