import { use } from 'react';
import { useNavigate, useParams } from 'react-router';
import Swal from 'sweetalert2';
import AuthContext from '../context/AuthContext';

const JobApply = () => {
  const { id } = useParams();
  //   console.log(id);
  const navigate = useNavigate();
  const { user } = use(AuthContext);

  const handleJobApplicationForm = (e) => {
    e.preventDefault();
    const github = e.target.github.value;
    const linkedin = e.target.linkedin.value;
    const resume = e.target.resume.value;
    // console.log(github, linkedin, resume);

    const applicationInfo = {
      job_id: id,
      applicant_email: user?.email,
      github_url: github,
      linkedin_url: linkedin,
      resume_url: resume,
    };

    fetch(`http://localhost:5000/applications/me/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data.insertedId) {
          Swal.fire('Job Applied Successfully');
          navigate('/myApplications', { replace: true });
        }
      });
  };

  return (
    <div className="mb-8 lg:mb-16">
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-bold">Apply now!</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
              exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
            </p>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleJobApplicationForm} className="card-body">
              <fieldset className="fieldset">
                <label className="label">github</label>
                <input name="github" type="url" className="input" placeholder="github url" />
                <label className="label">linkedin</label>
                <input name="linkedin" type="url" className="input" placeholder="linkedin url" />
                <label className="label">resume</label>
                <input name="resume" type="url" className="input" placeholder="resume url" />

                <button className="btn btn-neutral mt-4">Apply Now</button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApply;
