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

  const handleSignInForm = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);
    // auth
    signinUser(email, password)
      .then((result) => {
        // console.log(result.user);
        if (result?.user) {
          Swal.fire('user login successully');
        }
        navigate(from);
      })
      .catch((error) => {
        // console.log(error.message);
        Swal.fire(error.message);
      });
  };

  const handleGoogleSignin = () => {
    googleSignin()
      .then((result) => {
        // console.log(result.user);
        if (result?.user) {
          Swal.fire('user login successully');
        }
        navigate(from);
      })
      .catch((error) => {
        // console.log(error.message);
        Swal.fire(error.message);
      });
  };

  return (
    <div>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="text-center lg:text-left">
            <div className="w-full">
              <Lottie animationData={jsonData}></Lottie>
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
              Sign in with google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
