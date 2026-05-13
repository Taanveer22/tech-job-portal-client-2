import { use } from 'react';
import { NavLink } from 'react-router';
import logo from '../assets/logo.png';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user, signoutUser } = use(AuthContext);

  const handleSignOutUser = () => {
    signoutUser()
      .then(() => {
        console.log('sign out successful');
      })
      .catch(() => {
        console.log('sign out failed');
      });
  };

  const links = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/myApplications">My Applications</NavLink>
      </li>
      <li>
        <NavLink to="/adminJobForm">Admin Job Form</NavLink>
      </li>
      <li>
        <NavLink to="/adminPostedJobs">Admin Posted Jobs</NavLink>
      </li>
    </>
  );
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {' '}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />{' '}
              </svg>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              {links}
            </ul>
          </div>
          <div className="flex items-center gap-1">
            <img src={logo} className="w-8" alt="logo" />
            <NavLink to="/" className="btn btn-ghost text-xl">
              Tech Job Portal 2
            </NavLink>
          </div>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">{links}</ul>
        </div>
        <div className="navbar-end hidden lg:flex gap-2">
          {user ? (
            <>
              <span>{user?.displayName}</span>
              <button onClick={handleSignOutUser}>Signout</button>
            </>
          ) : (
            <>
              <NavLink to="/register">Register</NavLink>
              <NavLink to="/signin">Signin</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
