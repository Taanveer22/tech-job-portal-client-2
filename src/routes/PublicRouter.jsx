import { createBrowserRouter } from 'react-router';
import Root from '../layouts/Root';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Signin from '../pages/Signin';
import JobCardDetail from '../components/JobCardDetail';
import PrivateRouter from './PrivateRouter';
import JobApply from '../components/JobApply';
import UsersApplications from '../pages/UsersApplications';
import AdminJobForm from '../pages/AdminJobForm';
import AdminPostedJobs from '../pages/AdminPostedJobs';

let PublicRouter = createBrowserRouter([
  {
    path: '/',
    element: <Root></Root>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: '/jobCard/:id',
        element: (
          <PrivateRouter>
            <JobCardDetail></JobCardDetail>
          </PrivateRouter>
        ),
        loader: ({ params }) =>
          fetch(`http://localhost:5000/jobs/${params.id}`),
      },
      {
        path: '/jobApply/:id',
        element: (
          <PrivateRouter>
            <JobApply></JobApply>
          </PrivateRouter>
        ),
      },
      {
        path: '/usersApplications',
        element: (
          <PrivateRouter>
            <UsersApplications></UsersApplications>
          </PrivateRouter>
        ),
      },
      {
        path: '/adminJobForm',
        element: (
          <PrivateRouter>
            <AdminJobForm></AdminJobForm>
          </PrivateRouter>
        ),
      },
      {
        path: '/adminPostedJobs',
        element: (
          <PrivateRouter>
            <AdminPostedJobs></AdminPostedJobs>
          </PrivateRouter>
        ),
      },
      {
        path: '/register',
        element: <Register></Register>,
      },
      {
        path: '/signin',
        element: <Signin></Signin>,
      },
    ],
  },
]);

export default PublicRouter;
