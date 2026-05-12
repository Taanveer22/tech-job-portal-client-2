import { use } from 'react';
import AuthContext from '../context/AuthContext';
import { Navigate, useLocation } from 'react-router';

const PrivateRouter = ({ children }) => {
  const location = useLocation();
  //   console.log(location);
  const { user, loading } = use(AuthContext);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <span className="loading loading-infinity loading-xl"></span>
      </div>
    );
  }

  if (user) {
    return children;
  } else {
    return <Navigate to="/signin" state={location?.pathname}></Navigate>;
  }
};

export default PrivateRouter;
