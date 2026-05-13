import { createBrowserRouter } from 'react-router';
import JobApply from '../components/JobApply';
import JobCardDetail from '../components/JobCardDetail';
import Root from '../layouts/Root';
import AdminJobForm from '../pages/AdminJobForm';
import AdminPostedJobs from '../pages/AdminPostedJobs';
import Home from '../pages/Home';
import MyApplications from '../pages/MyApplications';
import Register from '../pages/Register';
import Signin from '../pages/Signin';
import PrivateRouter from './PrivateRouter';

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
        loader: ({ params }) => fetch(`http://localhost:5000/jobs/${params.id}`),
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
        path: '/myApplications',
        element: (
          <PrivateRouter>
            <MyApplications></MyApplications>
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
