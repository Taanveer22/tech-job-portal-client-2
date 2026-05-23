import { useContext } from 'react';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';
import logger from '../utilities/logger';

const AdminJobForm = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const containerFormData = new FormData(e.target);
    const realFormData = Object.fromEntries(containerFormData.entries());

    const { min, max, currency, ...newJob } = realFormData;
    newJob.salaryRange = { min, max, currency };
    newJob.responsibilities = newJob.responsibilities.split('\n');
    newJob.requirements = newJob.requirements.split('\n');

    // ✅ user check আগে করো
    if (!user) {
      return Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login first',
      });
    }

    axiosSecure
      .post(`/jobs/add`, newJob)
      .then((res) => {
        if (res.data.insertedId) {
          Swal.fire({
            icon: 'success',
            title: 'Job Added Successfully',
          });
        }
      })
      .catch((err) => {
        logger.log(err.response?.data);
        // ✅ 401/403 interceptor handle করবে
      });
  };

  return (
    <section className="flex justify-center items-center mb-8 lg:mb-16">
      <div className="card bg-base-300 w-full max-w-sm shrink-0">
        <form onSubmit={handleFormSubmit} className="card-body">
          <fieldset className="fieldset">
            {/* title field */}
            <label className="label">Title</label>
            <input name="title" type="text" className="input" placeholder="Title" />

            {/* location field */}
            <label className="label">Location</label>
            <input name="location" type="text" className="input" placeholder="Location" />

            {/* date field */}
            <label className="label">Application Deadline</label>
            <input name="applicationDeadline" type="date" className="input input-bordered" />

            {/* job type field */}
            <label className="label">Job Type</label>
            <select name="jobType" defaultValue="Remote" className="select">
              <option>Remote</option>
              <option>Full Time</option>
              <option>Intern</option>
            </select>

            {/* category field */}
            <label className="label">Category</label>
            <select name="category" defaultValue="Engineering" className="select">
              <option>Engineering</option>
              <option>Finance</option>
              <option>Marketing</option>
            </select>

            {/* salary currency field */}
            <label className="label">Salary Currency</label>
            <select name="currency" defaultValue="BDT" className="select">
              <option>BDT</option>
              <option>DINAR</option>
              <option>RIAL</option>
            </select>

            {/* salary min field */}
            <label className="label">Salary Min</label>
            <input name="min" type="number" className="input" placeholder="Salary Min" />

            {/* salary max field */}
            <label className="label">Salary Max</label>
            <input name="max" type="number" className="input" placeholder="Salary Max" />

            {/* company field */}
            <label className="label">Company</label>
            <input name="company" type="text" className="input" placeholder="Company" />

            {/* logo url field */}
            <label className="label">Company Logo</label>
            <input name="company_logo" type="text" className="input" placeholder="Company Logo" />

            {/* status field */}
            <label className="label">Status</label>
            <input name="status" type="text" className="input" placeholder="Status" />

            {/* hr name field */}
            <label className="label">HR Name</label>
            <input
              defaultValue={user?.displayName}
              name="hr_name"
              type="text"
              className="input"
              placeholder="HR Name"
            />

            {/* hr email field */}
            <label className="label">HR Email</label>
            <input
              defaultValue={user?.email || user?.providerData?.[0]?.email}
              name="hr_email"
              type="email"
              className="input"
              placeholder="HR Email"
            />

            {/* description field */}
            <label className="label">Description</label>
            <textarea name="description" className="textarea" placeholder="Description"></textarea>

            {/* requirements field */}
            <label className="label">Requirements</label>
            <textarea
              name="requirements"
              className="textarea"
              placeholder="Give one requirement in a line"
            ></textarea>

            {/* responsibilities field */}
            <label className="label">Responsibilities</label>
            <textarea
              name="responsibilities"
              className="textarea"
              placeholder="Give one responsibility in a line"
            ></textarea>

            <button className="btn btn-neutral mt-4">Post Job</button>
          </fieldset>
        </form>
      </div>
    </section>
  );
};

export default AdminJobForm;
