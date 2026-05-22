import Lottie from 'lottie-react';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import jsonData from '../assets/signin.json';
import AuthContext from '../context/AuthContext';
import logger from '../utilities/logger';

const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { signinUser, googleSignin } = useContext(AuthContext);

  const from = location?.state?.from || '/';

  // ======================================================
  // EMAIL LOGIN
  // ======================================================

  const handleSignInForm = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await signinUser(email, password);

      if (result?.user) {
        Swal.fire('Login Successful');

        navigate(from, { replace: true });
      }
    } catch (error) {
      logger.log(error);
      Swal.fire('Login Failed');
    }
  };

  // ======================================================
  // GOOGLE LOGIN
  // ======================================================

  const handleGoogleSignin = async () => {
    try {
      const result = await googleSignin();

      if (result?.user) {
        Swal.fire('Google Login Successful');
        navigate(from, { replace: true });
      }
    } catch (error) {
      logger.log(error);
      Swal.fire('Google Login Failed');
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* ANIMATION */}
        <div className="text-center lg:text-left">
          <div className="w-full">
            <Lottie animationData={jsonData} />
          </div>
        </div>

        {/* FORM */}
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleSignInForm} className="card-body">
            <div className="fieldset">
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

              <div>
                <a className="link link-hover">Forgot password?</a>
              </div>

              <button className="btn btn-neutral mt-4">Sign In</button>
            </div>
          </form>

          <button onClick={handleGoogleSignin} className="btn btn-warning mb-8 mx-6">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
