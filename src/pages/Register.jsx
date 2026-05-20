import Lottie from 'lottie-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

import jsonData from '../assets/register.json';
import AuthContext from '../context/AuthContext';

const Register = () => {
  // router navigation
  const navigate = useNavigate();

  // auth functions from context
  const { registerUser, updateUserProfile } = useContext(AuthContext);

  // ======================================================
  // HANDLE REGISTER
  // ======================================================

  const handleRegisterForm = async (e) => {
    e.preventDefault();

    // get form values
    const name = e.target.name.value;
    const photo = e.target.photo.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // ======================================================
      // CREATE USER
      // ======================================================

      await registerUser(email, password);

      // ======================================================
      // UPDATE USER PROFILE
      // ======================================================

      await updateUserProfile(name, photo);

      // ======================================================
      // JWT COOKIE
      // ======================================================

      // IMPORTANT:
      // JWT is automatically handled inside AuthProvider
      // through onAuthStateChanged listener

      Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
      });

      // redirect home
      navigate('/');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error.message,
      });
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* ======================================================
            LOTTIE ANIMATION
        ====================================================== */}

        <div className="w-full sm:w-2/3 lg:w-1/3">
          <Lottie animationData={jsonData} />
        </div>

        {/* ======================================================
            REGISTER FORM
        ====================================================== */}

        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleRegisterForm} className="card-body">
            <label className="label">Name</label>

            <input
              name="name"
              type="text"
              className="input input-bordered"
              placeholder="Your name"
              required
            />

            <label className="label">Photo URL</label>

            <input
              name="photo"
              type="text"
              className="input input-bordered"
              placeholder="Photo URL"
              required
            />

            <label className="label">Email</label>

            <input
              name="email"
              type="email"
              className="input input-bordered"
              placeholder="Email"
              required
            />

            <label className="label">Password</label>

            <input
              name="password"
              type="password"
              className="input input-bordered"
              placeholder="Password"
              required
            />

            <button className="btn btn-neutral mt-4">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
