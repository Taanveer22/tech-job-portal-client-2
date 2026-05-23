import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';

import AuthContext from '../context/AuthContext';
import useAxiosSecure from '../hooks/useAxiosSecure';
import logger from '../utilities/logger';

const MyJobApply = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleJobApplicationForm = async (e) => {
    e.preventDefault();

    // ✅  user check
    if (!user) {
      return Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Please login first',
      });
    }

    const github = e.target.github.value;
    const linkedin = e.target.linkedin.value;
    const resume = e.target.resume.value;

    const email = user.email || user.providerData?.[0]?.email;

    if (!email) {
      return Swal.fire({
        icon: 'warning',
        title: 'Email not found',
        text: 'Please login again',
      });
    }

    const applicationInfo = {
      job_id: id,
      applicant_email: email,
      github_url: github,
      linkedin_url: linkedin,
      resume_url: resume,
    };

    try {
      const res = await axiosSecure.post('/applications/me/apply', applicationInfo);

      if (res.data.insertedId) {
        Swal.fire({
          icon: 'success',
          title: 'Job Applied Successfully',
        });
        navigate('/myApplications', { replace: true });
      }
    } catch (error) {
      logger.log(error.response?.data);
      // ✅ interceptor already handle করবে 401/403
    }
  };

  return (
    <div className="mb-8 lg:mb-16">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Apply now!</h1>
            <p className="py-6">
              Submit your GitHub, LinkedIn and Resume links to apply for this job.
            </p>
          </div>

          <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
            <form onSubmit={handleJobApplicationForm} className="card-body">
              {/* GITHUB */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">GitHub</span>
                </label>
                <input
                  name="github"
                  type="url"
                  placeholder="https://github.com/yourname"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* LINKEDIN */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">LinkedIn</span>
                </label>
                <input
                  name="linkedin"
                  type="url"
                  placeholder="https://linkedin.com/in/yourname"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* RESUME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Resume</span>
                </label>
                <input
                  name="resume"
                  type="url"
                  placeholder="https://your-resume-link.com"
                  className="input input-bordered"
                  required
                />
              </div>

              {/* SUBMIT */}
              <div className="form-control mt-6">
                <button className="btn btn-neutral">Apply Now</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyJobApply;
