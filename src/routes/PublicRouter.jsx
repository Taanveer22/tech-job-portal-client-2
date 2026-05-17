import { createBrowserRouter } from 'react-router';
import AdminViewApplications from '../components/AdminViewApplications';
import JobCardDetail from '../components/JobCardDetail';
import MyJobApply from '../components/MyJobApply';
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
        path: '/myJobApply/:id',
        element: (
          <PrivateRouter>
            <MyJobApply></MyJobApply>
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
        path: '/adminViewApplications/:jobId',
        element: (
          <PrivateRouter>
            <AdminViewApplications></AdminViewApplications>
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
