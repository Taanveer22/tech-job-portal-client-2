import Lottie from 'lottie-react';
import { useContext } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import jsonData from '../assets/register.json';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser, updateUserProfile } = useContext(AuthContext);

  const handleRegisterForm = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const photo = e.target.photo.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      // -------------------------
      // 1. CREATE USER
      // -------------------------
      await registerUser(email, password);

      // -------------------------
      // 2. UPDATE PROFILE
      // -------------------------
      await updateUserProfile(name, photo);

      // -------------------------
      // 3. IMPORTANT NOTE:
      // JWT is handled automatically in AuthProvider
      // (onAuthStateChanged will trigger login API)
      // -------------------------

      Swal.fire('User registered successfully');

      // small delay helps Firebase sync + JWT cookie set
      setTimeout(() => {
        navigate('/');
      }, 300);
    } catch (error) {
      Swal.fire(error.message);
    }
  };

  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        {/* animation */}
        <div className="w-full sm:w-2/3 lg:w-1/3">
          <Lottie animationData={jsonData} />
        </div>

        {/* form */}
        <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
          <form onSubmit={handleRegisterForm} className="card-body">
            <label className="label">Name</label>
            <input name="name" type="text" className="input" />

            <label className="label">Photo</label>
            <input name="photo" type="text" className="input" />

            <label className="label">Email</label>
            <input name="email" type="email" className="input" />

            <label className="label">Password</label>
            <input name="password" type="password" className="input" />

            <button className="btn btn-neutral mt-4">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
