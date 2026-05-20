import Lottie from 'lottie-react';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';

import jsonData from '../assets/signin.json';
import AuthContext from '../context/AuthContext';

const Signin = () => {
  // router hooks
  const location = useLocation();
  const navigate = useNavigate();

  // auth functions from context
  const { signinUser, googleSignin } = useContext(AuthContext);

  // redirect path after login
  const from = location?.state?.from || '/';

  // ======================================================
  // HANDLE EMAIL/PASSWORD LOGIN
  // ======================================================

  const handleSignInForm = async (e) => {
    e.preventDefault();

    // get form values
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // firebase login
      const result = await signinUser(email, password);

      // if login successful
      if (result?.user) {
        // IMPORTANT:
        // JWT cookie is automatically handled
        // in AuthProvider

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
        });

        // small delay helps smoother auth sync
        setTimeout(() => {
          navigate(from);
        }, 200);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.message,
      });
    }
  };

  // ======================================================
  // HANDLE GOOGLE SIGNIN
  // ======================================================

  const handleGoogleSignin = async () => {
    try {
      // google login
      const result = await googleSignin();

      // if successful
      if (result?.user) {
        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
        });

        // delay helps JWT sync
        setTimeout(() => {
          navigate(from);
        }, 200);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Google Login Failed',
        text: error.message,
      });
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* ======================================================
            ANIMATION
        ====================================================== */}

        <div className="text-center lg:text-left">
          <div className="w-full">
            <Lottie animationData={jsonData} />
          </div>
        </div>

        {/* ======================================================
            SIGNIN FORM
        ====================================================== */}

        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form onSubmit={handleSignInForm} className="card-body">
            <fieldset className="fieldset">
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
            </fieldset>
          </form>

          {/* ======================================================
              GOOGLE SIGNIN BUTTON
          ====================================================== */}

          <button onClick={handleGoogleSignin} className="btn btn-warning mb-8 mx-6">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signin;
