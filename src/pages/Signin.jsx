import Lottie from 'lottie-react';
import { use } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import jsonData from '../assets/signin.json';
import AuthContext from '../context/AuthContext';

const Signin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signinUser, googleSignin } = use(AuthContext);

  const from = location?.state || '/';

  const handleSignInForm = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const result = await signinUser(email, password);

      if (result?.user) {
        // ✅ JWT is issued automatically in onAuthStateChanged
        // no need to manually call jwt/login here
        Swal.fire('User login successfully');
        navigate(from);
      }
    } catch (error) {
      Swal.fire(error.message);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const result = await googleSignin();

      if (result?.user) {
        // ✅ JWT is issued automatically in onAuthStateChanged
        // no need to manually call jwt/login here
        Swal.fire('User login successfully');
        navigate(from);
      }
    } catch (error) {
      Swal.fire(error.message);
    }
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <div className="w-full">
              <Lottie animationData={jsonData} />
            </div>
          </div>
          <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <form onSubmit={handleSignInForm} className="card-body">
              <fieldset className="fieldset">
                <label className="label">Email</label>
                <input name="email" type="email" className="input" placeholder="Email" />
                <label className="label">Password</label>
                <input name="password" type="password" className="input" placeholder="Password" />
                <div>
                  <a className="link link-hover">Forgot password?</a>
                </div>
                <button className="btn btn-neutral mt-4">Sign In</button>
              </fieldset>
            </form>
            <button onClick={handleGoogleSignin} className="btn btn-warning mb-8 mx-6">
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
